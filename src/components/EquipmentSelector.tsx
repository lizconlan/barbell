import { EQUIPMENT_TYPES, type Unit } from '../types';

interface Props {
  selectedId: string;
  unit: Unit;
  customBarWeight: number;
  dumbbellHandleWeight: number;
  onSelect: (id: string) => void;
  onCustomBarWeightChange: (w: number) => void;
  onDumbbellHandleWeightChange: (w: number) => void;
}

export function EquipmentSelector({
  selectedId,
  unit,
  customBarWeight,
  dumbbellHandleWeight,
  onSelect,
  onCustomBarWeightChange,
  onDumbbellHandleWeightChange,
}: Props) {
  const selected = EQUIPMENT_TYPES.find((e) => e.id === selectedId)!;

  return (
    <div className="equipment-selector">
      <label>
        Equipment
        <select value={selectedId} onChange={(e) => onSelect(e.target.value)}>
          {EQUIPMENT_TYPES.map((eq) => (
            <option key={eq.id} value={eq.id}>
              {eq.name} {eq.id !== 'custom' ? `(${eq.defaultWeight[unit]} ${unit})` : ''}
            </option>
          ))}
        </select>
      </label>

      {selectedId === 'custom' && (
        <label>
          Bar Weight ({unit})
          <input
            type="number"
            min={0}
            step={0.5}
            value={customBarWeight || ''}
            onChange={(e) => onCustomBarWeightChange(parseFloat(e.target.value) || 0)}
          />
        </label>
      )}

      {selectedId === 'dumbbell' && (
        <label>
          Handle Weight ({unit})
          <input
            type="number"
            min={0}
            step={0.1}
            value={dumbbellHandleWeight}
            onChange={(e) => onDumbbellHandleWeightChange(parseFloat(e.target.value) || 0)}
          />
        </label>
      )}

      {selected.category === 'dumbbell' && (
        <p className="equipment-note">Plates shown per dumbbell</p>
      )}
    </div>
  );
}

export function getBarWeight(
  equipmentId: string,
  unit: Unit,
  customBarWeight: number,
  dumbbellHandleWeight: number,
): number {
  if (equipmentId === 'custom') return customBarWeight;
  if (equipmentId === 'dumbbell') return dumbbellHandleWeight;
  const eq = EQUIPMENT_TYPES.find((e) => e.id === equipmentId)!;
  return eq.defaultWeight[unit];
}
