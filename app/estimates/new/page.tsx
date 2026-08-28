import React, { Suspense } from 'react';
import { AppLayout } from '../../../components/layout/AppLayout';
import { NewEstimateWizard } from '../../../components/estimation/NewEstimateWizard';
import { Card } from '../../../components/ui/Card';

export default function NewEstimatePage() {
  return (
    <AppLayout>
      <Suspense
        fallback={
          <Card className="p-12 text-center bg-white border-slate-200">
            <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-amber-600 animate-spin mx-auto" />
            <p className="text-xs text-slate-500 mt-2">Loading estimation engine...</p>
          </Card>
        }
      >
        <NewEstimateWizard />
      </Suspense>
    </AppLayout>
  );
}
