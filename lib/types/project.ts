export type BuildingType =
  | 'Residential'
  | 'Commercial'
  | 'Institutional'
  | 'Industrial';

export type StructuralSystem =
  | 'RCC Frame'
  | 'Load Bearing'
  | 'Steel Frame'
  | 'Other';

export type FoundationType =
  | 'Isolated Footing'
  | 'Combined Footing'
  | 'Raft Foundation'
  | 'Pile Foundation'
  | 'Other';

export type RoofType =
  | 'RCC Slab'
  | 'Metal Roof'
  | 'Flat Roof'
  | 'Other';

export type FinishQuality =
  | 'Economy'
  | 'Standard'
  | 'Premium'
  | 'Luxury';

export type ProjectStatus =
  | 'Planning'
  | 'Active'
  | 'Under Review'
  | 'Completed';

export interface Project {
  id: string;
  projectName: string;
  clientName: string;
  location: string;
  buildingType: BuildingType;
  plotArea: number; // in sq.ft
  builtUpArea: number; // in sq.ft
  numberOfFloors: number;
  structuralSystem: StructuralSystem;
  foundationType: FoundationType;
  roofType: RoofType;
  materialGrade: string;
  finishQuality: FinishQuality;
  description?: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFormData {
  projectName: string;
  clientName: string;
  location: string;
  buildingType: BuildingType;
  plotArea: string | number;
  builtUpArea: string | number;
  numberOfFloors: string | number;
  structuralSystem: StructuralSystem;
  foundationType: FoundationType;
  roofType: RoofType;
  materialGrade: string;
  finishQuality: FinishQuality;
  description: string;
}

// Supabase raw row interface (snake_case)
export interface SupabaseProjectRow {
  id: string;
  project_name: string;
  client_name: string;
  location: string;
  building_type: string;
  plot_area: number;
  built_up_area: number;
  number_of_floors: number;
  structural_system: string;
  foundation_type: string;
  roof_type: string;
  material_grade: string | null;
  finish_quality: string;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export function mapRowToProject(row: SupabaseProjectRow): Project {
  return {
    id: row.id,
    projectName: row.project_name,
    clientName: row.client_name,
    location: row.location,
    buildingType: row.building_type as BuildingType,
    plotArea: Number(row.plot_area),
    builtUpArea: Number(row.built_up_area),
    numberOfFloors: Number(row.number_of_floors),
    structuralSystem: row.structural_system as StructuralSystem,
    foundationType: row.foundation_type as FoundationType,
    roofType: row.roof_type as RoofType,
    materialGrade: row.material_grade || 'M25 Concrete / Fe500 Steel',
    finishQuality: row.finish_quality as FinishQuality,
    description: row.description || '',
    status: (row.status as ProjectStatus) || 'Planning',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapProjectToRow(proj: Project): Partial<SupabaseProjectRow> {
  return {
    id: proj.id,
    project_name: proj.projectName,
    client_name: proj.clientName,
    location: proj.location,
    building_type: proj.buildingType,
    plot_area: proj.plotArea,
    built_up_area: proj.builtUpArea,
    number_of_floors: proj.numberOfFloors,
    structural_system: proj.structuralSystem,
    foundation_type: proj.foundationType,
    roof_type: proj.roofType,
    material_grade: proj.materialGrade,
    finish_quality: proj.finishQuality,
    description: proj.description || null,
    status: proj.status,
    created_at: proj.createdAt,
    updated_at: proj.updatedAt,
  };
}
