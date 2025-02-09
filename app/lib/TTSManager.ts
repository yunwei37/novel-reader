export interface TTSEventHandlers {
    onBoundary: (position: number) => void;
    onEnd: () => void;
    onStart: () => void;
    onError: () => void;
}

export class TTSManager {
    private utterance: SpeechSynthesisUtterance | null = null;
    private synthesis: SpeechSynthesis;
    private isInitialized: boolean = false;

    constructor() {
        // Check if speech synthesis is available
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            this.synthesis = window.speechSynthesis;
            this.isInitialized = true;
        } else {
            console.warn('Speech synthesis not supported');
            this.synthesis = {} as SpeechSynthesis;
        }
    }

    speak(
        text: string, 
        voice: SpeechSynthesisVoice, 
        rate: number,
        startOffset: number = 0,
        handlers: TTSEventHandlers
    ) {
        if (!this.isInitialized) {
            handlers.onError();
            return;
        }

        try {
            this.stop();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = voice;
            utterance.rate = rate;
            this.utterance = utterance;

            // Mobile Safari bug workaround
            if (this.synthesis.speaking) {
                this.synthesis.cancel();
            }

            utterance.onboundary = (event) => {
                if (event.charIndex !== undefined) {
                    handlers.onBoundary(startOffset + event.charIndex);
                }
            };

            utterance.onend = () => {
                this.utterance = null;
                handlers.onEnd();
            };

            utterance.onstart = () => {
                handlers.onStart();
            };

            utterance.onerror = (event) => {
                console.error('Speech synthesis error:', event);
                this.utterance = null;
                handlers.onError();
            };

            this.synthesis.speak(utterance);
        } catch (error) {
            console.error('Error in speech synthesis:', error);
            handlers.onError();
        }
    }

    stop() {
        this.synthesis.cancel();
        this.utterance = null;
    }

    isPlaying(): boolean {
        return this.synthesis.speaking;
    }
} 