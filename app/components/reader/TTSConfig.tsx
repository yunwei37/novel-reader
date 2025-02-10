import React, { useEffect, useState } from 'react';
import { useTranslation } from '../../contexts/LanguageContext';

interface TTSConfigProps {
  rate: number;
  onRateChange: (rate: number) => void;
  selectedVoice: SpeechSynthesisVoice | null;
  onVoiceChange: (voice: SpeechSynthesisVoice) => void;
  voices: SpeechSynthesisVoice[];
}

const getLanguageDisplay = (langCode: string): string => {
  try {
    // First try with Intl.DisplayNames
    return new Intl.DisplayNames(['en'], { type: 'language' }).of(langCode) || langCode;
  } catch (error) {
    console.warn('Failed to get language display name:', error);
    // Fallback: return the language code itself or a mapped name
    const languageMap: Record<string, string> = {
      'en': 'English',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'it': 'Italian',
      'pt': 'Portuguese',
      'ru': 'Russian',
      'zh': 'Chinese',
      'ja': 'Japanese',
      'ko': 'Korean',
      // Add more common languages as needed
    };
    return languageMap[langCode] || langCode;
  }
};

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
      try {
        const langCode = voice.lang.split('-')[0].toLowerCase();
        const language = getLanguageDisplay(langCode);
        
        if (!voiceMap.has(language)) {
          voiceMap.set(language, []);
        }
        voiceMap.get(language)?.push(voice);
      } catch (error) {
        console.warn('Error processing voice:', voice, error);
      }
    });
    
    return new Map([...voiceMap.entries()].sort());
  }, [voices]);

  // Get current language from selected voice
  const currentLanguage = React.useMemo(() => {
    if (!selectedVoice) return '';
    try {
      const langCode = selectedVoice.lang.split('-')[0].toLowerCase();
      return getLanguageDisplay(langCode);
    } catch (error) {
      console.warn('Error getting current language:', error);
      return selectedVoice.lang || '';
    }
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

  // Add error state
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const initVoices = () => {
      try {
        const availableVoices = window.speechSynthesis.getVoices();
        if (availableVoices.length === 0) {
          // Some mobile browsers need a moment to initialize
          timeoutId = setTimeout(initVoices, 1000);
        } else {
          // Set default voice and rate
          onVoiceChange(availableVoices[0]);
          onRateChange(1.0);
          setInitError(null);
        }
      } catch (error) {
        console.error('Error initializing voices:', error);
        setInitError('Failed to initialize speech synthesis');
      }
    };

    const handleVoicesChanged = () => {
      clearTimeout(timeoutId);
      initVoices();
    };

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
      initVoices();
    } else {
      setInitError('Speech synthesis not supported in this browser');
    }

    return () => {
      clearTimeout(timeoutId);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      }
    };
  }, [onVoiceChange, onRateChange]);

  if (initError) {
    return (
      <div className="p-4 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg">
        {initError}
      </div>
    );
  }

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