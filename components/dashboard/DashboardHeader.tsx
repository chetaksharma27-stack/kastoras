'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { Plus, HardHat } from 'lucide-react';

export function DashboardHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-slate-900 text-amber-300 border border-slate-700">
            <HardHat className="w-3 h-3 text-amber-400" />
            Engineering Workspace
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Good morning, Engineer
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Manage your construction projects, estimates, BOQs and carbon analysis from one unified platform.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/projects/new">
          <Button
            size="md"
            variant="amber"
            icon={<Plus className="w-4 h-4" />}
            className="w-full sm:w-auto shadow-xs font-semibold"
          >
            New Project
          </Button>
        </Link>
      </div>
    </div>
  );
}
