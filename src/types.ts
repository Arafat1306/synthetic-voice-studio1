export type StepId = 
  | 'idle'
  | 'welcome'
  | 'input'
  | 'voice'
  | 'generating'
  | 'reveal'
  | 'deepdive'
  | 'share';

export interface StepInfo {
  id: StepId;
  number: number;
  label: string;
  shortName: string;
}

export type EmotionType = 'Neutral' | 'Friendly' | 'Energetic' | 'Dramatic' | 'Whisper' | 'Excited' | 'Calm';

export interface VoiceOption {
  id: string;
  name: string;
  geminiVoice: string; // 'Kore' | 'Puck' | 'Zephyr' | 'Charon' | 'Fenrir'
  tagline: string;
  gender: 'Female' | 'Male' | 'Non-Binary';
  accent: string;
  description: string;
  recommendedFor: string;
  avatarColor: string;
  sampleText: string;
  defaultPitch: number;
  defaultSpeed: number;
}

export interface GenerationSettings {
  text: string;
  voiceId: string;
  emotion: EmotionType;
  emotionValue: number; // 0 to 100
  pitch: number; // 0.5 to 1.5
  speed: number; // 0.5 to 1.5
  language: string;
}

export interface PhonemeItem {
  phoneme: string;
  ipa: string;
  startTime: number; // seconds
  endTime: number; // seconds
  type: 'vowel' | 'consonant' | 'silence';
  frequencyRange: [number, number]; // Hz
}

export interface SynthesisResult {
  text: string;
  voice: VoiceOption;
  emotion: EmotionType;
  audioUrl?: string;
  pcmData?: ArrayBuffer;
  duration: number; // seconds
  phonemes: PhonemeItem[];
  sampleRate: number;
  isGeminiAudio: boolean;
}
