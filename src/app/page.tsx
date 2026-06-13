'use client';

import React, { useState, useEffect } from 'react';
import OnboardingWizard from '../components/OnboardingWizard';
import Dashboard from '../components/Dashboard';
import { OnboardingData } from '../lib/ecoStore';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [onboarded, setOnboarded] = useState(false);
  const [baseline, setBaseline] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);

  useEffect(() => {
    // Check if user is already onboarded
    const savedOnboarded = localStorage.getItem('ecosphere_onboarded');
    const savedBaseline = localStorage.getItem('ecosphere_baseline');
    const savedData = localStorage.getItem('ecosphere_onboarding_data');

    if (savedOnboarded === 'true' && savedBaseline) {
      setOnboarded(true);
      setBaseline(Number(savedBaseline));
      if (savedData) setOnboardingData(JSON.parse(savedData));
    }
    setLoading(false);
  }, []);

  const handleOnboardingComplete = (data: OnboardingData, calculatedBaseline: number) => {
    setOnboarded(true);
    setBaseline(calculatedBaseline);
    setOnboardingData(data);

    // Save to localStorage
    localStorage.setItem('ecosphere_onboarded', 'true');
    localStorage.setItem('ecosphere_baseline', calculatedBaseline.toString());
    localStorage.setItem('ecosphere_onboarding_data', JSON.stringify(data));
  };

  const handleResetOnboarding = () => {
    // Clear localStorage
    localStorage.removeItem('ecosphere_onboarded');
    localStorage.removeItem('ecosphere_baseline');
    localStorage.removeItem('ecosphere_onboarding_data');
    localStorage.removeItem('ecosphere_logs');
    localStorage.removeItem('ecosphere_commitments');
    localStorage.removeItem('ecosphere_badges');

    // Reset local state
    setOnboarded(false);
    setBaseline(0);
    setOnboardingData(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 font-medium">
        Syncing EcoSphere profile...
      </div>
    );
  }

  if (!onboarded) {
    return <OnboardingWizard onComplete={handleOnboardingComplete} />;
  }

  return (
    <Dashboard
      initialBaseline={baseline}
      initialOnboardingData={onboardingData!}
      onResetOnboarding={handleResetOnboarding}
    />
  );
}
