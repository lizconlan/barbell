import { type Unit, KG_TO_LB } from '../types';

interface Props {
  plates: { weight: number; count: number }[];
  barWeight: number;
  unit: Unit;
  isDumbbell: boolean;
}

const PLATE_COLORS: Record<number, string> = {
  25: '#e74c3c',
  20: '#3498db',
  15: '#f1c40f',
  10: '#2ecc71',
  5: '#9b59b6',
  2.5: '#e67e22',
  1.25: '#1abc9c',
  1: '#34495e',
  0.5: '#95a5a6',
};

function getColor(weight: number): string {
  return PLATE_COLORS[weight] || '#7f8c8d';
}

function getHeight(weight: number): number {
  // Proportional height: heavier plates are taller
  const maxWeight = 25;
  const minH = 30;
  const maxH = 100;
  return minH + (weight / maxWeight) * (maxH - minH);
}

export function PlateBar({ plates, barWeight, unit, isDumbbell }: Props) {
  const displayWeight = (w: number) =>
    unit === 'kg' ? w : Math.round(w * KG_TO_LB * 10) / 10;

  // Expand plates: [{weight: 20, count: 2}] -> [20, 20]
  const expanded: number[] = [];
  for (const p of plates) {
    for (let i = 0; i < p.count; i++) {
      expanded.push(p.weight);
    }
  }

  const renderPlates = (side: number[]) =>
    side.map((w, i) => (
      <div
        key={i}
        className="plate"
        style={{
          backgroundColor: getColor(w),
          height: `${getHeight(w)}px`,
          width: '28px',
        }}
        title={`${displayWeight(w)} ${unit}`}
      >
        <span className="plate-label">{displayWeight(w)}</span>
      </div>
    ));

  return (
    <div className="plate-bar">
      <div className="bar-diagram">
        <div className="bar-side left">
          {renderPlates([...expanded].reverse())}
        </div>
        <div className="bar-center">
          <div className="bar-shaft" />
          <span className="bar-weight-label">{displayWeight(barWeight)} {unit}</span>
        </div>
        <div className="bar-side right">
          {renderPlates(expanded)}
        </div>
      </div>
    </div>
  );
}
