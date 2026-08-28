export type EstimateCategory =
  | 'Substructure & Earthwork'
  | 'RCC & Structural Framework'
  | 'Masonry & Superstructure'
  | 'Waterproofing & Plastering'
  | 'Flooring & Tiling'
  | 'Doors & Windows'
  | 'Plumbing & Sanitary'
  | 'Electrical Infrastructure'
  | 'Painting & Surface Finishes'
  | 'Site Overheads & Supervision';

export interface EstimateItem {
  id: string;
  estimateId: string;
  category: EstimateCategory;
  itemCode: string;
  description: string;
  unit: string;
  quantity: number;
  materialRate: number;
  labourRate: number;
  equipmentRate: number;
  totalRate: number;
  amount: number;
}

export interface CalculationAssumptions {
  builtUpArea: number;
  numberOfFloors: number;
  buildingType: string;
  structuralSystem: string;
  foundationType: string;
  finishQuality: string;
  location: string;
  overheadPercentage: number;
  finishMultiplier: number;
  foundationMultiplier: number;
  rateSource: string;
  calculationDate: string;
}

export interface Estimate {
  id: string;
  projectId: string;
  projectName: string;
  clientName: string;
  location: string;
  estimateName: string;
  estimateType: string;
  totalBuiltUpArea: number;
  materialCost: number;
  labourCost: number;
  equipmentCost: number;
  directCost: number;
  overheadPercentage: number;
  overheadAmount: number;
  totalEstimatedCost: number;
  costPerSqFt: number;
  status: 'Draft' | 'Finalized' | 'Approved';
  items: EstimateItem[];
  calculationAssumptions: CalculationAssumptions;
  createdAt: string;
  updatedAt: string;
}

export interface RateItem {
  id?: string;
  itemCode: string;
  itemName: string;
  category: EstimateCategory;
  unit: string;
  materialRate: number;
  labourRate: number;
  equipmentRate: number;
  totalRate: number;
  location: string;
  effectiveDate: string;
  source: string;
  status: 'Active' | 'Archived';
}

// Supabase raw row interfaces
export interface SupabaseEstimateRow {
  id: string;
  project_id: string;
  estimate_name: string;
  estimate_type: string;
  total_built_up_area: number;
  material_cost: number;
  labour_cost: number;
  equipment_cost: number;
  direct_cost: number;
  overhead_percentage: number;
  overhead_amount: number;
  total_estimated_cost: number;
  cost_per_sqft: number;
  status: string;
  calculation_assumptions: CalculationAssumptions;
  created_at: string;
  updated_at: string;
}

export interface SupabaseEstimateItemRow {
  id: string;
  estimate_id: string;
  category: string;
  item_code: string;
  description: string;
  unit: string;
  quantity: number;
  material_rate: number;
  labour_rate: number;
  equipment_rate: number;
  total_rate: number;
  amount: number;
  created_at: string;
}

export function mapRowToEstimate(
  row: SupabaseEstimateRow,
  items: EstimateItem[] = [],
  projectName = '',
  clientName = '',
  location = ''
): Estimate {
  return {
    id: row.id,
    projectId: row.project_id,
    projectName: projectName || 'Project',
    clientName: clientName || '',
    location: location || '',
    estimateName: row.estimate_name,
    estimateType: row.estimate_type,
    totalBuiltUpArea: Number(row.total_built_up_area),
    materialCost: Number(row.material_cost),
    labourCost: Number(row.labour_cost),
    equipmentCost: Number(row.equipment_cost),
    directCost: Number(row.direct_cost),
    overheadPercentage: Number(row.overhead_percentage),
    overheadAmount: Number(row.overhead_amount),
    totalEstimatedCost: Number(row.total_estimated_cost),
    costPerSqFt: Number(row.cost_per_sqft),
    status: (row.status as 'Draft' | 'Finalized' | 'Approved') || 'Finalized',
    items,
    calculationAssumptions: row.calculation_assumptions || ({} as CalculationAssumptions),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapRowToEstimateItem(row: SupabaseEstimateItemRow): EstimateItem {
  return {
    id: row.id,
    estimateId: row.estimate_id,
    category: row.category as EstimateCategory,
    itemCode: row.item_code,
    description: row.description,
    unit: row.unit,
    quantity: Number(row.quantity),
    materialRate: Number(row.material_rate),
    labourRate: Number(row.labour_rate),
    equipmentRate: Number(row.equipment_rate),
    totalRate: Number(row.total_rate),
    amount: Number(row.amount),
  };
}
