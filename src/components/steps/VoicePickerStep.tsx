import React, { useState } from 'react';
import { VOICES } from '../../data/voices';
import { VoiceOption, GenerationSettings, EmotionType } from '../../types';
import { KioskHeader } from '../KioskHeader';
import { speakWebSpeech } from '../../utils/audio';
import { Volume2, Sliders, Sparkles, Check, Play, User } from 'lucide-react';

interface VoicePickerStepProps {
  selectedLang: string;
  onSelectLang: (code: string) => void;
  settings: GenerationSettings;
  setSettings: React.Dispatch<React.SetStateAction<GenerationSettings>>;
  onGenerate: () => void;
}

const EMOTIONS: EmotionType[] = ['Neutral', 'Friendly', 'Energetic', 'Dramatic', 'Whisper', 'Excited'];

export const VoicePickerStep: React.FC<VoicePickerStepProps> = ({
  selectedLang,
  onSelectLang,
  settings,
  setSettings,
  onGenerate,
}) => {
  const [playingSampleId, setPlayingSampleId] = useState<string | null>(null);

  const selectedVoice = VOICES.find(v => v.id === settings.voiceId) || VOICES[0];

  const handlePreviewSample = (voice: VoiceOption, e: React.MouseEvent) => {
    e.stopPropagation();
    setPlayingSampleId(voice.id);
    speakWebSpeech(
      voice.sampleText,
      voice.defaultPitch * settings.pitch,
      voice.defaultSpeed * settings.speed,
      voice.name,
      () => setPlayingSampleId(null)
    );
  };

  const handleEmotionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    const index = Math.min(Math.floor((val / 100) * EMOTIONS.length), EMOTIONS.length - 1);
    setSettings(prev => ({
      ...prev,
      emotionValue: val,
      emotion: EMOTIONS[index]
    }));
  };

  return (
    <div className="flex-1 flex flex-col justify-between text-slate-100 pb-5 relative overflow-hidden">
      <KioskHeader selectedLang={selectedLang} onSelectLang={onSelectLang} />

      <div className="px-5 py-2 flex-1 flex flex-col justify-between overflow-y-auto">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders size={16} className="text-cyan-400" />
              Step 4: Voice & Emotion
            </h2>
            <span className="text-[11px] bg-cyan-950 border border-cyan-500/30 text-cyan-300 px-2 py-0.5 rounded-full">
              {settings.emotion} Emotion
            </span>
          </div>

          {/* Voice Cards Grid */}
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Select Neural Voice Persona
          </p>

          <div className="grid grid-cols-2 gap-2 mb-4">
            {VOICES.map((voice) => {
              const isSelected = settings.voiceId === voice.id;
              const isPlaying = playingSampleId === voice.id;

              return (
                <div
                  key={voice.id}
                  onClick={() => setSettings(prev => ({ ...prev, voiceId: voice.id }))}
                  className={`relative p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-gradient-to-br from-[#192238] to-[#12192a] border-cyan-400 ring-1 ring-cyan-400/50 shadow-md'
                      : 'bg-[#121626]/80 border-slate-800 hover:border-slate-700 hover:bg-[#161c30]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${voice.avatarColor} flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
                        {voice.name[0]}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1">
                          {voice.name}
                          {isSelected && <Check size={12} className="text-cyan-400" />}
                        </div>
                        <div className="text-[10px] text-slate-400 leading-tight">
                          {voice.tagline}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between border-t border-slate-800/80 pt-2 text-[10px]">
                    <span className="text-slate-400">{voice.accent}</span>
                    <button
                      onClick={(e) => handlePreviewSample(voice, e)}
                      className={`px-2 py-0.5 rounded-md flex items-center gap-1 font-medium transition-colors ${
                        isPlaying
                          ? 'bg-cyan-500 text-black font-bold'
                          : 'bg-slate-800 hover:bg-slate-700 text-cyan-300'
                      }`}
                    >
                      <Volume2 size={10} />
                      {isPlaying ? 'Playing' : 'Sample'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Emotion Slider Section (Clickable) */}
          <div className="bg-[#121626] border border-slate-800 rounded-xl p-3 mb-3">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-200">Interactive Emotion Slider</span>
              <span className="text-cyan-300 font-bold">{settings.emotion}</span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={settings.emotionValue}
              onChange={handleEmotionChange}
              className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />

            <div className="flex justify-between text-[9px] text-slate-400 mt-1 font-medium">
              <span>Neutral</span>
              <span>Friendly</span>
              <span>Dramatic</span>
              <span>Excited</span>
            </div>
          </div>

          {/* Pitch & Speed Fine Tuning */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-[#121626] border border-slate-800 rounded-xl p-2.5">
              <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                <span>Pitch</span>
                <span className="text-cyan-400 font-mono">{settings.pitch.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.7"
                max="1.3"
                step="0.1"
                value={settings.pitch}
                onChange={(e) => setSettings(p => ({ ...p, pitch: parseFloat(e.target.value) }))}
                className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg"
              />
            </div>

            <div className="bg-[#121626] border border-slate-800 rounded-xl p-2.5">
              <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                <span>Speaking Rate</span>
                <span className="text-cyan-400 font-mono">{settings.speed.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.7"
                max="1.4"
                step="0.1"
                value={settings.speed}
                onChange={(e) => setSettings(p => ({ ...p, speed: parseFloat(e.target.value) }))}
                className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Generate CTA Button */}
        <div className="pt-3 border-t border-slate-800/80">
          <button
            onClick={onGenerate}
            className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <Sparkles size={16} />
            <span>Generate Neural Voice Synthesis &rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
};
