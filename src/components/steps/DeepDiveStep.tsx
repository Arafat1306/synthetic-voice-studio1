import React, { useState } from 'react';
import { Activity, Layers, Volume2, ArrowRight, Zap, Info } from 'lucide-react';
import { KioskHeader } from '../KioskHeader';
import { generatePhonemeBreakdown, playPhonemeTone } from '../../utils/audio';

interface DeepDiveStepProps {
  selectedLang: string;
  onSelectLang: (code: string) => void;
  text: string;
  onNext: () => void;
}

export const DeepDiveStep: React.FC<DeepDiveStepProps> = ({
  selectedLang,
  onSelectLang,
  text,
  onNext,
}) => {
  const [activePhonemeIdx, setActivePhonemeIdx] = useState<number | null>(null);
  const [scaleMode, setScaleMode] = useState<'mel' | 'linear'>('mel');

  const phonemes = generatePhonemeBreakdown(text || 'Hello world');

  const handlePhonemeClick = (idx: number, ipa: string, freq: [number, number]) => {
    setActivePhonemeIdx(idx);
    playPhonemeTone(ipa, 0.25, freq);
    setTimeout(() => setActivePhonemeIdx(null), 300);
  };

  return (
    <div className="flex-1 flex flex-col justify-between text-slate-100 pb-5 relative select-none">
      <KioskHeader selectedLang={selectedLang} onSelectLang={onSelectLang} />

      <div className="px-5 py-2 flex-1 flex flex-col justify-between overflow-y-auto">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                Step 7: Deep Dive
              </div>
              <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                Spectrogram & Phonemes
              </h2>
            </div>

            <button
              onClick={() => setScaleMode(s => s === 'mel' ? 'linear' : 'mel')}
              className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-[10px] text-cyan-300 font-mono font-semibold hover:bg-slate-700"
            >
              Scale: {scaleMode.toUpperCase()}
            </button>
          </div>

          {/* Interactive Spectrogram Heatmap Simulation */}
          <div className="bg-[#0e1222] border border-slate-800 rounded-2xl p-3 mb-3 shadow-inner">
            <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1.5 font-mono">
              <span>Frequency (0 - 12 kHz)</span>
              <span className="text-cyan-400 font-bold">Acoustic Energy Map</span>
            </div>

            {/* Heatmap Grid */}
            <div className="h-28 w-full bg-[#080b14] rounded-xl overflow-hidden relative border border-slate-900 grid grid-cols-12 gap-0.5 p-1">
              {Array.from({ length: 12 }).map((_, col) => (
                <div key={col} className="flex flex-col gap-0.5 h-full">
                  {Array.from({ length: 8 }).map((_, row) => {
                    const intensity = Math.sin((col + 1) * (row + 1) * 0.4) * 0.5 + 0.5;
                    const isHot = intensity > 0.6;
                    const isMid = intensity > 0.3;

                    return (
                      <div
                        key={row}
                        className={`flex-1 rounded-[2px] transition-opacity duration-300 ${
                          isHot
                            ? 'bg-gradient-to-r from-cyan-400 to-amber-400 opacity-90'
                            : isMid
                            ? 'bg-cyan-600/60 opacity-60'
                            : 'bg-slate-800/40 opacity-30'
                        }`}
                      />
                    );
                  })}
                </div>
              ))}

              <div className="absolute bottom-1 left-2 text-[9px] text-slate-500 font-mono">Time (0s - 2.5s)</div>
            </div>
          </div>

          {/* Phoneme Timeline Breakdown (Clickable Phonemes) */}
          <div className="bg-[#121626] border border-slate-800 rounded-xl p-3 mb-3">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-200 flex items-center gap-1">
                <Layers size={13} className="text-cyan-400" />
                Tap Phoneme to Hear Acoustic Tone
              </span>
              <span className="text-[10px] text-slate-400">{phonemes.length} Phonemes</span>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
              {phonemes.map((item, idx) => {
                const isActive = activePhonemeIdx === idx;
                if (item.type === 'silence') return null;

                return (
                  <button
                    key={idx}
                    onClick={() => handlePhonemeClick(idx, item.ipa, item.frequencyRange)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1 ${
                      isActive
                        ? 'bg-cyan-400 text-black scale-110 shadow-lg'
                        : item.type === 'vowel'
                        ? 'bg-cyan-950/80 border border-cyan-500/40 text-cyan-200 hover:bg-cyan-900'
                        : 'bg-slate-800/80 border border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span>/{item.ipa}/</span>
                    <Volume2 size={10} className="opacity-70" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Neural Architecture Telemetry Box */}
          <div className="grid grid-cols-3 gap-2 text-[10px]">
            <div className="bg-[#111526] border border-slate-800 rounded-xl p-2 text-center">
              <div className="text-slate-400">Sample Rate</div>
              <div className="text-cyan-300 font-bold font-mono text-xs mt-0.5">24,000 Hz</div>
            </div>

            <div className="bg-[#111526] border border-slate-800 rounded-xl p-2 text-center">
              <div className="text-slate-400">Vocoder</div>
              <div className="text-cyan-300 font-bold font-mono text-xs mt-0.5">Neural Mel</div>
            </div>

            <div className="bg-[#111526] border border-slate-800 rounded-xl p-2 text-center">
              <div className="text-slate-400">Latency</div>
              <div className="text-emerald-400 font-bold font-mono text-xs mt-0.5">~180 ms</div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-slate-800/80">
          <button
            onClick={onNext}
            className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs sm:text-sm shadow-lg hover:shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <span>Step 8: Share & Reset Journey &rarr;</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
