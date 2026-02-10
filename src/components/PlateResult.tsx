import { type CalculationResult, type Unit, KG_TO_LB } from '../types';
import { PlateBar } from './PlateBar';

interface Props {
  result: CalculationResult;
  barWeight: number;
  unit: Unit;
  isDumbbell: boolean;
}

export function PlateResult({ result, barWeight, unit, isDumbbell }: Props) {
  const displayWeight = (w: number) =>
    unit === 'kg' ? w : Math.round(w * KG_TO_LB * 10) / 10;

  if (result.plates.length === 0 && result.remainder === 0) {
    return (
      <div className="plate-result">
        <p className="result-message">Just the {isDumbbell ? 'handle' : 'bar'} — no plates needed.</p>
      </div>
    );
  }

  return (
    <div className="plate-result">
      <PlateBar plates={result.plates} barWeight={barWeight} unit={unit} isDumbbell={isDumbbell} />

      <div className="result-details">
        <h3>
          Per side {isDumbbell && <span className="equipment-note">(per dumbbell)</span>}
        </h3>
        <ul className="plate-summary">
          {result.plates.map((p, i) => (
            <li key={i}>
              {p.count} × {displayWeight(p.weight)} {unit}
            </li>
          ))}
        </ul>
        <p className="total-weight">
          Total: <strong>{displayWeight(result.totalWeight)} {unit}</strong>
        </p>
        {result.remainder > 0 && (
          <p className="remainder-warning">
            Cannot reach exact target — {displayWeight(result.remainder)} {unit} short.
            Loaded {displayWeight(result.totalWeight)} {unit} instead.
          </p>
        )}
      </div>
    </div>
  );
}
