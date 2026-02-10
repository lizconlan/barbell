import { useState, useMemo, useEffect } from 'react';
import { type Unit, EQUIPMENT_TYPES, KG_TO_LB } from './types';
import { calculatePlates } from './utils/calculator';
import {
  loadBarbellPlates, saveBarbellPlates,
  loadDumbbellPlates, saveDumbbellPlates,
  loadCustomBarWeight, saveCustomBarWeight,
  loadDumbbellHandleWeight, saveDumbbellHandleWeight,
} from './utils/storage';
import { WeightInput } from './components/WeightInput';
import { EquipmentSelector, getBarWeight } from './components/EquipmentSelector';
import { PlateConfig } from './components/PlateConfig';
import { PlateResult } from './components/PlateResult';
import './App.css';

function App() {
  const [targetWeight, setTargetWeight] = useState(100);
  const [unit, setUnit] = useState<Unit>('kg');
  const [equipmentId, setEquipmentId] = useState('olympic');
  const [customBarWeight, setCustomBarWeight] = useState(loadCustomBarWeight);
  const [dumbbellHandleWeight, setDumbbellHandleWeight] = useState(loadDumbbellHandleWeight);
  const [barbellPlates, setBarbellPlates] = useState(loadBarbellPlates);
  const [dumbbellPlates, setDumbbellPlates] = useState(loadDumbbellPlates);

  const equipment = EQUIPMENT_TYPES.find((e) => e.id === equipmentId)!;
  const isDumbbell = equipment.category === 'dumbbell';
  const plates = isDumbbell ? dumbbellPlates : barbellPlates;

  const targetKg = unit === 'lb' ? targetWeight / KG_TO_LB : targetWeight;
  const barWeightDisplay = getBarWeight(equipmentId, unit, customBarWeight, dumbbellHandleWeight);
  const barWeightKg = unit === 'lb' ? barWeightDisplay / KG_TO_LB : barWeightDisplay;

  const result = useMemo(
    () => calculatePlates(targetKg, barWeightKg, plates, 2),
    [targetKg, barWeightKg, plates, isDumbbell],
  );

  useEffect(() => { saveBarbellPlates(barbellPlates); }, [barbellPlates]);
  useEffect(() => { saveDumbbellPlates(dumbbellPlates); }, [dumbbellPlates]);
  useEffect(() => { saveCustomBarWeight(customBarWeight); }, [customBarWeight]);
  useEffect(() => { saveDumbbellHandleWeight(dumbbellHandleWeight); }, [dumbbellHandleWeight]);

  const handlePlateChange = isDumbbell ? setDumbbellPlates : setBarbellPlates;

  return (
    <div className="app">
      <h1>Plate Calculator</h1>
      <div className="controls">
        <WeightInput
          targetWeight={targetWeight}
          unit={unit}
          onWeightChange={setTargetWeight}
          onUnitChange={setUnit}
        />
        <EquipmentSelector
          selectedId={equipmentId}
          unit={unit}
          customBarWeight={customBarWeight}
          dumbbellHandleWeight={dumbbellHandleWeight}
          onSelect={setEquipmentId}
          onCustomBarWeightChange={setCustomBarWeight}
          onDumbbellHandleWeightChange={setDumbbellHandleWeight}
        />
      </div>

      {targetWeight > 0 && (
        <PlateResult
          result={result}
          barWeight={barWeightKg}
          unit={unit}
          isDumbbell={isDumbbell}
        />
      )}

      <PlateConfig plates={plates} unit={unit} onChange={handlePlateChange} />
    </div>
  );
}

export default App;
