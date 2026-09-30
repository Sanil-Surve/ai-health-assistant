'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Globe,
  Volume2,
  Check,
  User,
  ArrowRight,
  Mic,
  Play,
  Square,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { ThemeMode, ScreenId } from './types';

interface ProfileScreenProps {
  theme: ThemeMode;
  onToggleTheme?: () => void;
  onNavigate?: (screen: ScreenId) => void;
  language?: string;
  onSelectLanguage?: (lang: string) => void;
  speaker?: string;
  onSelectSpeaker?: (speaker: string) => void;
}

const LANGUAGE_OPTIONS = [
  { code: 'en-IN', name: 'English', native: 'Indian English' },
  { code: 'hi-IN', name: 'Hindi', native: 'हिन्दी' },
  { code: 'bn-IN', name: 'Bengali', native: 'বাংলা' },
  { code: 'ta-IN', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te-IN', name: 'Telugu', native: 'తెలుగు' },
  { code: 'mr-IN', name: 'Marathi', native: 'मराठी' },
  { code: 'gu-IN', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'kn-IN', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml-IN', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'pa-IN', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'od-IN', name: 'Odia', native: 'ଓଡ଼ିଆ' },
];

const VOICE_AVATARS = [
  { id: 'shubh', name: 'Shubh', gender: 'Male', desc: 'Calm & Professional' },
  { id: 'priya', name: 'Priya', gender: 'Female', desc: 'Warm & Empathetic' },
  { id: 'aditya', name: 'Aditya', gender: 'Male', desc: 'Energetic & Clear' },
  { id: 'neha', name: 'Neha', gender: 'Female', desc: 'Gentle & Attentive' },
  { id: 'rahul', name: 'Rahul', gender: 'Male', desc: 'Clear & Reassuring' },
  { id: 'ritu', name: 'Ritu', gender: 'Female', desc: 'Kind & Supportive' },
  { id: 'kabir', name: 'Kabir', gender: 'Male', desc: 'Deep & Thoughtful' },
  { id: 'kavya', name: 'Kavya', gender: 'Female', desc: 'Patient & Cheerful' },
  { id: 'amit', name: 'Amit', gender: 'Male', desc: 'Focused & Confident' },
  { id: 'pooja', name: 'Pooja', gender: 'Female', desc: 'Bright & Caring' },
  { id: 'rohan', name: 'Rohan', gender: 'Male', desc: 'Warm & Composed' },
  { id: 'simran', name: 'Simran', gender: 'Female', desc: 'Articulate & Friendly' },
];

const getSampleGreeting = (langCode: string, speakerName: string): string => {
  if (langCode.startsWith('hi')) return `नमस्ते, मैं ${speakerName} हूँ। आपका स्वास्थ्य कैसा है?`;
  if (langCode.startsWith('bn')) return `নমস্কার, আমি ${speakerName}। আপনার স্বাস্থ্য কেমন আছে?`;
  if (langCode.startsWith('ta')) return `வணக்கம், நான் ${speakerName}। உங்கள் உடல்நலம் எப்படி உள்ளது?`;
  if (langCode.startsWith('te')) return `నమస్కారం, నేను ${speakerName}। మీ ఆరోగ్యం ఎలా ఉంది?`;
  if (langCode.startsWith('mr')) return `नमस्कार, मी ${speakerName} आहे। आपले आरोग्य कसे आहे?`;
  if (langCode.startsWith('gu')) return `નમસ્તે, હું ${speakerName} છું। આપનું સ્વાસ્થ્ય કેવું છે?`;
  if (langCode.startsWith('kn')) return `ನಮಸ್ಕಾರ, ನಾನು ${speakerName}। ನಿಮ್ಮ ಆರೋಗ್ಯ ಹೇಗಿದೆ?`;
  if (langCode.startsWith('ml')) return `നമസ്കാരം, ഞാൻ ${speakerName} ആണ്। താങ്കളുടെ ആരോഗ്യം എങ്ങനെയുണ്ട്?`;
  if (langCode.startsWith('pa')) return `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ, ਮੈਂ ${speakerName} ਹਾਂ। ਤੁਹਾਡੀ ਸਿਹਤ ਕਿਵੇਂ ਹੈ?`;
  if (langCode.startsWith('od')) return `ନମସ୍କାର, ମୁଁ ${speakerName}। ଆପଣଙ୍କ ସ୍ୱାସ୍ଥ୍ୟ କିପରି ଅଛି?`;
  return `Hello, I'm ${speakerName}, your personal AI health assistant. How are you feeling today?`;
};

export function ProfileScreen({
  theme,
  onNavigate,
  language = 'en-IN',
  onSelectLanguage,
  speaker = 'shubh',
  onSelectSpeaker,
}: ProfileScreenProps) {
  const isDark = theme === 'dark';

  const [voiceFilter, setVoiceFilter] = useState<'all' | 'Male' | 'Female'>('all');
  const [previewingSpeaker, setPreviewingSpeaker] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState<boolean>(false);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);

  // Clean up any playing audio when component unmounts
  useEffect(() => {
    return () => {
      if (audioPreviewRef.current) {
        audioPreviewRef.current.pause();
        audioPreviewRef.current = null;
      }
    };
  }, []);

  const handleLanguageChange = (code: string) => {
    onSelectLanguage?.(code);
    // If an audio preview is playing, stop it so next preview uses new language
    if (audioPreviewRef.current) {
      audioPreviewRef.current.pause();
      audioPreviewRef.current = null;
      setPreviewingSpeaker(null);
      setIsPreviewLoading(false);
    }
  };

  const handleSpeakerChange = (id: string) => {
    onSelectSpeaker?.(id);
  };

  const handleToggleVoicePreview = async (
    targetSpeaker: string,
    e?: React.MouseEvent
  ) => {
    if (e) {
      e.stopPropagation();
    }

    // If this speaker is already playing, stop playback
    if (previewingSpeaker === targetSpeaker) {
      if (audioPreviewRef.current) {
        audioPreviewRef.current.pause();
        audioPreviewRef.current = null;
      }
      setPreviewingSpeaker(null);
      setIsPreviewLoading(false);
      return;
    }

    // If another preview is playing, stop it
    if (audioPreviewRef.current) {
      audioPreviewRef.current.pause();
      audioPreviewRef.current = null;
    }

    const speakerInfo = VOICE_AVATARS.find((v) => v.id === targetSpeaker);
    const speakerDisplayName = speakerInfo ? speakerInfo.name : targetSpeaker;
    const sampleText = getSampleGreeting(language, speakerDisplayName);

    setIsPreviewLoading(true);
    setPreviewingSpeaker(targetSpeaker);

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: sampleText,
          language,
          speaker: targetSpeaker,
        }),
      });

      if (!res.ok) {
        throw new Error('Preview TTS request failed');
      }

      const data = await res.json();
      if (!data.audio) {
        throw new Error('No audio returned');
      }

      const audio = new Audio(`data:audio/wav;base64,${data.audio}`);
      audioPreviewRef.current = audio;

      audio.onended = () => {
        setPreviewingSpeaker(null);
        setIsPreviewLoading(false);
        audioPreviewRef.current = null;
      };

      audio.onerror = () => {
        setPreviewingSpeaker(null);
        setIsPreviewLoading(false);
        audioPreviewRef.current = null;
      };

      setIsPreviewLoading(false);
      await audio.play();
    } catch (err) {
      console.warn('Voice preview error:', err);
      setPreviewingSpeaker(null);
      setIsPreviewLoading(false);
      audioPreviewRef.current = null;
    }
  };

  const filteredVoices = VOICE_AVATARS.filter((v) =>
    voiceFilter === 'all' ? true : v.gender === voiceFilter
  );

  const selectedLangObj =
    LANGUAGE_OPTIONS.find((l) => l.code === language) || LANGUAGE_OPTIONS[0];
  const selectedSpeakerObj =
    VOICE_AVATARS.find((v) => v.id === speaker) || VOICE_AVATARS[0];

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10 transition-colors select-none">
      {/* Title & Introduction Header */}
      <div className="mb-6 sm:mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-600 dark:text-teal-400 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step 1 of 2: Personalize Consultation</span>
        </div>
        <h1
          className={`text-2xl sm:text-3xl font-black tracking-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          Profile Settings
        </h1>
        <p
          className={`text-xs sm:text-sm mt-1.5 max-w-xl ${
            isDark ? 'text-zinc-400' : 'text-slate-600'
          }`}
        >
          Select your preferred consultation language and voice avatar. Once selected,
          proceed directly to start your voice health conversation.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Section 1: Language Selection */}
        <section
          aria-labelledby="language-heading"
          className={`p-5 sm:p-6 rounded-3xl border transition-colors ${
            isDark
              ? 'bg-zinc-900/90 border-zinc-800'
              : 'bg-white border-slate-200/80 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-teal-500" />
              <h2
                id="language-heading"
                className={`text-sm sm:text-base font-bold tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                1. Select Consultation Language
              </h2>
            </div>
            <span className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 px-2 py-0.5 rounded-md bg-teal-500/10">
              {selectedLangObj.name} ({selectedLangObj.native})
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {LANGUAGE_OPTIONS.map((lang) => {
              const isSelected = language === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  aria-pressed={isSelected}
                  className={`min-h-[52px] p-3 rounded-2xl text-left flex flex-col justify-between transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/20'
                      : isDark
                      ? 'bg-zinc-850/60 text-zinc-300 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-bold leading-tight">
                      {lang.name}
                    </span>
                    {isSelected ? (
                      <Check className="w-3.5 h-3.5 stroke-[2.5] text-white shrink-0" />
                    ) : null}
                  </div>
                  <span
                    className={`text-[10px] mt-1 ${
                      isSelected
                        ? 'text-teal-100 font-medium'
                        : isDark
                        ? 'text-zinc-500'
                        : 'text-slate-400'
                    }`}
                  >
                    {lang.native}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Section 2: Voice Avatars */}
        <section
          aria-labelledby="voice-heading"
          className={`p-5 sm:p-6 rounded-3xl border transition-colors ${
            isDark
              ? 'bg-zinc-900/90 border-zinc-800'
              : 'bg-white border-slate-200/80 shadow-xs'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-teal-500" />
              <h2
                id="voice-heading"
                className={`text-sm sm:text-base font-bold tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                2. Select Voice Avatar
              </h2>
            </div>

            {/* Gender Filter Pills */}
            <div
              className={`self-start sm:self-auto p-1 rounded-xl flex items-center border ${
                isDark
                  ? 'bg-zinc-800/80 border-zinc-700'
                  : 'bg-slate-100 border-slate-200'
              }`}
            >
              {(['all', 'Male', 'Female'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setVoiceFilter(filter)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold capitalize transition-all cursor-pointer ${
                    voiceFilter === filter
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredVoices.map((voice) => {
              const isSelected = speaker === voice.id;
              const isCurrentPreviewPlaying =
                previewingSpeaker === voice.id && !isPreviewLoading;
              const isCurrentPreviewLoading =
                previewingSpeaker === voice.id && isPreviewLoading;

              return (
                <div
                  key={voice.id}
                  onClick={() => handleSpeakerChange(voice.id)}
                  aria-selected={isSelected}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSpeakerChange(voice.id);
                    }
                  }}
                  className={`relative p-3.5 rounded-2xl flex flex-col items-center justify-between gap-2 transition-all cursor-pointer border select-none ${
                    isSelected
                      ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/25 ring-2 ring-teal-500/40 ring-offset-1 dark:ring-offset-zinc-900'
                      : isDark
                      ? 'bg-zinc-850/60 text-zinc-300 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100/70'
                  }`}
                >
                  {/* Top Row: User Icon & Preview Voice Audio Button */}
                  <div className="w-full flex items-center justify-between">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : isDark
                          ? 'bg-zinc-750 text-zinc-300'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      <User className="w-3.5 h-3.5" />
                    </div>

                    {/* Voice Sample Preview Button */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleVoicePreview(voice.id, e)}
                      title={
                        isCurrentPreviewPlaying
                          ? `Stop ${voice.name} voice preview`
                          : `Listen to sample of ${voice.name}'s voice`
                      }
                      aria-label={`Preview ${voice.name}'s voice`}
                      className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-white/20 hover:bg-white/30 text-white'
                          : isDark
                          ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white'
                          : 'bg-slate-200/80 hover:bg-slate-300 text-slate-700'
                      }`}
                    >
                      {isCurrentPreviewLoading ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : isCurrentPreviewPlaying ? (
                        <Square className="w-3 h-3 fill-current" />
                      ) : (
                        <Play className="w-3 h-3 fill-current" />
                      )}
                    </button>
                  </div>

                  {/* Avatar Name & Selection Checkmark */}
                  <div className="flex items-center gap-1.5 mt-1 text-center">
                    <span className="text-xs font-bold">{voice.name}</span>
                    {isSelected ? (
                      <Check className="w-3 h-3 stroke-[2.5] text-white" />
                    ) : null}
                  </div>

                  {/* Gender and Tone Tag */}
                  <div className="flex items-center gap-1">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${
                        isSelected
                          ? 'bg-teal-700/60 text-teal-100'
                          : isDark
                          ? 'bg-zinc-800 text-zinc-400'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {voice.gender}
                    </span>
                    <span
                      className={`text-[10px] hidden sm:inline ${
                        isSelected
                          ? 'text-teal-100'
                          : isDark
                          ? 'text-zinc-500'
                          : 'text-slate-400'
                      }`}
                    >
                      · {voice.desc.split(' ')[0]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 3: Summary & Proceed Card with Navigation CTA */}
        <div
          className={`p-5 sm:p-6 rounded-3xl border transition-colors ${
            isDark
              ? 'bg-gradient-to-br from-zinc-900 via-zinc-900 to-teal-950/20 border-teal-900/40 shadow-lg shadow-black/40'
              : 'bg-gradient-to-br from-white via-white to-teal-50/50 border-teal-100 shadow-md shadow-slate-200/50'
          }`}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-5">
            {/* Active Configuration Summary */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3.5">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                  isDark
                    ? 'bg-teal-950/60 border-teal-800/80 text-teal-400'
                    : 'bg-teal-50 border-teal-200 text-teal-600'
                }`}
              >
                <Mic className="w-6 h-6 stroke-[2]" />
              </div>

              <div>
                <p
                  className={`text-xs font-semibold ${
                    isDark ? 'text-zinc-400' : 'text-slate-500'
                  }`}
                >
                  Selected Setup
                </p>
                <h3
                  className={`text-sm sm:text-base font-bold ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {selectedSpeakerObj.name} ({selectedSpeakerObj.gender}) ·{' '}
                  {selectedLangObj.name}
                </h3>
                <p
                  className={`text-[11px] mt-0.5 ${
                    isDark ? 'text-zinc-500' : 'text-slate-400'
                  }`}
                >
                  Ready to assist with symptoms, vitals, and wellness advice.
                </p>
              </div>
            </div>

            {/* Action Buttons: Preview Sample & Continue to Voice Chat */}
            <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-2.5">
              <button
                type="button"
                onClick={() => handleToggleVoicePreview(speaker)}
                className={`w-full sm:w-auto px-4 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer border ${
                  previewingSpeaker === speaker
                    ? 'bg-teal-600 text-white border-teal-600'
                    : isDark
                    ? 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-750'
                    : 'bg-white border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-slate-50 shadow-xs'
                }`}
              >
                {previewingSpeaker === speaker && isPreviewLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : previewingSpeaker === speaker ? (
                  <Square className="w-3.5 h-3.5 fill-current" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5" />
                )}
                <span>
                  {previewingSpeaker === speaker
                    ? 'Stop Sample'
                    : `Listen to ${selectedSpeakerObj.name}`}
                </span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate?.('voice')}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-teal-600/30 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Continue to Voice Chat</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
