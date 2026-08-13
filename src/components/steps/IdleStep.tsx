import React from 'react';
import { Volume2, Sparkles, Radio, Play } from 'lucide-react';

interface IdleStepProps {
  onStart: () => void;
}

export const IdleStep: React.FC<IdleStepProps> = ({ onStart }) => {
  return (
    <div
      onClick={onStart}
      className="flex-1 flex flex-col items-center justify-between px-6 py-8 text-center cursor-pointer select-none group relative overflow-hidden"
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-radial from-cyan-500/10 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* Top Header info */}
      <div className="z-10 mt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-[11px] font-medium tracking-wider uppercase mb-2">
          <Radio size={12} className="animate-pulse text-cyan-400" />
          Exhibit Standby
        </div>
        <p className="text-slate-400 text-xs">Touch screen to explore neural voice synthesis</p>
      </div>

      {/* Center glowing orb / neural sphere */}
      <div className="relative my-auto z-10 flex flex-col items-center justify-center">
        {/* Animated concentric rings */}
        <div className="absolute w-44 h-44 rounded-full border border-cyan-500/20 animate-ping opacity-30" />
        <div className="absolute w-36 h-36 rounded-full border border-cyan-400/30 animate-pulse" />
        
        {/* Main interactive orb */}
        <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-cyan-600 via-teal-500 to-indigo-600 p-[3px] shadow-[0_0_50px_rgba(6,182,212,0.4)] group-hover:scale-105 transition-transform duration-300">
          <div className="w-full h-full rounded-full bg-[#0d1120] flex items-center justify-center relative overflow-hidden">
            <Volume2 size={36} className="text-cyan-300 group-hover:text-cyan-200 transition-colors" />
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-transparent" />
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center justify-center gap-2">
            SYNTHETIC VOICE STUDIO
          </h2>
          <p className="text-slate-300 text-xs mt-1 max-w-[240px]">
            Neural Text-to-Speech Exhibit Prototype
          </p>
        </div>
      </div>

      {/* Bottom CTA Button */}
      <div className="z-10 w-full mb-2">
        <button className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] flex items-center justify-center gap-2 transition-all">
          <Play size={16} className="fill-current" />
          Tap Anywhere to Begin
        </button>
        <p className="text-[10px] text-slate-500 mt-2">Interactive Visitor Journey — Step 1 of 8</p>
      </div>
    </div>
  );
};
