import { type PlateDefinition, type Unit, KG_TO_LB } from '../types';
import { useState } from 'react';

interface Props {
  plates: PlateDefinition[];
  unit: Unit;
  onChange: (plates: PlateDefinition[]) => void;
}

export function PlateConfig({ plates, unit, onChange }: Props) {
  const [newWeight, setNewWeight] = useState('');

  const displayWeight = (w: number) =>
    unit === 'kg' ? w : Math.round(w * KG_TO_LB * 100) / 100;

  const updateQuantity = (index: number, qty: number) => {
    const updated = plates.map((p, i) => (i === index ? { ...p, quantity: Math.max(0, qty) } : p));
    onChange(updated);
  };

  const addPlate = () => {
    const w = parseFloat(newWeight);
    if (!w || w <= 0) return;
    // Convert to kg if user is in lb mode
    const weightKg = unit === 'lb' ? w / KG_TO_LB : w;
    const rounded = Math.round(weightKg * 1000) / 1000;
    if (plates.some((p) => Math.abs(p.weight - rounded) < 0.001)) return;
    const updated = [...plates, { weight: rounded, quantity: 2 }].sort((a, b) => b.weight - a.weight);
    onChange(updated);
    setNewWeight('');
  };

  const removePlate = (index: number) => {
    onChange(plates.filter((_, i) => i !== index));
  };

  return (
    <div className="plate-config">
      <h3>Available Plates ({unit})</h3>
      <div className="plate-list">
        {plates.map((plate, i) => (
          <div key={i} className="plate-row">
            <span className="plate-weight">{displayWeight(plate.weight)} {unit}</span>
            <div className="plate-qty">
              <button onClick={() => updateQuantity(i, plate.quantity - 1)}>-</button>
              <span>{plate.quantity}</span>
              <button onClick={() => updateQuantity(i, plate.quantity + 1)}>+</button>
            </div>
            <button className="plate-remove" onClick={() => removePlate(i)} title="Remove">
              ×
            </button>
          </div>
        ))}
      </div>
      <div className="plate-add">
        <input
          type="number"
          min={0}
          step={0.5}
          placeholder={`Add plate (${unit})`}
          value={newWeight}
          onChange={(e) => setNewWeight(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addPlate()}
        />
        <button onClick={addPlate}>Add</button>
      </div>
    </div>
  );
}
