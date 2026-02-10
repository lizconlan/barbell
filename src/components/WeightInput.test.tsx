import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WeightInput } from './WeightInput';

describe('WeightInput', () => {
  const defaultProps = {
    targetWeight: 100,
    unit: 'kg' as const,
    onWeightChange: vi.fn(),
    onUnitChange: vi.fn(),
  };

  it('renders the target weight in the input', () => {
    render(<WeightInput {...defaultProps} />);
    const input = screen.getByLabelText('Target Weight') as HTMLInputElement;
    expect(input.value).toBe('100');
  });

  it('renders kg button as active when unit is kg', () => {
    render(<WeightInput {...defaultProps} unit="kg" />);
    expect(screen.getByText('kg').className).toBe('active');
    expect(screen.getByText('lb').className).toBe('');
  });

  it('renders lb button as active when unit is lb', () => {
    render(<WeightInput {...defaultProps} unit="lb" />);
    expect(screen.getByText('lb').className).toBe('active');
    expect(screen.getByText('kg').className).toBe('');
  });

  it('calls onWeightChange when input value changes', () => {
    const onWeightChange = vi.fn();
    render(<WeightInput {...defaultProps} onWeightChange={onWeightChange} />);
    const input = screen.getByLabelText('Target Weight');
    fireEvent.change(input, { target: { value: '85' } });
    expect(onWeightChange).toHaveBeenCalledWith(85);
  });

  it('calls onWeightChange with 0 for empty input', () => {
    const onWeightChange = vi.fn();
    render(<WeightInput {...defaultProps} onWeightChange={onWeightChange} />);
    const input = screen.getByLabelText('Target Weight');
    fireEvent.change(input, { target: { value: '' } });
    expect(onWeightChange).toHaveBeenCalledWith(0);
  });

  it('calls onUnitChange when clicking kg button', () => {
    const onUnitChange = vi.fn();
    render(<WeightInput {...defaultProps} onUnitChange={onUnitChange} />);
    fireEvent.click(screen.getByText('kg'));
    expect(onUnitChange).toHaveBeenCalledWith('kg');
  });

  it('calls onUnitChange when clicking lb button', () => {
    const onUnitChange = vi.fn();
    render(<WeightInput {...defaultProps} onUnitChange={onUnitChange} />);
    fireEvent.click(screen.getByText('lb'));
    expect(onUnitChange).toHaveBeenCalledWith('lb');
  });

  it('uses step 0.5 for kg and step 1 for lb', () => {
    const { rerender } = render(<WeightInput {...defaultProps} unit="kg" />);
    let input = screen.getByLabelText('Target Weight') as HTMLInputElement;
    expect(input.step).toBe('0.5');

    rerender(<WeightInput {...defaultProps} unit="lb" />);
    input = screen.getByLabelText('Target Weight') as HTMLInputElement;
    expect(input.step).toBe('1');
  });
});
