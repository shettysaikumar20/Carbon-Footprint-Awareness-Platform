export interface OnboardingData {
  username: string;
  country: 'in' | 'us' | 'de' | 'fr' | 'no';
  avatarColor: string; // e.g. '#06b6d4' (cyan) or '#6366f1' (indigo)
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

// Regional Grid Coefficients (kg CO2e per kWh)
export const COUNTRY_GRID_FACTORS = {
  in: 0.70, // India: Coal-reliant grid
  us: 0.38, // USA: Mixed natural gas/coal grid
  de: 0.35, // Germany: Wind/Coal transitional grid
  fr: 0.05, // France: Nuclear clean grid
  no: 0.01, // Norway: Scandanavian hydropower clean grid
};

export const EMISSION_FACTORS = {
  // Transport (per km)
  transport: {
    petrol: 0.18,
    diesel: 0.17,
    hybrid: 0.10,
    electric: 0.05,
    public: 0.04,
    flight_short: 0.15,
    flight_long: 0.11,
  },
  // Base Energy Factor multipliers
  energy: {
    grid: 1.0, // multiplier for Country Grid factor
    hybrid: 0.5,
    solar: 0.05,
  },
  // Food (per meal)
  food: {
    vegan: 0.6,
    vegetarian: 1.2,
    flexitarian: 2.1,
    'meat-heavy': 4.5,
  },
  // Waste (per standard trash bag)
  waste: {
    standard: 2.5,
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
  // Resolve regional grid coefficient
  const gridIntensity = COUNTRY_GRID_FACTORS[data.country || 'us'];
  const monthlyKwh = data.houseSize * 0.8;
  const energyFactor = EMISSION_FACTORS.energy[data.energySource] * gridIntensity;
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

// Localized Climate AI Agent Heuristics compiler
export function compileAIResponse(query: string, data: OnboardingData, logs: LogEntry[]): string {
  const q = query.toLowerCase();
  
  // Calculate stats
  const totalLogsEmission = logs.reduce((acc, l) => acc + l.emission, 0);
  const transportLogs = logs.filter(l => l.category === 'transport');
  const energyLogs = logs.filter(l => l.category === 'energy');
  const foodLogs = logs.filter(l => l.category === 'food');
  
  const countryName = data.country === 'in' ? 'India' :
                      data.country === 'us' ? 'United States' :
                      data.country === 'de' ? 'Germany' :
                      data.country === 'fr' ? 'France' : 'Norway';

  let header = `[ECOSPHERE_AI_AGENT // CONSULTATION_REPORT]\n`;
  header += `OPERATOR: ${data.username.toUpperCase()} // LOC: ${data.country.toUpperCase()} (${countryName})\n`;
  header += `DIAGNOSTIC STATUS: ACTIVE\n`;
  header += `--------------------------------------------------------\n\n`;

  if (q.includes('transport') || q.includes('commute') || q.includes('car') || q.includes('flight')) {
    const transitBaseline = Math.round(data.weeklyDistance * 4 * (data.vehicleType === 'none' ? 0 : EMISSION_FACTORS.transport[data.vehicleType]));
    return header + 
      `[AI_TRANSIT_DIAGNOSTIC]:\n` +
      `* Your transport profile baseline registers at ~${transitBaseline} kg CO2e/month.\n` +
      `* Your vehicle configuration is set to: [${data.vehicleType.toUpperCase()}].\n` +
      `* Yearly flight metrics: [${data.flights} round trips].\n\n` +
      `[AI_REDUCTION_PLAN]:\n` +
      `1. Since you commute ${data.weeklyDistance} km/week, swapping just 2 commutes to public transit (${EMISSION_FACTORS.transport.public} kg/km) or active riding will trim your footprint indices by ~${Math.round(data.weeklyDistance * 0.15)} kg/month.\n` +
      `2. Aviation offsets: Each short-haul flight adds ~300 kg CO2e. Consolidate travel plans or invest in wind power offsets during flights.`;
  }

  if (q.includes('energy') || q.includes('electricity') || q.includes('power') || q.includes('grid')) {
    const gridVal = COUNTRY_GRID_FACTORS[data.country];
    return header + 
      `[AI_POWER_DIAGNOSTIC]:\n` +
      `* Your grid coefficient for ${countryName} is [${gridVal} kg/kWh].\n` +
      `* Household size parameters: [${data.houseSize} SQFT].\n` +
      `* Energy configuration model: [${data.energySource.toUpperCase()}].\n\n` +
      `[AI_GRID_OPTIMIZATIONS]:\n` +
      `1. ${data.country === 'in' ? 'India\'s coal grid intensity makes power conservation high-priority.' : 'Optimize your electricity feeds.'}\n` +
      `2. Washing clothes on cold cycles reduces thermal element utility by 90%. Saving: ~5 kg CO2e/month.\n` +
      `3. Swapping standard bulbs to LEDs offers an immediate 80% grid drop.`;
  }

  if (q.includes('food') || q.includes('diet') || q.includes('meat') || q.includes('vegan')) {
    return header + 
      `[AI_DIETARY_DIAGNOSTIC]:\n` +
      `* Selected diet intensity: [${data.diet.toUpperCase()}].\n` +
      `* Standard diet coefficient: ~${EMISSION_FACTORS.food[data.diet]} kg CO2e per meal.\n\n` +
      `[AI_DIETARY_MITIGATION]:\n` +
      `1. Swapping from ${data.diet} to vegetarian or vegan meals just twice a week diverts ~30-50 kg CO2e/month.\n` +
      `2. Meat-heavy diets are land-intensive. Prioritize plant protein streams to decrease industrial methane output.`;
  }

  if (q.includes('predict') || q.includes('forecast') || q.includes('future') || q.includes('projection')) {
    const yearlyBaseline = calculateBaseline(data) * 12;
    return header + 
      `[AI_FORECAST_SIMULATION]:\n` +
      `* 5-Year Cumulative Output (Business As Usual): ~${(yearlyBaseline * 5).toLocaleString()} kg CO2e.\n` +
      `* 5-Year Cumulative Output (Target Ceiling Path): ~${((calculateBaseline(data) * 0.7) * 12 * 5).toLocaleString()} kg CO2e.\n\n` +
      `[AI_DECISION_MATRIX]:\n` +
      `* Implementing active mitigation commitments today diverts up to ${(yearlyBaseline * 0.3 * 5).toLocaleString()} kg CO2e over the forecast period, avoiding localized climate degradation.`;
  }

  // Default diagnostic report
  const baseline = calculateBaseline(data);
  return header + 
    `[SYSTEM_DIAGNOSTIC_SUMMARY]:\n` +
    `* Calculated Baseline: ${baseline} kg CO2e/mo.\n` +
    `* Active logs logged: ${logs.length} logged entries.\n` +
    `* Total ledger emissions: ${totalLogsEmission} kg CO2e.\n\n` +
    `[RECOMMENDED_QUERY]:\n` +
    `Query parameters detected: NULL. Try typing "transport", "energy", "diet", or "predict" in the terminal input to get specialized AI carbon reports.`;
}
