import { supabase } from './client';
import { Project, SupabaseProjectRow, mapRowToProject, mapProjectToRow } from '../types/project';

/**
 * Fetch all projects from Supabase
 */
export async function fetchProjectsFromSupabase(): Promise<Project[] | null> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch projects notice:', error.message);
      return null;
    }

    if (!data) return [];
    return (data as SupabaseProjectRow[]).map(mapRowToProject);
  } catch (err) {
    console.warn('Supabase projects query exception:', err);
    return null;
  }
}

/**
 * Fetch single project by ID from Supabase
 */
export async function fetchProjectByIdFromSupabase(id: string): Promise<Project | null> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    return mapRowToProject(data as SupabaseProjectRow);
  } catch (err) {
    console.warn('Supabase project query exception:', err);
    return null;
  }
}

/**
 * Save / Insert project into Supabase
 */
export async function saveProjectToSupabase(project: Project): Promise<Project | null> {
  try {
    const row = mapProjectToRow(project);
    const { data, error } = await supabase
      .from('projects')
      .upsert(row)
      .select()
      .single();

    if (error || !data) {
      console.warn('Supabase save project notice:', error?.message);
      return null;
    }

    return mapRowToProject(data as SupabaseProjectRow);
  } catch (err) {
    console.warn('Supabase save project exception:', err);
    return null;
  }
}

/**
 * Delete project from Supabase
 */
export async function deleteProjectFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) {
      console.warn('Supabase delete project notice:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase delete project exception:', err);
    return false;
  }
}
