import React from 'react';
import { LANGUAGES } from '../data/voices';
import { Globe, X, Check } from 'lucide-react';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLang: string;
  onSelectLang: (code: string) => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({
  isOpen,
  onClose,
  selectedLang,
  onSelectLang,
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all">
      <div className="bg-[#121626] border border-cyan-500/30 rounded-2xl w-full max-w-xs p-5 shadow-2xl text-white relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 mb-4 text-cyan-400">
          <Globe size={20} />
          <h3 className="font-semibold text-lg">Select Kiosk Language</h3>
        </div>

        <p className="text-xs text-slate-400 mb-4">
          Choose a primary language for phoneme synthesis and interface text.
        </p>

        <div className="space-y-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                onSelectLang(lang.code);
                onClose();
              }}
              className={`w-full flex items-center justify-between p-3 rounded-xl border text-sm font-medium transition-all ${
                selectedLang === lang.code
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{lang.flag}</span>
                <span>{lang.name}</span>
              </div>
              {selectedLang === lang.code && <Check size={16} className="text-cyan-400" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
