'use client';

import React, { useState, useEffect } from 'react';
import { OnboardingData, LogEntry, Commitment, Badge, SavedRoute, INITIAL_COMMITMENTS, INITIAL_BADGES, exportToCSV } from '../lib/ecoStore';
import LogEmissionModal from './LogEmissionModal';
import OffsetSimulator from './OffsetSimulator';
import EcoJourneyRoadmap from './EcoJourneyRoadmap';
import InsightsAdvisor from './InsightsAdvisor';
import AIChatConsole from './AIChatConsole';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, AreaChart, Area, Legend } from 'recharts';
import {
  Compass,
  Zap,
  Award,
  Sparkles,
  Plus,
  Trash2,
  Calendar,
  Layers,
  ChevronRight,
  TrendingDown,
  Info,
  LogOut,
  Map,
  Lightbulb,
  Download,
  Flame,
  CheckCircle,
  HelpCircle,
  Car,
  Cpu,
  BrainCircuit
} from 'lucide-react';

interface DashboardProps {
  initialBaseline: number;
  initialOnboardingData: OnboardingData;
  onResetOnboarding: () => void;
}

export default function Dashboard({ initialBaseline, initialOnboardingData, onResetOnboarding }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'simulator' | 'roadmap' | 'insights' | 'aichat'>('dashboard');
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // States
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [isNetZero, setIsNetZero] = useState(false);

  // Advanced features state
  const [carbonTarget, setCarbonTarget] = useState<number>(300); // Default 300 kg CO2e / month
  const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>([]);
  
  // Saved route form
  const [newRouteName, setNewRouteName] = useState('');
  const [newRouteDistance, setNewRouteDistance] = useState(15);
  const [newRouteMode, setNewRouteMode] = useState<keyof typeof import('../lib/ecoStore').EMISSION_FACTORS.transport>('public');

  // Load state on mount
  useEffect(() => {
    setMounted(true);

    const savedLogs = localStorage.getItem('ecosphere_logs');
    if (savedLogs) setLogs(JSON.parse(savedLogs));

    const savedCommitments = localStorage.getItem('ecosphere_commitments');
    if (savedCommitments) {
      setCommitments(JSON.parse(savedCommitments));
    } else {
      setCommitments(INITIAL_COMMITMENTS);
    }

    const savedBadges = localStorage.getItem('ecosphere_badges');
    if (savedBadges) {
      setBadges(JSON.parse(savedBadges));
    } else {
      const initial = [...INITIAL_BADGES];
      initial[0].unlocked = true;
      setBadges(initial);
      localStorage.setItem('ecosphere_badges', JSON.stringify(initial));
    }

    const savedTarget = localStorage.getItem('ecosphere_carbon_target');
    if (savedTarget) setCarbonTarget(Number(savedTarget));

    const savedRoutesData = localStorage.getItem('ecosphere_saved_routes');
    if (savedRoutesData) {
      setSavedRoutes(JSON.parse(savedRoutesData));
    } else {
      const defaultRoutes: SavedRoute[] = [
        { id: 'r1', label: 'Office Commute', distance: 12, mode: 'public' },
        { id: 'r2', label: 'Grocery Run', distance: 4, mode: 'electric' },
      ];
      setSavedRoutes(defaultRoutes);
      localStorage.setItem('ecosphere_saved_routes', JSON.stringify(defaultRoutes));
    }
  }, []);

  // Save helpers
  const saveLogs = (newLogs: LogEntry[]) => {
    setLogs(newLogs);
    localStorage.setItem('ecosphere_logs', JSON.stringify(newLogs));
    checkAndUnlockBadges(newLogs, commitments, isNetZero);
  };

  const handleToggleCommitment = (id: string) => {
    const updated = commitments.map((c) => (c.id === id ? { ...c, active: !c.active } : c));
    setCommitments(updated);
    localStorage.setItem('ecosphere_commitments', JSON.stringify(updated));
    checkAndUnlockBadges(logs, updated, isNetZero);
  };

  // Add Log Entry
  const handleAddLog = (newEntry: Omit<LogEntry, 'id' | 'date'>) => {
    const entry: LogEntry = {
      ...newEntry,
      id: `l-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
    const updated = [entry, ...logs];
    saveLogs(updated);
    setIsLogOpen(false);
  };

  // Saved commute trigger log
  const handleQuickLogCommute = (route: SavedRoute) => {
    const factor = route.mode === 'public' ? 0.04 : route.mode === 'electric' ? 0.05 : route.mode === 'hybrid' ? 0.10 : 0.18;
    const emission = Math.round(route.distance * factor);
    
    handleAddLog({
      category: 'transport',
      details: `${route.distance} km commute via ${route.label} (${route.mode})`,
      emission,
    });
  };

  // Save a new custom route
  const handleCreateRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRouteName.trim()) return;

    const route: SavedRoute = {
      id: `r-${Date.now()}`,
      label: newRouteName,
      distance: newRouteDistance,
      mode: newRouteMode,
    };
    const updated = [...savedRoutes, route];
    setSavedRoutes(updated);
    localStorage.setItem('ecosphere_saved_routes', JSON.stringify(updated));
    setNewRouteName('');
  };

  // Delete saved route
  const handleDeleteRoute = (id: string) => {
    const updated = savedRoutes.filter((r) => r.id !== id);
    setSavedRoutes(updated);
    localStorage.setItem('ecosphere_saved_routes', JSON.stringify(updated));
  };

  // Change carbon budget target
  const handleTargetChange = (val: number) => {
    setCarbonTarget(val);
    localStorage.setItem('ecosphere_carbon_target', val.toString());
  };

  // Export Ledger to CSV
  const handleExportCSV = () => {
    const csvContent = exportToCSV(logs);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ecosphere_ledger_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Delete Log Entry
  const handleDeleteLog = (id: string) => {
    const updated = logs.filter((log) => log.id !== id);
    saveLogs(updated);
  };

  // Trigger Demo tour to populate mock logs immediately
  const handleTriggerDemoTour = () => {
    const mockEntries: LogEntry[] = [
      { id: 'm1', date: 'Jun 10, 2026', category: 'transport', details: '150 km roadtrip via petrol vehicle', emission: 27 },
      { id: 'm2', date: 'Jun 11, 2026', category: 'energy', details: '80 kWh consumed from solar power', emission: 4 },
      { id: 'm3', date: 'Jun 12, 2026', category: 'food', details: '3x meat-heavy dinners with friends', emission: 13.5 },
      { id: 'm4', date: 'Jun 12, 2026', category: 'waste', details: '3 bags of standard landfill garbage', emission: 7.5 }
    ];
    // Commit 3 active reductions
    const mockCommitments = commitments.map((c, i) => i < 3 ? { ...c, active: true } : c);
    setCommitments(mockCommitments);
    localStorage.setItem('ecosphere_commitments', JSON.stringify(mockCommitments));

    saveLogs([...mockEntries, ...logs]);
  };

  // Unlock badges checking function
  const checkAndUnlockBadges = (currentLogs: LogEntry[], currentCommits: Commitment[], netZeroActive: boolean) => {
    let changed = false;
    const updatedBadges = badges.map((badge) => {
      let shouldUnlock = badge.unlocked;

      if (badge.id === 'b1') {
        shouldUnlock = true;
      } else if (badge.id === 'b2') {
        const lowCommutes = currentLogs.filter(
          (log) => log.category === 'transport' && log.emission <= 40
        ).length;
        if (lowCommutes >= 3) shouldUnlock = true;
      } else if (badge.id === 'b3') {
        const activeCount = currentCommits.filter((c) => c.active).length;
        if (activeCount >= 3) shouldUnlock = true;
      } else if (badge.id === 'b4') {
        if (netZeroActive) shouldUnlock = true;
      } else if (badge.id === 'b5') {
        const wasteLogs = currentLogs.filter((log) => log.category === 'waste').length;
        if (wasteLogs >= 1) shouldUnlock = true;
      }

      if (shouldUnlock !== badge.unlocked) {
        badge.unlocked = true;
        changed = true;
      }
      return badge;
    });

    if (changed) {
      setBadges(updatedBadges);
      localStorage.setItem('ecosphere_badges', JSON.stringify(updatedBadges));
    }
  };

  const handleNetZeroUnlocked = () => {
    if (!isNetZero) {
      setIsNetZero(true);
      checkAndUnlockBadges(logs, commitments, true);
    }
  };

  // Calculations
  const activeReductionAnnual = commitments
    .filter((c) => c.active)
    .reduce((acc, c) => acc + c.carbonSaving, 0);

  const monthlyLogEmissions = logs.reduce((acc, l) => acc + l.emission, 0);

  // Baseline Monthly Footprint minus active commitments scaled to month
  const estimatedCurrentEmissions = Math.max(
    0,
    Math.round(initialBaseline - activeReductionAnnual / 12) + monthlyLogEmissions
  );

  // Consecutive Streak Count (Rough calculation based on unique days logged)
  const calculateStreak = (): number => {
    if (logs.length === 0) return 0;
    const dates = logs.map(l => l.date).filter((value, index, self) => self.indexOf(value) === index);
    return dates.length;
  };

  // Letter Grade Calculation based on Custom Target
  const calculateGrade = () => {
    if (estimatedCurrentEmissions === 0) return { letter: 'A+', color: 'text-cyan-400', desc: 'Absolute Zero Neutrality' };
    const ratio = estimatedCurrentEmissions / carbonTarget;
    if (ratio <= 0.6) return { letter: 'A', color: 'text-cyan-400 glow-text-cyan', desc: 'Outstanding reduction metrics' };
    if (ratio <= 0.85) return { letter: 'B', color: 'text-indigo-400', desc: 'Solid environmental compliance' };
    if (ratio <= 1.0) return { letter: 'C', color: 'text-yellow-400', desc: 'Within target parameter boundaries' };
    if (ratio <= 1.25) return { letter: 'D', color: 'text-orange-400', desc: 'Target threshold breached' };
    return { letter: 'F', color: 'text-red-500', desc: 'Critical carbon load excess' };
  };

  const ecoGrade = calculateGrade();

  // Chart data formatting
  const categoriesMap = { transport: 0, energy: 0, food: 0, waste: 0 };
  logs.forEach((log) => {
    if (log.category in categoriesMap) {
      categoriesMap[log.category as keyof typeof categoriesMap] += log.emission;
    }
  });

  const categoriesData = [
    { name: 'Transport', emission: categoriesMap.transport, color: '#6366f1' },
    { name: 'Energy', emission: categoriesMap.energy, color: '#06b6d4' },
    { name: 'Food', emission: categoriesMap.food, color: '#a855f7' },
    { name: 'Waste', emission: categoriesMap.waste, color: '#f43f5e' },
  ];

  // AI 5-Year Projections data model
  const projectionData = [
    { year: 'Year 0', currentPath: Math.round(initialBaseline * 12), targetPath: Math.round(initialBaseline * 12) },
    { year: 'Year 1', currentPath: Math.round(initialBaseline * 12 * 2), targetPath: Math.round(estimatedCurrentEmissions * 12 * 2) },
    { year: 'Year 2', currentPath: Math.round(initialBaseline * 12 * 3), targetPath: Math.round(estimatedCurrentEmissions * 12 * 3) },
    { year: 'Year 3', currentPath: Math.round(initialBaseline * 12 * 4), targetPath: Math.round(estimatedCurrentEmissions * 12 * 4) },
    { year: 'Year 4', currentPath: Math.round(initialBaseline * 12 * 5), targetPath: Math.round(estimatedCurrentEmissions * 12 * 5) },
    { year: 'Year 5', currentPath: Math.round(initialBaseline * 12 * 6), targetPath: Math.round(estimatedCurrentEmissions * 12 * 6) },
  ];

  const countryLabel = initialOnboardingData.country === 'in' ? 'India' :
                       initialOnboardingData.country === 'us' ? 'USA' :
                       initialOnboardingData.country === 'de' ? 'Germany' :
                       initialOnboardingData.country === 'fr' ? 'France' : 'Norway';

  if (!mounted) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 font-mono">LOADING_ECOSPHERE_CONSOLE...</div>;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen text-slate-350">
      {/* Sidebar navigation */}
      <aside className="w-full lg:w-64 glass-panel border-r border-indigo-500/20 flex flex-col justify-between p-6">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-cyan-500 text-slate-950 font-black rounded-lg shadow-[0_0_15px_rgba(99,102,241,0.4)] font-mono">
              AG
            </div>
            <div>
              <span className="font-extrabold text-white text-base tracking-wider uppercase block leading-none font-mono">EcoSphere</span>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1.5 block font-mono">Sys_Core_V2</span>
            </div>
          </div>

          {/* User Status Card */}
          <div className="bg-slate-950 border border-indigo-500/20 rounded-2xl p-4 mb-6 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/5 rounded-full blur-xl pointer-events-none" />
            <div className="text-[9px] text-slate-500 font-mono uppercase tracking-widest">[SYSTEM_OPERATOR]</div>
            <div className="text-white font-bold font-mono text-xs mt-1.5 uppercase tracking-wide">
              {initialOnboardingData.username}
            </div>
            <div className="text-[9px] text-slate-500 font-mono mt-0.5 font-semibold">GRID_LOC: {countryLabel.toUpperCase()}</div>
            {calculateStreak() > 0 && (
              <div className="flex items-center gap-1 mt-2 text-[10px] text-indigo-400 font-mono">
                <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse" /> STREAK: {calculateStreak()} DAYS
              </div>
            )}
          </div>

          {/* Menu Items */}
          <nav className="space-y-1.5 font-mono text-xs">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full py-3 px-4 rounded-xl text-left font-bold flex items-center gap-3 transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-cyan-500/10 border border-cyan-500/20 text-white'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4 text-cyan-400" /> [DASHBOARD]
            </button>

            <button
              onClick={() => setActiveTab('aichat')}
              className={`w-full py-3 px-4 rounded-xl text-left font-bold flex items-center gap-3 transition-all ${
                activeTab === 'aichat'
                  ? 'bg-cyan-500/10 border border-cyan-500/20 text-white font-bold'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <BrainCircuit className="w-4 h-4 text-cyan-400 animate-pulse" /> [ECO_AI_CONSULT]
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className={`w-full py-3 px-4 rounded-xl text-left font-bold flex items-center gap-3 transition-all ${
                activeTab === 'simulator'
                  ? 'bg-cyan-500/10 border border-cyan-500/20 text-white'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-cyan-400" /> [OFFSET_LAB]
            </button>

            <button
              onClick={() => setActiveTab('roadmap')}
              className={`w-full py-3 px-4 rounded-xl text-left font-bold flex items-center gap-3 transition-all ${
                activeTab === 'roadmap'
                  ? 'bg-cyan-500/10 border border-cyan-500/20 text-white'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Map className="w-4 h-4 text-indigo-400" /> [ROADMAP_GRID]
            </button>

            <button
              onClick={() => setActiveTab('insights')}
              className={`w-full py-3 px-4 rounded-xl text-left font-bold flex items-center gap-3 transition-all ${
                activeTab === 'insights'
                  ? 'bg-cyan-500/10 border border-cyan-500/20 text-white'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Lightbulb className="w-4 h-4 text-yellow-400" /> [ACTION_SCHEMAS]
            </button>
          </nav>
        </div>

        {/* Footer actions */}
        <div className="font-mono text-xs">
          <button
            onClick={onResetOnboarding}
            className="w-full py-3 px-4 rounded-xl text-left text-slate-600 hover:text-red-400 flex items-center gap-3 transition-all border border-transparent hover:border-red-500/20"
          >
            <LogOut className="w-3.5 h-3.5" /> [RESET_SYS]
          </button>
        </div>
      </aside>

      {/* Main content pane */}
      <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto max-h-screen">
        {/* Top Header bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-indigo-500/15 pb-4">
          <div>
            <h1 className="text-xl font-bold font-mono text-white tracking-wider uppercase">
              {activeTab === 'dashboard' && 'SYSTEM_DASHBOARD_READOUT'}
              {activeTab === 'aichat' && 'ECO_AI_CONSULTANT_CORE'}
              {activeTab === 'simulator' && 'QUANTUM_OFFSET_SIM'}
              {activeTab === 'roadmap' && 'TRANSITION_TIMELINE_COORDS'}
              {activeTab === 'insights' && 'CARBON_REDUCTION_ADVISOR'}
            </h1>
            <p className="text-[10px] text-slate-500 font-mono mt-1">// OPERATING ON ANTIGRAVITY SPECIFICATIONS</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleTriggerDemoTour}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-indigo-500/15 bg-slate-950 text-indigo-400 font-bold font-mono text-xs hover:border-indigo-500/40 hover:bg-slate-900 transition-all"
            >
              <Cpu className="w-4 h-4" /> [SYSTEM_DEMO_TOUR]
            </button>
            <button
              onClick={() => setIsLogOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold font-mono text-xs transition-all hover:bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            >
              <Plus className="w-4 h-4" /> [LOG_NEW_EMISSION]
            </button>
          </div>
        </div>

        {/* Dynamic Tab Render */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Target Budget Adjuster and Grade Report */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Dynamic Carbon Target Adjuster Card */}
              <div className="lg:col-span-8 glass-panel rounded-3xl p-6 border border-indigo-500/20 relative overflow-hidden flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <TrendingDown className="w-4 h-4 text-cyan-400" /> [DYNAMIC_BUDGET_CALIBRATION]
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed mb-6">Drag to adjust your monthly carbon emission threshold ceiling.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-500">MONTHLY_CEILING_LIMIT</span>
                    <span className="text-cyan-400 font-bold">{carbonTarget} KG CO₂e</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="600"
                    step="25"
                    value={carbonTarget}
                    onChange={(e) => handleTargetChange(Number(e.target.value))}
                    className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-slate-500">
                    <span>100 KG (Highly ambitious)</span>
                    <span>350 KG (Global Average Target)</span>
                    <span>600 KG (Standard Ceiling)</span>
                  </div>
                </div>
              </div>

              {/* Monthly Grade Report Card */}
              <div className="lg:col-span-4 bg-slate-950 border border-indigo-500/25 rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl pointer-events-none" />
                <div>
                  <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">[ECO_PERFORMANCE_GRADE]</div>
                  <div className="mt-4 flex items-center gap-4">
                    <span className={`text-5xl font-black font-mono ${ecoGrade.color}`}>
                      {ecoGrade.letter}
                    </span>
                    <div>
                      <div className="text-white font-mono font-bold text-xs uppercase">[STATUS_RATING]</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{ecoGrade.desc}</div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 border-t border-white/5 pt-4 text-[9px] font-mono text-slate-500">
                  Calculated against your target ceiling of {carbonTarget} KG/mo.
                </div>
              </div>
            </div>

            {/* Top metrics summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
              <div className="glass-panel rounded-2xl p-5 border border-indigo-500/15 text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
                <div className="text-[9px] text-slate-500 uppercase tracking-widest">[INITIAL_BASELINE]</div>
                <div className="text-xl font-bold text-white mt-2">{initialBaseline} KG <span className="text-[10px] text-slate-500">CO₂E/MO</span></div>
                <p className="text-[9px] text-slate-500 mt-2">// Derived from setup questionnaire.</p>
              </div>

              <div className="glass-panel rounded-2xl p-5 border border-indigo-500/15 text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
                <div className="text-[9px] text-slate-500 uppercase tracking-widest">[COMMITMENT_REDUCTIONS]</div>
                <div className="text-xl font-bold text-cyan-400 mt-2 glow-text-cyan font-mono">-{Math.round(activeReductionAnnual / 12)} KG <span className="text-[10px] text-slate-500">CO₂E/MO</span></div>
                <p className="text-[9px] text-slate-500 mt-2">// From {commitments.filter(c => c.active).length} active reduction targets.</p>
              </div>

              <div className="glass-panel rounded-2xl p-5 border border-indigo-500/15 text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
                <div className="text-[9px] text-slate-500 uppercase tracking-widest">[EST_NET_MONTHLY]</div>
                <div className="text-xl font-bold text-indigo-400 mt-2 glow-text-indigo">{estimatedCurrentEmissions} KG <span className="text-[10px] text-slate-500">CO₂E</span></div>
                <p className="text-[9px] text-slate-500 mt-2">// Baseline reductions + ledger logs.</p>
              </div>
            </div>

            {/* AI 5-Year Forecast Area Chart */}
            <div className="glass-panel rounded-3xl p-6 border border-indigo-500/20">
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <BrainCircuit className="w-4 h-4 text-cyan-400" /> [AI_CARBON_PROJECTOR_5_YEAR_FORECAST]
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={projectionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <XAxis dataKey="year" stroke="#475569" fontSize={10} tickLine={false} className="font-mono" />
                    <YAxis stroke="#475569" fontSize={10} tickLine={false} className="font-mono" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#030712', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '12px' }}
                      labelStyle={{ color: '#fff', fontWeight: 'bold', fontFamily: 'monospace' }}
                    />
                    <Legend wrapperStyle={{ fontSize: 10, fontFamily: 'monospace' }} />
                    <Area type="monotone" dataKey="currentPath" name="BAU Path (No Actions)" stroke="#f43f5e" fillOpacity={0.1} fill="#f43f5e" />
                    <Area type="monotone" dataKey="targetPath" name="Projected Path (With Commitments)" stroke="#06b6d4" fillOpacity={0.15} fill="#06b6d4" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Saved Commute Quick Logs */}
            <div className="glass-panel rounded-3xl p-6 border border-indigo-500/20">
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-4">
                [SAVED_COMMUTES_QUICK_LOGGER]
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Saved routes grid */}
                <div className="md:col-span-7 space-y-3">
                  <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-1">Click to trigger instant ledger entry:</div>
                  {savedRoutes.length === 0 ? (
                    <div className="text-xs text-slate-500 italic py-4 font-mono">// No routes configured. Add one on the right.</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {savedRoutes.map((route) => (
                        <div
                          key={route.id}
                          onClick={() => handleQuickLogCommute(route)}
                          className="p-3 rounded-xl border border-indigo-500/10 bg-slate-950/60 hover:bg-cyan-500/5 hover:border-cyan-500/35 transition-all cursor-pointer flex justify-between items-center group"
                        >
                          <div className="font-mono text-xs">
                            <div className="font-bold text-white group-hover:text-cyan-400 transition-colors uppercase">{route.label}</div>
                            <div className="text-[10px] text-slate-500 mt-0.5">{route.distance} km via {route.mode}</div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteRoute(route.id);
                            }}
                            className="p-1 rounded text-slate-700 hover:text-red-400 hover:bg-slate-800 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add new route form */}
                <div className="md:col-span-5 bg-slate-950/40 p-4 border border-indigo-500/10 rounded-2xl">
                  <div className="text-[9px] font-mono text-indigo-400 uppercase tracking-widest mb-3">[CONFIGURE_NEW_ROUTE]</div>
                  <form onSubmit={handleCreateRoute} className="space-y-3 font-mono text-xs">
                    <div>
                      <input
                        type="text"
                        placeholder="Route label (e.g. Office)"
                        value={newRouteName}
                        onChange={(e) => setNewRouteName(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-white/5 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="text-[9px] text-slate-500">KM</label>
                        <input
                          type="number"
                          value={newRouteDistance}
                          onChange={(e) => setNewRouteDistance(Number(e.target.value))}
                          className="w-full px-3 py-1 bg-slate-950 border border-white/5 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-[9px] text-slate-500">MODE</label>
                        <select
                          value={newRouteMode}
                          onChange={(e) => setNewRouteMode(e.target.value as any)}
                          className="w-full px-2 py-1 bg-slate-950 border border-white/5 rounded-lg text-slate-400 focus:outline-none focus:border-cyan-500 text-xs"
                        >
                          <option value="public">Public</option>
                          <option value="petrol">Petrol Car</option>
                          <option value="hybrid">Hybrid Car</option>
                          <option value="electric">Electric</option>
                        </select>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-1.5 bg-indigo-500 text-slate-950 font-bold uppercase rounded-lg hover:opacity-90 transition-opacity text-[10px]"
                    >
                      Save Commute Route
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Visual Charts panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Category distribution bar chart */}
              <div className="lg:col-span-7 glass-panel rounded-3xl p-6 border border-indigo-500/20">
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-1.5">
                  <TrendingDown className="w-4 h-4 text-cyan-400" /> [EMISSION_VECTORS_BY_CATEGORY]
                </h3>
                <div className="h-64">
                  {logs.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-xs text-slate-500 flex-col gap-2 font-mono">
                      <Info className="w-8 h-8 text-slate-650" />
                      <span>// NO_DATA_STREAMS: Log daily parameters to plot categories.</span>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={categoriesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} className="font-mono" />
                        <YAxis stroke="#475569" fontSize={10} tickLine={false} className="font-mono" />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#030712', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '12px' }}
                          labelStyle={{ color: '#fff', fontWeight: 'bold', fontFamily: 'monospace' }}
                        />
                        <Bar dataKey="emission" radius={[8, 8, 0, 0]}>
                          {categoriesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Achievements visual block */}
              <div className="lg:col-span-5 glass-panel rounded-3xl p-6 border border-indigo-500/20 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-4">[MILITARY_SYSTEM_ACHIEVEMENTS]</h3>
                  <div className="grid grid-cols-5 gap-2.5">
                    {badges.map((badge) => {
                      const unlocked = badge.unlocked;
                      return (
                        <div
                          key={badge.id}
                          className={`flex flex-col items-center group relative cursor-help ${
                            unlocked ? 'opacity-100' : 'opacity-25'
                          }`}
                        >
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all ${
                            unlocked
                              ? 'bg-indigo-500/10 border-indigo-500/40 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.25)] glow-border-cyan'
                              : 'bg-slate-900 border-white/5 text-slate-700'
                          }`}>
                            <Award className="w-5 h-5" />
                          </div>
                          {/* Tooltip */}
                          <div className="absolute bottom-12 hidden group-hover:block w-40 p-2.5 rounded-xl bg-slate-950 border border-indigo-500/20 text-[10px] text-slate-300 z-50 shadow-xl text-center font-mono">
                            <div className="font-bold text-white uppercase text-[9px]">{badge.title}</div>
                            <div className="text-slate-500 mt-1 leading-normal text-[8px]">{badge.description}</div>
                            <div className="text-[8px] text-cyan-400 font-bold mt-1.5 uppercase">
                              {unlocked ? '[UNLOCKED]' : badge.requirement}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6 border-t border-indigo-500/15 pt-4 font-mono text-[10px]">
                  <div className="flex justify-between items-center text-slate-500 mb-2">
                    <span>[ACTIVE_COMMITMENTS]</span>
                    <span>{commitments.filter((c) => c.active).length} // {commitments.length}</span>
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {commitments.filter(c => c.active).slice(0, 3).map((c) => (
                      <span key={c.id} className="text-[9px] px-2 py-0.5 rounded-md bg-slate-950 border border-indigo-500/10 text-slate-400 font-semibold">
                        {c.title}
                      </span>
                    ))}
                    {commitments.filter(c => c.active).length > 3 && (
                      <span className="text-[9px] px-2 py-0.5 rounded-md bg-slate-950 border border-indigo-500/10 text-slate-500 font-bold">
                        +{commitments.filter(c => c.active).length - 3}
                      </span>
                    )}
                    {commitments.filter(c => c.active).length === 0 && (
                      <span className="text-[8px] text-slate-600 italic">// No active commitments.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent log table listing */}
            <div className="glass-panel rounded-3xl p-6 border border-indigo-500/20">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">[TRANSACTIONAL_CARBON_LEDGER]</h3>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-500 font-mono">{logs.length} entries</span>
                  <button
                    onClick={handleExportCSV}
                    disabled={logs.length === 0}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-500/15 bg-slate-950 text-slate-400 font-mono text-[9px] hover:text-cyan-400 hover:border-cyan-500/30 transition-all disabled:opacity-40 disabled:pointer-events-none"
                  >
                    <Download className="w-3.5 h-3.5" /> EXPORT_CSV
                  </button>
                </div>
              </div>

              {logs.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-600 font-mono">
                  // LEDGER_EMPTY: Enter manual emissions logs to begin tracking.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-400 font-mono">
                    <thead>
                      <tr className="border-b border-indigo-500/15 text-[9px] text-slate-500 uppercase font-semibold">
                        <th className="pb-3">Category</th>
                        <th className="pb-3">Details</th>
                        <th className="pb-3">Timestamp</th>
                        <th className="pb-3 text-right">Emissions</th>
                        <th className="pb-3 text-right">Delete</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-[11px]">
                      {logs.map((log) => (
                        <tr key={log.id} className="group hover:bg-white/2 hover:text-white transition-colors">
                          <td className="py-3 capitalize">
                            <span className={`inline-flex items-center gap-1.5 font-bold ${
                              log.category === 'transport' ? 'text-indigo-400' :
                              log.category === 'energy' ? 'text-cyan-400' :
                              log.category === 'food' ? 'text-purple-400' :
                              'text-rose-400'
                            }`}>
                              [{log.category}]
                            </span>
                          </td>
                          <td className="py-3 text-slate-200 font-medium">{log.details}</td>
                          <td className="py-3 text-slate-500">{log.date}</td>
                          <td className="py-3 text-right font-bold text-white">+{log.emission} KG CO₂E</td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => handleDeleteLog(log.id)}
                              className="p-1 rounded text-slate-700 hover:text-red-400 hover:bg-slate-900 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'aichat' && (
          <AIChatConsole
            onboardingData={initialOnboardingData}
            logs={logs}
          />
        )}

        {activeTab === 'simulator' && (
          <OffsetSimulator
            monthlyEmissions={estimatedCurrentEmissions}
            onNetZeroUnlocked={handleNetZeroUnlocked}
          />
        )}

        {activeTab === 'roadmap' && (
          <EcoJourneyRoadmap
            logsCount={logs.length}
            commitmentsCount={commitments.filter((c) => c.active).length}
            isNetZero={isNetZero}
            onboardingCompleted={true}
          />
        )}

        {activeTab === 'insights' && (
          <InsightsAdvisor
            commitments={commitments}
            onToggleCommitment={handleToggleCommitment}
          />
        )}
      </main>

      {/* Log Activity Modal */}
      {isLogOpen && (
        <LogEmissionModal
          onClose={() => setIsLogOpen(false)}
          onSave={handleAddLog}
        />
      )}
    </div>
  );
}
