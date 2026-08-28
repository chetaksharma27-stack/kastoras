import React from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { QuickActions } from '../components/dashboard/QuickActions';
import { ModuleCards } from '../components/dashboard/ModuleCards';
import { RecentProjects } from '../components/dashboard/RecentProjects';

export default function HomePage() {
  return (
    <AppLayout>
      <div className="space-y-7">
        <DashboardHeader />
        <DashboardStats />
        <QuickActions />
        <ModuleCards />
        <RecentProjects />
      </div>
    </AppLayout>
  );
}
