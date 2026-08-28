'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useProjects } from '../../lib/store/project-context';
import { useEstimates } from '../../lib/store/estimation-context';
import {
  MapPin,
  Calculator,
  FileSpreadsheet,
  Upload,
  ArrowLeft,
  ArrowRight,
  Calendar,
  User,
  Plus,
} from 'lucide-react';

interface ProjectDetailViewProps {
  id: string;
}

export function ProjectDetailView({ id }: ProjectDetailViewProps) {
  const { getProjectById, isLoading } = useProjects();
  const { getEstimatesByProjectId } = useEstimates();
  const [activeTab, setActiveTab] = useState<'estimates' | 'specs' | 'drawings' | 'reports'>('estimates');

  const project = getProjectById(id);
  const projectEstimates = getEstimatesByProjectId(id);

  if (isLoading) {
    return (
      <Card className="p-12 text-center bg-white border-slate-200">
        <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-amber-600 animate-spin mx-auto" />
        <p className="text-xs text-slate-500 mt-2">Loading project data...</p>
      </Card>
    );
  }

  if (!project) {
    return (
      <Card className="p-12 text-center bg-white border-slate-200">
        <div className="max-w-md mx-auto">
          <h2 className="text-lg font-bold text-slate-900">Project Not Found</h2>
          <p className="text-xs text-slate-500 mt-1">
            The requested project identifier does not exist in your workspace or was removed.
          </p>
          <div className="mt-4">
            <Link href="/projects">
              <Button variant="outline" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
                Back to Projects
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Breadcrumb / Nav */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <Link
          href="/projects"
          className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </Link>
        <span className="font-mono text-xs text-slate-400">ID: {project.id}</span>
      </div>

      {/* Project Overview Header */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="blue">{project.buildingType}</Badge>
              <Badge variant="amber" className="font-mono text-[10px]">
                {project.status}
              </Badge>
              <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(project.createdAt).toLocaleDateString()}
              </span>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {project.projectName}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mt-1.5 text-xs text-slate-600">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-medium text-slate-800">{project.clientName}</span>
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{project.location}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start">
            <Link href={`/estimates/new?projectId=${project.id}`}>
              <Button
                size="sm"
                variant="amber"
                icon={<Calculator className="w-3.5 h-3.5" />}
                className="font-semibold shadow-xs"
              >
                + Generate Cost Estimate
              </Button>
            </Link>
          </div>
        </div>

        {/* Key Engineering Specifications Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70">
            <span className="text-[10px] uppercase font-mono text-slate-500 font-semibold block">
              Built-up Area
            </span>
            <span className="text-base font-bold font-mono text-slate-900 mt-0.5 block">
              {project.builtUpArea.toLocaleString()} <span className="text-xs font-normal text-slate-500">sq.ft</span>
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70">
            <span className="text-[10px] uppercase font-mono text-slate-500 font-semibold block">
              Plot Area
            </span>
            <span className="text-base font-bold font-mono text-slate-900 mt-0.5 block">
              {project.plotArea.toLocaleString()} <span className="text-xs font-normal text-slate-500">sq.ft</span>
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70">
            <span className="text-[10px] uppercase font-mono text-slate-500 font-semibold block">
              Floors
            </span>
            <span className="text-base font-bold font-mono text-slate-900 mt-0.5 block">
              G + {project.numberOfFloors - 1} <span className="text-xs font-normal text-slate-500">({project.numberOfFloors} lvl)</span>
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70">
            <span className="text-[10px] uppercase font-mono text-slate-500 font-semibold block">
              Finish Benchmark
            </span>
            <span className="text-base font-bold text-slate-900 mt-0.5 block">
              {project.finishQuality}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
          <div className="p-3 bg-slate-50/60 rounded-lg border border-slate-200/50 text-xs">
            <span className="text-[10px] font-mono text-slate-500 block">Structural System</span>
            <span className="font-semibold text-slate-800 mt-0.5 block">{project.structuralSystem}</span>
          </div>
          <div className="p-3 bg-slate-50/60 rounded-lg border border-slate-200/50 text-xs">
            <span className="text-[10px] font-mono text-slate-500 block">Foundation Type</span>
            <span className="font-semibold text-slate-800 mt-0.5 block">{project.foundationType}</span>
          </div>
          <div className="p-3 bg-slate-50/60 rounded-lg border border-slate-200/50 text-xs">
            <span className="text-[10px] font-mono text-slate-500 block">Roofing System</span>
            <span className="font-semibold text-slate-800 mt-0.5 block">{project.roofType}</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold text-slate-600">
        <button
          type="button"
          onClick={() => setActiveTab('estimates')}
          className={`pb-3 relative transition-colors cursor-pointer ${
            activeTab === 'estimates'
              ? 'text-slate-900 border-b-2 border-amber-600 font-bold'
              : 'hover:text-slate-900'
          }`}
        >
          Cost Estimates ({projectEstimates.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('specs')}
          className={`pb-3 relative transition-colors cursor-pointer ${
            activeTab === 'specs'
              ? 'text-slate-900 border-b-2 border-amber-600 font-bold'
              : 'hover:text-slate-900'
          }`}
        >
          Full Project Specs
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('drawings')}
          className={`pb-3 relative transition-colors cursor-pointer ${
            activeTab === 'drawings'
              ? 'text-slate-900 border-b-2 border-amber-600 font-bold'
              : 'hover:text-slate-900'
          }`}
        >
          Drawings & BIM (Module 2)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('reports')}
          className={`pb-3 relative transition-colors cursor-pointer ${
            activeTab === 'reports'
              ? 'text-slate-900 border-b-2 border-amber-600 font-bold'
              : 'hover:text-slate-900'
          }`}
        >
          Reports & Export Archive
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'estimates' && (
        <div className="space-y-4">
          {projectEstimates.length === 0 ? (
            <Card className="p-10 text-center bg-white border-slate-200 border-dashed">
              <div className="max-w-md mx-auto flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-3">
                  <Calculator className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  No cost estimates generated for this project yet
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Run the deterministic calculation engine to generate itemized rate analysis, material/labour breakdown, and cost per square foot.
                </p>
                <div className="mt-5">
                  <Link href={`/estimates/new?projectId=${project.id}`}>
                    <Button
                      variant="amber"
                      size="sm"
                      icon={<Plus className="w-4 h-4" />}
                      className="font-semibold shadow-xs"
                    >
                      Generate First Estimate
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {projectEstimates.map((est) => (
                <Card
                  key={est.id}
                  hoverEffect
                  className="p-5 bg-white border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{est.estimateName}</h3>
                      <Badge variant="amber" className="font-mono text-[10px]">
                        {est.status}
                      </Badge>
                      <span className="text-xs text-slate-400 font-mono">
                        {new Date(est.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-xs text-slate-600">
                      <span>
                        Built-up Area: <strong className="font-mono text-slate-900">{est.totalBuiltUpArea.toLocaleString()} sq.ft</strong>
                      </span>
                      <span>
                        Overhead: <strong className="font-mono text-slate-900">{est.overheadPercentage}%</strong>
                      </span>
                      <span>
                        Items: <strong className="font-mono text-slate-900">{est.items.length} line items</strong>
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-1 text-[11px] text-slate-500 font-mono">
                      <span>Material: ₹{est.materialCost.toLocaleString()}</span>
                      <span>•</span>
                      <span>Labour: ₹{est.labourCost.toLocaleString()}</span>
                      <span>•</span>
                      <span>Equipment: ₹{est.equipmentCost.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-5 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 justify-between md:justify-end">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] font-mono text-slate-500 uppercase block font-semibold">
                        Total Estimate
                      </span>
                      <span className="text-xl font-bold font-mono text-slate-900 block">
                        ₹{est.totalEstimatedCost.toLocaleString()}
                      </span>
                      <span className="text-xs font-mono text-amber-700 block">
                        ₹{est.costPerSqFt.toLocaleString()} / sq.ft
                      </span>
                    </div>

                    <Link href={`/estimates/${est.id}`}>
                      <Button
                        variant="primary"
                        size="sm"
                        icon={<ArrowRight className="w-3.5 h-3.5" />}
                        iconPosition="right"
                      >
                        View Breakdown
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Module 2 & 3 Notice */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <Card className="p-4 bg-slate-50/70 border-slate-200 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-900">Module 2: AI BOQ Generator</span>
                <Badge variant="blue" className="font-mono text-[10px]">Coming in Phase 2</Badge>
              </div>
              <p className="text-slate-500 leading-relaxed">
                Will extract itemized schedule of quantities directly from uploaded CAD/BIM floor plans for {project.projectName}.
              </p>
            </Card>

            <Card className="p-4 bg-slate-50/70 border-slate-200 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-900">Module 3: Carbon Analysis</span>
                <Badge variant="emerald" className="font-mono text-[10px]">Coming in Phase 3</Badge>
              </div>
              <p className="text-slate-500 leading-relaxed">
                Will calculate embodied carbon (kgCO₂e/m²) from concrete, steel, and masonry material weights.
              </p>
            </Card>
          </div>
        </div>
      )}

      {/* Full Info Tab */}
      {activeTab === 'specs' && (
        <Card className="p-6 bg-white border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
            Comprehensive Project Technical Specifications
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="font-mono text-slate-400 block text-[10px]">PROJECT NAME</span>
              <span className="font-semibold text-slate-900">{project.projectName}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="font-mono text-slate-400 block text-[10px]">CLIENT / DEVELOPER</span>
              <span className="font-semibold text-slate-900">{project.clientName}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="font-mono text-slate-400 block text-[10px]">GEOGRAPHIC LOCATION</span>
              <span className="font-semibold text-slate-900">{project.location}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="font-mono text-slate-400 block text-[10px]">BUILDING USE CLASSIFICATION</span>
              <span className="font-semibold text-slate-900">{project.buildingType}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="font-mono text-slate-400 block text-[10px]">STRUCTURAL SYSTEM</span>
              <span className="font-semibold text-slate-900">{project.structuralSystem}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="font-mono text-slate-400 block text-[10px]">MATERIAL GRADE SPECIFICATION</span>
              <span className="font-semibold text-slate-900">{project.materialGrade}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="font-mono text-slate-400 block text-[10px]">FOUNDATION SYSTEM</span>
              <span className="font-semibold text-slate-900">{project.foundationType}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="font-mono text-slate-400 block text-[10px]">ROOFING & DECKING</span>
              <span className="font-semibold text-slate-900">{project.roofType}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="font-mono text-slate-400 block text-[10px]">ARCHITECTURAL FINISH STANDARD</span>
              <span className="font-semibold text-slate-900">{project.finishQuality}</span>
            </div>
            {project.description && (
              <div className="sm:col-span-2 p-3 bg-slate-50 rounded-lg">
                <span className="font-mono text-slate-400 block text-[10px]">ENGINEERING NOTES & REMARKS</span>
                <p className="text-slate-700 mt-1 whitespace-pre-wrap">{project.description}</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Drawings Tab */}
      {activeTab === 'drawings' && (
        <Card className="p-8 text-center bg-white border-slate-200 border-dashed">
          <div className="max-w-md mx-auto flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mb-3">
              <Upload className="w-6 h-6 text-slate-500" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">No drawings attached yet</h3>
            <p className="text-xs text-slate-500 mt-1">
              Upload architectural CAD/PDF drawings and structural layout plans for automated drawing parsing in Module 2.
            </p>
            <div className="mt-4">
              <Button variant="outline" size="sm" icon={<Upload className="w-3.5 h-3.5" />}>
                Upload CAD / PDF Plans (Module 2)
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <Card className="p-8 text-center bg-white border-slate-200 border-dashed">
          <div className="max-w-md mx-auto flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mb-3">
              <FileSpreadsheet className="w-6 h-6 text-slate-500" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Project Estimation Deliverables</h3>
            <p className="text-xs text-slate-500 mt-1">
              {projectEstimates.length > 0
                ? `${projectEstimates.length} estimate report(s) ready for export and print review.`
                : 'Generate a preliminary cost estimate to produce exportable summary reports.'}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
