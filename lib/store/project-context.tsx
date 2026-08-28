'use client';

import React, { createContext, useContext, useState, useEffect, useTransition } from 'react';
import { Project, ProjectFormData } from '../types/project';
import {
  fetchProjectsFromSupabase,
  saveProjectToSupabase,
  deleteProjectFromSupabase,
} from '../supabase/projects';

interface ProjectContextType {
  projects: Project[];
  getProjectById: (id: string) => Project | undefined;
  addProject: (data: ProjectFormData) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
  isLoading: boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const STORAGE_KEY = 'kastoras_projects_v2';

function getStoredProjects(): Project[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error('Failed to load projects from localStorage:', e);
    return [];
  }
}

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(getStoredProjects);
  const [isPending, startTransition] = useTransition();

  const syncWithLocalStorage = (newProjects: Project[]) => {
    setProjects(newProjects);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newProjects));
      } catch (e) {
        console.error('Failed to save projects to localStorage:', e);
      }
    }
  };

  // On mount, attempt background sync with Supabase if available
  useEffect(() => {
    let isMounted = true;
    async function loadFromSupabase() {
      const remoteProjects = await fetchProjectsFromSupabase();
      if (isMounted && remoteProjects && remoteProjects.length > 0) {
        startTransition(() => {
          syncWithLocalStorage(remoteProjects);
        });
      }
    }
    loadFromSupabase();
    return () => {
      isMounted = false;
    };
  }, []);

  const addProject = async (data: ProjectFormData): Promise<Project> => {
    // Generate UUID v4 format or fallback valid string
    const generatedId =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `00000000-0000-4000-8000-${Date.now().toString(16).padStart(12, '0')}`;

    const newProject: Project = {
      id: generatedId,
      projectName: data.projectName.trim(),
      clientName: data.clientName.trim(),
      location: data.location.trim(),
      buildingType: data.buildingType,
      plotArea: Number(data.plotArea),
      builtUpArea: Number(data.builtUpArea),
      numberOfFloors: Number(data.numberOfFloors),
      structuralSystem: data.structuralSystem,
      foundationType: data.foundationType,
      roofType: data.roofType,
      materialGrade: data.materialGrade?.trim() || 'M25 Concrete / Fe500 Steel',
      finishQuality: data.finishQuality,
      description: data.description?.trim(),
      status: 'Planning',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newProject, ...projects];
    syncWithLocalStorage(updated);

    // Background sync to Supabase
    saveProjectToSupabase(newProject).catch((err) => {
      console.warn('Background Supabase save notice:', err);
    });

    return newProject;
  };

  const getProjectById = (id: string) => {
    return projects.find((p) => p.id === id);
  };

  const deleteProject = async (id: string) => {
    const updated = projects.filter((p) => p.id !== id);
    syncWithLocalStorage(updated);

    // Background sync to Supabase
    deleteProjectFromSupabase(id).catch((err) => {
      console.warn('Background Supabase delete notice:', err);
    });
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        getProjectById,
        addProject,
        deleteProject,
        isLoading: isPending,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
}
