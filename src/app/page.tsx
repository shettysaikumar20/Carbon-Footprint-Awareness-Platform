'use client';

import React, { useState } from 'react';
import OnboardingWizard from '../components/OnboardingWizard';
import Dashboard from '../components/Dashboard';
import { OnboardingData } from '../lib/ecoStore';

export default function Home() {
  const [onboarded, setOnboarded] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('ecosphere_onboarded') === 'true';
    }
    return false;
  });

  const [baseline, setBaseline] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return Number(localStorage.getItem('ecosphere_baseline')) || 0;
    }
    return 0;
  });

  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('ecosphere_onboarding_data');
      return savedData ? JSON.parse(savedData) : null;
    }
    return null;
  });

  const handleOnboardingComplete = (data: OnboardingData, calculatedBaseline: number) => {
    setOnboarded(true);
    setBaseline(calculatedBaseline);
    setOnboardingData(data);

    localStorage.setItem('ecosphere_onboarded', 'true');
    localStorage.setItem('ecosphere_baseline', calculatedBaseline.toString());
    localStorage.setItem('ecosphere_onboarding_data', JSON.stringify(data));
  };

  const handleResetOnboarding = () => {
    localStorage.removeItem('ecosphere_onboarded');
    localStorage.removeItem('ecosphere_baseline');
    localStorage.removeItem('ecosphere_onboarding_data');
    localStorage.removeItem('ecosphere_logs');
    localStorage.removeItem('ecosphere_commitments');
    localStorage.removeItem('ecosphere_badges');

    setOnboarded(false);
    setBaseline(0);
    setOnboardingData(null);
  };

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
