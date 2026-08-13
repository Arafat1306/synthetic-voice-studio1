import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Sparkles, ArrowRight, Volume2, RotateCcw } from 'lucide-react';
import { KioskHeader } from '../KioskHeader';
import { SAMPLE_PROMPTS } from '../../data/voices';

interface InputStepProps {
  selectedLang: string;
  onSelectLang: (code: string) => void;
  text: string;
  setText: (t: string) => void;
  onNext: () => void;
}

export const InputStep: React.FC<InputStepProps> = ({
  selectedLang,
  onSelectLang,
  text,
  setText,
  onNext,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setSpeechSupported(true);
    }
  }, []);

  const toggleSpeechRecognition = () => {
    if (!speechSupported) {
      alert("Speech recognition is not supported in this browser. Please type your phrase.");
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = selectedLang === 'EN' ? 'en-US' : selectedLang;

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setText(transcript);
        }
        setIsRecording(false);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsRecording(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between text-slate-100 pb-6 relative">
      <KioskHeader selectedLang={selectedLang} onSelectLang={onSelectLang} />

      <div className="px-5 py-2 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Step 3: Enter Your Phrase
            </h2>
            <span className="text-[11px] text-slate-400">
              {text.length} / 250
            </span>
          </div>

          {/* Interactive Text Box Container */}
          <div className="relative bg-[#131728] border border-slate-700/80 rounded-2xl p-3 shadow-inner focus-within:border-cyan-400/80 focus-within:ring-1 focus-within:ring-cyan-400/50 transition-all">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 250))}
              placeholder="Type anything you want the neural voice to say..."
              rows={4}
              className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
            />

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
              <button
                onClick={toggleSpeechRecognition}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all ${
                  isRecording
                    ? 'bg-red-500/20 border border-red-500/60 text-red-300 animate-pulse'
                    : 'bg-slate-800 border border-slate-700 text-slate-300 hover:text-cyan-300'
                }`}
              >
                {isRecording ? <MicOff size={13} /> : <Mic size={13} />}
                <span>{isRecording ? 'Listening...' : 'Dictate Mic'}</span>
              </button>

              {text && (
                <button
                  onClick={() => setText('')}
                  className="text-slate-500 hover:text-slate-300 flex items-center gap-1"
                >
                  <RotateCcw size={12} /> Clear
                </button>
              )}
            </div>
          </div>

          {/* Quick Preset Prompts */}
          <div className="mt-4">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Preset Quick Examples
            </p>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_PROMPTS.slice(0, 4).map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => setText(prompt)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                    text === prompt
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <button
            disabled={!text.trim()}
            onClick={onNext}
            className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-xs sm:text-sm shadow-lg hover:shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <span>Next: Pick Neural Voice</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
