import { PhonemeItem } from '../types';

// Convert base64 raw 16-bit PCM (24kHz) to AudioBuffer
export function pcmBase64ToAudioBuffer(
  base64Data: string,
  sampleRate: number = 24000
): AudioBuffer {
  const binaryString = window.atob(base64Data);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  // 16-bit PCM little endian
  const int16Array = new Int16Array(bytes.buffer);
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate });
  const buffer = audioCtx.createBuffer(1, int16Array.length, sampleRate);
  const channelData = buffer.getChannelData(0);

  for (let i = 0; i < int16Array.length; i++) {
    channelData[i] = int16Array[i] / 32768.0;
  }

  return buffer;
}

// Generate estimate phonemes breakdown from input text
export function generatePhonemeBreakdown(text: string, durationSec: number = 2.5): PhonemeItem[] {
  const clean = text.toLowerCase().replace(/[^a-z0-9\s]/g, '');
  const words = clean.split(/\s+/).filter(Boolean);
  
  const phonemes: PhonemeItem[] = [];
  if (words.length === 0) return phonemes;

  let currentTime = 0.1;
  const timePerWord = (durationSec - 0.2) / words.length;

  const charToIpaMap: Record<string, { ipa: string; type: 'vowel' | 'consonant'; freq: [number, number] }> = {
    a: { ipa: 'æ', type: 'vowel', freq: [700, 1800] },
    e: { ipa: 'ɛ', type: 'vowel', freq: [500, 2300] },
    i: { ipa: 'ɪ', type: 'vowel', freq: [400, 2600] },
    o: { ipa: 'oʊ', type: 'vowel', freq: [500, 1000] },
    u: { ipa: 'ʌ', type: 'vowel', freq: [600, 1200] },
    b: { ipa: 'b', type: 'consonant', freq: [150, 400] },
    c: { ipa: 'k', type: 'consonant', freq: [1500, 4000] },
    d: { ipa: 'd', type: 'consonant', freq: [200, 3000] },
    f: { ipa: 'f', type: 'consonant', freq: [2500, 8000] },
    g: { ipa: 'ɡ', type: 'consonant', freq: [200, 2500] },
    h: { ipa: 'h', type: 'consonant', freq: [1000, 6000] },
    l: { ipa: 'l', type: 'consonant', freq: [300, 3000] },
    m: { ipa: 'm', type: 'consonant', freq: [250, 1000] },
    n: { ipa: 'n', type: 'consonant', freq: [250, 1800] },
    p: { ipa: 'p', type: 'consonant', freq: [500, 5000] },
    r: { ipa: 'ɹ', type: 'consonant', freq: [300, 2000] },
    s: { ipa: 's', type: 'consonant', freq: [4000, 10000] },
    t: { ipa: 't', type: 'consonant', freq: [2000, 8000] },
    v: { ipa: 'v', type: 'consonant', freq: [200, 4000] },
    w: { ipa: 'w', type: 'consonant', freq: [300, 800] },
    y: { ipa: 'j', type: 'consonant', freq: [300, 2800] },
    z: { ipa: 'z', type: 'consonant', freq: [3500, 9000] },
  };

  words.forEach((word) => {
    const letters = word.split('');
    const charDur = timePerWord / letters.length;
    letters.forEach((char) => {
      const mapping = charToIpaMap[char] || { ipa: char, type: 'consonant', freq: [1000, 3000] };
      phonemes.push({
        phoneme: char.toUpperCase(),
        ipa: mapping.ipa,
        startTime: Number(currentTime.toFixed(2)),
        endTime: Number((currentTime + charDur).toFixed(2)),
        type: mapping.type,
        frequencyRange: mapping.freq,
      });
      currentTime += charDur;
    });
    // Add brief silence between words
    phonemes.push({
      phoneme: '•',
      ipa: '∅',
      startTime: Number(currentTime.toFixed(2)),
      endTime: Number((currentTime + 0.05).toFixed(2)),
      type: 'silence',
      frequencyRange: [0, 0],
    });
    currentTime += 0.05;
  });

  return phonemes;
}

// Play synthetic beep / phoneme sound for interactive Deep Dive learning
export function playPhonemeTone(ipa: string, durationSec: number = 0.2, freqRange: [number, number] = [440, 880]) {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    const centerFreq = (freqRange[0] + freqRange[1]) / 2 || 440;
    osc.type = ipa === 's' || ipa === 'f' || ipa === 't' ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(centerFreq, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + durationSec);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + durationSec);
  } catch (e) {
    console.error("Phoneme tone play error:", e);
  }
}

// Speak text using Browser Web Speech API as zero-latency local fallback
export function speakWebSpeech(
  text: string,
  pitch: number = 1.0,
  rate: number = 1.0,
  voiceName?: string,
  onEnd?: () => void,
  onBoundary?: (charIndex: number) => void
): SpeechSynthesisUtterance | null {
  if (!('speechSynthesis' in window)) return null;

  window.speechSynthesis.cancel(); // Stop ongoing

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.pitch = pitch;
  utterance.rate = rate;

  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    if (voiceName) {
      const match = voices.find(v => v.name.toLowerCase().includes(voiceName.toLowerCase()));
      if (match) utterance.voice = match;
    }
  }

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  if (onBoundary) {
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        onBoundary(event.charIndex);
      }
    };
  }

  window.speechSynthesis.speak(utterance);
  return utterance;
}
