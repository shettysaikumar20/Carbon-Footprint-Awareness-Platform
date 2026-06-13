'use client';

import React, { useState } from 'react';
import { EMISSION_FACTORS, LogEntry } from '../lib/ecoStore';
import { X, Car, Zap, Utensils, Trash2, Plus, Info } from 'lucide-react';

interface LogEmissionModalProps {
  onClose: () => void;
  onSave: (entry: Omit<LogEntry, 'id' | 'date'>) => void;
}

type CategoryType = 'transport' | 'energy' | 'food' | 'waste';

export default function LogEmissionModal({ onClose, onSave }: LogEmissionModalProps) {
  const [category, setCategory] = useState<CategoryType>('transport');

  // Transport details
  const [distance, setDistance] = useState<number>(10);
  const [transportMode, setTransportMode] = useState<keyof typeof EMISSION_FACTORS.transport>('petrol');

  // Energy details
  const [kwh, setKwh] = useState<number>(30);
  const [energySource, setEnergySource] = useState<keyof typeof EMISSION_FACTORS.energy>('grid');

  // Food details
  const [dietMeal, setDietMeal] = useState<keyof typeof EMISSION_FACTORS.food>('flexitarian');
  const [mealCount, setMealCount] = useState<number>(1);

  // Waste details
  const [wasteType, setWasteType] = useState<keyof typeof EMISSION_FACTORS.waste>('standard');
  const [bagCount, setBagCount] = useState<number>(1);

  // Calculate live emission preview
  const getPreviewValue = (): number => {
    switch (category) {
      case 'transport':
        return Math.round(distance * EMISSION_FACTORS.transport[transportMode]);
      case 'energy':
        return Math.round(kwh * EMISSION_FACTORS.energy[energySource]);
      case 'food':
        return Math.round(mealCount * EMISSION_FACTORS.food[dietMeal]);
      case 'waste':
        return Math.round(bagCount * EMISSION_FACTORS.waste[wasteType]);
      default:
        return 0;
    }
  };

  const handleSave = () => {
    let details = '';
    const emission = getPreviewValue();

    if (category === 'transport') {
      const label = transportMode === 'flight_short' ? 'Short Flight' : transportMode === 'flight_long' ? 'Long Flight' : `${transportMode} vehicle`;
      details = `${distance} km via ${label}`;
    } else if (category === 'energy') {
      details = `${kwh} kWh consumed from ${energySource} source`;
    } else if (category === 'food') {
      details = `${mealCount}x ${dietMeal} meals`;
    } else if (category === 'waste') {
      details = `${bagCount} bag(s) of ${wasteType} waste`;
    }

    onSave({
      category,
      details,
      emission,
    });
  };

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="dialog-title" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm transition-all">
      <div className="w-full max-w-lg glass-panel rounded-3xl overflow-hidden border border-indigo-500/20 relative shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-indigo-500/15 bg-slate-900/40">
          <h2 id="dialog-title" className="text-sm font-mono font-bold text-white flex items-center gap-2 uppercase tracking-wider">
            <Plus className="w-4 h-4 text-cyan-400" /> [LOG_ECO_ACTIVITY]
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal dialouge"
            className="p-1 rounded text-slate-500 hover:text-white hover:bg-slate-800 transition-all font-mono text-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <nav aria-label="Activity categories navigation" className="flex border-b border-indigo-500/10 bg-slate-900/20 p-2 gap-1 font-mono text-xs">
          {(['transport', 'energy', 'food', 'waste'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setCategory(tab)}
              aria-label={`Switch form view to ${tab} tracker`}
              className={`flex-1 py-2 px-3 rounded-xl capitalize font-bold flex items-center justify-center gap-1.5 transition-all ${
                category === tab
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {tab === 'transport' && <Car className="w-3.5 h-3.5" />}
              {tab === 'energy' && <Zap className="w-3.5 h-3.5" />}
              {tab === 'food' && <Utensils className="w-3.5 h-3.5" />}
              {tab === 'waste' && <Trash2 className="w-3.5 h-3.5" />}
              {tab}
            </button>
          ))}
        </nav>

        {/* Inputs */}
        <div className="p-6 space-y-6">
          {/* TRANSPORT */}
          {category === 'transport' && (
            <div className="space-y-4">
              <div>
                <fieldset>
                  <legend className="block text-slate-400 font-mono text-[10px] uppercase mb-2">Transport Mode</legend>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {(Object.keys(EMISSION_FACTORS.transport) as Array<keyof typeof EMISSION_FACTORS.transport>).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setTransportMode(mode)}
                        aria-label={`Select transport mode ${mode}`}
                        className={`py-2 px-3 rounded-xl text-left border transition-all text-xs font-mono ${
                          transportMode === mode
                            ? 'border-cyan-500 bg-cyan-500/10 text-white'
                            : 'border-white/5 bg-slate-900/40 text-slate-400 hover:border-white/10'
                        }`}
                      >
                        <div className="font-bold capitalize text-[10px]">
                          {mode.replace('_', ' ')}
                        </div>
                        <div className="text-[9px] text-slate-500 mt-0.5">
                          {EMISSION_FACTORS.transport[mode]} kg/km
                        </div>
                      </button>
                    ))}
                  </div>
                </fieldset>
              </div>

              <div>
                <label htmlFor="log-transit-distance" className="flex justify-between text-slate-300 font-mono text-[10px] uppercase mb-2">
                  <span>Travel Distance</span>
                  <span className="text-cyan-400 font-bold">{distance} km</span>
                </label>
                <input
                  id="log-transit-distance"
                  type="range"
                  min="1"
                  max="500"
                  value={distance}
                  onChange={(e) => setDistance(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-[9px] font-mono text-slate-500">
                  <span>1 km</span>
                  <span>250 km</span>
                  <span>500 km</span>
                </div>
              </div>
            </div>
          )}

          {/* ENERGY */}
          {category === 'energy' && (
            <div className="space-y-4">
              <div>
                <fieldset>
                  <legend className="block text-slate-400 font-mono text-[10px] uppercase mb-2">Power Feed Source</legend>
                  <div className="grid grid-cols-3 gap-2">
                    {(Object.keys(EMISSION_FACTORS.energy) as Array<keyof typeof EMISSION_FACTORS.energy>).map((src) => (
                      <button
                        key={src}
                        type="button"
                        onClick={() => setEnergySource(src)}
                        aria-label={`Select energy feed source ${src}`}
                        className={`py-2 px-3 rounded-xl text-left border transition-all text-xs font-mono ${
                          energySource === src
                            ? 'border-cyan-500 bg-cyan-500/10 text-white'
                            : 'border-white/5 bg-slate-900/40 text-slate-400 hover:border-white/10'
                        }`}
                      >
                        <div className="font-bold capitalize text-[10px]">{src}</div>
                        <div className="text-[9px] text-slate-500 mt-0.5">
                          {EMISSION_FACTORS.energy[src]} kg/kWh
                        </div>
                      </button>
                    ))}
                  </div>
                </fieldset>
              </div>

              <div>
                <label htmlFor="log-energy-kwh" className="flex justify-between text-slate-300 font-mono text-[10px] uppercase mb-2">
                  <span>Grid Consumption</span>
                  <span className="text-cyan-400 font-bold">{kwh} kWh</span>
                </label>
                <input
                  id="log-energy-kwh"
                  type="range"
                  min="1"
                  max="200"
                  value={kwh}
                  onChange={(e) => setKwh(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-[9px] font-mono text-slate-500">
                  <span>1 kWh</span>
                  <span>100 kWh</span>
                  <span>200 kWh</span>
                </div>
              </div>
            </div>
          )}

          {/* FOOD */}
          {category === 'food' && (
            <div className="space-y-4">
              <div>
                <fieldset>
                  <legend className="block text-slate-400 font-mono text-[10px] uppercase mb-2">Diet Profile</legend>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(EMISSION_FACTORS.food) as Array<keyof typeof EMISSION_FACTORS.food>).map((diet) => (
                      <button
                        key={diet}
                        type="button"
                        onClick={() => setDietMeal(diet)}
                        aria-label={`Select dietary menu profile ${diet}`}
                        className={`py-2.5 px-3 rounded-xl text-left border transition-all text-xs font-mono ${
                          dietMeal === diet
                            ? 'border-cyan-500 bg-cyan-500/10 text-white'
                            : 'border-white/5 bg-slate-900/40 text-slate-400 hover:border-white/10'
                        }`}
                      >
                        <div className="font-bold capitalize text-[10px]">
                          {diet === 'meat-heavy' ? 'Frequent Meat' : diet}
                        </div>
                        <div className="text-[9px] text-slate-500 mt-0.5">
                          ~{EMISSION_FACTORS.food[diet]} kg/meal
                        </div>
                      </button>
                    ))}
                  </div>
                </fieldset>
              </div>

              <div>
                <label htmlFor="log-food-meals" className="flex justify-between text-slate-300 font-mono text-[10px] uppercase mb-2">
                  <span>Meal Quantity</span>
                  <span className="text-cyan-400 font-bold">{mealCount} meal(s)</span>
                </label>
                <input
                  id="log-food-meals"
                  type="range"
                  min="1"
                  max="15"
                  value={mealCount}
                  onChange={(e) => setMealCount(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-[9px] font-mono text-slate-500">
                  <span>1 meal</span>
                  <span>8 meals</span>
                  <span>15 meals</span>
                </div>
              </div>
            </div>
          )}

          {/* WASTE */}
          {category === 'waste' && (
            <div className="space-y-4">
              <div>
                <fieldset>
                  <legend className="block text-slate-400 font-mono text-[10px] uppercase mb-2">Disposal Type</legend>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(EMISSION_FACTORS.waste) as Array<keyof typeof EMISSION_FACTORS.waste>).map((w) => (
                      <button
                        key={w}
                        type="button"
                        onClick={() => setWasteType(w)}
                        aria-label={`Select waste bin disposal type ${w}`}
                        className={`py-2.5 px-3 rounded-xl text-left border transition-all text-xs font-mono ${
                          wasteType === w
                            ? 'border-cyan-500 bg-cyan-500/10 text-white'
                            : 'border-white/5 bg-slate-900/40 text-slate-400 hover:border-white/10'
                        }`}
                      >
                        <div className="font-bold capitalize text-[10px]">{w} Landfill</div>
                        <div className="text-[9px] text-slate-500 mt-0.5">
                          {EMISSION_FACTORS.waste[w]} kg/bag
                        </div>
                      </button>
                    ))}
                  </div>
                </fieldset>
              </div>

              <div>
                <label htmlFor="log-waste-bags" className="flex justify-between text-slate-300 font-mono text-[10px] uppercase mb-2">
                  <span>Bags of Trash</span>
                  <span className="text-cyan-400 font-bold">{bagCount} Bags</span>
                </label>
                <input
                  id="log-waste-bags"
                  type="range"
                  min="1"
                  max="10"
                  value={bagCount}
                  onChange={(e) => setBagCount(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-[9px] font-mono text-slate-500">
                  <span>1 Bag</span>
                  <span>5 Bags</span>
                  <span>10 Bags</span>
                </div>
              </div>
            </div>
          )}

          {/* Carbon Preview Summary */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-indigo-500/25 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl pointer-events-none" />
            <div>
              <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[10px] uppercase tracking-wider">
                <Info className="w-3.5 h-3.5 text-cyan-400" /> Emission Impact Preview
              </div>
              <div className="text-slate-500 text-[9px] mt-0.5 font-mono">[CALC_RUNNING_COEFFICIENTS]</div>
            </div>
            <div className="text-right font-mono">
              <span className="text-3xl font-black text-cyan-400 glow-text-cyan">
                {getPreviewValue()}
              </span>
              <span className="text-slate-500 text-xs font-bold ml-1">KG CO₂E</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-900/40 border-t border-indigo-500/15 flex gap-3 font-mono text-xs">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-white/5 text-slate-300 font-bold transition-all hover:bg-slate-900"
          >
            [CANCEL]
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-slate-950 font-extrabold transition-all hover:opacity-90 shadow-lg shadow-indigo-500/20"
          >
            [SAVE_TO_LEDGER]
          </button>
        </div>
      </div>
    </div>
  );
}
