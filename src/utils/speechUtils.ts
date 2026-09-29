// Speech synthesis and recognition utilities for AI Interview Simulator

export interface SpeechSettings {
  pitch: number;
  rate: number;
  volume: number;
  voiceGender?: 'female' | 'male';
}

const COMMON_FILLER_WORDS = [
  'um', 'uh', 'er', 'ah', 'like', 'literally', 'basically', 'actually', 'you know', 'kind of', 'sort of', 'honestly'
];

export function countFillerWords(text: string): { total: number; breakdown: Record<string, number> } {
  if (!text) return { total: 0, breakdown: {} };

  const lower = text.toLowerCase();
  const breakdown: Record<string, number> = {};
  let total = 0;

  for (const filler of COMMON_FILLER_WORDS) {
    // Regex for whole phrase or word
    const regex = new RegExp(`\\b${filler}\\b`, 'gi');
    const matches = lower.match(regex);
    if (matches && matches.length > 0) {
      breakdown[filler] = matches.length;
      total += matches.length;
    }
  }

  return { total, breakdown };
}

export function calculateWPM(text: string, durationSeconds: number): number {
  if (!text || durationSeconds <= 2) return 0;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = durationSeconds / 60;
  return Math.round(words / minutes);
}

// Web Speech Synthesis
export function speakText(
  text: string,
  settings: SpeechSettings = { pitch: 1.0, rate: 0.95, volume: 1.0, voiceGender: 'female' },
  onEnd?: () => void,
  onError?: (err: any) => void
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  try {
    window.speechSynthesis.cancel(); // Stop any pending utterance

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = settings.pitch;
    utterance.rate = settings.rate;
    utterance.volume = settings.volume;

    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      // Pick voice matching gender preference if possible
      let matchedVoice = voices.find(v => {
        const name = v.name.toLowerCase();
        if (settings.voiceGender === 'female') {
          return name.includes('female') || name.includes('samantha') || name.includes('zira') || name.includes('karen') || name.includes('victoria') || name.includes('moira');
        } else {
          return name.includes('male') || name.includes('david') || name.includes('george') || name.includes('daniel') || name.includes('alex');
        }
      });

      if (!matchedVoice) {
        matchedVoice = voices.find(v => v.lang.startsWith('en')) || voices[0];
      }

      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }
    }

    utterance.onend = () => {
      onEnd?.();
    };

    utterance.onerror = (e) => {
      onError?.(e);
    };

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.warn('SpeechSynthesis error:', err);
    return false;
  }
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// Browser SpeechRecognition interface
export interface SpeechRecognitionResultObject {
  transcript: string;
  isFinal: boolean;
}

export class SpeechRecognitionService {
  private recognition: any = null;
  private isListening = false;
  public onTranscriptChange?: (text: string, isFinal: boolean) => void;
  public onError?: (error: string) => void;
  public onStateChange?: (listening: boolean) => void;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        this.recognition.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }

          const combined = finalTranscript || interimTranscript;
          if (this.onTranscriptChange && combined) {
            this.onTranscriptChange(combined, !!finalTranscript);
          }
        };

        this.recognition.onerror = (event: any) => {
          console.warn('SpeechRecognition error:', event.error);
          this.onError?.(event.error);
          if (event.error === 'not-allowed') {
            this.isListening = false;
            this.onStateChange?.(false);
          }
        };

        this.recognition.onend = () => {
          if (this.isListening) {
            // Auto restart if still marked as listening
            try {
              this.recognition.start();
            } catch (e) {
              this.isListening = false;
              this.onStateChange?.(false);
            }
          } else {
            this.onStateChange?.(false);
          }
        };
      }
    }
  }

  public isSupported(): boolean {
    return !!this.recognition;
  }

  public start(): boolean {
    if (!this.recognition) return false;
    try {
      this.isListening = true;
      this.recognition.start();
      this.onStateChange?.(true);
      return true;
    } catch (e) {
      console.warn('Recognition start exception:', e);
      return false;
    }
  }

  public stop(): void {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
      this.onStateChange?.(false);
    }
  }

  public getIsListening(): boolean {
    return this.isListening;
  }
}
