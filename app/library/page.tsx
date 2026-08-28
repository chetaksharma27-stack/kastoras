'use client';

import React, { useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import {
  Search,
  ShieldCheck,
} from 'lucide-react';

export function ConstructionLibraryPage() {
  const [search, setSearch] = useState('');

  const libraryItems = [
    {
      code: 'IS 456:2000',
      title: 'Plain and Reinforced Concrete - Code of Practice',
      category: 'Structural Code',
      description: 'General design requirements, mix proportions, durability provisions, and limit state design of RCC.',
      type: 'National Standard',
      badge: 'blue' as const,
    },
    {
      code: 'IS 1200 (Parts 1-28)',
      title: 'Methods of Measurement of Building and Civil Engineering Works',
      category: 'Measurement Standard',
      description: 'Standard rules for measurement of earthwork, concrete, brickwork, stone masonry, wood, and metal.',
      type: 'Quantity Surveying',
      badge: 'amber' as const,
    },
    {
      code: 'CPWD DSR 2023',
      title: 'Delhi Schedule of Rates (DSR)',
      category: 'Rate Schedule',
      description: 'Standard unit rates, labour coefficients, and basic material benchmarks for civil construction items.',
      type: 'Cost Index',
      badge: 'slate' as const,
    },
    {
      code: 'IS 875 (Parts 1-5)',
      title: 'Design Loads (Other than Earthquake) for Buildings and Structures',
      category: 'Loading Code',
      description: 'Dead loads, imposed loads, wind loads, snow loads, and special load combinations.',
      type: 'Structural Code',
      badge: 'blue' as const,
    },
    {
      code: 'ICE Embodied Carbon v3',
      title: 'Inventory of Carbon & Energy Database',
      category: 'Embodied Carbon',
      description: 'Standard benchmark carbon factors for concrete mixes, rebar, structural steel, and masonry.',
      type: 'LCA Benchmark',
      badge: 'emerald' as const,
    },
  ];

  const filtered = libraryItems.filter(
    (item) =>
      item.code.toLowerCase().includes(search.toLowerCase()) ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Construction Library & Standards
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              National building codes, standard schedules of rates (DSR), measurement rules (IS 1200), and carbon factor libraries.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="amber" className="font-mono text-xs">
              Curated Civil Engineering Specs
            </Badge>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search codes, standards, rate schedules..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 shadow-2xs"
          />
        </div>

        {/* List of library items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <Card
              key={item.code}
              hoverEffect
              className="p-5 bg-white border-slate-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-slate-900 text-white">
                    {item.code}
                  </span>
                  <Badge variant={item.badge}>{item.category}</Badge>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mt-2">{item.title}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="font-mono text-[11px] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  {item.type}
                </span>
                <span className="text-[11px] font-medium text-amber-700">Indexed for V2 Rates</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

export default ConstructionLibraryPage;
