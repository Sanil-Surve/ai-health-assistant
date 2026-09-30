'use client';

import React from 'react';
import Image from 'next/image';
import {
  HeartPulse,
  Activity,
  Pill,
  Moon,
  ArrowUpRight,
  Mic,
  AudioLines,
  Plus,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { BottomNav } from './BottomNav';
import { ThemeMode, ScreenId } from './types';

interface HomeScreenProps {
  theme: ThemeMode;
  onNavigate: (screen: ScreenId) => void;
  onOpenVoice: () => void;
}

export function HomeScreen({
  theme,
  onNavigate,
  onOpenVoice,
}: HomeScreenProps) {
  const isDark = theme === 'dark';

  return (
    <div className="flex-1 flex flex-col justify-between h-full relative">
      {/* Scrollable Main Area */}
      <div className="flex-1 overflow-y-auto px-5 pt-2 pb-24 scrollbar-none">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-4">
          <BrandLogo theme={theme} size="md" />

          {/* User Profile Avatar with Online Ring */}
          <button
            onClick={() => onNavigate('profile')}
            aria-label="View user profile"
            className="relative rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-teal-500/80 shadow-sm relative">
              <Image
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&h=160&q=80"
                alt="Nasim Rivera"
                width={36}
                height={36}
                unoptimized
                className="w-full h-full object-cover"
              />
            </div>
            {/* Active Clinical Status Indicator */}
            <span className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-zinc-950 rounded-full" />
          </button>
        </div>

        {/* Greeting Section */}
        <div className="mb-5">
          <h1
            className={`text-[28px] font-black tracking-tight leading-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Good morning, <br />
            <span className="text-teal-600 dark:text-teal-400">Nasim</span>
          </h1>
          <p
            className={`text-xs font-semibold mt-1 ${
              isDark ? 'text-zinc-400' : 'text-slate-500'
            }`}
          >
            Wednesday, July 2 · 4 health check-ins due
          </p>
        </div>

        {/* Hero Card: Today's Health Schedule & Vitals Ring (Preserving Reference Rhythm) */}
        <div className="w-full rounded-[26px] bg-gradient-to-br from-[#0f766e] via-[#0d9488] to-[#044e3d] p-5 text-white shadow-xl shadow-teal-900/20 relative overflow-hidden mb-6">
          {/* Subtle Ambient Decorative Glows */}
          <div className="absolute -top-10 -right-10 w-36 h-36 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-teal-300/10 rounded-full blur-2xl pointer-events-none" />

          {/* Card Header */}
          <div className="flex items-center justify-between mb-3.5">
            <span className="text-sm font-bold tracking-tight flex items-center gap-1.5 text-white">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              Today
            </span>
            <span className="text-[11px] font-semibold text-teal-100 bg-white/15 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
              Optimal Day
            </span>
          </div>

          <div className="flex items-center justify-between">
            {/* Timeline Schedule Items */}
            <div className="flex flex-col gap-2.5 flex-1 pr-2">
              {/* Item 1 */}
              <div className="flex items-center gap-2 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-300 shrink-0" />
                <span className="text-teal-100 font-medium text-[11px] w-8">
                  7:30
                </span>
                <span className="text-white/80 font-medium truncate">
                  Fasting Glucose
                </span>
              </div>

              {/* Item 2 */}
              <div className="flex items-center gap-2 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 shrink-0" />
                <span className="text-teal-100 font-medium text-[11px] w-8">
                  9:00
                </span>
                <span className="text-white/80 font-medium truncate">
                  Hydration & Cortisol
                </span>
              </div>

              {/* Item 3 (Current / Active with Pill badge) */}
              <div className="flex items-center gap-2 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 ring-2 ring-emerald-400/40 shrink-0" />
                <span className="text-white font-bold text-[11px] w-8">
                  1:30
                </span>
                <span className="text-white font-bold truncate">
                  Post-meal walk
                </span>
                <span className="text-[10px] font-extrabold bg-white/20 text-white px-2 py-0.5 rounded-full shrink-0">
                  in 2h
                </span>
              </div>

              {/* Item 4 */}
              <div className="flex items-center gap-2 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-300 shrink-0" />
                <span className="text-teal-100 font-medium text-[11px] w-8">
                  4:00
                </span>
                <span className="text-white/80 font-medium truncate">
                  HRV breathwork
                </span>
              </div>

              {/* Item 5 */}
              <div className="flex items-center gap-2 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-200 shrink-0" />
                <span className="text-teal-100 font-medium text-[11px] w-8">
                  8:30
                </span>
                <span className="text-white/80 font-medium truncate">
                  Magnesium & sleep prep
                </span>
              </div>
            </div>

            {/* Circular Progress Ring (Matching Reference Arc) */}
            <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="rgba(255, 255, 255, 0.15)"
                  strokeWidth="8"
                />
                {/* Progress Arc: 75% completed */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#34d399"
                  strokeWidth="8"
                  strokeDasharray="238.76"
                  strokeDashoffset="60"
                  strokeLinecap="round"
                  className="drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-base font-extrabold tracking-tight text-white leading-none">
                  75%
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-teal-100 mt-1">
                  3 OF 4
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section Heading: FOR YOU (Matching Zyniq Style) */}
        <div className="flex items-center justify-between mb-3 px-1">
          <h2
            className={`text-xs font-black uppercase tracking-wider ${
              isDark ? 'text-zinc-300' : 'text-slate-800'
            }`}
          >
            Health Protocols
          </h2>
          <span
            className={`text-[11px] font-semibold ${
              isDark ? 'text-teal-400' : 'text-teal-700'
            }`}
          >
            Live Vitals
          </span>
        </div>

        {/* 2x2 Feature Grid (Matching Reference Structure with Health Features) */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* Card 1: Symptom Checker */}
          <button
            onClick={onOpenVoice}
            aria-label="Open Symptom Checker"
            className={`p-3.5 rounded-2xl flex flex-col justify-between text-left transition-all duration-200 cursor-pointer min-h-[110px] group border shadow-sm ${
              isDark
                ? 'bg-zinc-900/80 border-zinc-800 hover:border-teal-500/50 hover:bg-zinc-900'
                : 'bg-white border-slate-200/80 hover:border-teal-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-start justify-between w-full">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <HeartPulse className="w-4 h-4" />
              </div>
              <ArrowUpRight
                className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                  isDark ? 'text-zinc-500' : 'text-slate-400'
                }`}
              />
            </div>
            <div className="mt-2">
              <h3
                className={`text-xs font-bold ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                Symptom triage
              </h3>
              <p
                className={`text-[10px] font-medium leading-tight mt-0.5 ${
                  isDark ? 'text-zinc-400' : 'text-slate-500'
                }`}
              >
                Instant voice diagnosis
              </p>
            </div>
          </button>

          {/* Card 2: Biomarkers & Labs */}
          <button
            onClick={() => onNavigate('profile')}
            aria-label="View Biomarkers & Labs"
            className={`p-3.5 rounded-2xl flex flex-col justify-between text-left transition-all duration-200 cursor-pointer min-h-[110px] group border shadow-sm ${
              isDark
                ? 'bg-zinc-900/80 border-zinc-800 hover:border-teal-500/50 hover:bg-zinc-900'
                : 'bg-white border-slate-200/80 hover:border-teal-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-start justify-between w-full">
              <div className="w-8 h-8 rounded-xl bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
              <ArrowUpRight
                className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                  isDark ? 'text-zinc-500' : 'text-slate-400'
                }`}
              />
            </div>
            <div className="mt-2">
              <h3
                className={`text-xs font-bold ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                Biomarkers & labs
              </h3>
              <p
                className={`text-[10px] font-medium leading-tight mt-0.5 ${
                  isDark ? 'text-zinc-400' : 'text-slate-500'
                }`}
              >
                Sync CGM & Apple Health
              </p>
            </div>
          </button>

          {/* Card 3: Rx & Supplements */}
          <button
            onClick={() => onNavigate('profile')}
            aria-label="View Rx and Supplements"
            className={`p-3.5 rounded-2xl flex flex-col justify-between text-left transition-all duration-200 cursor-pointer min-h-[110px] group border shadow-sm ${
              isDark
                ? 'bg-zinc-900/80 border-zinc-800 hover:border-teal-500/50 hover:bg-zinc-900'
                : 'bg-white border-slate-200/80 hover:border-teal-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-start justify-between w-full">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Pill className="w-4 h-4" />
              </div>
              <ArrowUpRight
                className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                  isDark ? 'text-zinc-500' : 'text-slate-400'
                }`}
              />
            </div>
            <div className="mt-2">
              <h3
                className={`text-xs font-bold ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                Rx & supplements
              </h3>
              <p
                className={`text-[10px] font-medium leading-tight mt-0.5 ${
                  isDark ? 'text-zinc-400' : 'text-slate-500'
                }`}
              >
                Morning taken · 2 left
              </p>
            </div>
          </button>

          {/* Card 4: Sleep & Recovery */}
          <button
            onClick={() => onNavigate('profile')}
            aria-label="View Sleep and Recovery"
            className={`p-3.5 rounded-2xl flex flex-col justify-between text-left transition-all duration-200 cursor-pointer min-h-[110px] group border shadow-sm ${
              isDark
                ? 'bg-zinc-900/80 border-zinc-800 hover:border-teal-500/50 hover:bg-zinc-900'
                : 'bg-white border-slate-200/80 hover:border-teal-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-start justify-between w-full">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Moon className="w-4 h-4" />
              </div>
              <ArrowUpRight
                className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                  isDark ? 'text-zinc-500' : 'text-slate-400'
                }`}
              />
            </div>
            <div className="mt-2">
              <h3
                className={`text-xs font-bold ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                Sleep & recovery
              </h3>
              <p
                className={`text-[10px] font-medium leading-tight mt-0.5 ${
                  isDark ? 'text-zinc-400' : 'text-slate-500'
                }`}
              >
                Score 88 · Optimal REM
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Floating Bottom Input Bar (Exactly Preserving Reference Dock Style) */}
      <div className="absolute inset-x-4 bottom-14 z-20">
        <div
          className={`w-full min-h-[48px] rounded-full px-3.5 py-1.5 flex items-center justify-between border shadow-lg backdrop-blur-xl transition-all duration-200 ${
            isDark
              ? 'bg-zinc-900/90 border-zinc-700/70 shadow-black/50 text-white'
              : 'bg-white/95 border-slate-200/80 shadow-slate-300/40 text-slate-800'
          }`}
        >
          {/* Quick Plus / Search Button */}
          <button
            onClick={onOpenVoice}
            aria-label="Add medical record or query"
            className={`w-8 h-8 rounded-full flex items-center justify-center min-h-[44px] min-w-[44px] cursor-pointer ${
              isDark
                ? 'text-zinc-400 hover:text-white'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Input Placeholder Click to Consult */}
          <button
            onClick={onOpenVoice}
            aria-label="Type or ask Aura health assistant"
            className="flex-1 text-left px-2 text-xs font-medium truncate cursor-pointer text-slate-400 dark:text-zinc-500 min-h-[44px] flex items-center"
          >
            Ask Aura about symptoms or labs...
          </button>

          {/* Right Action Cluster: Mic button + Solid Voice Orb trigger button */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Subtle Mic Button */}
            <button
              onClick={onOpenVoice}
              aria-label="Open voice recording"
              className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer min-h-[44px] min-w-[44px] transition-colors ${
                isDark
                  ? 'bg-teal-500/15 text-teal-400 hover:bg-teal-500/25'
                  : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
              }`}
            >
              <Mic className="w-4 h-4" />
            </button>

            {/* Solid Bio-Teal Voice Orb Trigger */}
            <button
              onClick={onOpenVoice}
              aria-label="Launch voice consultation"
              className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white flex items-center justify-center shadow-md shadow-teal-600/30 hover:scale-105 active:scale-95 transition-all cursor-pointer min-h-[44px] min-w-[44px]"
            >
              <AudioLines className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Persistent Bottom Navigation */}
      <BottomNav
        currentScreen="home"
        onNavigate={onNavigate}
        theme={theme}
      />
    </div>
  );
}
