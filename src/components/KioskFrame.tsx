import React from 'react';

interface KioskFrameProps {
  children: React.ReactNode;
}

export const KioskFrame: React.FC<KioskFrameProps> = ({ children }) => {
  return (
    <div className="relative my-4 flex items-center justify-center">
      {/* Outer ambient glow */}
      <div className="absolute w-[380px] h-[720px] rounded-[38px] bg-cyan-500/10 blur-2xl -z-10 pointer-events-none" />

      {/* Main Kiosk Phone Frame */}
      <div className="w-[360px] sm:w-[380px] h-[700px] sm:h-[720px] bg-[#090b16] border-2 border-slate-800/90 rounded-[36px] shadow-[0_0_50px_rgba(3,7,18,0.8),0_0_20px_rgba(6,182,212,0.15)] overflow-hidden flex flex-col relative z-10">
        {/* Top Camera Notch / Speaker Grill bar */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-[#050711] rounded-b-xl border-x border-b border-slate-800/60 z-30 flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-700" />
          <div className="w-8 h-1 rounded-full bg-slate-800" />
        </div>

        {/* Ambient background particle grid inside screen */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

        {/* Dynamic Screen Content View */}
        <div className="flex-1 flex flex-col pt-3 overflow-hidden relative z-20">
          {children}
        </div>
      </div>
    </div>
  );
};
