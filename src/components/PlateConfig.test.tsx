import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PlateConfig } from './PlateConfig';
import type { PlateDefinition } from '../types';

describe('PlateConfig', () => {
  const plates: PlateDefinition[] = [
    { weight: 20, quantity: 2 },
    { weight: 10, quantity: 4 },
  ];

  const defaultProps = {
    plates,
    unit: 'kg' as const,
    onChange: vi.fn(),
  };

  it('renders all plates with weights and quantities', () => {
    render(<PlateConfig {...defaultProps} />);
    expect(screen.getByText('20 kg')).toBeTruthy();
    expect(screen.getByText('10 kg')).toBeTruthy();
    expect(screen.getByText('2')).toBeTruthy();
    expect(screen.getByText('4')).toBeTruthy();
  });

  it('shows heading with current unit', () => {
    render(<PlateConfig {...defaultProps} unit="lb" />);
    expect(screen.getByText('Available Plates (lb)')).toBeTruthy();
  });

  it('calls onChange with incremented quantity when + is clicked', () => {
    const onChange = vi.fn();
    render(<PlateConfig {...defaultProps} onChange={onChange} />);
    // Click the first + button (for 20kg plate with qty 2)
    const plusButtons = screen.getAllByText('+');
    fireEvent.click(plusButtons[0]);
    expect(onChange).toHaveBeenCalledWith([
      { weight: 20, quantity: 3 },
      { weight: 10, quantity: 4 },
    ]);
  });

  it('calls onChange with decremented quantity when - is clicked', () => {
    const onChange = vi.fn();
    render(<PlateConfig {...defaultProps} onChange={onChange} />);
    const minusButtons = screen.getAllByText('-');
    fireEvent.click(minusButtons[0]);
    expect(onChange).toHaveBeenCalledWith([
      { weight: 20, quantity: 1 },
      { weight: 10, quantity: 4 },
    ]);
  });

  it('clamps quantity to 0 when decrementing past zero', () => {
    const onChange = vi.fn();
    const zeroPlates = [{ weight: 20, quantity: 0 }];
    render(<PlateConfig plates={zeroPlates} unit="kg" onChange={onChange} />);
    fireEvent.click(screen.getByText('-'));
    expect(onChange).toHaveBeenCalledWith([{ weight: 20, quantity: 0 }]);
  });

  it('removes a plate when × is clicked', () => {
    const onChange = vi.fn();
    render(<PlateConfig {...defaultProps} onChange={onChange} />);
    const removeButtons = screen.getAllByTitle('Remove');
    fireEvent.click(removeButtons[0]);
    expect(onChange).toHaveBeenCalledWith([{ weight: 10, quantity: 4 }]);
  });

  it('adds a new plate via the Add button', () => {
    const onChange = vi.fn();
    render(<PlateConfig plates={[{ weight: 20, quantity: 2 }]} unit="kg" onChange={onChange} />);
    const input = screen.getByPlaceholderText('Add plate (kg)');
    fireEvent.change(input, { target: { value: '5' } });
    fireEvent.click(screen.getByText('Add'));
    expect(onChange).toHaveBeenCalledWith([
      { weight: 20, quantity: 2 },
      { weight: 5, quantity: 2 },
    ]);
  });

  it('adds a new plate via Enter key', () => {
    const onChange = vi.fn();
    render(<PlateConfig plates={[{ weight: 20, quantity: 2 }]} unit="kg" onChange={onChange} />);
    const input = screen.getByPlaceholderText('Add plate (kg)');
    fireEvent.change(input, { target: { value: '15' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onChange).toHaveBeenCalledWith([
      { weight: 20, quantity: 2 },
      { weight: 15, quantity: 2 },
    ]);
  });

  it('does not add a duplicate plate', () => {
    const onChange = vi.fn();
    render(<PlateConfig plates={[{ weight: 20, quantity: 2 }]} unit="kg" onChange={onChange} />);
    const input = screen.getByPlaceholderText('Add plate (kg)');
    fireEvent.change(input, { target: { value: '20' } });
    fireEvent.click(screen.getByText('Add'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not add a plate with empty or zero value', () => {
    const onChange = vi.fn();
    render(<PlateConfig plates={[]} unit="kg" onChange={onChange} />);
    fireEvent.click(screen.getByText('Add'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not add a negative weight plate', () => {
    const onChange = vi.fn();
    render(<PlateConfig plates={[]} unit="kg" onChange={onChange} />);
    const input = screen.getByPlaceholderText('Add plate (kg)');
    fireEvent.change(input, { target: { value: '-5' } });
    fireEvent.click(screen.getByText('Add'));
    expect(onChange).not.toHaveBeenCalled();
  });
});
