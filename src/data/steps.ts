import { StepInfo } from '../types';

export const STEPS: StepInfo[] = [
  { id: 'idle', number: 1, label: '1. Idle / Attract', shortName: 'Idle' },
  { id: 'welcome', number: 2, label: '2. Welcome', shortName: 'Welcome' },
  { id: 'input', number: 3, label: '3. Input', shortName: 'Input' },
  { id: 'voice', number: 4, label: '4. Voice Picker', shortName: 'Voice Picker' },
  { id: 'generating', number: 5, label: '5. Generating', shortName: 'Generating' },
  { id: 'reveal', number: 6, label: '6. Reveal', shortName: 'Reveal' },
  { id: 'deepdive', number: 7, label: '7. Deep Dive', shortName: 'Deep Dive' },
  { id: 'share', number: 8, label: '8. Share & Reset', shortName: 'Share & Reset' },
];
