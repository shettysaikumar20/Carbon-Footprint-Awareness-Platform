'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, Sparkles } from 'lucide-react';

interface OffsetSimulatorProps {
  monthlyEmissions: number;
  onNetZeroUnlocked: () => void;
}

export default function OffsetSimulator({ monthlyEmissions, onNetZeroUnlocked }: OffsetSimulatorProps) {
  const [trees, setTrees] = useState(0);
  const [solarPanels, setSolarPanels] = useState(0);
  const [windShares, setWindShares] = useState(0);

  // Offset capacities (kg CO2e per unit per month)
  const TREE_OFFSET = 1.83; // 22kg/year
  const SOLAR_OFFSET = 50.0;
  const WIND_OFFSET = 150.0;

  const totalOffset = Math.round(
    trees * TREE_OFFSET + solarPanels * SOLAR_OFFSET + windShares * WIND_OFFSET
  );

  const remainingFootprint = Math.max(0, monthlyEmissions - totalOffset);
  const percentOffset = monthlyEmissions > 0 ? Math.min(100, Math.round((totalOffset / monthlyEmissions) * 100)) : 100;

  useEffect(() => {
    if (percentOffset >= 100 && monthlyEmissions > 0) {
      onNetZeroUnlocked();
    }
  }, [percentOffset, monthlyEmissions, onNetZeroUnlocked]);

  // Reset function
  const handleReset = () => {
    setTrees(0);
    setSolarPanels(0);
    setWindShares(0);
  };

  return (
    <div className="glass-panel rounded-3xl p-6 md:p-8 border border-indigo-500/20 relative overflow-hidden">
      {/* Background neon blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" /> [CARBON_OFFSET_SIMULATOR]
          </h2>
          <p className="text-slate-400 text-xs mt-1">Simulate quantum environmental offsets to neutralize positive emission vectors.</p>
        </div>
        <button
          onClick={handleReset}
          aria-label="Reset all offset sliders to zero"
          className="text-xs text-slate-500 hover:text-cyan-450 transition-colors uppercase font-bold tracking-wider font-mono"
        >
          [RESET_SLIDERS]
        </button>
      </div>

      {/* Stats Summary cards */}
      <div className="grid grid-cols-3 gap-3 mb-8 font-mono text-xs">
        <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-4 text-center">
          <div className="text-[9px] text-slate-500 uppercase tracking-widest">[EMISSIONS]</div>
          <div className="text-xl md:text-2xl font-black text-white mt-1">{monthlyEmissions} KG</div>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/15 rounded-2xl p-4 text-center">
          <div className="text-[9px] text-cyan-400 uppercase tracking-widest">[OFFSET]</div>
          <div className="text-xl md:text-2xl font-black text-cyan-400 mt-1 glow-text-cyan">+{totalOffset} KG</div>
        </div>
        <div className={`border rounded-2xl p-4 text-center transition-all ${
          remainingFootprint === 0
            ? 'bg-indigo-500/20 border-indigo-500/30'
            : 'bg-slate-900/60 border-white/5'
        }`}>
          <div className="text-[9px] text-slate-500 uppercase tracking-widest">[REMAINING]</div>
          <div className={`text-xl md:text-2xl font-black mt-1 ${
            remainingFootprint === 0 ? 'text-indigo-400 glow-text-indigo' : 'text-slate-300'
          }`}>
            {remainingFootprint} KG
          </div>
        </div>
      </div>

      {/* Neutralization Progress bar */}
      <div className="mb-8 space-y-2 font-mono text-xs">
        <div className="flex justify-between text-[10px] text-slate-400">
          <span>NET_ZERO_PROGRESS</span>
          <span className={percentOffset >= 100 ? 'text-cyan-400 glow-text-cyan' : 'text-indigo-400'}>
            {percentOffset}% NEUTRALIZED
          </span>
        </div>
        <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-indigo-500/20 p-0.5" aria-label={`Offset progress is ${percentOffset} percent`}>
          <div
            className={`h-full rounded-full transition-all duration-350 ${
              percentOffset >= 100
                ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.4)] animate-neon-pulse'
                : 'bg-indigo-500'
            }`}
            style={{ width: `${percentOffset}%` }}
          />
        </div>
      </div>

      {/* Simulator Sliders */}
      <div className="space-y-6">
        {/* Sliders: Tree Planting */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <label htmlFor="offset-trees-input" className="font-semibold text-slate-300 flex items-center gap-1.5 font-mono text-xs uppercase">
              🌲 Reforestation Grid
            </label>
            <span className="font-bold font-mono text-xs text-indigo-400">{trees} Trees</span>
          </div>
          <input
            id="offset-trees-input"
            type="range"
            min="0"
            max="150"
            value={trees}
            onChange={(e) => setTrees(Number(e.target.value))}
            className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="flex justify-between text-[9px] font-mono text-slate-500">
            <span>0 TREES</span>
            <span>Est. ~1.83 kg / tree monthly</span>
            <span>150 TREES</span>
          </div>
        </div>

        {/* Sliders: Solar Panels */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <label htmlFor="offset-solar-input" className="font-semibold text-slate-300 flex items-center gap-1.5 font-mono text-xs uppercase">
              ☀️ Community Solar
            </label>
            <span className="font-bold font-mono text-xs text-cyan-400">{solarPanels} Panels</span>
          </div>
          <input
            id="offset-solar-input"
            type="range"
            min="0"
            max="10"
            value={solarPanels}
            onChange={(e) => setSolarPanels(Number(e.target.value))}
            className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <div className="flex justify-between text-[9px] font-mono text-slate-500">
            <span>0 PANELS</span>
            <span>Est. ~50 kg / panel monthly</span>
            <span>10 PANELS</span>
          </div>
        </div>

        {/* Sliders: Wind energy */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <label htmlFor="offset-wind-input" className="font-semibold text-slate-300 flex items-center gap-1.5 font-mono text-xs uppercase">
              💨 Wind Turbine Project
            </label>
            <span className="font-bold font-mono text-xs text-purple-400">{windShares} Turbine Shares</span>
          </div>
          <input
            id="offset-wind-input"
            type="range"
            min="0"
            max="5"
            value={windShares}
            onChange={(e) => setWindShares(Number(e.target.value))}
            className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <div className="flex justify-between text-[9px] font-mono text-slate-500">
            <span>0 SHARES</span>
            <span>Est. ~150 kg / share monthly</span>
            <span>5 SHARES</span>
          </div>
        </div>
      </div>

      {/* Net Zero Success Alert */}
      {percentOffset >= 100 && (
        <div role="alert" className="mt-8 p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-start gap-3 text-left transition-all animate-float">
          <ShieldAlert className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div className="font-mono text-xs">
            <h4 className="font-extrabold text-cyan-400">[NET_ZERO_STABILITY_LOCKED]</h4>
            <p className="text-slate-400 text-[10px] mt-1 leading-relaxed">
              [SYSTEM_NOTIFICATION]: Your offset allocation model matches or exceeds your carbon footprint. Unlocked achievement: **Net-Zero Hero**.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
