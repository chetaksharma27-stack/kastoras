'use client';

import React, { useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  FileBarChart2,
  Calculator,
  Layers,
  Leaf,
  Plus,
} from 'lucide-react';
import Link from 'next/link';

export default function ReportsPage() {
  const [activeCategory, setActiveCategory] = useState<'cost' | 'boq' | 'carbon'>('cost');

  const categories = [
    {
      id: 'cost' as const,
      name: 'Cost Estimate Reports',
      icon: Calculator,
      badge: 'amber' as const,
      count: 0,
      description: 'Abstract of estimated costs, rate analysis breakdowns, and cash-flow projections.',
    },
    {
      id: 'boq' as const,
      name: 'BOQ Reports',
      icon: Layers,
      badge: 'blue' as const,
      count: 0,
      description: 'Itemized bills of quantities, trade schedules, measurement books, and bar bending schedules.',
    },
    {
      id: 'carbon' as const,
      name: 'Carbon Reports',
      icon: Leaf,
      badge: 'emerald' as const,
      count: 0,
      description: 'Embodied carbon audit summaries, lifecycle stage A1-A5 breakdowns, and green compliance ratings.',
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Reports & Engineering Deliverables
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Central archive for generated cost summaries, tender-ready BOQ schedules, and embodied carbon certificates.
            </p>
          </div>

          <Link href="/projects/new">
            <Button variant="amber" size="sm" icon={<Plus className="w-4 h-4" />}>
              Generate from Project
            </Button>
          </Link>
        </div>

        {/* Category Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white border-slate-900 shadow-xs ring-1 ring-slate-900'
                    : 'bg-white/70 border-slate-200 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                    <Icon className="w-4 h-4" />
                  </div>
                  <Badge variant={cat.badge} className="font-mono text-[10px]">
                    {cat.count} files
                  </Badge>
                </div>
                <h3 className="text-xs font-bold text-slate-900">{cat.name}</h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug line-clamp-2">
                  {cat.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Empty State for Reports */}
        <Card className="p-12 text-center bg-white border-slate-200 border-dashed">
          <div className="max-w-md mx-auto flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mb-4 shadow-2xs">
              <FileBarChart2 className="w-7 h-7 text-slate-500" />
            </div>

            <h3 className="text-base font-bold text-slate-900">
              No reports in this category yet
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Exportable engineering reports will appear here once an estimation, quantity extraction, or carbon audit is executed for a project.
            </p>

            <div className="mt-5 flex items-center gap-3">
              <Link href="/projects">
                <Button variant="outline" size="sm">
                  View Projects
                </Button>
              </Link>
              <Link href="/projects/new">
                <Button variant="amber" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
                  Create Project
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
