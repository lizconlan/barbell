# Barbell Plate Calculator

A React + TypeScript web app for calculating which weight plates to load on a barbell or dumbbell to reach a target weight.

## Features

- Calculate plate configurations for target weights
- Support for multiple equipment types (Olympic, Women's, EZ Curl, Trap barbells, and dumbbells)
- Custom bar weight support
- Toggle between kilograms (kg) and pounds (lb)
- Customizable plate inventory
- Visual plate bar diagram
- LocalStorage persistence for configurations

## Getting Started

### Install dependencies
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

## Testing

This project has comprehensive test coverage including unit tests, component tests, integration tests, and accessibility tests.

### Run all tests
```bash
npm test
```

### Run tests in watch mode (during development)
```bash
npx vitest
```

### Run a specific test file
```bash
npx vitest run src/utils/calculator.test.ts
```

### Test Coverage

- **100 total tests** across 9 test files
- **Unit tests**: Calculator logic and localStorage utilities
- **Component tests**: All 5 React components (WeightInput, EquipmentSelector, PlateConfig, PlateResult, PlateBar)
- **Integration tests**: Full app user flows and state management
- **Accessibility tests**: Keyboard navigation, ARIA labels, form controls

## Project Structure

- `src/types.ts` — Type definitions, equipment presets, default plate inventories
- `src/utils/calculator.ts` — Greedy plate-loading algorithm
- `src/utils/storage.ts` — LocalStorage persistence
- `src/App.tsx` — Main app state management
- `src/components/` — React components
  - `WeightInput` — Target weight input and unit toggle
  - `EquipmentSelector` — Bar type picker and custom weight inputs
  - `PlateConfig` — Editable plate inventory
  - `PlateResult` — Calculation results display
  - `PlateBar` — Visual bar diagram with colored plates

## Tech Stack

- React 19
- TypeScript 5.9
- Vite 7.3
- Vitest + Testing Library
- Plain CSS

## How It Works

1. All plate weights are stored and calculated in kg internally
2. Unit conversion to lb happens only at the display layer
3. The greedy algorithm selects the heaviest plates first to reach the target weight
4. Both barbells and dumbbells load plates on both ends (2 sides)
5. User configurations are persisted to localStorage
