import React from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { ProjectList } from '../../components/projects/ProjectList';

export default function ProjectsPage() {
  return (
    <AppLayout>
      <ProjectList />
    </AppLayout>
  );
}
