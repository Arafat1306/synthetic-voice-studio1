import React, { useState } from 'react';
import { Download, Share2, QrCode, RotateCcw, Check, Sparkles, Heart } from 'lucide-react';
import { KioskHeader } from '../KioskHeader';
import { GenerationSettings } from '../../types';
import { VOICES } from '../../data/voices';

interface ShareAndResetStepProps {
  selectedLang: string;
  onSelectLang: (code: string) => void;
  settings: GenerationSettings;
  onReset: () => void;
}

export const ShareAndResetStep: React.FC<ShareAndResetStepProps> = ({
  selectedLang,
  onSelectLang,
  settings,
  onReset,
}) => {
  const [copied, setCopied] = useState(false);
  const voice = VOICES.find(v => v.id === settings.voiceId) || VOICES[0];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    // Generate simple audio WAV or trigger web synthesis text download
    const blob = new Blob([`Synthetic Voice Studio Audio Export\nVoice: ${voice.name}\nEmotion: ${settings.emotion}\nText: "${settings.text}"`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `synthetic_voice_${voice.name.toLowerCase()}_${Date.now()}.txt`;
    a.click();
  };

  return (
    <div className="flex-1 flex flex-col justify-between text-slate-100 pb-5 relative select-none">
      <KioskHeader selectedLang={selectedLang} onSelectLang={onSelectLang} />

      <div className="px-5 py-2 flex-1 flex flex-col justify-between overflow-y-auto">
        <div>
          {/* Header */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-300 text-[11px] font-semibold uppercase tracking-wider mb-2">
              <Sparkles size={12} />
              Journey Complete
            </div>
            <h2 className="text-lg font-bold text-white">Share Your Synthetic Voice</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Take your neural voice audio creation home or send it to your device.
            </p>
          </div>

          {/* QR Code Simulation Box */}
          <div className="bg-[#121626] border border-slate-800 rounded-2xl p-4 text-center mb-4 shadow-lg flex flex-col items-center justify-center">
            <div className="w-28 h-28 bg-white p-2 rounded-xl flex items-center justify-center shadow-md relative">
              {/* QR Code Pixel Grid Simulation */}
              <div className="w-full h-full border-2 border-slate-900 grid grid-cols-6 gap-0.5 p-1 bg-slate-950 rounded">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-[1px] ${
                      (i * 7 + 3) % 5 === 0 || i % 2 === 0 ? 'bg-cyan-400' : 'bg-[#0f172a]'
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-[11px] text-slate-300 font-medium mt-2 flex items-center gap-1 justify-center">
              <QrCode size={13} className="text-cyan-400" />
              Scan QR code on mobile to save audio
            </p>
          </div>

          {/* Download & Copy Link Buttons */}
          <div className="space-y-2 mb-4">
            <button
              onClick={handleDownload}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <Download size={15} className="text-cyan-400" />
              <span>Download Audio (.WAV)</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
            >
              {copied ? <Check size={15} className="text-emerald-400" /> : <Share2 size={15} className="text-cyan-400" />}
              <span>{copied ? 'Link Copied to Clipboard!' : 'Copy Shareable Kiosk Link'}</span>
            </button>
          </div>
        </div>

        {/* Start New Visitor Journey CTA */}
        <div className="pt-3 border-t border-slate-800/80">
          <button
            onClick={onReset}
            className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 text-white font-bold text-xs sm:text-sm shadow-lg hover:shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <RotateCcw size={16} />
            <span>Start New Visitor Journey</span>
          </button>
        </div>
      </div>
    </div>
  );
};
