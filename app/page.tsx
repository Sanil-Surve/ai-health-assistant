'use client';

import React, { useState, useEffect } from 'react';
import {
  Sun,
  Moon,
  Mic,
  User,
} from 'lucide-react';
import { ThemeMode, ScreenId } from '@/components/aura/types';
import { VoiceChatScreen } from '@/components/aura/VoiceChatScreen';
import { ProfileScreen } from '@/components/aura/ProfileScreen';
import { BrandLogo } from '@/components/aura/BrandLogo';

const THEME_STORAGE_KEY = 'aura_health_theme:v1';

export default function AuraHealthApp() {
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('voice');
  const [language, setLanguage] = useState<string>('en-IN');
  const [speaker, setSpeaker] = useState<string>('shubh');

  // Restore persisted theme, language, and speaker on client mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme);
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme: ThemeMode = prefersDark ? 'dark' : 'light';
        setTheme(initialTheme);
        document.documentElement.classList.toggle('dark', initialTheme === 'dark');
      }

      const savedLang = localStorage.getItem('aura_health_lang:v1');
      if (savedLang) setLanguage(savedLang);

      const savedSpeaker = localStorage.getItem('aura_health_speaker:v1');
      if (savedSpeaker) setSpeaker(savedSpeaker);
    } catch {
      // localStorage may fail in restricted/private browsing modes
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const nextTheme: ThemeMode = prev === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      } catch {
        // Fallback gracefully
      }
      document.documentElement.classList.toggle('dark', nextTheme === 'dark');
      return nextTheme;
    });
  };

  const screens: { id: ScreenId; label: string; fullLabel: string; icon: React.ElementType }[] = [
    { id: 'voice', label: 'Voice Health', fullLabel: 'Voice Health', icon: Mic },
    { id: 'profile', label: 'Profile', fullLabel: 'Profile', icon: User },
  ];

  return (
    <main
      className={`min-h-screen transition-colors duration-300 font-sans selection:bg-teal-500/30 ${
        theme === 'dark'
          ? 'bg-[#060a0e] text-zinc-100'
          : 'bg-[#eef2f5] text-slate-800'
      }`}
    >
      {/* Responsive Navbar */}
      <header
        className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors ${
          theme === 'dark'
            ? 'bg-zinc-950/85 border-zinc-800/80 shadow-md shadow-black/40'
            : 'bg-white/85 border-slate-200/80 shadow-xs'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          {/* Top Row: Brand & Theme Toggle on mobile; Brand, Nav, and Theme on desktop */}
          <div className="flex items-center justify-between py-2.5 sm:py-3 gap-3">
            {/* Brand Logo */}
            <div className="flex items-center gap-3">
              <BrandLogo theme={theme} size="md" />
            </div>

            {/* Desktop Navigation Tabs (Visible on sm: and up) */}
            <nav
              aria-label="Desktop Screen Navigation"
              className={`hidden sm:flex p-1 rounded-2xl items-center border transition-colors ${
                theme === 'dark'
                  ? 'bg-zinc-900/90 border-zinc-800'
                  : 'bg-slate-100 border-slate-200'
              }`}
            >
              {screens.map((s) => {
                const Icon = s.icon;
                const isActive = currentScreen === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setCurrentScreen(s.id)}
                    aria-label={s.fullLabel}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center gap-1.5 px-3.5 sm:px-5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[38px] ${
                      isActive
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-950 dark:text-zinc-400 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{s.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right: Persistent Light / Dark Mode Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
                title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
                className={`p-2 rounded-xl flex items-center justify-center cursor-pointer min-h-[38px] min-w-[38px] transition-colors border ${
                  theme === 'dark'
                    ? 'bg-zinc-900 border-zinc-800 text-amber-400 hover:bg-zinc-850'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs'
                }`}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Segmented Nav Bar (Visible only on mobile < sm) */}
          <div className="sm:hidden pb-2.5 pt-0.5">
            <nav
              aria-label="Mobile Screen Navigation"
              className={`p-1 rounded-2xl grid grid-cols-2 gap-1 border transition-colors ${
                theme === 'dark'
                  ? 'bg-zinc-900/90 border-zinc-800'
                  : 'bg-slate-100 border-slate-200'
              }`}
            >
              {screens.map((s) => {
                const Icon = s.icon;
                const isActive = currentScreen === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setCurrentScreen(s.id)}
                    aria-label={s.fullLabel}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[38px] ${
                      isActive
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-950 dark:text-zinc-400 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{s.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="w-full">
        {currentScreen === 'voice' && (
          <VoiceChatScreen
            theme={theme}
            onNavigate={(screen) => setCurrentScreen(screen)}
            onClose={() => setCurrentScreen('profile')}
            language={language}
            speaker={speaker}
          />
        )}

        {currentScreen === 'profile' && (
          <ProfileScreen
            theme={theme}
            onToggleTheme={toggleTheme}
            onNavigate={(screen) => setCurrentScreen(screen)}
            language={language}
            onSelectLanguage={(lang) => setLanguage(lang)}
            speaker={speaker}
            onSelectSpeaker={(spk) => setSpeaker(spk)}
          />
        )}
      </div>
    </main>
  );
}