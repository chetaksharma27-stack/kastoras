'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useEstimates } from '../../lib/store/estimation-context';
import { useProjects } from '../../lib/store/project-context';
import {
  MapPin,
  User,
  Calendar,
  ArrowLeft,
  Search,
  Filter,
  Printer,
  Info,
  AlertTriangle,
} from 'lucide-react';

interface EstimateResultsViewProps {
  id: string;
}

export function EstimateResultsView({ id }: EstimateResultsViewProps) {
  const { getEstimateById, isLoading: estimatesLoading } = useEstimates();
  const { getProjectById } = useProjects();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');

  const estimate = getEstimateById(id);
  const project = estimate ? getProjectById(estimate.projectId) : undefined;

  if (estimatesLoading) {
    return (
      <Card className="p-12 text-center bg-white border-slate-200">
        <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-amber-600 animate-spin mx-auto" />
        <p className="text-xs text-slate-500 mt-2">Loading estimate data...</p>
      </Card>
    );
  }

  if (!estimate) {
    return (
      <Card className="p-12 text-center bg-white border-slate-200 max-w-2xl mx-auto">
        <h2 className="text-lg font-bold text-slate-900">Estimate Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">
          The requested estimate identifier was not found in your workspace.
        </p>
        <div className="mt-4">
          <Link href="/estimates">
            <Button variant="outline" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
              Back to Estimates
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  // Filter items
  const filteredItems = estimate.items.filter((item) => {
    const matchesCategory =
      selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesSearch =
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.itemCode.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate category totals for breakdown visualizer
  const categoryTotals: Record<string, number> = {};
  estimate.items.forEach((item) => {
    categoryTotals[item.category] = (categoryTotals[item.category] || 0) + item.amount;
  });

  const categories = Object.keys(categoryTotals).sort(
    (a, b) => categoryTotals[b] - categoryTotals[a]
  );

  const matPercent = Math.round((estimate.materialCost / Math.max(1, estimate.directCost)) * 100);
  const labPercent = Math.round((estimate.labourCost / Math.max(1, estimate.directCost)) * 100);
  const eqPercent = Math.max(0, 100 - matPercent - labPercent);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 print:p-0 print:max-w-none">
      {/* Top Breadcrumb & Print Controls */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 print:hidden">
        <div className="flex items-center gap-3">
          <Link
            href="/estimates"
            className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Estimates</span>
          </Link>
          <span className="text-slate-300">/</span>
          {project && (
            <Link
              href={`/projects/${project.id}`}
              className="text-xs text-slate-600 hover:text-slate-900 font-medium"
            >
              {project.projectName}
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            icon={<Printer className="w-3.5 h-3.5" />}
          >
            Print Summary
          </Button>
          <Badge variant="amber" className="font-mono text-[11px]">
            {estimate.status}
          </Badge>
        </div>
      </div>

      {/* Project & Estimate Header */}
      <Card className="p-6 bg-white border-slate-200/90 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
                M1
              </span>
              <Badge variant="amber" className="font-mono text-xs">
                Preliminary Construction Cost Estimate
              </Badge>
              <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(estimate.createdAt).toLocaleDateString()}
              </span>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {estimate.estimateName}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-600">
              {estimate.clientName && (
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium text-slate-900">{estimate.clientName}</span>
                </span>
              )}
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{estimate.location}</span>
              </span>
              <span className="font-mono text-slate-400">
                Built-up: <strong className="text-slate-900">{estimate.totalBuiltUpArea.toLocaleString()} sq.ft</strong>
              </span>
            </div>
          </div>

          {/* Big Totals Box */}
          <div className="p-4 bg-slate-900 text-white rounded-xl text-left md:text-right shrink-0 border border-slate-800">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block font-semibold">
              Total Estimated Cost
            </span>
            <span className="text-2xl sm:text-3xl font-bold font-mono text-white block mt-0.5">
              ₹{estimate.totalEstimatedCost.toLocaleString()}
            </span>
            <span className="text-xs font-mono text-amber-300 block mt-1">
              ₹{estimate.costPerSqFt.toLocaleString()} <span className="text-slate-400">/ sq.ft</span>
            </span>
          </div>
        </div>
      </Card>

      {/* Part 6 Cards: Material, Labour, Equipment, Contractor Overhead, Total Cost */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <Card className="p-4 bg-white border-slate-200">
          <span className="text-[10px] font-mono text-slate-500 uppercase block font-semibold">
            Material Cost
          </span>
          <span className="text-lg font-bold font-mono text-slate-900 block mt-1">
            ₹{estimate.materialCost.toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            {matPercent}% of direct cost
          </span>
        </Card>

        <Card className="p-4 bg-white border-slate-200">
          <span className="text-[10px] font-mono text-slate-500 uppercase block font-semibold">
            Labour Cost
          </span>
          <span className="text-lg font-bold font-mono text-slate-900 block mt-1">
            ₹{estimate.labourCost.toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            {labPercent}% of direct cost
          </span>
        </Card>

        <Card className="p-4 bg-white border-slate-200">
          <span className="text-[10px] font-mono text-slate-500 uppercase block font-semibold">
            Equipment Cost
          </span>
          <span className="text-lg font-bold font-mono text-slate-900 block mt-1">
            ₹{estimate.equipmentCost.toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            {eqPercent}% of direct cost
          </span>
        </Card>

        <Card className="p-4 bg-white border-slate-200">
          <span className="text-[10px] font-mono text-slate-500 uppercase block font-semibold">
            Contractor Overhead
          </span>
          <span className="text-lg font-bold font-mono text-amber-700 block mt-1">
            ₹{estimate.overheadAmount.toLocaleString()}
          </span>
          <span className="text-[11px] text-amber-600 font-mono mt-1 block">
            {estimate.overheadPercentage}% rate applied
          </span>
        </Card>

        <Card className="p-4 bg-slate-900 text-white border-slate-800 col-span-2 sm:col-span-1">
          <span className="text-[10px] font-mono text-amber-400 uppercase block font-semibold">
            Total Direct + Overhead
          </span>
          <span className="text-lg font-bold font-mono text-white block mt-1">
            ₹{estimate.totalEstimatedCost.toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-300 font-mono mt-1 block">
            100% Total Project
          </span>
        </Card>
      </div>

      {/* Cost Breakdown Visualizer by Trade Category */}
      <Card className="p-5 bg-white border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
            Trade Category Budget Distribution
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            Direct Cost Base: ₹{estimate.directCost.toLocaleString()}
          </span>
        </div>

        {/* Stacked Color Bar */}
        <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden flex mb-4">
          {categories.map((cat, idx) => {
            const amount = categoryTotals[cat];
            const pct = Math.max(1, (amount / Math.max(1, estimate.directCost)) * 100);
            const colors = [
              'bg-blue-600',
              'bg-amber-600',
              'bg-emerald-600',
              'bg-indigo-600',
              'bg-purple-600',
              'bg-rose-600',
              'bg-teal-600',
              'bg-cyan-600',
              'bg-slate-600',
            ];
            return (
              <div
                key={cat}
                style={{ width: `${pct}%` }}
                className={`${colors[idx % colors.length]} transition-all`}
                title={`${cat}: ₹${amount.toLocaleString()} (${pct.toFixed(1)}%)`}
              />
            );
          })}
        </div>

        {/* Category Breakdown Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
          {categories.map((cat, idx) => {
            const amount = categoryTotals[cat];
            const pct = ((amount / Math.max(1, estimate.directCost)) * 100).toFixed(1);
            const colors = [
              'text-blue-600',
              'text-amber-600',
              'text-emerald-600',
              'text-indigo-600',
              'text-purple-600',
              'text-rose-600',
              'text-teal-600',
              'text-cyan-600',
              'text-slate-600',
            ];
            return (
              <div
                key={cat}
                className="p-2.5 rounded-lg bg-slate-50/75 border border-slate-200/70 flex items-center justify-between"
              >
                <div className="truncate pr-2">
                  <span className={`text-[11px] font-bold block truncate ${colors[idx % colors.length]}`}>
                    {cat}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{pct}% of direct cost</span>
                </div>
                <span className="font-mono font-bold text-slate-900 shrink-0">
                  ₹{amount.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Detailed Itemized Estimate Table (Part 6) */}
      <Card className="overflow-hidden bg-white border-slate-200/90 shadow-2xs">
        {/* Table Header Controls: Search & Category Filter */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-50/50 print:hidden">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-semibold text-slate-700">Filter Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10 cursor-pointer"
            >
              <option value="ALL">All Categories ({estimate.items.length} items)</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search item, code, trade..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            />
          </div>
        </div>

        {/* The Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-mono text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-3 font-semibold">Item Code</th>
                <th className="py-3 px-3 font-semibold">Description</th>
                <th className="py-3 px-3 font-semibold">Category</th>
                <th className="py-3 px-3 font-semibold text-center">Unit</th>
                <th className="py-3 px-3 font-semibold text-right">Quantity</th>
                <th className="py-3 px-3 font-semibold text-right">Mat. Rate</th>
                <th className="py-3 px-3 font-semibold text-right">Lab. Rate</th>
                <th className="py-3 px-3 font-semibold text-right">Eq. Rate</th>
                <th className="py-3 px-3 font-semibold text-right">Total Rate</th>
                <th className="py-3 px-3 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-700">
                    {item.itemCode}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-900 max-w-[240px]">
                    {item.description}
                  </td>
                  <td className="py-2.5 px-3 text-[11px] text-slate-500 max-w-[140px] truncate">
                    {item.category}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-slate-500">
                    {item.unit}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-medium text-slate-800">
                    {item.quantity.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-500">
                    ₹{item.materialRate.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-500">
                    ₹{item.labourRate.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-500">
                    ₹{item.equipmentRate.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-medium text-slate-700">
                    ₹{item.totalRate.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                    ₹{item.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 border-t-2 border-slate-300 font-mono font-semibold text-xs text-slate-900">
                <td colSpan={4} className="py-2.5 px-3 uppercase">
                  Subtotal (Direct Construction Costs)
                </td>
                <td className="py-2.5 px-3 text-right">-</td>
                <td className="py-2.5 px-3 text-right">₹{estimate.materialCost.toLocaleString()}</td>
                <td className="py-2.5 px-3 text-right">₹{estimate.labourCost.toLocaleString()}</td>
                <td className="py-2.5 px-3 text-right">₹{estimate.equipmentCost.toLocaleString()}</td>
                <td className="py-2.5 px-3 text-right">-</td>
                <td className="py-2.5 px-3 text-right font-bold text-sm">
                  ₹{estimate.directCost.toLocaleString()}
                </td>
              </tr>
              <tr className="bg-slate-50/50 border-t border-slate-200 font-mono text-xs text-slate-700">
                <td colSpan={9} className="py-2 px-3">
                  Contractor Overhead & Site Supervision ({estimate.overheadPercentage}%)
                </td>
                <td className="py-2 px-3 text-right font-bold text-amber-800">
                  ₹{estimate.overheadAmount.toLocaleString()}
                </td>
              </tr>
              <tr className="bg-slate-900 text-white font-mono font-bold text-sm">
                <td colSpan={9} className="py-3 px-3 uppercase tracking-wider">
                  Grand Total Estimated Cost
                </td>
                <td className="py-3 px-3 text-right text-amber-300">
                  ₹{estimate.totalEstimatedCost.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      {/* Part 7: Engineering Transparency & Calculation Method */}
      <Card className="p-6 bg-white border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Info className="w-5 h-5 text-amber-600" />
          <h2 className="text-base font-bold text-slate-900">Calculation Method & Engineering Assumptions</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 leading-relaxed">
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-xs">Deterministic Formulas Applied</h3>
            <ul className="space-y-1.5 list-disc pl-4">
              <li>
                <strong>Item Amount:</strong> Quantity &times; Total Rate (where Total Rate = Material + Labour + Equipment).
              </li>
              <li>
                <strong>Total Direct Cost:</strong> Sum of all itemized civil trade package amounts (&Sigma; Item Amounts).
              </li>
              <li>
                <strong>Contractor Overhead:</strong> Direct Cost &times; {estimate.overheadPercentage}% overhead & supervision factor.
              </li>
              <li>
                <strong>Total Estimated Cost:</strong> Direct Cost + Contractor Overhead.
              </li>
              <li>
                <strong>Cost per sq.ft:</strong> Total Estimated Cost / {estimate.totalBuiltUpArea.toLocaleString()} sq.ft = &#8377;{estimate.costPerSqFt.toLocaleString()} / sq.ft.
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-xs">Rate & Quantity Assumptions</h3>
            <ul className="space-y-1.5 list-disc pl-4">
              <li>
                <strong>Rate Source:</strong> {estimate.calculationAssumptions?.rateSource || 'Illustrative / MVP Baseline Rates (2026)'}.
              </li>
              <li>
                <strong>Structural Coefficient:</strong> Scaled for {estimate.calculationAssumptions?.structuralSystem || 'RCC Frame'} and {estimate.calculationAssumptions?.foundationType || 'Isolated Footing'}.
              </li>
              <li>
                <strong>Finish Benchmark:</strong> {estimate.calculationAssumptions?.finishQuality || 'Standard'} grade multiplier ({estimate.calculationAssumptions?.finishMultiplier || 1.0}x).
              </li>
              <li>
                <strong>Location:</strong> {estimate.location}.
              </li>
            </ul>
          </div>
        </div>

        {/* Required Mandatory Engineering Warning (Part 7) */}
        <div className="mt-4 p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <p className="font-bold">Engineering Transparency Notice:</p>
            <p className="mt-0.5">
              This is a preliminary estimate intended for planning purposes. Final project costs require detailed drawings, specifications, quantity take-off, applicable Schedule of Rates/market rates, site conditions and professional verification.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
