import React from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { ModulePlaceholder } from '../../components/modules/ModulePlaceholder';

export default function BoqPage() {
  return (
    <AppLayout>
      <ModulePlaceholder
        moduleNumber="M2"
        title="AI BOQ Generator"
        subtitle="Convert construction drawings and project information into structured quantities and BOQ items."
        description="Standardized quantity extraction adhering to standard civil measurement codes (IS 1200 / NRM2 / POMI). Segregates work into sub-structure, super-structure, internal finishes, and MEP packages."
        accentColor="blue"
        workflowSteps={[
          {
            title: 'Drawing Parsing & Layer Identification',
            desc: 'Extracts dimensional grids, wall centerlines, slab spans, and column schedules.',
          },
          {
            title: 'Measurement Code Categorization',
            desc: 'Assigns standard measurement rules (e.g. deductions for openings, overlap rules).',
          },
          {
            title: 'Bill Item Compilation',
            desc: 'Generates structured item descriptions with standard units (cum, sqm, rmt, tonne, nos).',
          },
          {
            title: 'Verification & Export Packaging',
            desc: 'Cross-checks total quantities against building volume and exports to tender format.',
          },
        ]}
        plannedInputs={[
          '2D CAD layout plans (DWG/DXF) & structural drawings',
          'Building dimensional schedules (Slab, Beam, Column, Footing)',
          'Measurement code standard selection (CPWD / IS 1200 / SMM7)',
          'Opening schedules (Doors, Windows, Structural Voids)',
        ]}
        expectedOutputs={[
          'Detailed Bill of Quantities (BOQ) with trade hierarchy',
          'Measurement Book (MB) takeoff sheets with step-by-step dimensions',
          'Bar Bending Schedule (BBS) summaries for reinforcement',
          'Tender-ready Excel workbook & printable schedules',
        ]}
      />
    </AppLayout>
  );
}
