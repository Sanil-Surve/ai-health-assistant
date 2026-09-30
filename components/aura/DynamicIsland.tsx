'use client';

import React from 'react';
import { Wifi } from 'lucide-react';

interface DynamicIslandProps {
  theme?: 'light' | 'dark';
  time?: string;
  isRecording?: boolean;
}

export function DynamicIsland({
  theme = 'light',
  time = '9:41',
  isRecording = false,
}: DynamicIslandProps) {
  const isDark = theme === 'dark';
  const textColor = isDark ? 'text-white' : 'text-slate-900';

  return (
    <div className="w-full pt-3 px-7 pb-2 flex items-center justify-between select-none relative z-30">
      {/* Time */}
      <span className={`text-[14px] font-semibold tracking-tight ${textColor}`}>
        {time}
      </span>

      {/* Dynamic Island Capsule */}
      <div className="absolute left-1/2 -translate-x-1/2 top-2.5 h-[28px] px-3 bg-black rounded-full flex items-center justify-between gap-2 shadow-inner border border-zinc-800/40 min-w-[110px]">
        {/* Left Sensor Eye */}
        <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
          <div className="w-1 h-1 rounded-full bg-blue-950/80" />
        </div>

        {/* Dynamic Activity Dot */}
        {isRecording ? (
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] text-emerald-400 font-medium tracking-wide">MIC</span>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 rounded-full bg-zinc-700" />
            <div className="w-1 h-1 rounded-full bg-zinc-800" />
          </div>
        )}

        {/* Right Camera Lens */}
        <div className="w-2.5 h-2.5 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center">
          <div className="w-1 h-1 rounded-full bg-indigo-950" />
        </div>
      </div>

      {/* Right Icons: Cellular, Wifi, Battery */}
      <div className={`flex items-center gap-1.5 ${textColor}`}>
        {/* Cellular Signal (4 bars) */}
        <div className="flex items-end gap-[1.5px] h-3">
          <div className="w-[3px] h-[3px] bg-current rounded-[0.5px]" />
          <div className="w-[3px] h-[5px] bg-current rounded-[0.5px]" />
          <div className="w-[3px] h-[8px] bg-current rounded-[0.5px]" />
          <div className="w-[3px] h-[11px] bg-current rounded-[0.5px]" />
        </div>

        {/* WiFi Icon */}
        <Wifi className="w-3.5 h-3.5 stroke-[2.2]" />

        {/* Battery Icon with Fill */}
        <div className="flex items-center">
          <div className="w-[20px] h-[10px] border border-current rounded-[3px] p-[1px] flex items-center">
            <div className="w-[85%] h-full bg-current rounded-[1.5px]" />
          </div>
          <div className="w-[1.5px] h-[4px] bg-current rounded-r-[1px] -ml-[0.5px]" />
        </div>
      </div>
    </div>
  );
}
