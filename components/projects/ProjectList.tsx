'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useProjects } from '../../lib/store/project-context';
import { useEstimates } from '../../lib/store/estimation-context';
import {
  FolderKanban,
  Plus,
  Search,
  MapPin,
  Filter,
  ArrowUpRight,
  Trash2,
  Calculator,
  User,
} from 'lucide-react';

export function ProjectList() {
  const { projects, deleteProject, isLoading } = useProjects();
  const { getEstimatesByProjectId } = useEstimates();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.projectName.toLowerCase().includes(search.toLowerCase()) ||
      p.clientName.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase());

    const matchesType = typeFilter === 'ALL' || p.buildingType === typeFilter;

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Projects Portfolio
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your civil projects, structural specs, and associated cost estimations.
          </p>
        </div>

        <Link href="/projects/new">
          <Button
            variant="amber"
            size="md"
            icon={<Plus className="w-4 h-4" />}
            className="font-semibold shadow-xs"
          >
            New Project
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by project, client, location, ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-500 font-medium">Type:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10 shadow-2xs cursor-pointer"
          >
            <option value="ALL">All Building Types</option>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Institutional">Institutional</option>
            <option value="Industrial">Industrial</option>
          </select>
        </div>
      </div>

      {/* Projects Table or Empty State */}
      {isLoading ? (
        <Card className="p-12 text-center bg-white border-slate-200">
          <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-amber-600 animate-spin mx-auto" />
          <p className="text-xs text-slate-500 mt-2">Loading projects...</p>
        </Card>
      ) : filteredProjects.length === 0 ? (
        <Card className="p-12 text-center bg-white border-slate-200 border-dashed">
          <div className="max-w-md mx-auto flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mb-4 shadow-2xs">
              <FolderKanban className="w-7 h-7 text-slate-500" />
            </div>

            <h3 className="text-base font-bold text-slate-900">
              {search || typeFilter !== 'ALL' ? 'No matching projects found' : 'No projects yet'}
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              {search || typeFilter !== 'ALL'
                ? 'Try adjusting your search criteria or filter to locate the project.'
                : 'Create your first construction project to start estimating costs, generating BOQs and analysing carbon.'}
            </p>

            <div className="mt-5">
              <Link href="/projects/new">
                <Button
                  variant="amber"
                  size="sm"
                  icon={<Plus className="w-4 h-4" />}
                  className="font-semibold shadow-xs"
                >
                  Create New Project
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="overflow-hidden bg-white border-slate-200/90 shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4 font-semibold">Project & Client</th>
                  <th className="py-3 px-4 font-semibold">Location</th>
                  <th className="py-3 px-4 font-semibold">Building Type</th>
                  <th className="py-3 px-4 font-semibold text-right">Built-up Area</th>
                  <th className="py-3 px-4 font-semibold text-center">Floors</th>
                  <th className="py-3 px-4 font-semibold">Estimates</th>
                  <th className="py-3 px-4 font-semibold">Created</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {filteredProjects.map((p) => {
                  const projectEstimates = getEstimatesByProjectId(p.id);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="py-3.5 px-4">
                        <Link href={`/projects/${p.id}`} className="block">
                          <span className="font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                            {p.projectName}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                            <User className="w-3 h-3 text-slate-400" />
                            <span>{p.clientName}</span>
                          </span>
                        </Link>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[130px]">{p.location}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant="blue">{p.buildingType}</Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-medium text-slate-900">
                        {p.builtUpArea.toLocaleString()} sq.ft
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-medium text-slate-700">
                        G + {p.numberOfFloors - 1}
                      </td>
                      <td className="py-3.5 px-4">
                        {projectEstimates.length > 0 ? (
                          <Link href={`/estimates/${projectEstimates[0].id}`}>
                            <Badge variant="amber" className="font-mono text-[10px] hover:bg-amber-100 transition-colors">
                              {projectEstimates.length} Saved (₹{Math.round(projectEstimates[0].totalEstimatedCost / 100000)}L)
                            </Badge>
                          </Link>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-mono">None</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link href={`/estimates/new?projectId=${p.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 px-2 text-[11px] text-amber-800 border-amber-300 hover:bg-amber-50"
                              icon={<Calculator className="w-3 h-3 text-amber-600" />}
                            >
                              Estimate
                            </Button>
                          </Link>
                          <Link href={`/projects/${p.id}`}>
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                              <span>Open</span>
                              <ArrowUpRight className="w-3.5 h-3.5 ml-1 text-slate-400 group-hover:text-slate-700" />
                            </Button>
                          </Link>
                          <button
                            type="button"
                            onClick={() => deleteProject(p.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete Project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
