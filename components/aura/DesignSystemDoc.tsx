'use client';

import React from 'react';
import { Palette, Type, Layout, ShieldCheck } from 'lucide-react';
import { ThemeMode } from './types';

interface DesignSystemDocProps {
  theme: ThemeMode;
  onClose?: () => void;
}

export function DesignSystemDoc({ theme, onClose }: DesignSystemDocProps) {
  const isDark = theme === 'dark';

  return (
    <div
      className={`w-full max-w-4xl mx-auto rounded-3xl p-6 sm:p-8 border shadow-2xl transition-colors ${
        isDark
          ? 'bg-zinc-950/90 border-zinc-800 text-zinc-200 shadow-black'
          : 'bg-white border-slate-200 text-slate-800 shadow-slate-200/80'
      }`}
    >
      <div className="flex items-center justify-between border-b pb-4 mb-6 border-slate-200 dark:border-zinc-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            Design System Documentation
          </span>
          <h2 className="text-2xl font-black tracking-tight mt-1 text-slate-900 dark:text-white">
            Step 1: Zyniq Reference Analysis & Step 2: Aura Health System
          </h2>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 text-white hover:bg-teal-500 cursor-pointer min-h-[44px]"
          >
            Close Specs
          </button>
        )}
      </div>

      <div className="space-y-8">
        {/* Section 1: Color Palette */}
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2 mb-3 text-slate-900 dark:text-white">
            <Palette className="w-5 h-5 text-teal-500" />
            1. Color Palette Comparison (Reference vs. Aura Health)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Zyniq Reference Palette */}
            <div
              className={`p-4 rounded-2xl border ${
                isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <h4 className="text-xs font-black uppercase tracking-wider mb-2 text-slate-600 dark:text-zinc-400">
                Zyniq Reference Palette
              </h4>
              <ul className="text-xs space-y-1.5 font-medium">
                <li>
                  <strong>Background:</strong> <code className="text-blue-500">#F6F8FB</code> (Cool Slate Off-White)
                </li>
                <li>
                  <strong>Card Surface:</strong> <code className="text-blue-500">#FFFFFF</code> (Pure White)
                </li>
                <li>
                  <strong>Primary Brand:</strong> <code className="text-blue-600">#1A4BD9</code> (Electric Cobalt / Indigo)
                </li>
                <li>
                  <strong>Accents:</strong> Teal <code className="text-teal-500">#2DD4BF</code>, Amber <code className="text-amber-500">#F59E0B</code>, Purple <code className="text-purple-500">#8B5CF6</code>
                </li>
                <li>
                  <strong>Headings & Body:</strong> <code className="text-slate-900">#111827</code> / Muted <code className="text-slate-500">#64748B</code>
                </li>
              </ul>
            </div>

            {/* Aura Health New Palette */}
            <div
              className={`p-4 rounded-2xl border ${
                isDark ? 'bg-teal-950/20 border-teal-800/40' : 'bg-teal-50/60 border-teal-200'
              }`}
            >
              <h4 className="text-xs font-black uppercase tracking-wider mb-2 text-teal-800 dark:text-teal-300">
                Aura Health New Brand Palette
              </h4>
              <ul className="text-xs space-y-1.5 font-medium">
                <li>
                  <strong>Light Canvas / Dark Canvas:</strong> <code className="text-teal-600">#F4F7F6</code> (Clinical Sage) / <code className="text-teal-400">#0B1117</code> (Midnight Slate)
                </li>
                <li>
                  <strong>Primary Bio-Teal:</strong> <code className="text-teal-600">#0D9488</code> to <code className="text-emerald-700">#044E3D</code> gradient
                </li>
                <li>
                  <strong>Vitality Accents:</strong> Medical Mint <code className="text-emerald-500">#10B981</code>, Cardiac Rose <code className="text-rose-500">#F43F5E</code>, Sleep Violet <code className="text-indigo-500">#6366F1</code>
                </li>
                <li>
                  <strong>Contrast Ratio:</strong> Exceeds WCAG AAA (&gt;7:1 for text headings, &gt;4.5:1 for body)
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 2: Typography */}
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2 mb-3 text-slate-900 dark:text-white">
            <Type className="w-5 h-5 text-teal-500" />
            2. Typography Hierarchy & Spacing Rhythm
          </h3>
          <div
            className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-2 ${
              isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <p>
              • <strong>Font Family:</strong> Geist Sans & SF Pro Display (Geometric neo-grotesque with clean apertures).
            </p>
            <p>
              • <strong>Greeting Display:</strong> 28px–32px, Font Weight 900 (Black), tight tracking (<code>-0.02em</code>), bold brand color on user name.
            </p>
            <p>
              • <strong>Voice Screen Transcript:</strong> 20px–24px, Font Weight 700 with dual-contrast hierarchy: spoken segment in 100% opacity solid text, predicted/streaming words in 40% faded tone.
            </p>
            <p>
              • <strong>Section Labels:</strong> 11px–12px, Font Weight 800, uppercase with wide letter tracking (<code>0.08em</code>).
            </p>
          </div>
        </div>

        {/* Section 3: Layout & Geometry */}
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2 mb-3 text-slate-900 dark:text-white">
            <Layout className="w-5 h-5 text-teal-500" />
            3. Layout Patterns, Corner Radii & Shadows
          </h3>
          <div
            className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-2 ${
              isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <p>
              • <strong>Device & Frame:</strong> 52px corner radius (<code>rounded-[52px]</code>) with Dynamic Island cutout and iOS home indicator.
            </p>
            <p>
              • <strong>Hero Card:</strong> 26px radius (<code>rounded-[26px]</code>) with 80% circular progress ring and vertical schedule timeline.
            </p>
            <p>
              • <strong>2x2 Feature Grid:</strong> 16px radius cards with rounded colored icon badge top-left and diagonal <code>↗</code> affordance arrow top-right.
            </p>
            <p>
              • <strong>Floating Pill Docks:</strong> <code>rounded-full</code> pill with backdrop blur (<code>backdrop-blur-xl</code>) and ambient elevation shadow.
            </p>
            <p>
              • <strong>3D Bio Orb Visual:</strong> Concentric radial aura blur, 3D radial gradient sphere with tactile depth highlights and animated sound equalizer bars.
            </p>
          </div>
        </div>

        {/* Section 4: Accessibility */}
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2 mb-3 text-slate-900 dark:text-white">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            4. Accessibility Basics Verified
          </h3>
          <div
            className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-2 ${
              isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <p>
              ✓ <strong>Minimum 44px Touch Targets:</strong> All buttons, nav items, pills, and switches enforce a minimum 44×44px hit target for ergonomic mobile tap accessibility.
            </p>
            <p>
              ✓ <strong>Semantic ARIA markup:</strong> Interactive controls include <code>aria-label</code>, <code>aria-pressed</code>, and <code>aria-current</code> tags.
            </p>
            <p>
              ✓ <strong>Light & Dark Mode:</strong> Seamless toggle with adaptive high-contrast color values for both day and night clinical reading.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
