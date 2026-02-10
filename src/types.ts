export type Unit = 'kg' | 'lb';

export interface PlateDefinition {
  weight: number;
  quantity: number; // total available (for barbells: per side)
}

export type EquipmentCategory = 'barbell' | 'dumbbell';

export interface EquipmentType {
  id: string;
  name: string;
  category: EquipmentCategory;
  defaultWeight: { kg: number; lb: number };
}

export interface CalculationResult {
  plates: { weight: number; count: number }[];
  totalWeight: number;
  remainder: number;
}

export const EQUIPMENT_TYPES: EquipmentType[] = [
  { id: 'olympic', name: 'Olympic Barbell', category: 'barbell', defaultWeight: { kg: 20, lb: 45 } },
  { id: 'womens', name: "Women's Barbell", category: 'barbell', defaultWeight: { kg: 15, lb: 35 } },
  { id: 'ez-curl', name: 'EZ Curl Bar', category: 'barbell', defaultWeight: { kg: 11, lb: 25 } },
  { id: 'trap', name: 'Trap Bar', category: 'barbell', defaultWeight: { kg: 25, lb: 55 } },
  { id: 'dumbbell', name: 'Dumbbell Handle', category: 'dumbbell', defaultWeight: { kg: 0.5, lb: 1 } },
  { id: 'custom', name: 'Custom', category: 'barbell', defaultWeight: { kg: 0, lb: 0 } },
];

export const DEFAULT_BARBELL_PLATES_KG: PlateDefinition[] = [
  { weight: 25, quantity: 2 },
  { weight: 20, quantity: 2 },
  { weight: 15, quantity: 2 },
  { weight: 10, quantity: 2 },
  { weight: 5, quantity: 2 },
  { weight: 2.5, quantity: 2 },
];

export const DEFAULT_DUMBBELL_PLATES_KG: PlateDefinition[] = [
  { weight: 10, quantity: 4 },
  { weight: 5, quantity: 4 },
  { weight: 2.5, quantity: 4 },
  { weight: 1.25, quantity: 4 },
  { weight: 1, quantity: 4 },
  { weight: 0.5, quantity: 4 },
];

export const KG_TO_LB = 2.20462;
