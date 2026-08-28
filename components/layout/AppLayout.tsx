'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { ProjectProvider } from '../../lib/store/project-context';
import { EstimationProvider } from '../../lib/store/estimation-context';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <ProjectProvider>
      <EstimationProvider>
        <div className="flex h-screen w-full bg-[#F8FAFC] overflow-hidden text-slate-900 font-sans">
          {/* Desktop Sidebar */}
          <div className="hidden lg:flex shrink-0 h-full">
            <Sidebar />
          </div>

          {/* Mobile Navigation Drawer */}
          <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
            <Header onOpenMobileMenu={() => setMobileNavOpen(true)} />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
              <div className="max-w-7xl mx-auto space-y-6">{children}</div>
            </main>
          </div>
        </div>
      </EstimationProvider>
    </ProjectProvider>
  );
}
