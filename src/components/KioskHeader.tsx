import React, { useState } from 'react';
import { Globe, HelpCircle } from 'lucide-react';
import { LanguageModal } from './LanguageModal';
import { HelpModal } from './HelpModal';

interface KioskHeaderProps {
  selectedLang: string;
  onSelectLang: (code: string) => void;
}

export const KioskHeader: React.FC<KioskHeaderProps> = ({
  selectedLang,
  onSelectLang,
}) => {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between px-5 pt-5 pb-2 text-xs font-medium text-slate-300 select-none">
        <button
          onClick={() => setIsLangOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 hover:border-cyan-500/50 hover:bg-slate-800 text-cyan-300 transition-all shadow-sm"
        >
          <Globe size={13} className="text-cyan-400" />
          <span>{selectedLang}</span>
        </button>

        <button
          onClick={() => setIsHelpOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 hover:border-cyan-500/50 hover:bg-slate-800 text-slate-300 hover:text-white transition-all shadow-sm"
        >
          <HelpCircle size={13} className="text-slate-400" />
          <span>? Help</span>
        </button>
      </div>

      <LanguageModal
        isOpen={isLangOpen}
        onClose={() => setIsLangOpen(false)}
        selectedLang={selectedLang}
        onSelectLang={onSelectLang}
      />

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </>
  );
};
