'use client';

import React, { useState } from 'react';
import { OnboardingData, calculateBaseline } from '../lib/ecoStore';
import { Home, Car, Utensils, ArrowRight, ArrowLeft, CheckCircle2, Leaf, Zap, HelpCircle } from 'lucide-react';

interface OnboardingWizardProps {
  onComplete: (data: OnboardingData, baseline: number) => void;
}

export default function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>({
    houseSize: 1500,
    energySource: 'grid',
    vehicleType: 'petrol',
    weeklyDistance: 150,
    diet: 'flexitarian',
    flights: 2,
  });

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const calculatedVal = calculateBaseline(formData);

  const handleSubmit = () => {
    onComplete(formData, calculatedVal);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-radial-gradient">
      <div className="w-full max-w-2xl glass-panel rounded-3xl p-8 md:p-12 border border-indigo-500/20 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

        {/* Progress Bar */}
        <div className="flex justify-between items-center mb-8 relative">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="flex items-center z-10">
              <button
                disabled={num > step}
                onClick={() => setStep(num)}
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
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-widest mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" /> ANTIGRAVITY // ECO_BASELINE
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            {step === 1 && 'Household & Energy'}
            {step === 2 && 'Travel & Transport'}
            {step === 3 && 'Dietary Lifestyle'}
            {step === 4 && 'Your Footprint Analysis'}
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            {step === 1 && 'Estimate household energy variables to build your emission baseline.'}
            {step === 2 && 'Define commute modes, distance profiles, and aviation frequencies.'}
            {step === 3 && 'Calculate the ecological coefficients of your food lifestyle.'}
            {step === 4 && 'Confirm your profile baseline parameters and launch EcoSphere.'}
          </p>
        </div>

        {/* Content Steps */}
        <div className="my-8 min-h-[260px]">
          {/* STEP 1: HOUSEHOLD & ENERGY */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="flex justify-between text-slate-300 font-mono text-xs mb-2">
                  <span>HOME_SIZE_SQFT</span>
                  <span className="text-cyan-400 font-bold font-mono">{formData.houseSize} SQFT</span>
                </label>
                <input
                  type="range"
                  min="500"
                  max="5000"
                  step="100"
                  value={formData.houseSize}
                  onChange={(e) => setFormData({ ...formData, houseSize: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                  <span>500 SQFT</span>
                  <span>2,500 SQFT</span>
                  <span>5,000 SQFT</span>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-mono text-xs mb-3 block">ENERGY_GRID_SOURCE</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {(['grid', 'hybrid', 'solar'] as const).map((energy) => (
                    <button
                      key={energy}
                      type="button"
                      onClick={() => setFormData({ ...formData, energySource: energy })}
                      className={`p-4 rounded-xl text-left border transition-all ${
                        formData.energySource === energy
                          ? 'border-cyan-500 bg-cyan-500/10 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                          : 'border-white/5 bg-slate-900/40 text-slate-400 hover:border-white/10'
                      }`}
                    >
                      <Zap className={`w-5 h-5 mb-2 ${formData.energySource === energy ? 'text-cyan-400' : 'text-slate-500'}`} />
                      <div className="font-bold font-mono text-xs uppercase text-white">{energy}</div>
                      <div className="text-[10px] text-slate-500 mt-1">
                        {energy === 'grid' && '100% Fossil Fuel'}
                        {energy === 'hybrid' && 'Grid + Solar Share'}
                        {energy === 'solar' && '100% Rooftop Solar'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: TRANSPORT */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="text-slate-300 font-mono text-xs mb-3 block">VEHICLE_FUEL_COEFFICIENT</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {(['petrol', 'diesel', 'hybrid', 'electric', 'none'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, vehicleType: type })}
                      className={`p-3 rounded-xl text-center border transition-all ${
                        formData.vehicleType === type
                          ? 'border-cyan-500 bg-cyan-500/10 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                          : 'border-white/5 bg-slate-900/40 text-slate-400 hover:border-white/10'
                      }`}
                    >
                      <Car className={`w-5 h-5 mx-auto mb-1 ${formData.vehicleType === type ? 'text-cyan-400' : 'text-slate-500'}`} />
                      <div className="font-bold font-mono text-[10px] uppercase text-white">{type === 'none' ? 'active' : type}</div>
                    </button>
                  ))}
                </div>
              </div>

              {formData.vehicleType !== 'none' && (
                <div>
                  <label className="flex justify-between text-slate-300 font-mono text-xs mb-2">
                    <span>WEEKLY_COMMUTE_DISTANCE</span>
                    <span className="text-cyan-400 font-bold font-mono">{formData.weeklyDistance} KM</span>
                  </label>
                  <input
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
                <label className="flex justify-between text-slate-300 font-mono text-xs mb-2">
                  <span>ANNUAL_AVIATION_TRIPS</span>
                  <span className="text-indigo-400 font-bold font-mono">{formData.flights} FLIGHTS</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="1"
                  value={formData.flights}
                  onChange={(e) => setFormData({ ...formData, flights: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                  <span>0 FLIGHTS</span>
                  <span>15 FLIGHTS</span>
                  <span>30 FLIGHTS</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: DIETARY LIFESTYLE */}
          {step === 3 && (
            <div className="space-y-6">
              <label className="text-slate-300 font-mono text-xs mb-3 block">DIET_CARBON_INTENSITY</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(['vegan', 'vegetarian', 'flexitarian', 'meat-heavy'] as const).map((diet) => (
                  <button
                    key={diet}
                    type="button"
                    onClick={() => setFormData({ ...formData, diet: diet })}
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
                  <span className="text-slate-400 text-sm font-bold uppercase">kg CO₂e / mo</span>
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
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between border-t border-white/5 pt-6 font-mono text-xs">
          <button
            type="button"
            disabled={step === 1}
            onClick={prevStep}
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
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold transition-all hover:bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            >
              NEXT_STEP <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-slate-950 font-extrabold transition-all hover:opacity-90 shadow-[0_0_20px_rgba(99,102,241,0.4)]"
            >
              INIT_ECOSPHERE <Leaf className="w-4 h-4 animate-spin-slow" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
