'use client';

import React from 'react';
import { Commitment } from '../lib/ecoStore';
import { Leaf, Award, Lightbulb, DollarSign, Activity } from 'lucide-react';

interface InsightsAdvisorProps {
  commitments: Commitment[];
  onToggleCommitment: (id: string) => void;
}

export default function InsightsAdvisor({ commitments, onToggleCommitment }: InsightsAdvisorProps) {
  const activeCommitments = commitments.filter((c) => c.active);
  const totalCarbonSaving = activeCommitments.reduce((acc, c) => acc + c.carbonSaving, 0);
  const totalCostSaving = activeCommitments.reduce((acc, c) => acc + c.costSaving, 0);

  return (
    <div className="space-y-6">
      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-panel rounded-2xl p-5 border border-indigo-500/20 flex items-start gap-4">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-slate-400 font-mono text-[10px] uppercase tracking-wider">ANNUAL_CO2_REDUCTION_TARGET</h3>
            <div className="mt-1 flex items-baseline gap-1 font-mono">
              <span className="text-2xl font-black text-white glow-text-cyan">
                {totalCarbonSaving.toLocaleString()}
              </span>
              <span className="text-slate-500 text-xs font-bold">KG CO₂E</span>
            </div>
            <p className="text-[9px] font-mono text-slate-500 mt-1">[EQUIV_TREE_COUNT]: ~{Math.round(totalCarbonSaving / 22)} trees annually.</p>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-indigo-500/20 flex items-start gap-4">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-slate-400 font-mono text-[10px] uppercase tracking-wider">PROJECTED_ECONOMIC_SAVINGS</h3>
            <div className="mt-1 flex items-baseline gap-1 font-mono">
              <span className="text-2xl font-black text-white glow-text-indigo">
                ${totalCostSaving.toLocaleString()}
              </span>
              <span className="text-slate-500 text-xs font-bold">USD</span>
            </div>
            <p className="text-[9px] font-mono text-slate-500 mt-1">[SAVINGS_COEFFICIENT]: Domestic power & fuel reduction.</p>
          </div>
        </div>
      </div>

      {/* Guide list */}
      <div className="glass-panel rounded-3xl p-6 border border-indigo-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-4">
          <Lightbulb className="w-4 h-4 text-cyan-400" /> [ACTIONABLE_REDUCTION_SCHEMAS]
        </h2>
        <p className="text-slate-400 text-xs mb-6">Select climate reduction schemas to load them into your active environmental roadmap commitments.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {commitments.map((action) => (
            <div
              key={action.id}
              onClick={() => onToggleCommitment(action.id)}
              className={`p-4 rounded-2xl border cursor-pointer text-left transition-all ${
                action.active
                  ? 'border-cyan-500 bg-cyan-500/10 shadow-[0_0_12px_rgba(6,182,212,0.05)]'
                  : 'border-white/5 bg-slate-900/40 hover:border-white/10'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider ${
                  action.category === 'transport' ? 'bg-blue-500/10 text-blue-400' :
                  action.category === 'energy' ? 'bg-indigo-500/10 text-indigo-400' :
                  action.category === 'food' ? 'bg-cyan-500/10 text-cyan-400' :
                  'bg-purple-500/10 text-purple-400'
                }`}>
                  {action.category}
                </span>

                <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                  action.active
                    ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                    : 'border-slate-800'
                }`}>
                  {action.active && <Award className="w-3 h-3 font-bold" />}
                </div>
              </div>

              <h4 className="font-bold text-white text-xs font-mono uppercase mt-3">{action.title}</h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{action.description}</p>

              <div className="flex gap-4 mt-4 text-[9px] font-mono text-slate-500 border-t border-white/5 pt-3">
                <span className="flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" /> -{action.carbonSaving} KG/YR
                </span>
                <span className="flex items-center gap-1 font-semibold text-slate-400">
                  <DollarSign className="w-3 h-3 text-indigo-400" /> +${action.costSaving}/YR
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
