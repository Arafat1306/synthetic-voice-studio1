import React from 'react';
import { Mic } from 'lucide-react';
import { KioskHeader } from '../KioskHeader';

interface WelcomeStepProps {
  selectedLang: string;
  onSelectLang: (code: string) => void;
  onSelectPrompt: (promptText: string) => void;
  onOpenInput: () => void;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({
  selectedLang,
  onSelectLang,
  onSelectPrompt,
  onOpenInput,
}) => {
  const samplePrompts = [
    '"Hello, world!"',
    '"To infinity and beyond"',
    '"I am a robot"',
  ];

  return (
    <div className="flex-1 flex flex-col justify-between text-slate-100 select-none pb-8 relative">
      {/* Kiosk Top Bar inside Phone Frame */}
      <KioskHeader selectedLang={selectedLang} onSelectLang={onSelectLang} />

      {/* Main Content Area */}
      <div className="px-6 flex-1 flex flex-col items-center justify-center my-auto text-center space-y-6">
        {/* Main Headings */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
            Type or say<br />something.
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm font-normal max-w-[240px] mx-auto">
            I'll bring your words to life as a voice.
          </p>
        </div>

        {/* Center Mic Button inside Glowing Ring */}
        <div className="py-2">
          <button
            onClick={onOpenInput}
            className="group relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none"
            title="Tap to speak or type custom text"
          >
            {/* Glowing ring matching image */}
            <div className="absolute inset-0 rounded-full border-2 border-teal-400/80 shadow-[0_0_20px_rgba(45,212,191,0.4)] group-hover:shadow-[0_0_30px_rgba(45,212,191,0.7)] group-hover:scale-105 transition-all" />
            <div className="w-16 h-16 rounded-full bg-[#1e2338] border border-slate-700/80 flex items-center justify-center text-slate-200 group-hover:text-cyan-300 group-hover:bg-[#252a42] transition-colors">
              <Mic size={24} className="transform rotate-[-12deg]" />
            </div>
          </button>
        </div>

        {/* Sample Prompt Chips */}
        <div className="w-full flex flex-col items-center gap-2.5 pt-2">
          {samplePrompts.map((promptText, idx) => (
            <button
              key={idx}
              onClick={() => onSelectPrompt(promptText.replace(/"/g, ''))}
              className="px-4 py-2 rounded-full bg-[#1b2034]/90 border border-slate-700/70 hover:border-cyan-400/60 hover:bg-[#232943] text-slate-200 text-xs font-medium transition-all shadow-sm hover:scale-[1.02] active:scale-95"
            >
              {promptText}
            </button>
          ))}
        </div>
      </div>

      {/* Subtle indicator */}
      <div className="text-center px-4">
        <button
          onClick={onOpenInput}
          className="text-xs text-cyan-400 hover:text-cyan-300 underline font-medium"
        >
          Or type a custom phrase &rarr;
        </button>
      </div>
    </div>
  );
};
