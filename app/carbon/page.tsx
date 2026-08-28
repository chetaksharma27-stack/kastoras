import React from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { ModulePlaceholder } from '../../components/modules/ModulePlaceholder';

export default function CarbonPage() {
  return (
    <AppLayout>
      <ModulePlaceholder
        moduleNumber="M3"
        title="Carbon Footprint & LCA Analysis"
        subtitle="Estimate embodied carbon from material quantities and emission factors."
        description="A lifecycle assessment (LCA) module calculating upfront embodied carbon (Stages A1-A5) across structural concrete, structural steel, masonry, rebar, and architectural building envelopes."
        accentColor="emerald"
        workflowSteps={[
          {
            title: 'Material Bill of Quantities Linkage',
            desc: 'Extracts exact weights and volumes from the BOQ module (tonnes of steel, m³ of concrete).',
          },
          {
            title: 'EPD & Emission Factor Database Matching',
            desc: 'Links regional Environmental Product Declarations (ICE Database / Ecoinvent / EC3).',
          },
          {
            title: 'Embodied Carbon Aggregation',
            desc: 'Calculates total kgCO₂e and carbon intensity benchmarked against floor area (kgCO₂e/m²).',
          },
          {
            title: 'Low-Carbon Optimization Suggestions',
            desc: 'Models carbon reduction scenarios (e.g., Fly Ash/GGBS replacement, recycled steel).',
          },
        ]}
        plannedInputs={[
          'Itemized material quantities from BOQ or manual input',
          'Concrete mix design (OPC vs. PPC vs. GGBS blend percentage)',
          'Steel manufacturing route (Electric Arc Furnace vs. Blast Furnace)',
          'Building design life & gross floor area (GFA)',
          'Regional electricity grid emission factors',
        ]}
        expectedOutputs={[
          'Total Upfront Embodied Carbon (tCO₂e)',
          'Carbon Intensity Index (kgCO₂e/m² GFA)',
          'Trade-by-trade emission breakdown charts (Substructure vs Superstructure)',
          'Low-carbon material replacement comparison matrix',
          'Sustainability rating compliance summary (LEED / BREEAM / GRIHA)',
        ]}
      />
    </AppLayout>
  );
}
