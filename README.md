# EcoSphere: Individual Carbon Ledger & Mitigation Advisor

EcoSphere is a premium, high-fidelity carbon footprint tracking, visualization, and reduction recommendation system designed to empower individuals to quantify and mitigate their carbon output. This project is structured as a client-side serverless application matching the **Google Antigravity UI theme**—utilizing cybernetic grids, quantum cyan/indigo status states, and monospace technical readouts.

---

## 🌍 Abstract & Problem Statement
Individual emissions account for over 60% of global greenhouse gas (GHG) outputs. Climate action requires shifting from abstract global parameters to personal, quantifiable metrics. EcoSphere solves this by providing:
1. **Calibration:** An interactive onboarding wizard establishing a personalized annual carbon baseline.
2. **Quantification:** A transactional carbon ledger recording daily travel, power, food, and waste variables.
3. **Simulation:** An offset laboratory simulating ecological investments (reforestation, community solar, wind) to reach net-zero neutrality.
4. **Mitigation:** An advisor mapping custom reduction targets to projected annual carbon and monetary savings.

---

## 🛠️ Technical Stack
* **Framework:** Next.js (App Router, React 19)
* **Language:** TypeScript (Strict type safety)
* **Styling:** Tailwind CSS (Custom Antigravity gridlines, neon glows, and glassmorphic panels)
* **Data Visualization:** Recharts (Dynamic client-side category distribution graphs)
* **State Management:** LocalStorage API (Ensuring fully persistent client state for zero-cost serverless deployment)
* **Icons:** Lucide React

---

## 📊 Scientific Methodology & Calculation Factors
Emissions are calculated as **kilograms of carbon dioxide equivalent ($CO_2e$)** using standardized coefficients derived from average EPA (Environmental Protection Agency) and DEFRA (UK Department for Environment, Food & Rural Affairs) conversion parameters:

### 1. Transportation ($CO_2e$ per km)
* **Petrol Vehicle:** $0.18$ kg/km
* **Diesel Vehicle:** $0.17$ kg/km
* **Hybrid Vehicle:** $0.10$ kg/km
* **Electric Vehicle (EV):** $0.05$ kg/km (accounting for grid transmission generation)
* **Public Transit:** $0.04$ kg/km
* **Short-Haul Flights:** $0.15$ kg/km (higher radiative forcing index)
* **Long-Haul Flights:** $0.11$ kg/km

### 2. Domestic Energy ($CO_2e$ per kWh)
* **Coal/Gas Power Grid:** $0.38$ kg/kWh
* **Hybrid Grid Mix:** $0.19$ kg/kWh
* **100% Renewable Solar:** $0.02$ kg/kWh (manufacturing lifecycle offset)

### 3. Nutritional Intake ($CO_2e$ per meal)
* **Plant-Based (Vegan):** $0.60$ kg/meal
* **Vegetarian:** $1.20$ kg/meal
* **Flexitarian (Occasional meat):** $2.10$ kg/meal
* **High-Meat Diet:** $4.50$ kg/meal

### 4. Waste Disposal ($CO_2e$ per standard bag)
* **Landfill Waste:** $2.50$ kg/bag
* **Diverted/Recycled Waste:** $0.50$ kg/bag

---

## ⚙️ Key Functional Features

### 1. Pre-saved Commute Routes (One-Click Logger)
Users can pre-configure their daily travels (e.g. office commutes, school runs) with set distances and modes, allowing them to record daily commutes directly onto the transaction ledger with a single click.

### 2. Dynamic Target Ceiling Adjuster
Instead of using static global limits, users can customize their monthly emissions budget (from 100 kg to 600 kg). The system automatically evaluates performance against this custom budget ceiling.

### 3. Ledger Export Utility
All logged carbon outputs can be exported client-side as a standard formatted CSV file, allowing users to save, share, or run external data analysis on their environmental footprint history.

### 4. Gamified Milestones & Streak Tracking
* **Consecutive Streaks:** Tracks active logging habits.
* **Performance Grades:** Outputs a performance letter grade (A+ through F) based on current emissions relative to the user's custom ceiling.
* **Achievement Badges:** Unlocks credentials (e.g., *Net-Zero Hero*, *Eco Commuter*) once specific roadmap criteria are achieved.

---

## 📂 Codebase Architecture
```
g:/sai/
├── src/
│   ├── app/
│   │   ├── globals.css      # Custom Antigravity grid style rules and animation pulses
│   │   ├── layout.tsx       # Root layout injecting fonts and metadata
│   │   └── page.tsx         # Gateway route allocating Onboarding or Dashboard
│   ├── components/
│   │   ├── Dashboard.tsx          # Central control cabin, charts, and routes manager
│   │   ├── OnboardingWizard.tsx   # Baseline calculator questionnaire
│   │   ├── LogEmissionModal.tsx   # Multi-tab transactional logger
│   │   ├── OffsetSimulator.tsx    # Offset sliders for tree, wind, and solar projects
│   │   ├── EcoJourneyRoadmap.tsx  # Gamified milestones timeline
│   │   └── InsightsAdvisor.tsx    # Dynamic saving checklists
│   └── lib/
│       └── ecoStore.ts            # Mathematical rules, interfaces, and CSV exporter
├── package.json
└── tsconfig.json
```

---

## 🚀 Execution & Deployment

### Run Locally
To spin up the local development environment:
1. Install dependencies:
   ```bash
   npm install
   ```
2. Launch the developer server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build and Compile
Verify the static generation build:
```bash
npm run build
```

### Deploy to Vercel
1. Push your local directory to a GitHub repository.
2. Go to the [Vercel Dashboard](https://vercel.com/new).
3. Import the repository and click **Deploy**. Vercel detects the Next.js setup automatically and deploys the application.
