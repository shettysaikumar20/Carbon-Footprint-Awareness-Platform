'use client';

import React, { useState, useEffect } from 'react';
import { OnboardingData, calculateBaseline } from '../lib/ecoStore';
import { Leaf, Zap, Car, Utensils, ArrowRight, ArrowLeft, CheckCircle2, HelpCircle } from 'lucide-react';

interface OnboardingWizardProps {
  onComplete: (data: OnboardingData, baseline: number) => void;
}

export default function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [welcomeScreen, setWelcomeScreen] = useState(true);
  const [bootStep, setBootStep] = useState(0);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>({
    username: 'Operator',
    country: 'in',
    avatarColor: '#06b6d4',
    houseSize: 1500,
    energySource: 'grid',
    vehicleType: 'petrol',
    weeklyDistance: 150,
    diet: 'flexitarian',
    flights: 2,
  });

  const bootLogs = [
    '// INITIALIZING QUANTUM ENVIRONMENTAL LEDGER...',
    '// BOOTSTRAPPING CO2e CONVERSION COEFFICIENTS...',
    '// PARSING EPA & DEFRA EMISSIONS PROTOCOLS...',
    '// CALIBRATING ANTIGRAVITY SYS CONTROLS...',
    '// ECOSPHERE CORE STABILITY LCK: ONLINE.'
  ];

  useEffect(() => {
    if (welcomeScreen && bootStep < bootLogs.length) {
      const timer = setTimeout(() => {
        setBootStep((prev) => prev + 1);
      }, 550);
      return () => clearTimeout(timer);
    }
  }, [welcomeScreen, bootStep]);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const calculatedVal = calculateBaseline(formData);

  const handleSubmit = () => {
    onComplete(formData, calculatedVal);
  };

  if (welcomeScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
        <div className="w-full max-w-xl glass-panel rounded-3xl p-8 border border-indigo-500/20 relative font-mono text-xs text-slate-400">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Console Header */}
          <div className="flex justify-between items-center border-b border-indigo-500/15 pb-4 mb-6">
            <span className="font-bold text-white tracking-widest">[ECOSPHERE_BOOT_SEQUENCE]</span>
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-ping" aria-label="System status online ping indicator" />
          </div>

          {/* Boot logs print */}
          <div className="space-y-3 min-h-[160px] font-mono">
            {bootLogs.slice(0, bootStep).map((log, idx) => (
              <div key={idx} className={idx === bootLogs.length - 1 ? 'text-cyan-400 font-bold glow-text-cyan' : 'text-slate-300'}>
                {log}
              </div>
            ))}
            {bootStep < bootLogs.length && (
              <div className="text-slate-500 animate-pulse">// LOADING INPUT MATRICES... <span className="inline-block w-1.5 h-3 bg-slate-400" /></div>
            )}
          </div>

          {/* Proceed Button */}
          {bootStep >= bootLogs.length && (
            <div className="border-t border-white/5 pt-6 mt-6 transition-all animate-fade-in text-center">
              <button
                onClick={() => setWelcomeScreen(false)}
                aria-label="Proceed to operator calibration onboarding"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-slate-950 font-bold transition-all hover:opacity-90 shadow-[0_0_15px_rgba(99,102,241,0.4)]"
              >
                PROCEED_TO_OPERATOR_CALIBRATION
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl glass-panel rounded-3xl p-8 md:p-12 border border-indigo-500/20 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

        {/* Progress Bar */}
        <nav className="flex justify-between items-center mb-8 relative" aria-label="Onboarding step tracker">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="flex items-center z-10">
              <button
                disabled={num > step}
                onClick={() => setStep(num)}
                aria-label={`Go to step ${num}`}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold transition-all ${
                  step >= num
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.6)]'
                    : 'bg-slate-900 text-slate-500 border border-white/5'
                }`}
              >
                0{num}
              </button>
              {num < 4 && (
                <div
                  className={`h-0.5 w-16 sm:w-28 transition-all ${
                    step > num ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.3)]' : 'bg-slate-800'
                  }`}
                />
              )}
            </div>
          ))}
        </nav>

        {/* Header */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-widest mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" /> ANTIGRAVITY // ECO_BASELINE
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            {step === 1 && 'Operator Credentials'}
            {step === 2 && 'Travel & Transport'}
            {step === 3 && 'Dietary Lifestyle'}
            {step === 4 && 'Your Footprint Analysis'}
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            {step === 1 && 'Define your operator credentials and dynamic grid location.'}
            {step === 2 && 'Define commute modes, distance profiles, and aviation frequencies.'}
            {step === 3 && 'Calculate the ecological coefficients of your food lifestyle.'}
            {step === 4 && 'Confirm your profile baseline parameters and launch EcoSphere.'}
          </p>
        </header>

        {/* Content Steps */}
        <main className="my-8 min-h-[260px]">
          {/* STEP 1: OPERATOR PROFILE SETUP */}
          {step === 1 && (
            <div className="space-y-6 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="username-input" className="block text-slate-400 uppercase tracking-wider mb-2">Operator Name</label>
                  <input
                    id="username-input"
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-white/5 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label htmlFor="country-input" className="block text-slate-400 uppercase tracking-wider mb-2">Location Country</label>
                  <select
                    id="country-input"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value as any })}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-white/5 rounded-xl text-slate-400 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="in">India (Coal heavy, 0.70 kg/kWh)</option>
                    <option value="us">United States (Mixed grid, 0.38 kg/kWh)</option>
                    <option value="de">Germany (Wind/Coal, 0.35 kg/kWh)</option>
                    <option value="fr">France (Nuclear clean, 0.05 kg/kWh)</option>
                    <option value="no">Norway (Hydropower, 0.01 kg/kWh)</option>
                  </select>
                </div>
              </div>

              <div>
                <fieldset>
                  <legend className="block text-slate-400 uppercase tracking-wider mb-2">Avatar Console Tint</legend>
                  <div className="flex gap-4">
                    {[
                      { hex: '#06b6d4', name: 'Cyan' },
                      { hex: '#6366f1', name: 'Indigo' },
                      { hex: '#a855f7', name: 'Purple' },
                      { hex: '#f43f5e', name: 'Rose' },
                    ].map((color) => (
                      <button
                        key={color.hex}
                        type="button"
                        onClick={() => setFormData({ ...formData, avatarColor: color.hex })}
                        aria-label={`Select ${color.name} console color theme`}
                        className={`px-4 py-2 rounded-lg border transition-all ${
                          formData.avatarColor === color.hex
                            ? 'border-cyan-500 text-white'
                            : 'border-white/5 bg-slate-900/40 text-slate-550'
                        }`}
                        style={{ color: formData.avatarColor === color.hex ? color.hex : '' }}
                      >
                        {color.name}
                      </button>
                    ))}
                  </div>
                </fieldset>
              </div>

              <div>
                <label htmlFor="house-size-input" className="flex justify-between text-slate-350 mb-2">
                  <span>Home Size (sq. ft.)</span>
                  <span className="text-cyan-400 font-bold font-mono">{formData.houseSize} SQFT</span>
                </label>
                <input
                  id="house-size-input"
                  type="range"
                  min="500"
                  max="5000"
                  step="100"
                  value={formData.houseSize}
                  onChange={(e) => setFormData({ ...formData, houseSize: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>
            </div>
          )}

          {/* STEP 2: TRANSPORT */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <fieldset>
                  <legend className="text-slate-355 font-mono text-xs mb-3 block">Primary Commute Vehicle Type</legend>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {(['petrol', 'diesel', 'hybrid', 'electric', 'none'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({ ...formData, vehicleType: type })}
                        aria-label={`Select vehicle type ${type}`}
                        className={`p-3 rounded-xl text-center border transition-all ${
                          formData.vehicleType === type
                            ? 'border-cyan-500 bg-cyan-500/10 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                            : 'border-white/5 bg-slate-900/40 text-slate-405 hover:border-white/10'
                        }`}
                      >
                        <Car className={`w-5 h-5 mx-auto mb-1 ${formData.vehicleType === type ? 'text-cyan-400' : 'text-slate-500'}`} />
                        <div className="font-bold font-mono text-[10px] uppercase text-white">{type === 'none' ? 'Bicycle/Walk' : type}</div>
                      </button>
                    ))}
                  </div>
                </fieldset>
              </div>

              {formData.vehicleType !== 'none' && (
                <div>
                  <label htmlFor="weekly-commute-distance" className="flex justify-between text-slate-305 font-mono text-xs mb-2">
                    <span>Weekly Commute Distance (km)</span>
                    <span className="text-cyan-400 font-bold font-mono">{formData.weeklyDistance} KM</span>
                  </label>
                  <input
                    id="weekly-commute-distance"
                    type="range"
                    min="0"
                    max="1000"
                    step="25"
                    value={formData.weeklyDistance}
                    onChange={(e) => setFormData({ ...formData, weeklyDistance: Number(e.target.value) })}
                    className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                    <span>0 KM</span>
                    <span>500 KM</span>
                    <span>1,000 KM</span>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="yearly-flights-input" className="flex justify-between text-slate-300 font-mono text-xs mb-2">
                  <span>Flights Per Year (Round Trips)</span>
                  <span className="text-indigo-400 font-bold font-mono">{formData.flights} FLIGHTS</span>
                </label>
                <input
                  id="yearly-flights-input"
                  type="range"
                  min="0"
                  max="30"
                  step="1"
                  value={formData.flights}
                  onChange={(e) => setFormData({ ...formData, flights: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            </div>
          )}

          {/* STEP 3: DIETARY LIFESTYLE */}
          {step === 3 && (
            <div className="space-y-6">
              <fieldset>
                <legend className="text-slate-305 font-mono text-xs mb-3 block">Dietary Profile</legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(['vegan', 'vegetarian', 'flexitarian', 'meat-heavy'] as const).map((diet) => (
                    <button
                      key={diet}
                      type="button"
                      onClick={() => setFormData({ ...formData, diet: diet })}
                      aria-label={`Select dietary lifestyle ${diet}`}
                      className={`p-4 rounded-xl text-left border flex items-start gap-4 transition-all ${
                        formData.diet === diet
                          ? 'border-cyan-500 bg-cyan-500/10 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                          : 'border-white/5 bg-slate-900/40 text-slate-400 hover:border-white/10'
                      }`}
                    >
                      <div className={`p-2.5 rounded-lg ${formData.diet === diet ? 'bg-cyan-500/20' : 'bg-slate-800'}`}>
                        <Utensils className={`w-5 h-5 ${formData.diet === diet ? 'text-cyan-400' : 'text-slate-500'}`} />
                      </div>
                      <div>
                        <div className="font-bold font-mono text-xs uppercase text-white">
                          {diet === 'meat-heavy' ? 'MEAT_HEAVY' : diet}
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">
                          {diet === 'vegan' && 'Plant-based exclusively. lowest carbon multiplier.'}
                          {diet === 'vegetarian' && 'No meat, includes dairy. low carbon footprint.'}
                          {diet === 'flexitarian' && 'Moderate meat/fish diets. average multiplier.'}
                          {diet === 'meat-heavy' && 'Daily red meat, poultry, pork. high carbon multiplier.'}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
          )}

          {/* STEP 4: ANALYSIS AND REVIEW */}
          {step === 4 && (
            <div className="text-center space-y-6">
              <div className="inline-block p-6 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-2 relative animate-float">
                <CheckCircle2 className="w-16 h-16 text-cyan-400 glow-text-cyan" />
              </div>
              <div>
                <h3 className="text-slate-400 text-xs font-mono uppercase tracking-wider">CALCULATED_BASELINE_OUTPUT</h3>
                <div className="mt-2 flex items-baseline justify-center gap-1 font-mono">
                  <span className="text-5xl font-black text-white glow-text-cyan">
                    {calculatedVal.toLocaleString()}
                  </span>
                  <span className="text-slate-450 text-sm font-bold uppercase">kg CO₂e / mo</span>
                </div>
              </div>

              <div className="max-w-md mx-auto py-3 px-4 rounded-xl bg-slate-950 border border-indigo-500/20 text-[11px] text-slate-400 flex items-center gap-3 text-left font-mono">
                <HelpCircle className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <span>
                  [SYS_INFO]: Global monthly average sits at ~400kg. Transition target threshold &lt; 150kg to align with net-zero sustainability paths.
                </span>
              </div>
            </div>
          )}
        </main>

        {/* Action Buttons */}
        <footer className="flex justify-between border-t border-white/5 pt-6 font-mono text-xs">
          <button
            type="button"
            disabled={step === 1}
            onClick={prevStep}
            aria-label="Return to previous onboarding setup step"
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/5 text-slate-300 font-bold transition-all hover:bg-slate-900 ${
              step === 1 ? 'opacity-0 pointer-events-none' : ''
            }`}
          >
            <ArrowLeft className="w-4 h-4" /> PREV_STEP
          </button>

          {step < 4 ? (
            <button
              type="button"
              onClick={nextStep}
              aria-label="Advance to next onboarding step"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold transition-all hover:bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            >
              NEXT_STEP <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              aria-label="Enter EcoSphere carbon dashboard application"
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-slate-950 font-extrabold transition-all hover:opacity-90 shadow-[0_0_20px_rgba(99,102,241,0.4)]"
            >
              INIT_ECOSPHERE <Leaf className="w-4 h-4 animate-spin-slow" />
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}
