import { describe, it, expect, beforeEach } from 'vitest';
import {
  loadBarbellPlates,
  saveBarbellPlates,
  loadDumbbellPlates,
  saveDumbbellPlates,
  loadCustomBarWeight,
  saveCustomBarWeight,
  loadDumbbellHandleWeight,
  saveDumbbellHandleWeight,
} from './storage';
import { DEFAULT_BARBELL_PLATES_KG, DEFAULT_DUMBBELL_PLATES_KG } from '../types';

beforeEach(() => {
  localStorage.clear();
});

describe('barbell plates', () => {
  it('returns defaults when nothing is stored', () => {
    expect(loadBarbellPlates()).toEqual(DEFAULT_BARBELL_PLATES_KG);
  });

  it('round-trips saved plates', () => {
    const plates = [{ weight: 10, quantity: 3 }];
    saveBarbellPlates(plates);
    expect(loadBarbellPlates()).toEqual(plates);
  });
});

describe('dumbbell plates', () => {
  it('returns defaults when nothing is stored', () => {
    expect(loadDumbbellPlates()).toEqual(DEFAULT_DUMBBELL_PLATES_KG);
  });

  it('round-trips saved plates', () => {
    const plates = [{ weight: 5, quantity: 4 }];
    saveDumbbellPlates(plates);
    expect(loadDumbbellPlates()).toEqual(plates);
  });
});

describe('custom bar weight', () => {
  it('returns default 20 when nothing is stored', () => {
    expect(loadCustomBarWeight()).toBe(20);
  });

  it('round-trips saved weight', () => {
    saveCustomBarWeight(15);
    expect(loadCustomBarWeight()).toBe(15);
  });
});

describe('dumbbell handle weight', () => {
  it('returns default 0.5 when nothing is stored', () => {
    expect(loadDumbbellHandleWeight()).toBe(0.5);
  });

  it('round-trips saved weight', () => {
    saveDumbbellHandleWeight(2);
    expect(loadDumbbellHandleWeight()).toBe(2);
  });
});

describe('loadJson fallback on corrupt data', () => {
  it('returns default barbell plates on invalid JSON', () => {
    localStorage.setItem('barbell-plates', 'not-json');
    expect(loadBarbellPlates()).toEqual(DEFAULT_BARBELL_PLATES_KG);
  });

  it('returns default custom bar weight on invalid JSON', () => {
    localStorage.setItem('custom-bar-weight', '{bad');
    expect(loadCustomBarWeight()).toBe(20);
  });
});
