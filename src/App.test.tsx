import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import App from './App';

describe('App integration tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the app with default state', () => {
    render(<App />);
    expect(screen.getByText('Plate Calculator')).toBeTruthy();
    expect(screen.getByLabelText('Target Weight')).toBeTruthy();
    expect(screen.getByLabelText('Equipment')).toBeTruthy();
  });

  it('updates calculation when target weight changes', () => {
    render(<App />);
    const input = screen.getByLabelText('Target Weight') as HTMLInputElement;

    // Default 100kg on 20kg olympic bar = 80kg to load, 40kg per side
    expect(screen.getByText(/1 × 25 kg/)).toBeTruthy();
    expect(screen.getByText(/1 × 15 kg/)).toBeTruthy();

    // Change to 60kg = 40kg to load, 20kg per side
    fireEvent.change(input, { target: { value: '60' } });
    expect(screen.getByText(/1 × 20 kg/)).toBeTruthy();
    expect(screen.queryByText(/1 × 25 kg/)).toBeNull();
  });

  it('converts weights when switching units', () => {
    render(<App />);

    // Start in kg
    const input = screen.getByLabelText('Target Weight') as HTMLInputElement;
    expect(input.value).toBe('100');

    // Switch to lb
    fireEvent.click(screen.getByText('lb'));

    // Olympic bar should show 45 lb in equipment selector
    const equipmentSelect = screen.getByRole('combobox', { name: 'Equipment' });
    expect(equipmentSelect.textContent).toContain('45 lb');
  });

  it('updates bar weight when changing equipment type', () => {
    render(<App />);

    const equipmentSelect = screen.getByRole('combobox', { name: 'Equipment' });

    // Change to Women's barbell (15kg)
    fireEvent.change(equipmentSelect, { target: { value: 'womens' } });

    // 100kg target - 15kg bar = 85kg to load, 42.5kg per side
    // Should use 25 + 15 + 2.5 = 42.5kg per side
    expect(screen.getByText(/1 × 25 kg/)).toBeTruthy();
    expect(screen.getByText(/1 × 15 kg/)).toBeTruthy();
    expect(screen.getByText(/1 × 2.5 kg/)).toBeTruthy();
  });

  it('shows custom bar weight input when custom is selected', () => {
    render(<App />);

    const equipmentSelect = screen.getByRole('combobox', { name: 'Equipment' });
    fireEvent.change(equipmentSelect, { target: { value: 'custom' } });

    expect(screen.getByLabelText('Bar Weight (kg)')).toBeTruthy();

    // Set custom bar weight to 10kg
    const barWeightInput = screen.getByLabelText('Bar Weight (kg)');
    fireEvent.change(barWeightInput, { target: { value: '10' } });

    // 100kg target - 10kg bar = 90kg to load, 45kg per side
    expect(screen.getByText(/1 × 25 kg/)).toBeTruthy();
    expect(screen.getByText(/1 × 20 kg/)).toBeTruthy();
  });

  it('switches to dumbbell plates when dumbbell is selected', () => {
    render(<App />);

    const equipmentSelect = screen.getByRole('combobox', { name: 'Equipment' });
    fireEvent.change(equipmentSelect, { target: { value: 'dumbbell' } });

    // Should show dumbbell-specific UI
    expect(screen.getByText('Plates shown per dumbbell')).toBeTruthy();
    expect(screen.getByText('(per dumbbell)')).toBeTruthy();
  });

  it('updates calculation when plate config changes', () => {
    render(<App />);

    // Remove the 15kg plates by finding the plate row and clicking remove (×)
    const removeButtons = screen.getAllByText('×');
    // Find the 15kg plate row (it's the third one in default config: 25, 20, 15...)
    fireEvent.click(removeButtons[2]);

    // Now calculation should use different plates since 15kg is gone
    // 100kg target - 20kg bar = 80kg, 40kg per side
    // Without 15kg: should use 25 + 10 + 5 = 40kg
    expect(screen.getByText(/1 × 25 kg/)).toBeTruthy();
    expect(screen.getByText(/1 × 10 kg/)).toBeTruthy();
    expect(screen.getByText(/1 × 5 kg/)).toBeTruthy();
  });

  it('hides result when target weight is zero', () => {
    render(<App />);

    // Should show result initially (default 100kg)
    expect(screen.getByText(/Per side/)).toBeTruthy();

    const input = screen.getByLabelText('Target Weight');
    fireEvent.change(input, { target: { value: '0' } });

    // Result should be hidden
    expect(screen.queryByText(/Per side/)).toBeNull();
  });

  it('persists custom bar weight to localStorage', () => {
    render(<App />);

    const equipmentSelect = screen.getByRole('combobox', { name: 'Equipment' });
    fireEvent.change(equipmentSelect, { target: { value: 'custom' } });

    const barWeightInput = screen.getByLabelText('Bar Weight (kg)');
    fireEvent.change(barWeightInput, { target: { value: '17' } });

    // Check localStorage was updated
    const stored = localStorage.getItem('custom-bar-weight');
    expect(stored).toBe('17');
  });

  it('persists plate configuration to localStorage', () => {
    render(<App />);

    // Add a new plate
    const addInput = screen.getByPlaceholderText('Add plate (kg)');
    fireEvent.change(addInput, { target: { value: '7.5' } });
    fireEvent.click(screen.getByText('Add'));

    // Check localStorage was updated
    const stored = localStorage.getItem('barbell-plates');
    expect(stored).toContain('7.5');
  });

  it('loads initial state from localStorage', () => {
    // Pre-populate localStorage
    localStorage.setItem('custom-bar-weight', '13');
    localStorage.setItem('barbell-plates', JSON.stringify([
      { weight: 20, quantity: 2 },
      { weight: 10, quantity: 2 },
    ]));

    render(<App />);

    // Switch to custom to see the loaded value
    const equipmentSelect = screen.getByRole('combobox', { name: 'Equipment' });
    fireEvent.change(equipmentSelect, { target: { value: 'custom' } });

    const barWeightInput = screen.getByLabelText('Bar Weight (kg)') as HTMLInputElement;
    expect(barWeightInput.value).toBe('13');

    // Check plates were loaded (should only show 20kg and 10kg)
    expect(screen.getByText('20 kg')).toBeTruthy();
    expect(screen.getByText('10 kg')).toBeTruthy();
    expect(screen.queryByText('25 kg')).toBeNull(); // Default 25kg plates should not be present
  });

  it('shows remainder warning when target cannot be reached exactly', () => {
    render(<App />);

    // Set odd target that can't be reached exactly with standard plates
    const input = screen.getByLabelText('Target Weight');
    fireEvent.change(input, { target: { value: '61' } });

    // 61kg target - 20kg bar = 41kg to load, 20.5kg per side
    // Can only load 20kg per side = 60kg total, 1kg short
    expect(screen.getByText(/Cannot reach exact target/)).toBeTruthy();
    expect(screen.getByText(/1 kg short/)).toBeTruthy();
  });

  it('full user flow: select dumbbell, change weight, configure plates', () => {
    render(<App />);

    // 1. Select dumbbell
    const equipmentSelect = screen.getByRole('combobox', { name: 'Equipment' });
    fireEvent.change(equipmentSelect, { target: { value: 'dumbbell' } });

    expect(screen.getByText('Plates shown per dumbbell')).toBeTruthy();

    // 2. Set target weight to 15kg
    const weightInput = screen.getByLabelText('Target Weight');
    fireEvent.change(weightInput, { target: { value: '15' } });

    // 3. Verify dumbbell handle weight input is shown
    expect(screen.getByLabelText('Handle Weight (kg)')).toBeTruthy();

    // 4. Result should show (per dumbbell)
    expect(screen.getByText('(per dumbbell)')).toBeTruthy();

    // 5. Plates should be from dumbbell inventory (smaller weights)
    // 15kg - 0.5kg handle = 14.5kg to load, 7.25kg per side
    // Greedy algorithm: 10kg is max that fits, then nothing else fits (7.25 - 10 = -2.75)
    // So loads 5kg per side = 10.5kg total (0.5 handle + 5×2 sides)
    // Actually: 7.25 per side → can't use 10kg (too heavy), so tries 5kg (fits), leaves 2.25
    // Then 2.5kg doesn't fit (too heavy), so next is 1.25kg which fits, leaves 1kg
    // Then 1kg fits exactly
    expect(screen.getByText(/1 × 5 kg/)).toBeTruthy();
    expect(screen.getByText(/1 × 1.25 kg/)).toBeTruthy();
    expect(screen.getByText(/1 × 1 kg/)).toBeTruthy();
  });
});
