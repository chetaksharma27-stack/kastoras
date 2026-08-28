'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import {
  Plus,
  Calculator,
  Layers,
  Leaf,
  ChevronRight,
} from 'lucide-react';

export function QuickActions() {
  const actions = [
    {
      title: 'Create New Project',
      subtitle: 'Define building parameters, areas & structural specs',
      href: '/projects/new',
      icon: Plus,
      module: 'Core System',
      badgeVariant: 'slate' as const,
      buttonColor: 'bg-slate-900 text-white hover:bg-slate-800',
    },
    {
      title: 'Create Cost Estimate',
      subtitle: 'Prepare quantity takeoffs and rate calculations',
      href: '/estimates',
      icon: Calculator,
      module: 'Module 1',
      badgeVariant: 'amber' as const,
      buttonColor: 'bg-amber-600 text-white hover:bg-amber-700',
    },
    {
      title: 'Generate BOQ',
      subtitle: 'Extract bills of quantities and item schedules',
      href: '/boq',
      icon: Layers,
      module: 'Module 2',
      badgeVariant: 'blue' as const,
      buttonColor: 'bg-blue-600 text-white hover:bg-blue-700',
    },
    {
      title: 'Carbon Analysis',
      subtitle: 'Audit embodied carbon from material takeoffs',
      href: '/carbon',
      icon: Leaf,
      module: 'Module 3',
      badgeVariant: 'emerald' as const,
      buttonColor: 'bg-emerald-600 text-white hover:bg-emerald-700',
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
          <span>Quick Actions</span>
        </h2>
        <span className="text-xs text-slate-500 font-mono">Module Launchers</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.title} href={action.href} className="block group">
              <Card
                hoverEffect
                className="p-4 border-slate-200/80 bg-white h-full flex flex-col justify-between group-hover:border-slate-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <Badge variant={action.badgeVariant} className="font-mono text-[10px]">
                      {action.module}
                    </Badge>
                    <div className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-slate-200 transition-colors">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 group-hover:text-amber-700 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                    {action.subtitle}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-600 group-hover:text-slate-900">
                  <span>Launch workflow</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
