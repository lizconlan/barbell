# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — production build (outputs to `dist/`)
- `npx tsc --noEmit` — type-check without emitting
- `npm test` — run all tests (Vitest)
- `npx vitest run src/utils/calculator.test.ts` — run a single test file

## Architecture

React + TypeScript app (Vite) for calculating barbell/dumbbell plate loading.

- **`src/types.ts`** — shared types, equipment definitions, default plate inventories. All plate weights are stored in kg internally; lb conversion uses `KG_TO_LB`.
- **`src/utils/calculator.ts`** — greedy plate-loading algorithm. Takes target weight, bar weight, available plates, and number of sides. Both barbells and dumbbells use 2 sides (plates on both ends). Returns plates per side plus any remainder.
- **`src/utils/storage.ts`** — localStorage persistence for plate configs, custom bar weight, and dumbbell handle weight.
- **`src/App.tsx`** — main state management. Converts lb inputs to kg before passing to calculator.
- **Components** (`src/components/`): `WeightInput` (target + unit toggle), `EquipmentSelector` (bar type picker + custom/handle weight inputs), `PlateConfig` (editable plate inventory), `PlateResult` (summary + visual), `PlateBar` (horizontal bar diagram with colored plates).

## Key conventions

- Plate weights are always stored and calculated in kg. Conversion to lb happens only at the display layer.
- Equipment types are defined in `EQUIPMENT_TYPES` array in `types.ts`. Add new bar types there.
- Barbell plates and dumbbell plates have separate inventories and localStorage keys.
- Both barbells and dumbbells load plates on both ends (2 sides). The visual diagram reflects this symmetrically.
- TypeScript uses `verbatimModuleSyntax` — type-only imports must use the `type` keyword (e.g., `import type { Unit }` or `import { type Unit, KG_TO_LB }`).
