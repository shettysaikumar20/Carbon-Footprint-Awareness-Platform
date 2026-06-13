import { describe, it, expect } from 'vitest';
import { calculateBaseline, exportToCSV, compileAIResponse, OnboardingData, LogEntry } from './ecoStore';

describe('EcoSphere Carbon Calculations', () => {
  it('should calculate correct baseline footprint', () => {
    const mockData: OnboardingData = {
      username: 'TestOperator',
      country: 'us',
      avatarColor: '#06b6d4',
      houseSize: 1500,
      energySource: 'grid',
      vehicleType: 'petrol',
      weeklyDistance: 150,
      diet: 'flexitarian',
      flights: 2,
    };

    const baseline = calculateBaseline(mockData);
    expect(baseline).toBeGreaterThan(0);
    expect(typeof baseline).toBe('number');
  });

  it('should format logs correctly to CSV format', () => {
    const mockLogs: LogEntry[] = [
      { id: '1', date: 'Jun 10, 2026', category: 'transport', details: '10 km drive', emission: 2 }
    ];

    const csv = exportToCSV(mockLogs);
    expect(csv).toContain('ID,Date,Category,Details');
    expect(csv).toContain('transport');
    expect(csv).toContain('"10 km drive"');
  });

  it('should compile appropriate AI diagnostic responses', () => {
    const mockData: OnboardingData = {
      username: 'TestOperator',
      country: 'us',
      avatarColor: '#06b6d4',
      houseSize: 1500,
      energySource: 'grid',
      vehicleType: 'petrol',
      weeklyDistance: 150,
      diet: 'flexitarian',
      flights: 2,
    };

    const mockLogs: LogEntry[] = [];

    const response = compileAIResponse('transport query test', mockData, mockLogs);
    expect(response).toContain('OPERATOR: TESTOPERATOR');
    expect(response).toContain('AI_TRANSIT_DIAGNOSTIC');
  });
});
