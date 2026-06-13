import { describe, it, expect } from 'vitest';
import {
  calculateBaseline,
  exportToCSV,
  compileAIResponse,
  OnboardingData,
  LogEntry
} from './ecoStore';

describe('EcoSphere Carbon Calculations & Utilities', () => {
  describe('calculateBaseline', () => {
    it('should calculate baseline for a standard US operator with typical options', () => {
      const mockData: OnboardingData = {
        username: 'EcoOperator',
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
      
      // Calculate manually to verify
      const monthlyKwh = 1500 * 0.8; // 1200
      const energyFactor = 1.0 * 0.38; // 0.38
      const energyCarbon = monthlyKwh * energyFactor; // 456
      const transportCarbon = 150 * 4 * 0.18; // 108
      const flightCarbonMonthly = (2 * 2000 * 0.15) / 12; // 50
      const dietCarbon = 30 * 3 * 2.1; // 189
      const wasteCarbon = 4 * 2.5; // 10
      const expected = Math.round(energyCarbon + transportCarbon + flightCarbonMonthly + dietCarbon + wasteCarbon); // 456 + 108 + 50 + 189 + 10 = 813

      expect(baseline).toBe(expected);
    });

    it('should calculate lower baseline for Norway with solar energy and vegan diet', () => {
      const mockData: OnboardingData = {
        username: 'CleanOperator',
        country: 'no',
        avatarColor: '#6366f1',
        houseSize: 1000,
        energySource: 'solar',
        vehicleType: 'none',
        weeklyDistance: 0,
        diet: 'vegan',
        flights: 0,
      };

      const baseline = calculateBaseline(mockData);
      expect(baseline).toBeGreaterThan(0);

      // Verify Norway grid and solar is extremely low
      const monthlyKwh = 1000 * 0.8; // 800
      const energyFactor = 0.05 * 0.01; // 0.0005
      const energyCarbon = monthlyKwh * energyFactor; // 0.4
      const transportCarbon = 0;
      const flightCarbonMonthly = 0;
      const dietCarbon = 30 * 3 * 0.6; // 54
      const wasteCarbon = 4 * 2.5; // 10
      const expected = Math.round(energyCarbon + transportCarbon + flightCarbonMonthly + dietCarbon + wasteCarbon); // 0.4 + 54 + 10 = 64

      expect(baseline).toBe(expected);
    });

    it('should calculate higher baseline for India with coal grid and meat-heavy diet', () => {
      const mockData: OnboardingData = {
        username: 'HeavyOperator',
        country: 'in',
        avatarColor: '#a855f7',
        houseSize: 2500,
        energySource: 'grid',
        vehicleType: 'diesel',
        weeklyDistance: 300,
        diet: 'meat-heavy',
        flights: 5,
      };

      const baseline = calculateBaseline(mockData);
      expect(baseline).toBe(2144); // Pre-calculated matching the formula
    });
  });

  describe('exportToCSV', () => {
    it('should format empty logs list safely', () => {
      const csv = exportToCSV([]);
      expect(csv).toBe('ID,Date,Category,Details,Carbon Emission (kg CO2e)');
    });

    it('should format multiple logs and escape double quotes in details', () => {
      const mockLogs: LogEntry[] = [
        { id: '1', date: 'Jun 10, 2026', category: 'transport', details: 'Drove "Tesla"', emission: 5 },
        { id: '2', date: 'Jun 11, 2026', category: 'food', details: 'Beef hamburger meal', emission: 12 },
      ];

      const csv = exportToCSV(mockLogs);
      expect(csv).toContain('1,"Jun 10, 2026",transport,"Drove ""Tesla""",5');
      expect(csv).toContain('2,"Jun 11, 2026",food,"Beef hamburger meal",12');
    });
  });

  describe('compileAIResponse Heuristics', () => {
    const mockData: OnboardingData = {
      username: 'EcoOperator',
      country: 'us',
      avatarColor: '#06b6d4',
      houseSize: 1500,
      energySource: 'grid',
      vehicleType: 'petrol',
      weeklyDistance: 150,
      diet: 'flexitarian',
      flights: 2,
    };
    const mockLogs: LogEntry[] = [
      { id: 'l1', date: 'Jun 12, 2026', category: 'transport', details: 'Daily transit', emission: 15 }
    ];

    it('should return transit diagnostic when query contains transit words', () => {
      const query = 'I want to optimize my transport footprint';
      const response = compileAIResponse(query, mockData, mockLogs);
      expect(response).toContain('[AI_TRANSIT_DIAGNOSTIC]');
      expect(response).toContain('commute 150 km/week');
    });

    it('should return power grid diagnostic when query contains energy words', () => {
      const query = 'How to save electricity power?';
      const response = compileAIResponse(query, mockData, mockLogs);
      expect(response).toContain('[AI_POWER_DIAGNOSTIC]');
      expect(response).toContain('0.38 kg/kWh');
    });

    it('should return dietary diagnostic when query contains food words', () => {
      const query = 'Tell me about diet impact';
      const response = compileAIResponse(query, mockData, mockLogs);
      expect(response).toContain('[AI_DIETARY_DIAGNOSTIC]');
      expect(response).toContain('FLEXITARIAN');
    });

    it('should return projection forecast when query contains forecast words', () => {
      const query = 'what is the future prediction';
      const response = compileAIResponse(query, mockData, mockLogs);
      expect(response).toContain('[AI_FORECAST_SIMULATION]');
      expect(response).toContain('5-Year Cumulative Output');
    });

    it('should return default summary when query is unrelated', () => {
      const query = 'hello there';
      const response = compileAIResponse(query, mockData, mockLogs);
      expect(response).toContain('[SYSTEM_DIAGNOSTIC_SUMMARY]');
      expect(response).toContain('Active logs logged: 1');
      expect(response).toContain('[RECOMMENDED_QUERY]');
    });
  });
});
