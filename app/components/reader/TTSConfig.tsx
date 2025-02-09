import React, { useEffect } from 'react';
import { useTranslation } from '../../contexts/LanguageContext';

interface TTSConfigProps {
  rate: number;
  onRateChange: (rate: number) => void;
  selectedVoice: SpeechSynthesisVoice | null;
  onVoiceChange: (voice: SpeechSynthesisVoice) => void;
  voices: SpeechSynthesisVoice[];
}

export const TTSConfig: React.FC<TTSConfigProps> = ({
  rate,
  onRateChange,
  selectedVoice,
  onVoiceChange,
  voices,
}) => {
  const { t } = useTranslation();

  // Group voices by language
  const voicesByLanguage = React.useMemo(() => {
    const voiceMap = new Map<string, SpeechSynthesisVoice[]>();
    
    voices.forEach(voice => {
      const langCode = voice.lang.split('-')[0];
      const language = new Intl.DisplayNames(['en'], { type: 'language' }).of(langCode) || langCode;
      
      if (!voiceMap.has(language)) {
        voiceMap.set(language, []);
      }
      voiceMap.get(language)?.push(voice);
    });
    
    return new Map([...voiceMap.entries()].sort());
  }, [voices]);

  // Get current language from selected voice
  const currentLanguage = React.useMemo(() => {
    if (!selectedVoice) return '';
    const langCode = selectedVoice.lang.split('-')[0];
    return new Intl.DisplayNames(['en'], { type: 'language' }).of(langCode) || langCode;
  }, [selectedVoice]);

  // Handle language change
  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const language = event.target.value;
    const voicesForLanguage = voicesByLanguage.get(language) || [];
    if (voicesForLanguage.length > 0) {
      onVoiceChange(voicesForLanguage[0]);
    }
  };

  // Update handlers to persist settings
  const handleRateChange = (newRate: number) => {
    localStorage.setItem('tts-rate', newRate.toString());
    onRateChange(newRate);
  };

  const handleVoiceChange = (voice: SpeechSynthesisVoice) => {
    localStorage.setItem('tts-voice', voice.name);
    onVoiceChange(voice);
  };

  // Initialize saved settings
  useEffect(() => {
    if (voices.length > 0) {
      const savedVoiceName = localStorage.getItem('tts-voice');
      const savedRate = localStorage.getItem('tts-rate');

      if (savedVoiceName) {
        const savedVoice = voices.find(v => v.name === savedVoiceName);
        if (savedVoice) {
          onVoiceChange(savedVoice);
        }
      }
      
      if (savedRate) {
        onRateChange(parseFloat(savedRate));
      }
    }
  }, [voices, onVoiceChange, onRateChange]);

  useEffect(() => {
    const handleVoicesChanged = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length) {
        // Set default voice and rate
        onVoiceChange(voices[0]);
        onRateChange(1.0);
      }
    };

    window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
    handleVoicesChanged();

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
    };
  }, [onVoiceChange, onRateChange]);

  return (
    <div className="space-y-6">
      {/* Speed control */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('tts.speed')}
        </label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={rate}
          onChange={(e) => handleRateChange(parseFloat(e.target.value))}
          className="w-full accent-blue-500"
        />
        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {rate}x
        </div>
      </div>

      {/* Language selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('tts.language')}
        </label>
        <select
          value={currentLanguage}
          onChange={handleLanguageChange}
          className="w-full rounded-md border-gray-300 dark:border-gray-600 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                   focus:ring-blue-500 focus:border-blue-500"
        >
          {Array.from(voicesByLanguage.keys()).map(language => (
            <option key={language} value={language}>
              {language}
            </option>
          ))}
        </select>
      </div>

      {/* Voice selection */}
      {currentLanguage && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('tts.voice')}
          </label>
          <div className="space-y-2">
            {(voicesByLanguage.get(currentLanguage) || []).map((voice) => (
              <label
                key={voice.name}
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <input
                  type="radio"
                  name="voice"
                  checked={selectedVoice?.name === voice.name}
                  onChange={() => handleVoiceChange(voice)}
                  className="text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {voice.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 