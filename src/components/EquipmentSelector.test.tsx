import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EquipmentSelector, getBarWeight } from './EquipmentSelector';
import { EQUIPMENT_TYPES } from '../types';

describe('EquipmentSelector', () => {
  const defaultProps = {
    selectedId: 'olympic',
    unit: 'kg' as const,
    customBarWeight: 20,
    dumbbellHandleWeight: 0.5,
    onSelect: vi.fn(),
    onCustomBarWeightChange: vi.fn(),
    onDumbbellHandleWeightChange: vi.fn(),
  };

  it('renders a dropdown with all equipment types', () => {
    render(<EquipmentSelector {...defaultProps} />);
    const select = screen.getByRole('combobox', { name: 'Equipment' }) as HTMLSelectElement;
    const options = select.querySelectorAll('option');
    expect(options.length).toBe(EQUIPMENT_TYPES.length);
  });

  it('calls onSelect when changing equipment', () => {
    const onSelect = vi.fn();
    render(<EquipmentSelector {...defaultProps} onSelect={onSelect} />);
    fireEvent.change(screen.getByRole('combobox', { name: 'Equipment' }), { target: { value: 'trap' } });
    expect(onSelect).toHaveBeenCalledWith('trap');
  });

  it('does not show custom bar weight input for non-custom equipment', () => {
    render(<EquipmentSelector {...defaultProps} selectedId="olympic" />);
    expect(screen.queryByLabelText(/Bar Weight/)).toBeNull();
  });

  it('shows custom bar weight input when custom is selected', () => {
    render(<EquipmentSelector {...defaultProps} selectedId="custom" />);
    expect(screen.getByLabelText('Bar Weight (kg)')).toBeTruthy();
  });

  it('calls onCustomBarWeightChange when editing custom bar weight', () => {
    const onCustomBarWeightChange = vi.fn();
    render(
      <EquipmentSelector
        {...defaultProps}
        selectedId="custom"
        onCustomBarWeightChange={onCustomBarWeightChange}
      />,
    );
    fireEvent.change(screen.getByLabelText('Bar Weight (kg)'), { target: { value: '15' } });
    expect(onCustomBarWeightChange).toHaveBeenCalledWith(15);
  });

  it('does not show handle weight input for non-dumbbell equipment', () => {
    render(<EquipmentSelector {...defaultProps} selectedId="olympic" />);
    expect(screen.queryByLabelText(/Handle Weight/)).toBeNull();
  });

  it('shows handle weight input when dumbbell is selected', () => {
    render(<EquipmentSelector {...defaultProps} selectedId="dumbbell" />);
    expect(screen.getByLabelText('Handle Weight (kg)')).toBeTruthy();
  });

  it('shows "Plates shown per dumbbell" note for dumbbell', () => {
    render(<EquipmentSelector {...defaultProps} selectedId="dumbbell" />);
    expect(screen.getByText('Plates shown per dumbbell')).toBeTruthy();
  });

  it('does not show dumbbell note for barbell equipment', () => {
    render(<EquipmentSelector {...defaultProps} selectedId="olympic" />);
    expect(screen.queryByText('Plates shown per dumbbell')).toBeNull();
  });
});

describe('getBarWeight', () => {
  it('returns custom bar weight for custom equipment', () => {
    expect(getBarWeight('custom', 'kg', 17, 0.5)).toBe(17);
  });

  it('returns dumbbell handle weight for dumbbell equipment', () => {
    expect(getBarWeight('dumbbell', 'kg', 20, 2)).toBe(2);
  });

  it('returns default kg weight for olympic barbell', () => {
    expect(getBarWeight('olympic', 'kg', 20, 0.5)).toBe(20);
  });

  it('returns default lb weight for olympic barbell in lb mode', () => {
    expect(getBarWeight('olympic', 'lb', 20, 0.5)).toBe(45);
  });

  it('returns default weight for trap bar', () => {
    expect(getBarWeight('trap', 'kg', 20, 0.5)).toBe(25);
  });
});
