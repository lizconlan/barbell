import { type PlateDefinition, DEFAULT_BARBELL_PLATES_KG, DEFAULT_DUMBBELL_PLATES_KG } from '../types';

const BARBELL_PLATES_KEY = 'barbell-plates';
const DUMBBELL_PLATES_KEY = 'dumbbell-plates';
const CUSTOM_BAR_WEIGHT_KEY = 'custom-bar-weight';
const DUMBBELL_HANDLE_WEIGHT_KEY = 'dumbbell-handle-weight';

export function loadBarbellPlates(): PlateDefinition[] {
  return loadJson(BARBELL_PLATES_KEY, DEFAULT_BARBELL_PLATES_KG);
}

export function saveBarbellPlates(plates: PlateDefinition[]) {
  localStorage.setItem(BARBELL_PLATES_KEY, JSON.stringify(plates));
}

export function loadDumbbellPlates(): PlateDefinition[] {
  return loadJson(DUMBBELL_PLATES_KEY, DEFAULT_DUMBBELL_PLATES_KG);
}

export function saveDumbbellPlates(plates: PlateDefinition[]) {
  localStorage.setItem(DUMBBELL_PLATES_KEY, JSON.stringify(plates));
}

export function loadCustomBarWeight(): number {
  return loadJson(CUSTOM_BAR_WEIGHT_KEY, 20);
}

export function saveCustomBarWeight(weight: number) {
  localStorage.setItem(CUSTOM_BAR_WEIGHT_KEY, JSON.stringify(weight));
}

export function loadDumbbellHandleWeight(): number {
  return loadJson(DUMBBELL_HANDLE_WEIGHT_KEY, 0.5);
}

export function saveDumbbellHandleWeight(weight: number) {
  localStorage.setItem(DUMBBELL_HANDLE_WEIGHT_KEY, JSON.stringify(weight));
}

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
