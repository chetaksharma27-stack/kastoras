'use client';

import React, { createContext, useContext, useState, useEffect, useTransition } from 'react';
import { Estimate } from '../types/estimation';
import {
  fetchEstimatesFromSupabase,
  saveEstimateToSupabase,
  deleteEstimateFromSupabase,
} from '../supabase/estimates';

interface EstimationContextType {
  estimates: Estimate[];
  getEstimateById: (id: string) => Estimate | undefined;
  getEstimatesByProjectId: (projectId: string) => Estimate[];
  saveEstimate: (estimate: Estimate) => Promise<Estimate>;
  deleteEstimate: (id: string) => Promise<void>;
  isLoading: boolean;
}

const EstimationContext = createContext<EstimationContextType | undefined>(undefined);

const STORAGE_KEY = 'kastoras_estimates_v2';

function getStoredEstimates(): Estimate[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error('Failed to load estimates from localStorage:', e);
    return [];
  }
}

export function EstimationProvider({ children }: { children: React.ReactNode }) {
  const [estimates, setEstimates] = useState<Estimate[]>(getStoredEstimates);
  const [isPending, startTransition] = useTransition();

  const syncWithLocalStorage = (newEstimates: Estimate[]) => {
    setEstimates(newEstimates);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newEstimates));
      } catch (e) {
        console.error('Failed to save estimates to localStorage:', e);
      }
    }
  };

  // Sync with Supabase on mount
  useEffect(() => {
    let isMounted = true;
    async function loadFromSupabase() {
      const remote = await fetchEstimatesFromSupabase();
      if (isMounted && remote && remote.length > 0) {
        startTransition(() => {
          syncWithLocalStorage(remote);
        });
      }
    }
    loadFromSupabase();
    return () => {
      isMounted = false;
    };
  }, []);

  const saveEstimate = async (estimate: Estimate): Promise<Estimate> => {
    // If id is not UUID format, format or maintain
    const updated = [estimate, ...estimates.filter((e) => e.id !== estimate.id)];
    syncWithLocalStorage(updated);

    // Background sync to Supabase
    saveEstimateToSupabase(estimate).catch((err) => {
      console.warn('Background Supabase save estimate notice:', err);
    });

    return estimate;
  };

  const getEstimateById = (id: string) => {
    return estimates.find((e) => e.id === id);
  };

  const getEstimatesByProjectId = (projectId: string) => {
    return estimates.filter((e) => e.projectId === projectId);
  };

  const deleteEstimate = async (id: string) => {
    const updated = estimates.filter((e) => e.id !== id);
    syncWithLocalStorage(updated);

    // Background sync to Supabase
    deleteEstimateFromSupabase(id).catch((err) => {
      console.warn('Background Supabase delete estimate notice:', err);
    });
  };

  return (
    <EstimationContext.Provider
      value={{
        estimates,
        getEstimateById,
        getEstimatesByProjectId,
        saveEstimate,
        deleteEstimate,
        isLoading: isPending,
      }}
    >
      {children}
    </EstimationContext.Provider>
  );
}

export function useEstimates() {
  const context = useContext(EstimationContext);
  if (!context) {
    throw new Error('useEstimates must be used within an EstimationProvider');
  }
  return context;
}
