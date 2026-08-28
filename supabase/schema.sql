-- ==============================================================================
-- KASTORAS Civil Engineering Intelligence Platform
-- Database Schema Migration: Module 1 (Construction Cost Estimation)
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. Projects Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_name TEXT NOT NULL,
    client_name TEXT NOT NULL,
    location TEXT NOT NULL,
    building_type TEXT NOT NULL,
    plot_area NUMERIC(12, 2) NOT NULL CHECK (plot_area > 0),
    built_up_area NUMERIC(12, 2) NOT NULL CHECK (built_up_area > 0),
    number_of_floors INTEGER NOT NULL CHECK (number_of_floors >= 1),
    structural_system TEXT NOT NULL,
    foundation_type TEXT NOT NULL,
    roof_type TEXT NOT NULL,
    material_grade TEXT,
    finish_quality TEXT NOT NULL DEFAULT 'Standard',
    description TEXT,
    status TEXT NOT NULL DEFAULT 'Planning',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. Estimates Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.estimates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    estimate_name TEXT NOT NULL,
    estimate_type TEXT NOT NULL DEFAULT 'Preliminary Area-Based',
    total_built_up_area NUMERIC(12, 2) NOT NULL,
    material_cost NUMERIC(14, 2) NOT NULL DEFAULT 0,
    labour_cost NUMERIC(14, 2) NOT NULL DEFAULT 0,
    equipment_cost NUMERIC(14, 2) NOT NULL DEFAULT 0,
    direct_cost NUMERIC(14, 2) NOT NULL DEFAULT 0,
    overhead_percentage NUMERIC(5, 2) NOT NULL DEFAULT 12.00,
    overhead_amount NUMERIC(14, 2) NOT NULL DEFAULT 0,
    total_estimated_cost NUMERIC(14, 2) NOT NULL DEFAULT 0,
    cost_per_sqft NUMERIC(10, 2) NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'Finalized',
    calculation_assumptions JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. Estimate Items Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.estimate_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    estimate_id UUID NOT NULL REFERENCES public.estimates(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    item_code TEXT NOT NULL,
    description TEXT NOT NULL,
    unit TEXT NOT NULL,
    quantity NUMERIC(12, 3) NOT NULL CHECK (quantity >= 0),
    material_rate NUMERIC(12, 2) NOT NULL DEFAULT 0,
    labour_rate NUMERIC(12, 2) NOT NULL DEFAULT 0,
    equipment_rate NUMERIC(12, 2) NOT NULL DEFAULT 0,
    total_rate NUMERIC(12, 2) NOT NULL DEFAULT 0,
    amount NUMERIC(14, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. Rate Database Table (Baseline Unit Rates)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.rate_database (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_code TEXT NOT NULL UNIQUE,
    item_name TEXT NOT NULL,
    category TEXT NOT NULL,
    unit TEXT NOT NULL,
    material_rate NUMERIC(12, 2) NOT NULL DEFAULT 0,
    labour_rate NUMERIC(12, 2) NOT NULL DEFAULT 0,
    equipment_rate NUMERIC(12, 2) NOT NULL DEFAULT 0,
    location TEXT NOT NULL DEFAULT 'National Baseline',
    effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
    source TEXT NOT NULL DEFAULT 'Illustrative/MVP rate',
    status TEXT NOT NULL DEFAULT 'Active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. Specialized Rate Sub-Tables
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.material_rates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    material_code TEXT NOT NULL UNIQUE,
    material_name TEXT NOT NULL,
    unit TEXT NOT NULL,
    base_rate NUMERIC(12, 2) NOT NULL,
    supplier_notes TEXT,
    source TEXT NOT NULL DEFAULT 'Illustrative/MVP rate',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.labour_rates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trade_code TEXT NOT NULL UNIQUE,
    trade_name TEXT NOT NULL,
    unit TEXT NOT NULL DEFAULT 'day',
    daily_wage NUMERIC(10, 2) NOT NULL,
    source TEXT NOT NULL DEFAULT 'Illustrative/MVP rate',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.equipment_rates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    equipment_code TEXT NOT NULL UNIQUE,
    equipment_name TEXT NOT NULL,
    unit TEXT NOT NULL DEFAULT 'hr',
    hourly_rate NUMERIC(10, 2) NOT NULL,
    source TEXT NOT NULL DEFAULT 'Illustrative/MVP rate',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. Indexes for Fast Lookups
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_estimates_project_id ON public.estimates(project_id);
CREATE INDEX IF NOT EXISTS idx_estimate_items_estimate_id ON public.estimate_items(estimate_id);
CREATE INDEX IF NOT EXISTS idx_rate_database_category ON public.rate_database(category);

-- ------------------------------------------------------------------------------
-- 7. Row Level Security (RLS) Policies
-- ------------------------------------------------------------------------------
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estimate_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_database ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.labour_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_rates ENABLE ROW LEVEL SECURITY;

-- Allow public read/write for MVP workspace (or authenticated users)
CREATE POLICY "Allow public read access on projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on projects" ON public.projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on projects" ON public.projects FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on projects" ON public.projects FOR DELETE USING (true);

CREATE POLICY "Allow public read access on estimates" ON public.estimates FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on estimates" ON public.estimates FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on estimates" ON public.estimates FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on estimates" ON public.estimates FOR DELETE USING (true);

CREATE POLICY "Allow public read access on estimate_items" ON public.estimate_items FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on estimate_items" ON public.estimate_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete access on estimate_items" ON public.estimate_items FOR DELETE USING (true);

CREATE POLICY "Allow public read access on rate_database" ON public.rate_database FOR SELECT USING (true);
CREATE POLICY "Allow public read access on material_rates" ON public.material_rates FOR SELECT USING (true);
CREATE POLICY "Allow public read access on labour_rates" ON public.labour_rates FOR SELECT USING (true);
CREATE POLICY "Allow public read access on equipment_rates" ON public.equipment_rates FOR SELECT USING (true);
