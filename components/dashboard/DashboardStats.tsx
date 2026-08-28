'use client';

import React from 'react';
import { Card } from '../ui/Card';
import { useProjects } from '../../lib/store/project-context';
import { useEstimates } from '../../lib/store/estimation-context';
import {
  FolderKanban,
  Calculator,
  Layers,
  Leaf,
  ArrowUpRight,
} from 'lucide-react';
import Link from 'next/link';

export function DashboardStats() {
  const { projects } = useProjects();
  const { estimates } = useEstimates();

  const stats = [
    {
      title: 'Total Projects',
      value: projects.length,
      unit: projects.length === 1 ? 'project configured' : 'projects configured',
      icon: FolderKanban,
      href: '/projects',
      accentColor: 'text-slate-900',
      bgColor: 'bg-slate-100',
      description: 'Active building project records',
    },
    {
      title: 'Active Estimates',
      value: estimates.length,
      unit: estimates.length === 1 ? 'estimate generated' : 'estimates generated',
      icon: Calculator,
      href: '/estimates',
      accentColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
      description: 'Calculated civil cost models',
      badge: 'M1 Active',
    },
    {
      title: 'BOQs Generated',
      value: 0,
      unit: 'schedules',
      icon: Layers,
      href: '/boq',
      accentColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Bills of quantities & takeoffs',
      badge: 'Module 2 Next',
    },
    {
      title: 'Carbon Analyses',
      value: 0,
      unit: 'embodied CO₂ audits',
      icon: Leaf,
      href: '/carbon',
      accentColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      description: 'Embodied carbon assessments',
      badge: 'Module 3 Next',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Link key={stat.title} href={stat.href} className="block group">
            <Card
              hoverEffect
              className="p-5 border-slate-200/80 bg-white relative overflow-hidden transition-all duration-200 group-hover:border-slate-300"
            >
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center ${stat.accentColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400 group-hover:text-slate-700 transition-colors">
                  <span className="font-mono text-[11px]">View</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider font-mono">
                  {stat.title}
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-bold font-mono tracking-tight text-slate-900">
                    {stat.value}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{stat.unit}</span>
                </div>
                <p className="text-xs text-slate-500 mt-2 truncate">{stat.description}</p>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
