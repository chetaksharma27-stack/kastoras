import React from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { EstimateList } from '../../components/estimation/EstimateList';

export default function EstimatesPage() {
  return (
    <AppLayout>
      <EstimateList />
    </AppLayout>
  );
}
