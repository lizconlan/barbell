import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PlateResult } from './PlateResult';
import type { CalculationResult } from '../types';

describe('PlateResult', () => {
  it('shows no-plates message for barbell when result is empty', () => {
    const result: CalculationResult = { plates: [], totalWeight: 20, remainder: 0 };
    render(<PlateResult result={result} barWeight={20} unit="kg" isDumbbell={false} />);
    expect(screen.getByText(/Just the bar — no plates needed/)).toBeTruthy();
  });

  it('shows no-plates message with "handle" for dumbbell', () => {
    const result: CalculationResult = { plates: [], totalWeight: 0.5, remainder: 0 };
    render(<PlateResult result={result} barWeight={0.5} unit="kg" isDumbbell={true} />);
    expect(screen.getByText(/Just the handle — no plates needed/)).toBeTruthy();
  });

  it('renders plate summary list', () => {
    const result: CalculationResult = {
      plates: [
        { weight: 25, count: 1 },
        { weight: 15, count: 1 },
      ],
      totalWeight: 100,
      remainder: 0,
    };
    render(<PlateResult result={result} barWeight={20} unit="kg" isDumbbell={false} />);
    expect(screen.getByText('1 × 25 kg')).toBeTruthy();
    expect(screen.getByText('1 × 15 kg')).toBeTruthy();
  });

  it('displays total weight', () => {
    const result: CalculationResult = {
      plates: [{ weight: 20, count: 1 }],
      totalWeight: 60,
      remainder: 0,
    };
    render(<PlateResult result={result} barWeight={20} unit="kg" isDumbbell={false} />);
    expect(screen.getByText('60 kg')).toBeTruthy();
  });

  it('shows remainder warning when remainder > 0', () => {
    const result: CalculationResult = {
      plates: [{ weight: 20, count: 1 }],
      totalWeight: 60,
      remainder: 1,
    };
    render(<PlateResult result={result} barWeight={20} unit="kg" isDumbbell={false} />);
    expect(screen.getByText(/Cannot reach exact target/)).toBeTruthy();
    expect(screen.getByText(/1 kg short/)).toBeTruthy();
  });

  it('does not show remainder warning when remainder is 0', () => {
    const result: CalculationResult = {
      plates: [{ weight: 20, count: 1 }],
      totalWeight: 60,
      remainder: 0,
    };
    render(<PlateResult result={result} barWeight={20} unit="kg" isDumbbell={false} />);
    expect(screen.queryByText(/Cannot reach exact target/)).toBeNull();
  });

  it('shows "per dumbbell" note when isDumbbell is true', () => {
    const result: CalculationResult = {
      plates: [{ weight: 5, count: 1 }],
      totalWeight: 10.5,
      remainder: 0,
    };
    render(<PlateResult result={result} barWeight={0.5} unit="kg" isDumbbell={true} />);
    expect(screen.getByText('(per dumbbell)')).toBeTruthy();
  });

  it('does not show "per dumbbell" note for barbell', () => {
    const result: CalculationResult = {
      plates: [{ weight: 20, count: 1 }],
      totalWeight: 60,
      remainder: 0,
    };
    render(<PlateResult result={result} barWeight={20} unit="kg" isDumbbell={false} />);
    expect(screen.queryByText('(per dumbbell)')).toBeNull();
  });
});
