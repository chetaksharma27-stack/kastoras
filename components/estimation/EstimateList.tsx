'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useEstimates } from '../../lib/store/estimation-context';
import { useProjects } from '../../lib/store/project-context';
import {
  Calculator,
  Plus,
  Search,
  MapPin,
  ArrowUpRight,
  Trash2,
} from 'lucide-react';

export function EstimateList() {
  const { estimates, deleteEstimate, isLoading } = useEstimates();
  const { projects } = useProjects();
  const [search, setSearch] = useState('');

  const filtered = estimates.filter((est) => {
    const matches =
      est.estimateName.toLowerCase().includes(search.toLowerCase()) ||
      est.projectName.toLowerCase().includes(search.toLowerCase()) ||
      est.location.toLowerCase().includes(search.toLowerCase()) ||
      est.id.toLowerCase().includes(search.toLowerCase());
    return matches;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
              M1
            </span>
            <Badge variant="amber" className="font-mono text-xs">
              AI Construction Cost Estimation Engine
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Cost Estimation Portfolio
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Deterministic rate analysis, quantity takeoff models, and preliminary construction budgets.
          </p>
        </div>

        <Link href="/estimates/new">
          <Button
            variant="amber"
            size="md"
            icon={<Plus className="w-4 h-4" />}
            className="font-semibold shadow-xs"
          >
            + New Estimate
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search estimates by name, project, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 shadow-2xs"
          />
        </div>

        <div className="text-xs font-mono text-slate-500">
          {filtered.length} {filtered.length === 1 ? 'estimate' : 'estimates'} found
        </div>
      </div>

      {/* Table or Empty State */}
      {isLoading ? (
        <Card className="p-12 text-center bg-white border-slate-200">
          <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-amber-600 animate-spin mx-auto" />
          <p className="text-xs text-slate-500 mt-2">Loading estimates...</p>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center bg-white border-slate-200 border-dashed">
          <div className="max-w-md mx-auto flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-4 shadow-2xs">
              <Calculator className="w-7 h-7" />
            </div>

            <h3 className="text-base font-bold text-slate-900">
              {search ? 'No matching estimates found' : 'No cost estimates generated yet'}
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              {search
                ? 'Try adjusting your search criteria.'
                : 'Select an existing project or configure a new one to generate itemized rate analysis and preliminary construction cost budgets.'}
            </p>

            <div className="mt-5 flex items-center gap-3">
              {projects.length === 0 ? (
                <Link href="/projects/new">
                  <Button variant="amber" size="sm">
                    Create Project First
                  </Button>
                </Link>
              ) : (
                <Link href="/estimates/new">
                  <Button
                    variant="amber"
                    size="sm"
                    icon={<Plus className="w-4 h-4" />}
                    className="font-semibold shadow-xs"
                  >
                    Generate First Estimate
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </Card>
      ) : (
        <Card className="overflow-hidden bg-white border-slate-200/90 shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4 font-semibold">Estimate Name & Project</th>
                  <th className="py-3 px-4 font-semibold">Location</th>
                  <th className="py-3 px-4 font-semibold text-right">Built-up Area</th>
                  <th className="py-3 px-4 font-semibold text-right">Direct Cost</th>
                  <th className="py-3 px-4 font-semibold text-right">Overhead</th>
                  <th className="py-3 px-4 font-semibold text-right">Total Estimate</th>
                  <th className="py-3 px-4 font-semibold text-right">Rate / Sq.Ft</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {filtered.map((est) => (
                  <tr key={est.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-3.5 px-4">
                      <Link href={`/estimates/${est.id}`} className="block">
                        <span className="font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                          {est.estimateName}
                        </span>
                        <span className="block text-[11px] text-slate-500 mt-0.5">
                          Project: {est.projectName}
                        </span>
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[120px]">{est.location}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-800">
                      {est.totalBuiltUpArea.toLocaleString()} sq.ft
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-600">
                      ₹{est.directCost.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-amber-700">
                      ₹{est.overheadAmount.toLocaleString()} ({est.overheadPercentage}%)
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                      ₹{est.totalEstimatedCost.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-amber-700">
                      ₹{est.costPerSqFt.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {new Date(est.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link href={`/estimates/${est.id}`}>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                            <span>Open</span>
                            <ArrowUpRight className="w-3.5 h-3.5 ml-1 text-slate-400 group-hover:text-slate-700" />
                          </Button>
                        </Link>
                        <button
                          type="button"
                          onClick={() => deleteEstimate(est.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete Estimate"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
