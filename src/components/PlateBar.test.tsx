import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PlateBar } from './PlateBar';

describe('PlateBar', () => {
  it('renders bar weight label', () => {
    render(<PlateBar plates={[]} barWeight={20} unit="kg" isDumbbell={false} />);
    expect(screen.getByText('20 kg')).toBeTruthy();
  });

  it('renders left and right bar sides', () => {
    const { container } = render(
      <PlateBar plates={[{ weight: 20, count: 1 }]} barWeight={20} unit="kg" isDumbbell={false} />,
    );
    expect(container.querySelector('.bar-side.left')).toBeTruthy();
    expect(container.querySelector('.bar-side.right')).toBeTruthy();
  });

  it('renders correct number of plate elements (expanded)', () => {
    const { container } = render(
      <PlateBar
        plates={[
          { weight: 25, count: 2 },
          { weight: 10, count: 1 },
        ]}
        barWeight={20}
        unit="kg"
        isDumbbell={false}
      />,
    );
    // 3 plates per side × 2 sides = 6 total plate elements
    const plateElements = container.querySelectorAll('.plate');
    expect(plateElements.length).toBe(6);
  });

  it('displays plate weight labels', () => {
    render(
      <PlateBar plates={[{ weight: 20, count: 1 }]} barWeight={20} unit="kg" isDumbbell={false} />,
    );
    // Weight label appears on both sides
    const labels = screen.getAllByText('20');
    expect(labels.length).toBe(2);
  });

  it('converts weights to lb when unit is lb', () => {
    render(
      <PlateBar plates={[{ weight: 20, count: 1 }]} barWeight={20} unit="lb" isDumbbell={false} />,
    );
    // 20kg * 2.20462 ≈ 44.1
    expect(screen.getAllByText('44.1').length).toBe(2);
  });

  it('renders no plates when plates array is empty', () => {
    const { container } = render(
      <PlateBar plates={[]} barWeight={20} unit="kg" isDumbbell={false} />,
    );
    expect(container.querySelectorAll('.plate').length).toBe(0);
  });
});
