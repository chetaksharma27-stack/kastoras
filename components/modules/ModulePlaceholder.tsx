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
  ArrowLeft,
  CheckCircle2,
  FileCode2,
  Workflow,
  HardHat,
  Database,
  ArrowRight,
} from 'lucide-react';

interface ModulePlaceholderProps {
  moduleNumber: 'M1' | 'M2' | 'M3';
  title: string;
  subtitle: string;
  description: string;
  accentColor: 'amber' | 'blue' | 'emerald';
  workflowSteps: { title: string; desc: string }[];
  plannedInputs: string[];
  expectedOutputs: string[];
}

export function ModulePlaceholder({
  moduleNumber,
  title,
  subtitle,
  description,
  accentColor,
  workflowSteps,
  plannedInputs,
  expectedOutputs,
}: ModulePlaceholderProps) {
  const badgeMap = {
    amber: 'amber' as const,
    blue: 'blue' as const,
    emerald: 'emerald' as const,
  };

  const iconMap = {
    M1: Calculator,
    M2: Layers,
    M3: Leaf,
  };

  const Icon = iconMap[moduleNumber];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <Link
          href="/"
          className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <span className="font-mono text-xs text-slate-400">ENGINEERING MODULE {moduleNumber}</span>
      </div>

      {/* Module Hero Banner */}
      <Card className="p-6 sm:p-8 bg-white border-slate-200/90 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-slate-900 text-white">
                {moduleNumber}
              </span>
              <Badge variant={badgeMap[accentColor]} className="font-mono text-xs">
                Foundation Phase / Next Milestone
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {title}
            </h1>

            <p className="text-sm font-medium text-slate-700 max-w-2xl">{subtitle}</p>

            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              {description}
            </p>
          </div>

          <div className="shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 shadow-xs">
              <Icon className="w-8 h-8 text-amber-600" />
            </div>
          </div>
        </div>

        {/* Phase notice alert */}
        <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
          <HardHat className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-semibold text-slate-900">
              Module under engineering development
            </p>
            <p className="text-slate-600 mt-0.5 leading-relaxed">
              Kastoras adheres strictly to deterministic civil engineering formulas and genuine rate analysis.
              This module will be activated in the next development phase once the item rate database and takeoff parsing engines are wired.
            </p>
          </div>
        </div>
      </Card>

      {/* Workflow & Architecture Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Workflow Steps */}
        <Card className="p-6 bg-white border-slate-200 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <Workflow className="w-4 h-4 text-slate-600" />
            <span>Deterministic Workflow Pipeline</span>
          </h3>

          <div className="space-y-4">
            {workflowSteps.map((step, idx) => (
              <div key={step.title} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{step.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Specifications & Schema */}
        <div className="space-y-6">
          <Card className="p-6 bg-white border-slate-200 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
              <Database className="w-4 h-4 text-slate-600" />
              <span>Engine Input Requirements</span>
            </h3>
            <ul className="space-y-2">
              {plannedInputs.map((item) => (
                <li key={item} className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6 bg-white border-slate-200 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
              <FileCode2 className="w-4 h-4 text-slate-600" />
              <span>Target Engineering Deliverables</span>
            </h3>
            <ul className="space-y-2">
              {expectedOutputs.map((item) => (
                <li key={item} className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      {/* CTA Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <Link href="/projects/new">
          <Button variant="outline" size="sm">
            Configure A Project First
          </Button>
        </Link>
        <Link href="/">
          <Button variant="amber" size="sm" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
