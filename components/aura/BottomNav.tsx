'use client';

import React from 'react';
import { Sparkles, Mic, User } from 'lucide-react';
import { ScreenId } from './types';

interface BottomNavProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  theme?: 'light' | 'dark';
}

export function BottomNav({
  currentScreen,
  onNavigate,
  theme = 'light',
}: BottomNavProps) {
  const isDark = theme === 'dark';

  const navItems: { id: ScreenId; label: string; icon: React.ElementType }[] = [
    { id: 'onboarding', label: 'Onboarding', icon: Sparkles },
    { id: 'voice', label: 'Voice Health', icon: Mic },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav
      aria-label="App Navigation"
      className={`w-full py-2 px-5 border-t backdrop-blur-xl transition-colors duration-200 select-none ${
        isDark
          ? 'bg-zinc-950/85 border-zinc-800/60 text-zinc-400'
          : 'bg-white/90 border-slate-200/70 text-slate-500'
      }`}
    >
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center min-w-[52px] min-h-[44px] py-1 px-2 rounded-xl transition-all duration-200 relative group cursor-pointer ${
                isActive
                  ? isDark
                    ? 'text-teal-400 font-semibold'
                    : 'text-teal-700 font-semibold'
                  : isDark
                  ? 'hover:text-zinc-200'
                  : 'hover:text-slate-900'
              }`}
            >
              {/* Highlight pill for active item */}
              {isActive && (
                <span
                  className={`absolute inset-x-2 -top-1 h-0.5 rounded-full ${
                    isDark ? 'bg-teal-400' : 'bg-teal-600'
                  }`}
                />
              )}

              <div
                className={`p-1 rounded-xl transition-transform group-hover:scale-105 ${
                  isActive
                    ? isDark
                      ? 'bg-teal-500/15'
                      : 'bg-teal-50'
                    : ''
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'
                  }`}
                />
              </div>

              <span className="text-[11px] mt-0.5 tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
