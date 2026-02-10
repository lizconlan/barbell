import { describe, it, expect } from 'vitest';
import { calculatePlates } from './calculator';
import type { PlateDefinition } from '../types';

const standardPlates: PlateDefinition[] = [
  { weight: 25, quantity: 2 },
  { weight: 20, quantity: 2 },
  { weight: 15, quantity: 2 },
  { weight: 10, quantity: 2 },
  { weight: 5, quantity: 2 },
  { weight: 2.5, quantity: 2 },
];

describe('calculatePlates', () => {
  it('returns empty plates when target equals bar weight', () => {
    const result = calculatePlates(20, 20, standardPlates, 2);
    expect(result.plates).toEqual([]);
    expect(result.totalWeight).toBe(20);
    expect(result.remainder).toBe(0);
  });

  it('returns empty plates when target is less than bar weight', () => {
    const result = calculatePlates(10, 20, standardPlates, 2);
    expect(result.plates).toEqual([]);
    expect(result.totalWeight).toBe(20);
    expect(result.remainder).toBe(0);
  });

  it('calculates a simple load (60kg on 20kg bar)', () => {
    const result = calculatePlates(60, 20, standardPlates, 2);
    // 40kg to load, 20kg per side → 1×20 per side
    expect(result.plates).toEqual([{ weight: 20, count: 1 }]);
    expect(result.totalWeight).toBe(60);
    expect(result.remainder).toBe(0);
  });

  it('calculates a mixed plate load (100kg on 20kg bar)', () => {
    const result = calculatePlates(100, 20, standardPlates, 2);
    // 80kg to load, 40kg per side → 25+15 per side
    expect(result.plates).toEqual([
      { weight: 25, count: 1 },
      { weight: 15, count: 1 },
    ]);
    expect(result.totalWeight).toBe(100);
    expect(result.remainder).toBe(0);
  });

  it('uses multiple plates of the same weight', () => {
    const result = calculatePlates(120, 20, standardPlates, 2);
    // 100kg to load, 50kg per side → 25+25 per side
    expect(result.plates).toEqual([{ weight: 25, count: 2 }]);
    expect(result.totalWeight).toBe(120);
    expect(result.remainder).toBe(0);
  });

  it('handles remainder when exact weight is impossible', () => {
    const result = calculatePlates(61, 20, standardPlates, 2);
    // 41kg to load, 20.5kg per side → 20+0 (can't do 0.5), loads 20 per side = 60kg total
    expect(result.totalWeight).toBe(60);
    expect(result.remainder).toBe(1);
  });

  it('respects plate quantity limits', () => {
    const limitedPlates: PlateDefinition[] = [
      { weight: 20, quantity: 1 },
      { weight: 10, quantity: 1 },
    ];
    const result = calculatePlates(80, 20, limitedPlates, 2);
    // 60kg to load, 30 per side, but only 1×20 + 1×10 = 30 per side
    expect(result.plates).toEqual([
      { weight: 20, count: 1 },
      { weight: 10, count: 1 },
    ]);
    expect(result.totalWeight).toBe(80);
    expect(result.remainder).toBe(0);
  });

  it('skips plates with zero quantity', () => {
    const plates: PlateDefinition[] = [
      { weight: 20, quantity: 0 },
      { weight: 10, quantity: 2 },
    ];
    const result = calculatePlates(40, 0, plates, 2);
    expect(result.plates).toEqual([{ weight: 10, count: 2 }]);
    expect(result.totalWeight).toBe(40);
  });

  it('skips plates with zero weight', () => {
    const plates: PlateDefinition[] = [
      { weight: 0, quantity: 5 },
      { weight: 10, quantity: 2 },
    ];
    const result = calculatePlates(40, 0, plates, 2);
    expect(result.plates).toEqual([{ weight: 10, count: 2 }]);
    expect(result.totalWeight).toBe(40);
  });

  it('works with 1 side (e.g. machine-style loading)', () => {
    const plates: PlateDefinition[] = [{ weight: 10, quantity: 5 }];
    const result = calculatePlates(30, 0, plates, 1);
    expect(result.plates).toEqual([{ weight: 10, count: 3 }]);
    expect(result.totalWeight).toBe(30);
    expect(result.remainder).toBe(0);
  });

  it('handles dumbbell-style plates (small weights)', () => {
    const dumbbellPlates: PlateDefinition[] = [
      { weight: 10, quantity: 4 },
      { weight: 5, quantity: 4 },
      { weight: 2.5, quantity: 4 },
      { weight: 1.25, quantity: 4 },
      { weight: 1, quantity: 4 },
      { weight: 0.5, quantity: 4 },
    ];
    const result = calculatePlates(10.5, 0.5, dumbbellPlates, 2);
    // 10kg to load, 5kg per side → 5
    expect(result.plates).toEqual([{ weight: 5, count: 1 }]);
    expect(result.totalWeight).toBe(10.5);
    expect(result.remainder).toBe(0);
  });

  it('handles unsorted plate input', () => {
    const unsorted: PlateDefinition[] = [
      { weight: 5, quantity: 2 },
      { weight: 25, quantity: 2 },
      { weight: 10, quantity: 2 },
    ];
    const result = calculatePlates(90, 20, unsorted, 2);
    // 70kg to load, 35 per side → 25+10
    expect(result.plates).toEqual([
      { weight: 25, count: 1 },
      { weight: 10, count: 1 },
    ]);
    expect(result.totalWeight).toBe(90);
    expect(result.remainder).toBe(0);
  });

  it('handles a heavy max load', () => {
    const result = calculatePlates(220, 20, standardPlates, 2);
    // 200kg to load, 100 per side → 25×2 + 20×2 + 10×1
    expect(result.plates).toEqual([
      { weight: 25, count: 2 },
      { weight: 20, count: 2 },
      { weight: 10, count: 1 },
    ]);
    expect(result.totalWeight).toBe(220);
    expect(result.remainder).toBe(0);
  });

  it('returns remainder when plates run out', () => {
    const smallInventory: PlateDefinition[] = [{ weight: 10, quantity: 1 }];
    const result = calculatePlates(50, 0, smallInventory, 2);
    // 50kg to load, 25 per side, only 1×10 = 10 per side → total 20
    expect(result.totalWeight).toBe(20);
    expect(result.remainder).toBe(30);
  });

  it('does not mutate the input plates array', () => {
    const plates: PlateDefinition[] = [
      { weight: 20, quantity: 2 },
      { weight: 10, quantity: 2 },
    ];
    const original = JSON.parse(JSON.stringify(plates));
    calculatePlates(60, 0, plates, 2);
    expect(plates).toEqual(original);
  });
});
