import React from 'react';
import { AppLayout } from '../../../components/layout/AppLayout';
import { ProjectDetailView } from '../../../components/projects/ProjectDetailView';

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <AppLayout>
      <ProjectDetailView id={id} />
    </AppLayout>
  );
}
