import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, Sparkles, ArrowRight, Zap, SlidersHorizontal } from 'lucide-react';
import { KioskHeader } from '../KioskHeader';
import { GenerationSettings, VoiceOption } from '../../types';
import { VOICES } from '../../data/voices';
import { speakWebSpeech } from '../../utils/audio';

interface RevealStepProps {
  selectedLang: string;
  onSelectLang: (code: string) => void;
  settings: GenerationSettings;
  audioResult: { audioBase64?: string; fallback?: boolean } | null;
  onNext: () => void;
}

export const RevealStep: React.FC<RevealStepProps> = ({
  selectedLang,
  onSelectLang,
  settings,
  audioResult,
  onNext,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState<number | null>(null);
  const [compareLegacy, setCompareLegacy] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  const voice = VOICES.find(v => v.id === settings.voiceId) || VOICES[0];
  const words = settings.text.split(/\s+/).filter(Boolean);

  const playSpeech = () => {
    setIsPlaying(true);
    setCurrentWordIndex(0);

    const pitchToUse = compareLegacy ? 0.6 : voice.defaultPitch * settings.pitch;
    const rateToUse = compareLegacy ? 0.7 : voice.defaultSpeed * settings.speed * playbackSpeed;
    const voiceToUse = compareLegacy ? undefined : voice.name;

    speakWebSpeech(
      settings.text,
      pitchToUse,
      rateToUse,
      voiceToUse,
      () => {
        setIsPlaying(false);
        setCurrentWordIndex(null);
      },
      (charIdx) => {
        // Calculate rough word index from character position
        let accumulated = 0;
        for (let i = 0; i < words.length; i++) {
          accumulated += words[i].length + 1;
          if (charIdx <= accumulated) {
            setCurrentWordIndex(i);
            break;
          }
        }
      }
    );
  };

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setCurrentWordIndex(null);
  };

  useEffect(() => {
    // Auto-play once on reveal start
    playSpeech();
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col justify-between text-slate-100 pb-5 relative select-none">
      <KioskHeader selectedLang={selectedLang} onSelectLang={onSelectLang} />

      <div className="px-5 py-2 flex-1 flex flex-col justify-between overflow-y-auto">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                Step 6: Reveal & Playback
              </div>
              <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                Neural Speech Output
              </h2>
            </div>

            <div className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
              compareLegacy 
                ? 'bg-amber-950/80 border border-amber-500/50 text-amber-300' 
                : 'bg-cyan-950/80 border border-cyan-500/50 text-cyan-300'
            }`}>
              <Sparkles size={12} />
              <span>{compareLegacy ? 'Legacy Robot' : `${voice.name} (${settings.emotion})`}</span>
            </div>
          </div>

          {/* Persona Card */}
          <div className="bg-[#131728] border border-slate-700/70 rounded-2xl p-3.5 mb-4 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${voice.avatarColor} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                {voice.name[0]}
              </div>
              <div>
                <div className="text-sm font-bold text-white">{voice.name} Persona</div>
                <div className="text-xs text-slate-400">{voice.tagline} • {settings.emotion} tone</div>
              </div>
            </div>

            {/* Subtitle / Synchronized Word Highlight Display */}
            <div className="bg-[#0b0e1b] border border-slate-800/80 rounded-xl p-3 min-h-[70px] flex items-center justify-center text-center">
              <p className="text-sm sm:text-base font-medium leading-relaxed">
                {words.map((word, idx) => {
                  const isHighlighted = currentWordIndex === idx;
                  return (
                    <span
                      key={idx}
                      className={`inline-block mx-0.5 px-1 py-0.5 rounded transition-all duration-150 ${
                        isHighlighted
                          ? 'bg-cyan-500 text-black font-bold scale-105 shadow-sm'
                          : 'text-slate-200'
                      }`}
                    >
                      {word}
                    </span>
                  );
                })}
              </p>
            </div>

            {/* Animated Waveform Visualizer Bars */}
            <div className="mt-3 flex items-center justify-center gap-1 h-8 px-2">
              {[40, 70, 30, 90, 60, 100, 45, 80, 50, 95, 30, 65, 85, 40, 75, 50, 90, 35].map((h, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-200 ${
                    isPlaying 
                      ? 'bg-cyan-400 animate-pulse' 
                      : 'bg-slate-700'
                  }`}
                  style={{
                    height: isPlaying ? `${Math.max(15, (h * (i % 2 === 0 ? 0.9 : 0.6)))}%` : '20%',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Interactive Player Controls */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <button
              onClick={() => {
                stopSpeech();
                playSpeech();
              }}
              className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all border border-slate-700"
              title="Replay"
            >
              <RotateCcw size={16} />
            </button>

            <button
              onClick={() => (isPlaying ? stopSpeech() : playSpeech())}
              className="w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-0.5" />}
            </button>

            {/* Speed Adjust */}
            <button
              onClick={() => setPlaybackSpeed(s => (s >= 1.5 ? 0.8 : Number((s + 0.2).toFixed(1))))}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono font-bold border border-slate-700"
              title="Toggle Playback Speed"
            >
              {playbackSpeed}x
            </button>
          </div>

          {/* Interactive Audio Mode Comparison Toggle */}
          <div className="bg-[#121626] border border-slate-800 rounded-xl p-2.5 flex items-center justify-between text-xs">
            <div>
              <div className="font-semibold text-slate-200">A/B Technology Comparison</div>
              <div className="text-[10px] text-slate-400">Compare modern Neural AI vs 1990s Concatenative Robot</div>
            </div>

            <button
              onClick={() => {
                stopSpeech();
                setCompareLegacy(!compareLegacy);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                compareLegacy
                  ? 'bg-amber-500 text-black'
                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              }`}
            >
              {compareLegacy ? '1990s Robot' : 'Neural AI'}
            </button>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-slate-800/80">
          <button
            onClick={onNext}
            className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs sm:text-sm shadow-lg hover:shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <span>Step 7: Deep Dive Spectrogram &rarr;</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
