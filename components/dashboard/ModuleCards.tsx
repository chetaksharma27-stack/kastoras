'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  Calculator,
  Layers,
  Leaf,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export function ModuleCards() {
  const modules = [
    {
      id: 'M1',
      title: 'AI Construction Cost Estimation',
      tagline: 'Precision Rate Analysis & Takeoffs',
      description:
        'Generate structured construction cost estimates from project parameters, quantities and construction rates.',
      status: 'Foundation / Coming Soon',
      badgeVariant: 'amber' as const,
      icon: Calculator,
      cta: 'Open Cost Estimator',
      href: '/estimates',
      accentBorder: 'hover:border-amber-400/80',
      iconBg: 'bg-amber-500/10 text-amber-600 border border-amber-500/20',
      btnVariant: 'amber' as const,
      features: [
        'Deterministic rate analysis with civil material breakdown',
        'Direct takeoff from built-up area and structural specs',
        'Labour, equipment, and overhead coefficient scaling',
      ],
    },
    {
      id: 'M2',
      title: 'AI BOQ Generator',
      tagline: 'Automated Schedule of Quantities',
      description:
        'Convert construction drawings and project information into structured quantities and BOQ items.',
      status: 'Foundation / Coming Soon',
      badgeVariant: 'blue' as const,
      icon: Layers,
      cta: 'Open BOQ Generator',
      href: '/boq',
      accentBorder: 'hover:border-blue-400/80',
      iconBg: 'bg-blue-500/10 text-blue-600 border border-blue-500/20',
      btnVariant: 'primary' as const,
      features: [
        'Standard CPWD / IS-1200 measurement code taxonomy',
        'Itemized trade schedules (Earthwork, RCC, Masonry, Finishes)',
        'Exportable quantity takeoff sheets and work packages',
      ],
    },
    {
      id: 'M3',
      title: 'Carbon Analysis',
      tagline: 'Embodied Carbon & LCA Intelligence',
      description:
        'Estimate embodied carbon from material quantities and emission factors.',
      status: 'Foundation / Coming Soon',
      badgeVariant: 'emerald' as const,
      icon: Leaf,
      cta: 'Open Carbon Analysis',
      href: '/carbon',
      accentBorder: 'hover:border-emerald-400/80',
      iconBg: 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20',
      btnVariant: 'outline' as const,
      features: [
        'Embodied carbon metrics (kgCO₂e/m²) from Bill of Quantities',
        'Alternative cementitious & low-carbon material benchmarking',
        'Compliance with green building rating systems (LEED / GRIHA)',
      ],
    },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>Engineering Intelligence Modules</span>
          </h2>
          <p className="text-xs text-slate-500">
            Core computational engines powering the Kastoras civil engineering workflow.
          </p>
        </div>
        <div className="text-xs font-mono text-slate-500 self-start sm:self-auto">
          Workflow: Project Data → Cost & BOQ → Carbon
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {modules.map((mod) => {
          const Icon = mod.icon;
          return (
            <Card
              key={mod.id}
              hoverEffect
              className={`p-6 bg-white border-slate-200/90 flex flex-col justify-between transition-all duration-200 ${mod.accentBorder}`}
            >
              <div>
                {/* Header: Tag & Status */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
                      {mod.id}
                    </span>
                    <span className="text-xs font-medium text-slate-400 font-mono">
                      Module
                    </span>
                  </div>
                  <Badge variant={mod.badgeVariant} className="font-mono text-[11px]">
                    {mod.status}
                  </Badge>
                </div>

                {/* Icon & Title */}
                <div className="flex items-start gap-3.5 mb-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${mod.iconBg}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {mod.title}
                    </h3>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">
                      {mod.tagline}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed mt-3">
                  {mod.description}
                </p>

                {/* Feature highlights */}
                <div className="mt-4 pt-3.5 border-t border-slate-100 space-y-2">
                  {mod.features.map((feat) => (
                    <div key={feat} className="flex items-start gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="leading-tight">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link href={mod.href} className="block w-full">
                  <Button
                    variant={mod.btnVariant}
                    size="sm"
                    className="w-full justify-between"
                    icon={<ArrowRight className="w-4 h-4" />}
                    iconPosition="right"
                  >
                    {mod.cta}
                  </Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
