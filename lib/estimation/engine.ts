import { Project } from '../types/project';
import { Estimate, EstimateItem, CalculationAssumptions } from '../types/estimation';
import { DEFAULT_RATE_DATABASE } from './rate-database';

export interface EstimateOptions {
  estimateName?: string;
  overheadPercentage?: number; // default 12%
  rateSource?: string;
}

/**
 * Deterministic Civil Engineering Preliminary Cost Estimation Engine.
 * Follows Quantity x Rate = Amount rule without any artificial or randomized values.
 */
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function calculateProjectEstimate(
  project: Project,
  options?: EstimateOptions
): Estimate {
  const builtUpArea = project.builtUpArea;
  const floors = project.numberOfFloors;
  const footprintArea = builtUpArea / Math.max(1, floors);
  const overheadPercentage = options?.overheadPercentage ?? 12.0;
  const rateSource = options?.rateSource ?? 'Illustrative/MVP rate';

  // Finish Quality Multipliers (applicable to finishes, doors, windows, paint)
  const finishMultiplierMap: Record<string, number> = {
    Economy: 0.85,
    Standard: 1.0,
    Premium: 1.28,
    Luxury: 1.62,
  };
  const finishMultiplier = finishMultiplierMap[project.finishQuality] ?? 1.0;

  // Foundation Multipliers (substructure quantities)
  const foundationMultiplierMap: Record<string, number> = {
    'Isolated Footing': 1.0,
    'Combined Footing': 1.12,
    'Raft Foundation': 1.28,
    'Pile Foundation': 1.55,
    Other: 1.15,
  };
  const foundationMultiplier = foundationMultiplierMap[project.foundationType] ?? 1.0;

  // Structural System Multiplier for RCC Concrete Volume
  let concretePerSqFt = 0.04; // standard 0.040 cum / sq.ft for RCC Frame
  let steelPerCumConcrete = 0.088; // 88 kg / cum (0.088 MT / cum)

  if (project.structuralSystem === 'Steel Frame') {
    concretePerSqFt = 0.022; // Deck slabs & foundations
    steelPerCumConcrete = 0.11;
  } else if (project.structuralSystem === 'Load Bearing') {
    concretePerSqFt = 0.018; // Plinth & lintels only
    steelPerCumConcrete = 0.065;
  }

  // Rate lookup helper
  const getRate = (code: string) => {
    return DEFAULT_RATE_DATABASE.find((r) => r.itemCode === code);
  };

  const items: EstimateItem[] = [];

  const addItem = (
    code: string,
    quantity: number,
    rateModifier = 1.0,
    customDesc?: string
  ) => {
    const rateInfo = getRate(code);
    if (!rateInfo) return;

    const roundedQty = Math.round(quantity * 1000) / 1000;
    if (roundedQty <= 0) return;

    const matRate = Math.round(rateInfo.materialRate * rateModifier * 100) / 100;
    const labRate = Math.round(rateInfo.labourRate * rateModifier * 100) / 100;
    const eqRate = Math.round(rateInfo.equipmentRate * rateModifier * 100) / 100;
    const totalRate = matRate + labRate + eqRate;
    const amount = Math.round(roundedQty * totalRate * 100) / 100;

    items.push({
      id: generateUUID(),
      estimateId: '',
      category: rateInfo.category,
      itemCode: rateInfo.itemCode,
      description: customDesc || rateInfo.itemName,
      unit: rateInfo.unit,
      quantity: roundedQty,
      materialRate: matRate,
      labourRate: labRate,
      equipmentRate: eqRate,
      totalRate: totalRate,
      amount: amount,
    });
  };

  // --------------------------------------------------------------------------
  // 1. Substructure & Earthwork
  // --------------------------------------------------------------------------
  // Excavation: footprint area (in sqm) * 1.5m depth * foundation factor
  const footprintSqm = footprintArea * 0.0929;
  const excavationCum = footprintSqm * 1.5 * foundationMultiplier;
  addItem('EW-001', excavationCum);

  // PCC Footing Base: 0.08m thickness under foundation footprint
  const pccCum = footprintSqm * 0.12 * foundationMultiplier;
  addItem('EW-002', pccCum);

  // Anti-Termite Treatment
  const termiteSqm = footprintSqm * 1.1;
  addItem('EW-003', termiteSqm);

  // --------------------------------------------------------------------------
  // 2. RCC & Structural Framework
  // --------------------------------------------------------------------------
  const concreteCum = builtUpArea * concretePerSqFt;
  addItem('RCC-001', concreteCum);

  // Reinforcement Steel (MT)
  const steelMT = concreteCum * steelPerCumConcrete;
  addItem('RCC-002', steelMT);

  // Shuttering / Formwork (sqm) - approx 9.8 sqm per cum of concrete
  const formworkSqm = concreteCum * 9.8;
  addItem('RCC-003', formworkSqm);

  // --------------------------------------------------------------------------
  // 3. Masonry & Superstructure
  // --------------------------------------------------------------------------
  // Brickwork volume: approx 0.024 cum per sq.ft of built-up area
  const masonryCum = builtUpArea * 0.024;
  addItem('MAS-001', masonryCum);

  // --------------------------------------------------------------------------
  // 4. Waterproofing & Plastering
  // --------------------------------------------------------------------------
  // Internal plaster: 2.1 sqm per sq.ft
  const internalPlasterSqm = (builtUpArea * 2.1) * 0.0929;
  addItem('FIN-001', internalPlasterSqm, finishMultiplier);

  // External plaster: 0.75 sqm per sq.ft
  const externalPlasterSqm = (builtUpArea * 0.75) * 0.0929;
  addItem('FIN-002', externalPlasterSqm, finishMultiplier);

  // Terrace / Wet Area Waterproofing
  const waterproofingSqm = (footprintArea * 1.15) * 0.0929;
  addItem('FIN-003', waterproofingSqm, finishMultiplier);

  // --------------------------------------------------------------------------
  // 5. Flooring & Tiling
  // --------------------------------------------------------------------------
  const totalFloorSqm = (builtUpArea * 0.85) * 0.0929;
  const vitrifiedFloorSqm = totalFloorSqm * 0.82;
  const graniteFloorSqm = totalFloorSqm * 0.18;

  addItem('FLR-001', vitrifiedFloorSqm, finishMultiplier);
  addItem('FLR-002', graniteFloorSqm, finishMultiplier);

  // --------------------------------------------------------------------------
  // 6. Doors & Windows
  // --------------------------------------------------------------------------
  const doorsSqm = (builtUpArea * 0.035) * 0.0929;
  const windowsSqm = (builtUpArea * 0.042) * 0.0929;
  addItem('OPN-001', doorsSqm, finishMultiplier);
  addItem('OPN-002', windowsSqm, finishMultiplier);

  // --------------------------------------------------------------------------
  // 7. Plumbing & Sanitary Works
  // --------------------------------------------------------------------------
  addItem('MEP-P01', builtUpArea, finishMultiplier);
  // Estimated bathroom sets based on building area (approx 1 set per 800 sq.ft)
  const sanitarySets = Math.max(1, Math.round(builtUpArea / 800));
  addItem('MEP-P02', sanitarySets, finishMultiplier);

  // --------------------------------------------------------------------------
  // 8. Electrical Infrastructure
  // --------------------------------------------------------------------------
  addItem('MEP-E01', builtUpArea, finishMultiplier);

  // --------------------------------------------------------------------------
  // 9. Painting & Surface Finishes
  // --------------------------------------------------------------------------
  addItem('PNT-001', internalPlasterSqm, finishMultiplier);
  addItem('PNT-002', externalPlasterSqm, finishMultiplier);

  // --------------------------------------------------------------------------
  // Summation of Direct Costs
  // --------------------------------------------------------------------------
  let materialCost = 0;
  let labourCost = 0;
  let equipmentCost = 0;

  for (const item of items) {
    materialCost += item.quantity * item.materialRate;
    labourCost += item.quantity * item.labourRate;
    equipmentCost += item.quantity * item.equipmentRate;
  }

  materialCost = Math.round(materialCost);
  labourCost = Math.round(labourCost);
  equipmentCost = Math.round(equipmentCost);

  const directCost = materialCost + labourCost + equipmentCost;
  const overheadAmount = Math.round((directCost * overheadPercentage) / 100);
  const totalEstimatedCost = directCost + overheadAmount;
  const costPerSqFt = Math.round((totalEstimatedCost / Math.max(1, builtUpArea)) * 100) / 100;
  const estimateId = generateUUID();

  // Link items to estimate ID
  items.forEach((item) => {
    item.estimateId = estimateId;
  });

  const assumptions: CalculationAssumptions = {
    builtUpArea: project.builtUpArea,
    numberOfFloors: project.numberOfFloors,
    buildingType: project.buildingType,
    structuralSystem: project.structuralSystem,
    foundationType: project.foundationType,
    finishQuality: project.finishQuality,
    location: project.location,
    overheadPercentage,
    finishMultiplier,
    foundationMultiplier,
    rateSource,
    calculationDate: new Date().toISOString(),
  };

  return {
    id: estimateId,
    projectId: project.id,
    projectName: project.projectName,
    clientName: project.clientName,
    location: project.location,
    estimateName: options?.estimateName || `Cost Estimate: ${project.projectName}`,
    estimateType: 'Preliminary Area-Based',
    totalBuiltUpArea: builtUpArea,
    materialCost,
    labourCost,
    equipmentCost,
    directCost,
    overheadPercentage,
    overheadAmount,
    totalEstimatedCost,
    costPerSqFt,
    status: 'Finalized',
    items,
    calculationAssumptions: assumptions,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
