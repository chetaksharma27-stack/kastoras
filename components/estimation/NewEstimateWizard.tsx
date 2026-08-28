'use client';

import React, { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useProjects } from '../../lib/store/project-context';
import { useEstimates } from '../../lib/store/estimation-context';
import { calculateProjectEstimate } from '../../lib/estimation/engine';
import {
  Building2,
  Sliders,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';

export function NewEstimateWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultProjectId = searchParams.get('projectId') || '';

  const { projects, isLoading: projectsLoading } = useProjects();
  const { saveEstimate } = useEstimates();

  const [selectedProjectId, setSelectedProjectId] = useState(defaultProjectId);
  const [customName, setCustomName] = useState('');
  const [overheadPercentage, setOverheadPercentage] = useState(12);
  const [rateSource, setRateSource] = useState('Illustrative/MVP rate');
  const [isSaving, setIsSaving] = useState(false);

  const effectiveProjectId = selectedProjectId || (projects.length > 0 ? projects[0].id : '');
  const selectedProject = projects.find((p) => p.id === effectiveProjectId);

  const effectiveEstimateName =
    customName || (selectedProject ? `Cost Estimate: ${selectedProject.projectName}` : 'Project Cost Estimate');

  const previewEstimate = useMemo(() => {
    if (!selectedProject) return null;
    return calculateProjectEstimate(selectedProject, {
      estimateName: effectiveEstimateName,
      overheadPercentage,
      rateSource,
    });
  }, [selectedProject, effectiveEstimateName, overheadPercentage, rateSource]);

  const handleSaveAndOpen = async () => {
    if (!previewEstimate) return;

    setIsSaving(true);
    try {
      const saved = await saveEstimate(previewEstimate);
      router.push(`/estimates/${saved.id}`);
    } catch (err) {
      console.error('Error saving estimate:', err);
      setIsSaving(false);
    }
  };

  if (projectsLoading) {
    return (
      <Card className="p-12 text-center bg-white border-slate-200">
        <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-amber-600 animate-spin mx-auto" />
        <p className="text-xs text-slate-500 mt-2">Loading projects...</p>
      </Card>
    );
  }

  if (projects.length === 0) {
    return (
      <Card className="p-12 text-center bg-white border-slate-200 max-w-2xl mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mx-auto mb-4">
          <Building2 className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">No Projects Configured Yet</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
          Cost estimation calculations require project parameters (built-up area, floors, structural system, foundation type, and finish quality).
        </p>
        <div className="mt-5">
          <Link href="/projects/new">
            <Button variant="amber" size="md">
              Create Project First
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <Link
          href="/estimates"
          className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Estimates</span>
        </Link>
        <Badge variant="amber" className="font-mono text-xs">
          Module 1: Calculation Engine
        </Badge>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Generate Preliminary Cost Estimate
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Apply deterministic civil engineering takeoffs and unit rate databases to compute material, labour, equipment, and overhead budgets.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Parameter Form */}
        <div className="lg:col-span-1 space-y-5">
          <Card className="p-5 bg-white border-slate-200 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <Sliders className="w-4 h-4 text-slate-600" />
              <span>Calculation Parameters</span>
            </h2>

            {/* Select Project */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Target Project <span className="text-red-500">*</span>
              </label>
              <select
                value={effectiveProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 cursor-pointer"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.projectName} ({p.builtUpArea.toLocaleString()} sq.ft)
                  </option>
                ))}
              </select>
            </div>

            {/* Estimate Title */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Estimate Name
              </label>
              <input
                type="text"
                placeholder={selectedProject ? `Cost Estimate: ${selectedProject.projectName}` : ''}
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              />
            </div>

            {/* Contractor Overhead Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-700">
                  Contractor Overhead & Profit
                </label>
                <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {overheadPercentage}%
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="25"
                step="0.5"
                value={overheadPercentage}
                onChange={(e) => setOverheadPercentage(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">
                Standard industry range: 10% to 15%
              </span>
            </div>

            {/* Rate Source */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Unit Rate Database Benchmark
              </label>
              <select
                value={rateSource}
                onChange={(e) => setRateSource(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 cursor-pointer"
              >
                <option value="Illustrative/MVP rate">Illustrative / MVP Baseline Rates (2026)</option>
                <option value="User-configured rate">User-Configured Custom Rates</option>
                <option value="CPWD Schedule of Rates Benchmark">CPWD Schedule of Rates Benchmark</option>
              </select>
            </div>
          </Card>

          {/* Project Spec Quick Reference */}
          {selectedProject && (
            <Card className="p-4 bg-slate-50/80 border-slate-200 text-xs space-y-2">
              <h3 className="font-semibold text-slate-800 flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-mono">
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Project Parameters</span>
              </h3>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-400 block">Built-up Area</span>
                  <span className="font-bold text-slate-900 font-mono">
                    {selectedProject.builtUpArea.toLocaleString()} sq.ft
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Floors</span>
                  <span className="font-bold text-slate-900 font-mono">
                    G + {selectedProject.numberOfFloors - 1}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Structure</span>
                  <span className="font-medium text-slate-800">{selectedProject.structuralSystem}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Foundation</span>
                  <span className="font-medium text-slate-800">{selectedProject.foundationType}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Finish Quality</span>
                  <span className="font-medium text-slate-800">{selectedProject.finishQuality}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Location</span>
                  <span className="font-medium text-slate-800">{selectedProject.location}</span>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Right Column: Live Calculation Preview */}
        <div className="lg:col-span-2 space-y-5">
          {previewEstimate ? (
            <div className="space-y-5">
              {/* Grand Total Hero Card */}
              <Card className="p-6 bg-slate-900 text-white border-slate-800 shadow-sm relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <span className="text-xs font-mono text-amber-400 uppercase tracking-wider font-semibold block">
                      Estimated Total Construction Cost
                    </span>
                    <div className="flex items-baseline gap-3 mt-1">
                      <span className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-white">
                        ₹{previewEstimate.totalEstimatedCost.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Includes Direct Costs + {previewEstimate.overheadPercentage}% Contractor Overhead
                    </p>
                  </div>

                  <div className="sm:text-right p-3 sm:p-0 bg-slate-800/80 sm:bg-transparent rounded-lg border border-slate-700 sm:border-0">
                    <span className="text-[11px] font-mono text-slate-400 uppercase block">
                      Unit Rate per Sq.Ft
                    </span>
                    <span className="text-2xl font-bold font-mono text-amber-300 block">
                      ₹{previewEstimate.costPerSqFt.toLocaleString()}
                      <span className="text-xs font-normal text-slate-400"> / sq.ft</span>
                    </span>
                  </div>
                </div>

                {/* Direct Cost Breakdown Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-4 border-t border-slate-800 text-xs">
                  <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Material Cost</span>
                    <span className="font-bold font-mono text-white text-sm">
                      ₹{previewEstimate.materialCost.toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Labour Cost</span>
                    <span className="font-bold font-mono text-white text-sm">
                      ₹{previewEstimate.labourCost.toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Equipment Cost</span>
                    <span className="font-bold font-mono text-white text-sm">
                      ₹{previewEstimate.equipmentCost.toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Overhead ({previewEstimate.overheadPercentage}%)</span>
                    <span className="font-bold font-mono text-amber-300 text-sm">
                      ₹{previewEstimate.overheadAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Itemized Preview Summary */}
              <Card className="p-5 bg-white border-slate-200">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                    Calculated Trade Packages ({previewEstimate.items.length} Items)
                  </h3>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Quantity &times; Rate = Amount
                  </span>
                </div>

                <div className="overflow-x-auto max-h-72 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-[10px] font-mono text-slate-500 uppercase">
                        <th className="py-2 px-3">Category</th>
                        <th className="py-2 px-3">Item</th>
                        <th className="py-2 px-3 text-right">Quantity</th>
                        <th className="py-2 px-3 text-right">Total Rate</th>
                        <th className="py-2 px-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {previewEstimate.items.slice(0, 8).map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/80">
                          <td className="py-2 px-3 text-[11px] text-slate-500 truncate max-w-[120px]">
                            {item.category}
                          </td>
                          <td className="py-2 px-3 font-medium text-slate-800 truncate max-w-[180px]">
                            {item.description}
                          </td>
                          <td className="py-2 px-3 text-right font-mono text-slate-600">
                            {item.quantity.toLocaleString()} {item.unit}
                          </td>
                          <td className="py-2 px-3 text-right font-mono text-slate-600">
                            ₹{item.totalRate.toLocaleString()}
                          </td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                            ₹{item.amount.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {previewEstimate.items.length > 8 && (
                  <p className="text-[11px] text-slate-400 text-center pt-2">
                    + {previewEstimate.items.length - 8} more trade items generated
                  </p>
                )}
              </Card>

              {/* Action Button */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <Link href="/estimates">
                  <Button variant="outline" size="md">
                    Cancel
                  </Button>
                </Link>
                <Button
                  variant="amber"
                  size="md"
                  disabled={isSaving}
                  onClick={handleSaveAndOpen}
                  className="font-semibold shadow-xs px-6"
                  icon={<CheckCircle2 className="w-4 h-4" />}
                >
                  {isSaving ? 'Saving Estimate...' : 'Save & Open Full Results'}
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
