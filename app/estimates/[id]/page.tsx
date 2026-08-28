import React from 'react';
import { AppLayout } from '../../../components/layout/AppLayout';
import { EstimateResultsView } from '../../../components/estimation/EstimateResultsView';

export default async function EstimateDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <AppLayout>
      <EstimateResultsView id={id} />
    </AppLayout>
  );
}
