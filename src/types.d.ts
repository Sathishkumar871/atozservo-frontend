
interface SpeechRecognition extends EventTarget {
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  continuous: boolean;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface Window {
  webkitSpeechRecognition: {
    new (): SpeechRecognition;
  };
}
