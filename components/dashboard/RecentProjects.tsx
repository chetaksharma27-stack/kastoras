'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useProjects } from '../../lib/store/project-context';
import {
  FolderKanban,
  Plus,
  ArrowUpRight,
  MapPin,
  ChevronRight,
  User,
} from 'lucide-react';

export function RecentProjects() {
  const { projects, isLoading } = useProjects();

  const recent = projects.slice(0, 5);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Recent Projects</h2>
          <p className="text-xs text-slate-500">
            Active building assets and parameter records.
          </p>
        </div>
        {projects.length > 0 && (
          <Link
            href="/projects"
            className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 transition-colors"
          >
            <span>View all projects ({projects.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {isLoading ? (
        <Card className="p-8 text-center bg-white border-slate-200">
          <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-amber-600 animate-spin mx-auto" />
          <p className="text-xs text-slate-500 mt-2">Loading workspace data...</p>
        </Card>
      ) : projects.length === 0 ? (
        /* Professional Empty State */
        <Card className="p-10 text-center bg-white border-slate-200/90 border-dashed">
          <div className="max-w-md mx-auto flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-400 mb-4 shadow-2xs">
              <FolderKanban className="w-7 h-7 text-slate-500" />
            </div>

            <h3 className="text-base font-bold text-slate-900">No projects yet</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Create your first construction project to start estimating costs, generating BOQs and analysing carbon.
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
        /* Table of Existing Projects */
        <Card className="overflow-hidden bg-white border-slate-200/90">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4 font-semibold">Project & Client</th>
                  <th className="py-3 px-4 font-semibold">Location</th>
                  <th className="py-3 px-4 font-semibold">Building Type</th>
                  <th className="py-3 px-4 font-semibold text-right">Built-up Area</th>
                  <th className="py-3 px-4 font-semibold text-center">Floors</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {recent.map((proj) => (
                  <tr
                    key={proj.id}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  >
                    <td className="py-3 px-4">
                      <Link href={`/projects/${proj.id}`} className="block">
                        <span className="font-semibold text-slate-900 group-hover:text-amber-700 transition-colors">
                          {proj.projectName}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                          <User className="w-3 h-3 text-slate-400" />
                          <span>{proj.clientName}</span>
                        </span>
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[150px]">{proj.location}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="blue" className="font-sans">
                        {proj.buildingType}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-medium text-slate-900">
                      {proj.builtUpArea.toLocaleString()} sq.ft
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-medium text-slate-700">
                      G + {proj.numberOfFloors - 1}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="amber" className="font-mono text-[10px]">
                        {proj.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link href={`/projects/${proj.id}`}>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                          <span>Open</span>
                          <ArrowUpRight className="w-3.5 h-3.5 ml-1 text-slate-400 group-hover:text-slate-700" />
                        </Button>
                      </Link>
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
