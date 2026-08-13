import React from 'react';
import { HelpCircle, X, Sparkles, Mic, Sliders, Cpu, Activity, Download } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#121626] border border-cyan-500/30 rounded-2xl w-full max-w-sm p-5 shadow-2xl text-white relative max-h-[85vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 mb-3 text-cyan-400">
          <HelpCircle size={22} />
          <h3 className="font-semibold text-lg">Exhibit Guide</h3>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          Welcome to the <strong className="text-cyan-300">Synthetic Voice Studio</strong> exhibit prototype! This interactive kiosk demonstrates state-of-the-art neural text-to-speech technology.
        </p>

        <div className="space-y-3 text-xs">
          <div className="flex gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <Mic className="text-cyan-400 shrink-0 mt-0.5" size={18} />
            <div>
              <div className="font-medium text-slate-200">1. Input / Record</div>
              <p className="text-slate-400">Type custom text or tap sample prompt chips to speak into the neural vocoder.</p>
            </div>
          </div>

          <div className="flex gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <Sliders className="text-purple-400 shrink-0 mt-0.5" size={18} />
            <div>
              <div className="font-medium text-slate-200">2. Pick Voice & Emotion</div>
              <p className="text-slate-400">Select neural voice personas (Kore, Puck, Zephyr, etc.) and fine-tune emotion intensity.</p>
            </div>
          </div>

          <div className="flex gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <Cpu className="text-amber-400 shrink-0 mt-0.5" size={18} />
            <div>
              <div className="font-medium text-slate-200">3. Neural Synthesis</div>
              <p className="text-slate-400">Watch neural transformer layers transform graphemes into acoustic mel-spectrograms.</p>
            </div>
          </div>

          <div className="flex gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <Activity className="text-emerald-400 shrink-0 mt-0.5" size={18} />
            <div>
              <div className="font-medium text-slate-200">4. Spectrogram Deep Dive</div>
              <p className="text-slate-400">Inspect interactive acoustic heatmaps and tap individual phoneme timings.</p>
            </div>
          </div>

          <div className="flex gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <Download className="text-blue-400 shrink-0 mt-0.5" size={18} />
            <div>
              <div className="font-medium text-slate-200">5. Share & Download</div>
              <p className="text-slate-400">Export high-fidelity audio files (.wav) or scan QR code to transfer to your phone.</p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-medium text-xs text-white shadow-lg hover:opacity-90 transition-all"
        >
          Got it! Return to Exhibit
        </button>
      </div>
    </div>
  );
};
