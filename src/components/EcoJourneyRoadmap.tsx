'use client';

import React, { useState } from 'react';
import { Check, CheckCircle2, Circle, Compass, Zap, Award, Sparkles } from 'lucide-react';

interface JourneyPhase {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  requirements: { text: string; done: boolean }[];
}

interface EcoJourneyRoadmapProps {
  logsCount: number;
  commitmentsCount: number;
  isNetZero: boolean;
  onboardingCompleted: boolean;
}

export default function EcoJourneyRoadmap({
  logsCount,
  commitmentsCount,
  isNetZero,
  onboardingCompleted,
}: EcoJourneyRoadmapProps) {
  const [selectedPhase, setSelectedPhase] = useState<number>(1);

  // Define dynamic requirements check
  const phases: JourneyPhase[] = [
    {
      id: 1,
      title: 'PHASE 01: Baseline Calibration',
      subtitle: 'Perform baseline checks and register activities',
      description: 'Calculating your initial consumption vectors establishes a starting coordinate to begin reduction path mapping.',
      icon: <Compass className="w-4 h-4" />,
      requirements: [
        { text: 'Complete carbon profile onboarding questionnaire', done: onboardingCompleted },
        { text: 'Log your first daily activity (Transport, Food, or Energy)', done: logsCount >= 1 },
      ],
    },
    {
      id: 2,
      title: 'PHASE 02: Fleet Optimization',
      subtitle: 'Commit to sustainable transportation alternatives',
      description: 'Transit emissions represent a major segment of your footprint. Shift to hybrid models or public transit.',
      icon: <Zap className="w-4 h-4" />,
      requirements: [
        { text: 'Commit to at least 2 carbon-saving actions', done: commitmentsCount >= 2 },
        { text: 'Log at least 3 total eco logs in your profile', done: logsCount >= 3 },
      ],
    },
    {
      id: 3,
      title: 'PHASE 03: Grid Diversification',
      subtitle: 'Minimize domestic energy feeds & compost waste',
      description: 'Transitioning wash temperatures and home electricity supplies is critical to reducing grid reliance.',
      icon: <Award className="w-4 h-4" />,
      requirements: [
        { text: 'Commit to at least 4 active energy/waste targets', done: commitmentsCount >= 4 },
        { text: 'Log at least 6 total eco logs in your ledger', done: logsCount >= 6 },
      ],
    },
    {
      id: 4,
      title: 'PHASE 04: Absolute Neutrality',
      subtitle: 'Balance footprint indexes to absolute zero',
      description: 'Unavoidable carbon outputs are neutralized through certified offset models (planting, solar grids, wind).',
      icon: <Sparkles className="w-4 h-4" />,
      requirements: [
        { text: 'Use the Simulator to offset 100% of your footprint', done: isNetZero },
      ],
    },
  ];

  const isPhaseUnlocked = (phaseId: number): boolean => {
    if (phaseId === 1) return onboardingCompleted;
    const prevPhase = phases.find((p) => p.id === phaseId - 1);
    if (!prevPhase) return false;
    return prevPhase.requirements.every((r) => r.done);
  };

  const currentPhaseDetails = phases.find((p) => p.id === selectedPhase) || phases[0];

  return (
    <div className="glass-panel rounded-3xl p-6 md:p-8 border border-indigo-500/20 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-2">
        <Compass className="w-4 h-4 text-cyan-400" /> [ECO_JOURNEY_ROADMAP]
      </h2>
      <p className="text-slate-400 text-xs mb-8">Follow this system progression pipeline to lock in carbon reductions.</p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Vertical Timeline */}
        <div className="lg:col-span-7 space-y-6 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
          {phases.map((phase) => {
            const unlocked = isPhaseUnlocked(phase.id);
            const active = selectedPhase === phase.id;
            const allDone = phase.requirements.every((r) => r.done);

            return (
              <div
                key={phase.id}
                onClick={() => setSelectedPhase(phase.id)}
                className={`flex items-start gap-4 cursor-pointer group relative z-10 transition-all ${
                  active ? 'scale-[1.01]' : 'opacity-60 hover:opacity-100'
                }`}
              >
                {/* Checkbox Icon */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border font-mono text-xs transition-all ${
                    allDone
                      ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                      : unlocked
                      ? 'bg-slate-900 border-indigo-500 text-cyan-400 shadow-[0_0_8px_rgba(99,102,241,0.2)]'
                      : 'bg-slate-950 border-slate-800 text-slate-650'
                  }`}
                >
                  {allDone ? <CheckCircle2 className="w-4.5 h-4.5" /> : phase.icon}
                </div>

                <div className="flex-1 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <h4
                      className={`font-bold uppercase ${
                        active ? 'text-white' : 'text-slate-300'
                      }`}
                    >
                      {phase.title}
                    </h4>
                    {allDone && (
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-bold uppercase tracking-wider">
                        [LOCKED_DONE]
                      </span>
                    )}
                    {!unlocked && (
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-500 font-bold uppercase tracking-wider">
                        [LOCKED]
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 capitalize">{phase.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Phase Details Card */}
        <div className="lg:col-span-5 bg-slate-950 border border-indigo-500/15 rounded-2xl p-5 flex flex-col justify-between font-mono text-xs">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-2 py-0.5 rounded-full">
                [SYS_PHASE_STATUS]
              </span>
              <span className="text-[10px] text-slate-500 font-bold">0{currentPhaseDetails.id} // 04</span>
            </div>

            <h3 className="font-bold uppercase text-white">{currentPhaseDetails.title}</h3>
            <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">{currentPhaseDetails.description}</p>

            <div className="mt-5 space-y-2.5">
              <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-2">[CRITERIA_CHECKLIST]:</div>
              {currentPhaseDetails.requirements.map((req, idx) => (
                <div key={idx} className="flex items-center gap-2 text-[11px]">
                  {req.done ? (
                    <Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-slate-700 flex-shrink-0" />
                  )}
                  <span className={req.done ? 'text-slate-500 line-through' : 'text-slate-400'}>
                    {req.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 border-t border-white/5 pt-4">
            {currentPhaseDetails.requirements.every((r) => r.done) ? (
              <div className="text-[10px] text-center text-cyan-400 font-bold bg-cyan-500/10 py-2 rounded-xl">
                [PHASE_COMPLETE_LOCK]
              </div>
            ) : (
              <div className="text-[10px] text-center text-slate-550 font-bold bg-slate-900 py-2 rounded-xl">
                [PENDING_REQUIREMENTS]
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
