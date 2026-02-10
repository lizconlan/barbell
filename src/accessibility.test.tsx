import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WeightInput } from './components/WeightInput';
import { EquipmentSelector } from './components/EquipmentSelector';
import { PlateConfig } from './components/PlateConfig';
import App from './App';

describe('Accessibility - Keyboard Navigation', () => {
  it('WeightInput: Enter key in input does not trigger unexpected behavior', () => {
    const onWeightChange = vi.fn();
    const onUnitChange = vi.fn();
    render(
      <WeightInput
        targetWeight={100}
        unit="kg"
        onWeightChange={onWeightChange}
        onUnitChange={onUnitChange}
      />,
    );

    const input = screen.getByLabelText('Target Weight');
    fireEvent.keyDown(input, { key: 'Enter' });

    // Should not cause errors or unexpected calls
    expect(onUnitChange).not.toHaveBeenCalled();
  });

  it('PlateConfig: Enter key in add plate input triggers add', () => {
    const onChange = vi.fn();
    render(<PlateConfig plates={[]} unit="kg" onChange={onChange} />);

    const input = screen.getByPlaceholderText('Add plate (kg)');
    fireEvent.change(input, { target: { value: '20' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onChange).toHaveBeenCalledWith([{ weight: 20, quantity: 2 }]);
  });

  it('PlateConfig: non-Enter keys do not trigger add', () => {
    const onChange = vi.fn();
    render(<PlateConfig plates={[]} unit="kg" onChange={onChange} />);

    const input = screen.getByPlaceholderText('Add plate (kg)');
    fireEvent.change(input, { target: { value: '20' } });
    fireEvent.keyDown(input, { key: 'Tab' });
    fireEvent.keyDown(input, { key: 'Space' });
    fireEvent.keyDown(input, { key: 'Escape' });

    expect(onChange).not.toHaveBeenCalled();
  });

  it('App: can navigate through form controls with keyboard', () => {
    render(<App />);

    const weightInput = screen.getByLabelText('Target Weight');
    const equipmentSelect = screen.getByRole('combobox', { name: 'Equipment' });

    // Both should be focusable
    weightInput.focus();
    expect(document.activeElement).toBe(weightInput);

    equipmentSelect.focus();
    expect(document.activeElement).toBe(equipmentSelect);
  });
});

describe('Accessibility - Labels and Roles', () => {
  it('WeightInput: input has accessible label', () => {
    render(
      <WeightInput
        targetWeight={100}
        unit="kg"
        onWeightChange={vi.fn()}
        onUnitChange={vi.fn()}
      />,
    );

    const input = screen.getByLabelText('Target Weight');
    expect(input).toBeTruthy();
    expect(input.tagName).toBe('INPUT');
  });

  it('EquipmentSelector: select has accessible label', () => {
    render(
      <EquipmentSelector
        selectedId="olympic"
        unit="kg"
        customBarWeight={20}
        dumbbellHandleWeight={0.5}
        onSelect={vi.fn()}
        onCustomBarWeightChange={vi.fn()}
        onDumbbellHandleWeightChange={vi.fn()}
      />,
    );

    const select = screen.getByLabelText('Equipment');
    expect(select).toBeTruthy();
    expect(select.tagName).toBe('SELECT');
  });

  it('EquipmentSelector: custom bar weight input has accessible label', () => {
    render(
      <EquipmentSelector
        selectedId="custom"
        unit="kg"
        customBarWeight={20}
        dumbbellHandleWeight={0.5}
        onSelect={vi.fn()}
        onCustomBarWeightChange={vi.fn()}
        onDumbbellHandleWeightChange={vi.fn()}
      />,
    );

    const input = screen.getByLabelText('Bar Weight (kg)');
    expect(input).toBeTruthy();
    expect(input.tagName).toBe('INPUT');
  });

  it('EquipmentSelector: dumbbell handle weight input has accessible label', () => {
    render(
      <EquipmentSelector
        selectedId="dumbbell"
        unit="kg"
        customBarWeight={20}
        dumbbellHandleWeight={0.5}
        onSelect={vi.fn()}
        onCustomBarWeightChange={vi.fn()}
        onDumbbellHandleWeightChange={vi.fn()}
      />,
    );

    const input = screen.getByLabelText('Handle Weight (kg)');
    expect(input).toBeTruthy();
    expect(input.tagName).toBe('INPUT');
  });

  it('PlateConfig: buttons have accessible text or titles', () => {
    render(
      <PlateConfig
        plates={[{ weight: 20, quantity: 2 }]}
        unit="kg"
        onChange={vi.fn()}
      />,
    );

    // Quantity buttons have visible text
    expect(screen.getByText('+')).toBeTruthy();
    expect(screen.getByText('-')).toBeTruthy();

    // Remove button has title attribute and visible text
    const removeButton = screen.getByText('×');
    expect(removeButton).toBeTruthy();
    expect(removeButton.getAttribute('title')).toBe('Remove');
  });

  it('App: main heading exists', () => {
    render(<App />);

    const heading = screen.getByRole('heading', { name: 'Plate Calculator' });
    expect(heading).toBeTruthy();
    expect(heading.tagName).toBe('H1');
  });
});

describe('Accessibility - Form Controls', () => {
  it('WeightInput: input has appropriate type and constraints', () => {
    render(
      <WeightInput
        targetWeight={100}
        unit="kg"
        onWeightChange={vi.fn()}
        onUnitChange={vi.fn()}
      />,
    );

    const input = screen.getByLabelText('Target Weight') as HTMLInputElement;
    expect(input.type).toBe('number');
    expect(input.min).toBe('0');
    expect(input.step).toBe('0.5'); // kg mode
  });

  it('EquipmentSelector: custom bar weight has appropriate constraints', () => {
    render(
      <EquipmentSelector
        selectedId="custom"
        unit="kg"
        customBarWeight={20}
        dumbbellHandleWeight={0.5}
        onSelect={vi.fn()}
        onCustomBarWeightChange={vi.fn()}
        onDumbbellHandleWeightChange={vi.fn()}
      />,
    );

    const input = screen.getByLabelText('Bar Weight (kg)') as HTMLInputElement;
    expect(input.type).toBe('number');
    expect(input.min).toBe('0');
    expect(input.step).toBe('0.5');
  });

  it('PlateConfig: add plate input has appropriate constraints', () => {
    render(<PlateConfig plates={[]} unit="kg" onChange={vi.fn()} />);

    const input = screen.getByPlaceholderText('Add plate (kg)') as HTMLInputElement;
    expect(input.type).toBe('number');
    expect(input.min).toBe('0');
    expect(input.step).toBe('0.5');
  });
});

describe('Accessibility - Visual State', () => {
  it('WeightInput: active unit button has visual indicator', () => {
    render(
      <WeightInput
        targetWeight={100}
        unit="kg"
        onWeightChange={vi.fn()}
        onUnitChange={vi.fn()}
      />,
    );

    const kgButton = screen.getByText('kg');
    const lbButton = screen.getByText('lb');

    expect(kgButton.className).toBe('active');
    expect(lbButton.className).toBe('');
  });

  it('WeightInput: switching units updates visual state', () => {
    const { rerender } = render(
      <WeightInput
        targetWeight={100}
        unit="kg"
        onWeightChange={vi.fn()}
        onUnitChange={vi.fn()}
      />,
    );

    let kgButton = screen.getByText('kg');
    let lbButton = screen.getByText('lb');
    expect(kgButton.className).toBe('active');

    rerender(
      <WeightInput
        targetWeight={100}
        unit="lb"
        onWeightChange={vi.fn()}
        onUnitChange={vi.fn()}
      />,
    );

    kgButton = screen.getByText('kg');
    lbButton = screen.getByText('lb');
    expect(lbButton.className).toBe('active');
    expect(kgButton.className).toBe('');
  });
});
