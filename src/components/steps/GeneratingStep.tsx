import React, { useEffect, useState } from 'react';
import { Cpu, Sparkles, Activity, CheckCircle, ArrowRight } from 'lucide-react';
import { KioskHeader } from '../KioskHeader';

interface GeneratingStepProps {
  selectedLang: string;
  onSelectLang: (code: string) => void;
  onComplete: () => void;
}

const PROCESS_STEPS = [
  'Grapheme-to-Phoneme Alignment',
  'Acoustic Feature Extraction',
  'Mel-Spectrogram Prediction',
  'Neural Vocoder Waveform Synthesis',
  'Audio Post-Processing & Normalization'
];

export const GeneratingStep: React.FC<GeneratingStepProps> = ({
  selectedLang,
  onSelectLang,
  onComplete,
}) => {
  const [progress, setProgress] = useState(0);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => onComplete(), 400);
          return 100;
        }
        const next = prev + 5;
        const step = Math.min(Math.floor((next / 100) * PROCESS_STEPS.length), PROCESS_STEPS.length - 1);
        setCurrentStepIdx(step);
        return next;
      });
    }, 120);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="flex-1 flex flex-col justify-between text-slate-100 pb-6 relative select-none">
      <KioskHeader selectedLang={selectedLang} onSelectLang={onSelectLang} />

      <div className="px-6 flex-1 flex flex-col items-center justify-center text-center my-auto space-y-6">
        <div className="relative">
          {/* Glowing animated spinner */}
          <div className="w-24 h-24 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 border-r-teal-400 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Cpu size={32} className="text-cyan-300 animate-pulse" />
          </div>
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Activity size={12} className="animate-pulse" />
            Neural Synthesis Engine
          </div>
          <h2 className="text-xl font-bold text-white">Synthesizing Voice</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-[220px] mx-auto">
            Converting text input into high-fidelity neural acoustic waveforms...
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-xs space-y-2">
          <div className="flex justify-between text-xs text-slate-300 font-mono">
            <span>{PROCESS_STEPS[currentStepIdx]}</span>
            <span className="text-cyan-400 font-bold">{progress}%</span>
          </div>

          <div className="w-full h-2.5 bg-slate-900 border border-slate-800 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-500 rounded-full transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Live Telemetry Log */}
        <div className="w-full max-w-xs bg-[#111526] border border-slate-800 rounded-xl p-3 text-left space-y-1.5 font-mono text-[10px]">
          {PROCESS_STEPS.map((step, idx) => {
            const isDone = idx < currentStepIdx || progress === 100;
            const isCurrent = idx === currentStepIdx && progress < 100;

            return (
              <div
                key={idx}
                className={`flex items-center gap-2 transition-colors ${
                  isDone
                    ? 'text-cyan-400 font-medium'
                    : isCurrent
                    ? 'text-white font-bold'
                    : 'text-slate-600'
                }`}
              >
                {isDone ? (
                  <CheckCircle size={10} className="text-cyan-400 shrink-0" />
                ) : (
                  <div className={`w-2 h-2 rounded-full shrink-0 ${isCurrent ? 'bg-cyan-400 animate-ping' : 'bg-slate-700'}`} />
                )}
                <span className="truncate">{step}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-6 text-center">
        <button
          onClick={onComplete}
          className="text-xs text-slate-400 hover:text-cyan-300 flex items-center justify-center gap-1 mx-auto"
        >
          <span>Skip Wait & Reveal</span>
          <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
};
