import type { Unit } from '../types';

interface Props {
  targetWeight: number;
  unit: Unit;
  onWeightChange: (w: number) => void;
  onUnitChange: (u: Unit) => void;
}

export function WeightInput({ targetWeight, unit, onWeightChange, onUnitChange }: Props) {
  return (
    <div className="weight-input">
      <label>
        Target Weight
        <div className="input-row">
          <input
            type="number"
            min={0}
            step={unit === 'kg' ? 0.5 : 1}
            value={targetWeight || ''}
            onChange={(e) => onWeightChange(parseFloat(e.target.value) || 0)}
          />
          <div className="unit-toggle">
            <button
              className={unit === 'kg' ? 'active' : ''}
              onClick={() => onUnitChange('kg')}
            >
              kg
            </button>
            <button
              className={unit === 'lb' ? 'active' : ''}
              onClick={() => onUnitChange('lb')}
            >
              lb
            </button>
          </div>
        </div>
      </label>
    </div>
  );
}
