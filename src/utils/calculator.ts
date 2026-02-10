import type { PlateDefinition, CalculationResult } from '../types';

export function calculatePlates(
  targetWeight: number,
  barWeight: number,
  availablePlates: PlateDefinition[],
  sides: 1 | 2,
): CalculationResult {
  const weightToLoad = targetWeight - barWeight;
  if (weightToLoad <= 0) {
    return { plates: [], totalWeight: barWeight, remainder: 0 };
  }

  let perSide = weightToLoad / sides;
  const sorted = [...availablePlates].sort((a, b) => b.weight - a.weight);

  const selected: { weight: number; count: number }[] = [];

  for (const plate of sorted) {
    if (plate.quantity <= 0 || plate.weight <= 0) continue;
    const maxByWeight = Math.floor(perSide / plate.weight);
    const count = Math.min(maxByWeight, plate.quantity);
    if (count > 0) {
      selected.push({ weight: plate.weight, count });
      perSide -= plate.weight * count;
      // Round to avoid floating point drift
      perSide = Math.round(perSide * 1000) / 1000;
    }
  }

  const loadedPerSide = selected.reduce((sum, p) => sum + p.weight * p.count, 0);
  const totalWeight = barWeight + loadedPerSide * sides;
  const remainder = Math.round((targetWeight - totalWeight) * 1000) / 1000;

  return { plates: selected, totalWeight, remainder };
}
