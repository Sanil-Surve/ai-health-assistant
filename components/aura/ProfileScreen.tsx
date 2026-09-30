'use client';

import React, { useState, useEffect } from 'react';
import {
  Globe,
  Volume2,
  Check,
  User,
} from 'lucide-react';
import { ThemeMode, ScreenId } from './types';
import { SUPPORTED_LANGUAGES } from '@/app/lib/utils';

interface ProfileScreenProps {
  theme: ThemeMode;
  onToggleTheme?: () => void;
  onNavigate?: (screen: ScreenId) => void;
  language?: string;
  onSelectLanguage?: (lang: string) => void;
  speaker?: string;
  onSelectSpeaker?: (speaker: string) => void;
}

const VOICE_AVATARS = [
  { id: 'shubh', name: 'Shubh', gender: 'Male' },
  { id: 'priya', name: 'Priya', gender: 'Female' },
  { id: 'aditya', name: 'Aditya', gender: 'Male' },
  { id: 'neha', name: 'Neha', gender: 'Female' },
  { id: 'rahul', name: 'Rahul', gender: 'Male' },
  { id: 'ritu', name: 'Ritu', gender: 'Female' },
  { id: 'kabir', name: 'Kabir', gender: 'Male' },
  { id: 'kavya', name: 'Kavya', gender: 'Female' },
];

export function ProfileScreen({
  theme,
  language = 'en-IN',
  onSelectLanguage,
  speaker = 'shubh',
  onSelectSpeaker,
}: ProfileScreenProps) {
  const isDark = theme === 'dark';

  const [selectedLanguage, setSelectedLanguage] = useState<string>(language);
  const [selectedSpeaker, setSelectedSpeaker] = useState<string>(speaker);
  const [voiceFilter, setVoiceFilter] = useState<'all' | 'Male' | 'Female'>('all');

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('aura_health_lang:v1');
      if (savedLang) {
        setSelectedLanguage(savedLang);
        onSelectLanguage?.(savedLang);
      }
      const savedSpeaker = localStorage.getItem('aura_health_speaker:v1');
      if (savedSpeaker) {
        setSelectedSpeaker(savedSpeaker);
        onSelectSpeaker?.(savedSpeaker);
      }
    } catch {}
  }, [onSelectLanguage, onSelectSpeaker]);

  const handleLanguageChange = (code: string) => {
    setSelectedLanguage(code);
    onSelectLanguage?.(code);
    try {
      localStorage.setItem('aura_health_lang:v1', code);
    } catch {}
  };

  const handleSpeakerChange = (id: string) => {
    setSelectedSpeaker(id);
    onSelectSpeaker?.(id);
    try {
      localStorage.setItem('aura_health_speaker:v1', id);
    } catch {}
  };

  const filteredVoices = VOICE_AVATARS.filter((v) =>
    voiceFilter === 'all' ? true : v.gender === voiceFilter
  );

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10 transition-colors select-none">
      {/* Title */}
      <div className="mb-6 sm:mb-8">
        <h1
          className={`text-2xl sm:text-3xl font-black tracking-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          Profile Settings
        </h1>
      </div>

      <div className="flex flex-col gap-6">
        {/* Section 1: Language Selection */}
        <div
          className={`p-5 rounded-3xl border transition-colors ${
            isDark
              ? 'bg-zinc-900/90 border-zinc-800'
              : 'bg-white border-slate-200/80 shadow-xs'
          }`}
        >
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-4 h-4 text-teal-500" />
            <h2
              className={`text-sm font-bold tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Consultation Language
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = selectedLanguage === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  aria-pressed={isSelected}
                  className={`min-h-[46px] px-3.5 py-2.5 rounded-2xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                      : isDark
                      ? 'bg-zinc-800/50 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span>{lang.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Voice Avatars */}
        <div
          className={`p-5 rounded-3xl border transition-colors ${
            isDark
              ? 'bg-zinc-900/90 border-zinc-800'
              : 'bg-white border-slate-200/80 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-teal-500" />
              <h2
                className={`text-sm font-bold tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                Voice Avatar
              </h2>
            </div>

            {/* Gender Filter Pills */}
            <div
              className={`p-1 rounded-xl flex items-center border ${
                isDark
                  ? 'bg-zinc-800/80 border-zinc-700'
                  : 'bg-slate-100 border-slate-200'
              }`}
            >
              {(['all', 'Male', 'Female'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setVoiceFilter(filter)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-all cursor-pointer ${
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

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {filteredVoices.map((voice) => {
              const isSelected = selectedSpeaker === voice.id;
              return (
                <button
                  key={voice.id}
                  onClick={() => handleSpeakerChange(voice.id)}
                  aria-pressed={isSelected}
                  className={`min-h-[72px] p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                      : isDark
                      ? 'bg-zinc-800/50 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : isDark
                        ? 'bg-zinc-700 text-zinc-300'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold">{voice.name}</span>
                    {isSelected && <Check className="w-3 h-3 stroke-[2.5]" />}
                  </div>

                  <span
                    className={`text-[10px] ${
                      isSelected
                        ? 'text-teal-100'
                        : isDark
                        ? 'text-zinc-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {voice.gender}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
