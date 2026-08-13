import React, { useState } from 'react';
import { StepId, GenerationSettings } from './types';
import { StepNav } from './components/StepNav';
import { KioskFrame } from './components/KioskFrame';

// Step Views
import { IdleStep } from './components/steps/IdleStep';
import { WelcomeStep } from './components/steps/WelcomeStep';
import { InputStep } from './components/steps/InputStep';
import { VoicePickerStep } from './components/steps/VoicePickerStep';
import { GeneratingStep } from './components/steps/GeneratingStep';
import { RevealStep } from './components/steps/RevealStep';
import { DeepDiveStep } from './components/steps/DeepDiveStep';
import { ShareAndResetStep } from './components/steps/ShareAndResetStep';

export default function App() {
  const [currentStep, setCurrentStep] = useState<StepId>('welcome');
  const [selectedLang, setSelectedLang] = useState<string>('EN');

  const [settings, setSettings] = useState<GenerationSettings>({
    text: 'Hello, world!',
    voiceId: 'kore',
    emotion: 'Friendly',
    emotionValue: 30,
    pitch: 1.0,
    speed: 1.0,
    language: 'EN',
  });

  const [audioResult, setAudioResult] = useState<{ audioBase64?: string; fallback?: boolean } | null>(null);

  const handleStartGeneration = async () => {
    setCurrentStep('generating');
    setAudioResult(null);

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: settings.text,
          voice: settings.voiceId,
          emotion: settings.emotion,
          speed: settings.speed,
          pitch: settings.pitch,
        }),
      });
      const data = await res.json();
      setAudioResult(data);
    } catch (e) {
      console.error('Error fetching TTS:', e);
      setAudioResult({ fallback: true });
    }
  };

  const handlePromptSelect = (promptText: string) => {
    setSettings((prev) => ({ ...prev, text: promptText }));
    setCurrentStep('input');
  };

  return (
    <div className="min-h-screen bg-[#05070f] text-white flex flex-col items-center justify-between py-6 px-4 font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Header Section */}
      <header className="text-center space-y-1 mb-4 select-none">
        <h1 className="text-lg sm:text-xl font-extrabold tracking-widest uppercase text-slate-100 font-mono">
          SYNTHETIC VOICE STUDIO
        </h1>
        <p className="text-xs sm:text-sm font-medium text-teal-400">
          Neural Text-to-Speech Exhibit — Interactive High-Fidelity Prototype
        </p>
      </header>

      {/* Top Step Pills Navigation */}
      <nav className="w-full mb-2">
        <StepNav currentStep={currentStep} onSelectStep={setCurrentStep} />
      </nav>

      {/* Central Kiosk Phone Display Frame */}
      <main className="flex-1 flex items-center justify-center my-auto">
        <KioskFrame>
          {currentStep === 'idle' && (
            <IdleStep onStart={() => setCurrentStep('welcome')} />
          )}

          {currentStep === 'welcome' && (
            <WelcomeStep
              selectedLang={selectedLang}
              onSelectLang={setSelectedLang}
              onSelectPrompt={handlePromptSelect}
              onOpenInput={() => setCurrentStep('input')}
            />
          )}

          {currentStep === 'input' && (
            <InputStep
              selectedLang={selectedLang}
              onSelectLang={setSelectedLang}
              text={settings.text}
              setText={(t) => setSettings((prev) => ({ ...prev, text: t }))}
              onNext={() => setCurrentStep('voice')}
            />
          )}

          {currentStep === 'voice' && (
            <VoicePickerStep
              selectedLang={selectedLang}
              onSelectLang={setSelectedLang}
              settings={settings}
              setSettings={setSettings}
              onGenerate={handleStartGeneration}
            />
          )}

          {currentStep === 'generating' && (
            <GeneratingStep
              selectedLang={selectedLang}
              onSelectLang={setSelectedLang}
              onComplete={() => setCurrentStep('reveal')}
            />
          )}

          {currentStep === 'reveal' && (
            <RevealStep
              selectedLang={selectedLang}
              onSelectLang={setSelectedLang}
              settings={settings}
              audioResult={audioResult}
              onNext={() => setCurrentStep('deepdive')}
            />
          )}

          {currentStep === 'deepdive' && (
            <DeepDiveStep
              selectedLang={selectedLang}
              onSelectLang={setSelectedLang}
              text={settings.text}
              onNext={() => setCurrentStep('share')}
            />
          )}

          {currentStep === 'share' && (
            <ShareAndResetStep
              selectedLang={selectedLang}
              onSelectLang={setSelectedLang}
              settings={settings}
              onReset={() => setCurrentStep('welcome')}
            />
          )}
        </KioskFrame>
      </main>

      {/* Bottom Footer Caption */}
      <footer className="text-center text-xs text-slate-400 max-w-xl mx-auto mt-4 px-4 select-none leading-relaxed">
        <p>
          Click a screen name above to preview each step of the visitor journey.<br />
          <strong className="text-slate-200">Voice cards</strong> and the{' '}
          <strong className="text-slate-200">emotion slider</strong> on the Voice Picker screen are clickable.
        </p>
      </footer>
    </div>
  );
}
