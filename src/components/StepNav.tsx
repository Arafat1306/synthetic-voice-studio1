import React from 'react';
import { STEPS } from '../data/steps';
import { StepId } from '../types';

interface StepNavProps {
  currentStep: StepId;
  onSelectStep: (id: StepId) => void;
}

export const StepNav: React.FC<StepNavProps> = ({ currentStep, onSelectStep }) => {
  return (
    <div className="flex flex-col items-center gap-2 max-w-4xl mx-auto px-4 select-none">
      {/* Top row pills: 1 through 7 */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {STEPS.slice(0, 7).map((step) => {
          const isActive = currentStep === step.id;

          return (
            <button
              key={step.id}
              onClick={() => onSelectStep(step.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 border shadow-sm ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 border-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.5)] scale-105 font-bold'
                  : 'bg-[#151a2d]/80 text-slate-300 border-slate-700/80 hover:border-slate-500 hover:text-white hover:bg-[#1c223a]'
              }`}
            >
              {step.label}
            </button>
          );
        })}
      </div>

      {/* Bottom row pill: 8. Share & Reset */}
      <div className="flex justify-center">
        {STEPS.slice(7).map((step) => {
          const isActive = currentStep === step.id;

          return (
            <button
              key={step.id}
              onClick={() => onSelectStep(step.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 border shadow-sm ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 border-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.5)] scale-105 font-bold'
                  : 'bg-[#151a2d]/80 text-slate-300 border-slate-700/80 hover:border-slate-500 hover:text-white hover:bg-[#1c223a]'
              }`}
            >
              {step.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
