'use client';

import React from 'react';
import { DynamicIsland } from './DynamicIsland';
import { ThemeMode } from './types';

interface PhoneFrameProps {
  children: React.ReactNode;
  theme?: ThemeMode;
  time?: string;
  isRecording?: boolean;
  className?: string;
}

export function PhoneFrame({
  children,
  theme = 'light',
  time = '9:41',
  isRecording = false,
  className = '',
}: PhoneFrameProps) {
  const isDark = theme === 'dark';

  return (
    <div
      className={`relative mx-auto w-full max-w-[395px] h-[835px] rounded-[52px] p-[10px] transition-all duration-300 select-none shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25),0_10px_20px_-5px_rgba(0,0,0,0.12)] border ${
        isDark
          ? 'bg-zinc-900 border-zinc-700/60 shadow-black/80'
          : 'bg-slate-200 border-slate-300 shadow-slate-400/30'
      } ${className}`}
    >
      {/* Outer Titanium Bezel Accent */}
      <div
        className={`w-full h-full rounded-[44px] overflow-hidden flex flex-col relative ${
          isDark ? 'bg-[#0b1117]' : 'bg-[#f4f7f6]'
        }`}
      >
        {/* Dynamic Island & Status Bar */}
        <DynamicIsland theme={theme} time={time} isRecording={isRecording} />

        {/* Screen Content Viewport */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col scrollbar-none">
          {children}
        </div>

        {/* iOS Home Indicator Bar */}
        <div className="w-full pb-2 pt-1 flex justify-center items-center pointer-events-none z-30">
          <div
            className={`w-32 h-[4px] rounded-full transition-colors ${
              isDark ? 'bg-zinc-600/70' : 'bg-slate-400/80'
            }`}
          />
        </div>
      </div>
    </div>
  );
}
