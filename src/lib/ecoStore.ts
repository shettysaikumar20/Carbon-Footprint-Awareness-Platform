export interface OnboardingData {
  houseSize: number; // sqft
  energySource: 'grid' | 'hybrid' | 'solar';
  vehicleType: 'petrol' | 'diesel' | 'hybrid' | 'electric' | 'none';
  weeklyDistance: number; // km
  diet: 'vegan' | 'vegetarian' | 'flexitarian' | 'meat-heavy';
  flights: number; // per year
}

export interface LogEntry {
  id: string;
  date: string;
  category: 'transport' | 'energy' | 'food' | 'waste';
  details: string;
  emission: number; // kg CO2e
}

export interface Commitment {
  id: string;
  title: string;
  description: string;
  category: string;
  carbonSaving: number; // kg CO2e per year
  costSaving: number; // USD per year
  active: boolean;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  requirement: string;
}

export interface SavedRoute {
  id: string;
  label: string;
  distance: number;
  mode: keyof typeof EMISSION_FACTORS.transport;
}

// Standard Carbon Coefficients (kg CO2e)
export const EMISSION_FACTORS = {
  // Transport (per km)
  transport: {
    petrol: 0.18,
    diesel: 0.17,
    hybrid: 0.10,
    electric: 0.05,
    public: 0.04,
    flight_short: 0.15, // per passenger km
    flight_long: 0.11, // per passenger km
  },
  // Energy
  energy: {
    grid: 0.38, // kg CO2e per kWh
    hybrid: 0.19,
    solar: 0.02,
  },
  // Food (per meal)
  food: {
    vegan: 0.6,
    vegetarian: 1.2,
    flexitarian: 2.1,
    'meat-heavy': 4.5,
  },
  // Waste (per standard trash bag / week equivalent)
  waste: {
    standard: 2.5, // kg CO2e
    recycled: 0.5,
  }
};

export const INITIAL_COMMITMENTS: Commitment[] = [
  {
    id: 'c1',
    title: 'Meatless Mondays',
    description: 'Switch to a plant-based diet one day a week.',
    category: 'food',
    carbonSaving: 150,
    costSaving: 120,
    active: false,
  },
  {
    id: 'c2',
    title: 'Switch to LED Lighting',
    description: 'Replace standard incandescent bulbs with energy-efficient LEDs.',
    category: 'energy',
    carbonSaving: 80,
    costSaving: 45,
    active: false,
  },
  {
    id: 'c3',
    title: 'Carpool or Public Transit',
    description: 'Commit to commuting via public transit or carpool twice a week.',
    category: 'transport',
    carbonSaving: 480,
    costSaving: 200,
    active: false,
  },
  {
    id: 'c4',
    title: 'Active Commuting (Walk/Bike)',
    description: 'Walk or bike for short trips under 3 km.',
    category: 'transport',
    carbonSaving: 220,
    costSaving: 90,
    active: false,
  },
  {
    id: 'c5',
    title: 'Cold Wash Laundry',
    description: 'Wash clothes on cold cycle to reduce water heating energy.',
    category: 'energy',
    carbonSaving: 60,
    costSaving: 30,
    active: false,
  },
  {
    id: 'c6',
    title: 'Compost Organics',
    description: 'Divert organic waste from landfills to reduce methane output.',
    category: 'waste',
    carbonSaving: 110,
    costSaving: 15,
    active: false,
  }
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'b1',
    title: 'Green Explorer',
    description: 'Complete the initial onboarding process.',
    icon: 'Compass',
    unlocked: false,
    requirement: 'Complete Onboarding',
  },
  {
    id: 'b2',
    title: 'Eco Commuter',
    description: 'Log 3 transportation activities that are low-emission (public transit, biking, walking).',
    icon: 'Zap',
    unlocked: false,
    requirement: 'Log 3 Low-Carbon Commutes',
  },
  {
    id: 'b3',
    title: 'Climate Champion',
    description: 'Commit to 3 or more energy-saving actions.',
    icon: 'Award',
    unlocked: false,
    requirement: 'Commit to 3 actions',
  },
  {
    id: 'b4',
    title: 'Net-Zero Hero',
    description: 'Fully offset your footprint using the Simulator.',
    icon: 'ShieldAlert',
    unlocked: false,
    requirement: 'Reach Net-Zero Offset state',
  },
  {
    id: 'b5',
    title: 'Zero-Waste Pioneer',
    description: 'Log a waste-diversion activity in the tracker.',
    icon: 'Leaf',
    unlocked: false,
    requirement: 'Log a waste entry',
  }
];

// Calculates baseline monthly emissions in kg CO2e
export function calculateBaseline(data: OnboardingData): number {
  const monthlyKwh = data.houseSize * 0.8;
  const energyFactor = EMISSION_FACTORS.energy[data.energySource];
  const energyCarbon = monthlyKwh * energyFactor;

  const vehicleFactor = data.vehicleType === 'none' ? 0 : EMISSION_FACTORS.transport[data.vehicleType];
  const transportCarbon = data.weeklyDistance * 4 * vehicleFactor;

  const flightDistanceYearly = data.flights * 2000;
  const flightCarbonMonthly = (flightDistanceYearly * EMISSION_FACTORS.transport.flight_short) / 12;

  const dietCarbon = 30 * 3 * EMISSION_FACTORS.food[data.diet];

  const wasteCarbon = 4 * EMISSION_FACTORS.waste.standard;

  return Math.round(energyCarbon + transportCarbon + flightCarbonMonthly + dietCarbon + wasteCarbon);
}

// Convert log ledger array to standard CSV text
export function exportToCSV(logs: LogEntry[]): string {
  const headers = ['ID', 'Date', 'Category', 'Details', 'Carbon Emission (kg CO2e)'];
  const rows = logs.map((log) => [
    log.id,
    `"${log.date}"`,
    log.category,
    `"${log.details.replace(/"/g, '""')}"`,
    log.emission,
  ]);

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
}
