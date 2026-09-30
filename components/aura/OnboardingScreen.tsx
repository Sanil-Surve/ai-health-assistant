'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  HeartPulse,
  Activity,
  Moon,
  Check,
} from 'lucide-react';
import { ThemeMode, ScreenId } from './types';

interface OnboardingScreenProps {
  theme: ThemeMode;
  onNavigate: (screen: ScreenId) => void;
}

export function OnboardingScreen({ theme, onNavigate }: OnboardingScreenProps) {
  const isDark = theme === 'dark';

  const [selectedGoals, setSelectedGoals] = useState<string[]>([
    'longevity',
    'vitals',
  ]);

  const toggleGoal = (id: string) => {
    setSelectedGoals((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const goals = [
    { id: 'longevity', label: 'Longevity & Cellular Health', icon: Sparkles },
    { id: 'vitals', label: 'Continuous Vitals & CGM', icon: Activity },
    { id: 'cardio', label: 'Cardio & Blood Pressure', icon: HeartPulse },
    { id: 'sleep', label: 'Sleep & Circadian Recovery', icon: Moon },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col justify-center min-h-[calc(100vh-80px)] px-4 sm:px-8 py-6 sm:py-10 transition-colors select-none">
      {/* Responsive Content Grid */}
      <div className="my-auto grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12 items-center">
        {/* Left Column: 3D Glowing Bio Orb Hero & Headlines */}
        <div className="md:col-span-6 flex flex-col items-center md:items-start text-center md:text-left">
          {/* Glowing Vitality Rings */}
          <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center mb-6">
            {/* Outer Ambient Glow */}
            <div
              className={`absolute inset-0 rounded-full blur-2xl animate-orb-glow transition-opacity ${
                isDark ? 'bg-teal-500/30' : 'bg-teal-400/40'
              }`}
            />

            {/* Layered concentric health rings */}
            <div
              className={`absolute inset-2 rounded-full border-2 border-dashed animate-spin transition-colors ${
                isDark ? 'border-teal-500/40' : 'border-teal-400/50'
              }`}
              style={{ animationDuration: '30s' }}
            />

            <div
              className={`absolute inset-6 rounded-full border transition-colors ${
                isDark
                  ? 'border-emerald-500/30 bg-zinc-900/60'
                  : 'border-emerald-300/60 bg-white/70'
              } backdrop-blur-md`}
            />

            {/* Central 3D Bio Orb */}
            <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-teal-700 via-teal-500 to-emerald-400 shadow-xl shadow-teal-600/35 flex items-center justify-center p-0.5">
              <div className="w-full h-full rounded-full bg-gradient-to-b from-transparent via-black/10 to-black/30 flex items-center justify-center">
                <HeartPulse className="w-10 h-10 sm:w-12 sm:h-12 text-white animate-pulse" />
              </div>
            </div>

            {/* Floating Vitals Badges */}
            <div
              className={`absolute -top-1 -right-2 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-md flex items-center gap-1 ${
                isDark
                  ? 'bg-zinc-800 text-teal-300 border border-zinc-700'
                  : 'bg-white text-teal-800 border border-teal-100'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              98% SpO₂
            </div>

            <div
              className={`absolute -bottom-1 -left-2 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-md flex items-center gap-1 ${
                isDark
                  ? 'bg-zinc-800 text-emerald-300 border border-zinc-700'
                  : 'bg-white text-emerald-800 border border-emerald-100'
              }`}
            >
              <Activity className="w-3 h-3 text-emerald-500" />
              62 bpm HRV
            </div>
          </div>

          {/* Headline & Value Proposition */}
          <h1
            className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight mb-3 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Personal Health <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-400">
              Intelligence
            </span>
          </h1>

          <p
            className={`text-sm sm:text-base font-medium max-w-md leading-relaxed ${
              isDark ? 'text-zinc-400' : 'text-slate-600'
            }`}
          >
            Clinical guidance, daily biomarker tracking, and real-time voice consultations.
          </p>
        </div>

        {/* Right Column: Goal Priorities & CTA */}
        <div className="md:col-span-6 w-full flex flex-col gap-4">
          <div
            className={`p-5 sm:p-6 rounded-3xl border shadow-sm transition-colors ${
              isDark
                ? 'bg-zinc-900/90 border-zinc-800'
                : 'bg-white border-slate-200/80 shadow-slate-200/50'
            }`}
          >
            <p
              className={`text-xs uppercase font-bold tracking-wider mb-3 ${
                isDark ? 'text-zinc-400' : 'text-slate-500'
              }`}
            >
              Select priorities
            </p>

            <div className="flex flex-col gap-2.5 mb-5">
              {goals.map((goal) => {
                const isSelected = selectedGoals.includes(goal.id);
                const Icon = goal.icon;
                return (
                  <button
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    aria-pressed={isSelected}
                    className={`w-full min-h-[46px] px-4 py-3 rounded-2xl text-left text-xs sm:text-sm font-semibold flex items-center justify-between transition-all duration-200 cursor-pointer border ${
                      isSelected
                        ? isDark
                          ? 'bg-teal-950/50 border-teal-500/60 text-teal-200 shadow-sm'
                          : 'bg-teal-50/90 border-teal-500/40 text-teal-950 shadow-sm'
                        : isDark
                        ? 'bg-zinc-900/60 border-zinc-800/80 text-zinc-300 hover:border-zinc-700'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                          isSelected
                            ? isDark
                              ? 'bg-teal-500/20 text-teal-300'
                              : 'bg-teal-500/20 text-teal-700'
                            : isDark
                            ? 'bg-zinc-800 text-zinc-400'
                            : 'bg-white text-slate-500 shadow-xs'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span>{goal.label}</span>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-teal-600 text-white'
                          : isDark
                          ? 'border border-zinc-700'
                          : 'border border-slate-300'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* CTA Button */}
            <button
              onClick={() => onNavigate('voice')}
              aria-label="Start Voice Consultation"
              className="w-full min-h-[48px] py-3.5 px-6 rounded-2xl bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-700 hover:from-teal-500 hover:to-emerald-600 text-white font-bold text-sm sm:text-base shadow-lg shadow-teal-700/25 flex items-center justify-center gap-2 group transition-all duration-200 cursor-pointer active:scale-[0.98]"
            >
              <span>Start Voice Consultation</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            {/* Privacy Guarantee Note */}
            <div className="flex items-center justify-center gap-1.5 mt-3 text-[11px] text-slate-400 dark:text-zinc-500">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />
              <span>Encrypted on-device</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
