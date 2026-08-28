'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

export function Breadcrumbs() {
  const pathname = usePathname();

  if (pathname === '/') {
    return (
      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
        <Home className="w-3.5 h-3.5 text-slate-400" />
        <span>Platform Workspace</span>
        <ChevronRight className="w-3 h-3 text-slate-300" />
        <span className="text-slate-900 font-semibold">Dashboard</span>
      </div>
    );
  }

  const segments = pathname.split('/').filter(Boolean);

  const segmentLabels: Record<string, string> = {
    projects: 'Projects',
    new: 'New Project',
    estimates: 'Cost Estimation (M1)',
    boq: 'BOQ Generator (M2)',
    carbon: 'Carbon Analysis (M3)',
    library: 'Construction Library',
    reports: 'Reports & Analytics',
    settings: 'Settings',
  };

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
      <Link href="/" className="hover:text-slate-900 flex items-center gap-1 transition-colors">
        <Home className="w-3.5 h-3.5 text-slate-400" />
        <span className="hidden sm:inline">Workspace</span>
      </Link>

      {segments.map((seg, idx) => {
        const href = `/${segments.slice(0, idx + 1).join('/')}`;
        const isLast = idx === segments.length - 1;
        const label = segmentLabels[seg] || (seg.startsWith('proj-') ? 'Project Details' : seg);

        return (
          <React.Fragment key={href}>
            <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
            {isLast ? (
              <span className="text-slate-900 font-semibold truncate max-w-[180px] sm:max-w-none">
                {label}
              </span>
            ) : (
              <Link href={href} className="hover:text-slate-900 transition-colors truncate">
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
