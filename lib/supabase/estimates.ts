import { supabase } from './client';
import {
  Estimate,
  SupabaseEstimateRow,
  SupabaseEstimateItemRow,
  mapRowToEstimate,
  mapRowToEstimateItem,
} from '../types/estimation';

/**
 * Fetch estimates from Supabase, optionally filtered by project ID
 */
export async function fetchEstimatesFromSupabase(
  projectId?: string
): Promise<Estimate[] | null> {
  try {
    let query = supabase.from('estimates').select(`
      *,
      estimate_items (*)
    `);

    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.warn('Supabase fetch estimates notice:', error.message);
      return null;
    }

    if (!data) return [];

    return data.map((row) => {
      const rawItems = (row.estimate_items || []) as SupabaseEstimateItemRow[];
      const items = rawItems.map(mapRowToEstimateItem);
      return mapRowToEstimate(row as SupabaseEstimateRow, items);
    });
  } catch (err) {
    console.warn('Supabase estimates query exception:', err);
    return null;
  }
}

/**
 * Fetch a single estimate and its line items by ID from Supabase
 */
export async function fetchEstimateByIdFromSupabase(
  id: string
): Promise<Estimate | null> {
  try {
    const { data, error } = await supabase
      .from('estimates')
      .select(`
        *,
        estimate_items (*)
      `)
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    const rawItems = (data.estimate_items || []) as SupabaseEstimateItemRow[];
    const items = rawItems.map(mapRowToEstimateItem);
    return mapRowToEstimate(data as SupabaseEstimateRow, items);
  } catch (err) {
    console.warn('Supabase single estimate query exception:', err);
    return null;
  }
}

/**
 * Save an estimate and its itemized lines to Supabase
 */
export async function saveEstimateToSupabase(
  estimate: Estimate
): Promise<Estimate | null> {
  try {
    const estimateRow = {
      id: estimate.id,
      project_id: estimate.projectId,
      estimate_name: estimate.estimateName,
      estimate_type: estimate.estimateType,
      total_built_up_area: estimate.totalBuiltUpArea,
      material_cost: estimate.materialCost,
      labour_cost: estimate.labourCost,
      equipment_cost: estimate.equipmentCost,
      direct_cost: estimate.directCost,
      overhead_percentage: estimate.overheadPercentage,
      overhead_amount: estimate.overheadAmount,
      total_estimated_cost: estimate.totalEstimatedCost,
      cost_per_sqft: estimate.costPerSqFt,
      status: estimate.status,
      calculation_assumptions: estimate.calculationAssumptions,
      created_at: estimate.createdAt,
      updated_at: estimate.updatedAt,
    };

    // 1. Upsert Estimate header
    const { error: estError } = await supabase
      .from('estimates')
      .upsert(estimateRow);

    if (estError) {
      console.warn('Supabase save estimate notice:', estError.message);
      return null;
    }

    // 2. Insert Estimate Items
    if (estimate.items && estimate.items.length > 0) {
      const itemRows = estimate.items.map((item) => ({
        id: item.id,
        estimate_id: estimate.id,
        category: item.category,
        item_code: item.itemCode,
        description: item.description,
        unit: item.unit,
        quantity: item.quantity,
        material_rate: item.materialRate,
        labour_rate: item.labourRate,
        equipment_rate: item.equipmentRate,
        total_rate: item.totalRate,
        amount: item.amount,
      }));

      const { error: itemsError } = await supabase
        .from('estimate_items')
        .upsert(itemRows);

      if (itemsError) {
        console.warn('Supabase save estimate items notice:', itemsError.message);
      }
    }

    return estimate;
  } catch (err) {
    console.warn('Supabase save estimate exception:', err);
    return null;
  }
}

/**
 * Delete estimate from Supabase
 */
export async function deleteEstimateFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('estimates').delete().eq('id', id);
    if (error) {
      console.warn('Supabase delete estimate notice:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase delete estimate exception:', err);
    return false;
  }
}
