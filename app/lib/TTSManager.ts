export interface TTSEventHandlers {
    onBoundary: (position: number) => void;
    onEnd: () => void;
    onStart: () => void;
    onError: () => void;
}

export class TTSManager {
    private utterance: SpeechSynthesisUtterance | null = null;
    private synthesis: SpeechSynthesis;

    constructor() {
        this.synthesis = window.speechSynthesis;
    }

    speak(
        text: string, 
        voice: SpeechSynthesisVoice, 
        rate: number,
        startOffset: number = 0,
        handlers: TTSEventHandlers
    ) {
        this.stop();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = voice;
        utterance.rate = rate;
        this.utterance = utterance;

        utterance.onboundary = (event) => {
            handlers.onBoundary(startOffset + event.charIndex);
        };

        utterance.onend = () => {
            this.utterance = null;
            handlers.onEnd();
        };

        utterance.onstart = () => {
            handlers.onStart();
        };

        utterance.onerror = () => {
            handlers.onError();
        };

        this.synthesis.speak(utterance);
    }

    stop() {
        this.synthesis.cancel();
        this.utterance = null;
    }

    isPlaying(): boolean {
        return this.synthesis.speaking;
    }
} 