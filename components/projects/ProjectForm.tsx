'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useProjects } from '../../lib/store/project-context';
import {
  BuildingType,
  StructuralSystem,
  FoundationType,
  RoofType,
  FinishQuality,
  ProjectFormData,
} from '../../lib/types/project';
import {
  MapPin,
  AlertCircle,
  ArrowLeft,
  User,
} from 'lucide-react';

export function ProjectForm() {
  const router = useRouter();
  const { addProject } = useProjects();

  const [formData, setFormData] = useState<ProjectFormData>({
    projectName: '',
    clientName: '',
    location: '',
    buildingType: 'Commercial',
    plotArea: '',
    builtUpArea: '',
    numberOfFloors: '3',
    structuralSystem: 'RCC Frame',
    foundationType: 'Isolated Footing',
    roofType: 'RCC Slab',
    materialGrade: 'M25 Concrete / Fe500 Steel',
    finishQuality: 'Standard',
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const buildingTypes: BuildingType[] = [
    'Residential',
    'Commercial',
    'Institutional',
    'Industrial',
  ];

  const structuralSystems: StructuralSystem[] = [
    'RCC Frame',
    'Load Bearing',
    'Steel Frame',
    'Other',
  ];

  const foundationTypes: FoundationType[] = [
    'Isolated Footing',
    'Combined Footing',
    'Raft Foundation',
    'Pile Foundation',
    'Other',
  ];

  const roofTypes: RoofType[] = [
    'RCC Slab',
    'Metal Roof',
    'Flat Roof',
    'Other',
  ];

  const finishQualities: FinishQuality[] = ['Economy', 'Standard', 'Premium', 'Luxury'];

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.projectName.trim()) {
      errs.projectName = 'Project name is required';
    }

    if (!formData.clientName.trim()) {
      errs.clientName = 'Client name or owner organization is required';
    }

    if (!formData.location.trim()) {
      errs.location = 'Project location is required';
    }

    const plot = Number(formData.plotArea);
    if (!formData.plotArea || isNaN(plot) || plot <= 0) {
      errs.plotArea = 'Plot area must be a positive number greater than 0';
    }

    const builtUp = Number(formData.builtUpArea);
    if (!formData.builtUpArea || isNaN(builtUp) || builtUp <= 0) {
      errs.builtUpArea = 'Built-up area must be a positive number greater than 0';
    }

    const floors = Number(formData.numberOfFloors);
    if (!formData.numberOfFloors || isNaN(floors) || floors < 1 || !Number.isInteger(floors)) {
      errs.numberOfFloors = 'Number of floors must be at least 1 (whole integer)';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await addProject(formData);
      router.push(`/projects/${created.id}`);
    } catch (err) {
      console.error('Error creating project:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/projects"
              className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Projects</span>
            </Link>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Create New Project
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure civil engineering parameters, structural classification, and geometric constraints.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/projects">
            <Button type="button" variant="outline" size="sm">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            variant="amber"
            size="sm"
            disabled={isSubmitting}
            className="font-semibold shadow-xs"
          >
            {isSubmitting ? 'Saving Project...' : 'Save & Configure'}
          </Button>
        </div>
      </div>

      {/* Section 1: Project Information */}
      <Card className="p-6 bg-white border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-slate-100">
          <div className="w-7 h-7 rounded-md bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-xs">
            1
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Project & Client Information</h2>
            <p className="text-[11px] text-slate-500">General identification and ownership classification</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Project Name */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="projectName"
              placeholder="e.g. Horizon Commercial Complex Tower A"
              value={formData.projectName}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-slate-50/70 border rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.projectName
                  ? 'border-red-400 focus:ring-red-200'
                  : 'border-slate-300 focus:ring-slate-900/10 focus:border-slate-400'
              }`}
            />
            {errors.projectName && (
              <p className="text-[11px] text-red-600 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.projectName}</span>
              </p>
            )}
          </div>

          {/* Client Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Client / Developer Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="clientName"
                placeholder="e.g. Apex Infrastructure Pvt Ltd"
                value={formData.clientName}
                onChange={handleChange}
                className={`w-full pl-9 pr-3 py-2 bg-slate-50/70 border rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.clientName
                    ? 'border-red-400 focus:ring-red-200'
                    : 'border-slate-300 focus:ring-slate-900/10 focus:border-slate-400'
                }`}
              />
            </div>
            {errors.clientName && (
              <p className="text-[11px] text-red-600 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.clientName}</span>
              </p>
            )}
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Project Location <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="location"
                placeholder="e.g. Sector 62, Noida, NCR"
                value={formData.location}
                onChange={handleChange}
                className={`w-full pl-9 pr-3 py-2 bg-slate-50/70 border rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.location
                    ? 'border-red-400 focus:ring-red-200'
                    : 'border-slate-300 focus:ring-slate-900/10 focus:border-slate-400'
                }`}
              />
            </div>
            {errors.location && (
              <p className="text-[11px] text-red-600 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.location}</span>
              </p>
            )}
          </div>

          {/* Building Type */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700">
              Building Type <span className="text-red-500">*</span>
            </label>
            <select
              name="buildingType"
              value={formData.buildingType}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-50/70 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all cursor-pointer"
            >
              {buildingTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Section 2: Project Area */}
      <Card className="p-6 bg-white border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-slate-100">
          <div className="w-7 h-7 rounded-md bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-xs">
            2
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Project Area & Floor Parameters</h2>
            <p className="text-[11px] text-slate-500">Geometric quantities used for baseline takeoff and calculation</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Plot Area */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Plot Area (sq.ft) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="plotArea"
              min="1"
              placeholder="e.g. 15000"
              value={formData.plotArea}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-slate-50/70 border rounded-lg text-xs font-mono text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.plotArea
                  ? 'border-red-400 focus:ring-red-200'
                  : 'border-slate-300 focus:ring-slate-900/10 focus:border-slate-400'
              }`}
            />
            {errors.plotArea && (
              <p className="text-[11px] text-red-600 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.plotArea}</span>
              </p>
            )}
          </div>

          {/* Built-up Area */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Built-up Area (sq.ft) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="builtUpArea"
              min="1"
              placeholder="e.g. 45000"
              value={formData.builtUpArea}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-slate-50/70 border rounded-lg text-xs font-mono text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.builtUpArea
                  ? 'border-red-400 focus:ring-red-200'
                  : 'border-slate-300 focus:ring-slate-900/10 focus:border-slate-400'
              }`}
            />
            {errors.builtUpArea && (
              <p className="text-[11px] text-red-600 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.builtUpArea}</span>
              </p>
            )}
          </div>

          {/* Number of Floors */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Number of Floors <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="numberOfFloors"
              min="1"
              step="1"
              placeholder="e.g. 4"
              value={formData.numberOfFloors}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-slate-50/70 border rounded-lg text-xs font-mono text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.numberOfFloors
                  ? 'border-red-400 focus:ring-red-200'
                  : 'border-slate-300 focus:ring-slate-900/10 focus:border-slate-400'
              }`}
            />
            {errors.numberOfFloors && (
              <p className="text-[11px] text-red-600 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.numberOfFloors}</span>
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Section 3: Structural Information */}
      <Card className="p-6 bg-white border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-slate-100">
          <div className="w-7 h-7 rounded-md bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xs">
            3
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Structural & Engineering Systems</h2>
            <p className="text-[11px] text-slate-500">Framing system, foundation type, roof type, and material grades</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Structural System */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Structural System
            </label>
            <select
              name="structuralSystem"
              value={formData.structuralSystem}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-50/70 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all cursor-pointer"
            >
              {structuralSystems.map((sys) => (
                <option key={sys} value={sys}>
                  {sys}
                </option>
              ))}
            </select>
          </div>

          {/* Foundation Type */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Foundation Type
            </label>
            <select
              name="foundationType"
              value={formData.foundationType}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-50/70 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all cursor-pointer"
            >
              {foundationTypes.map((ft) => (
                <option key={ft} value={ft}>
                  {ft}
                </option>
              ))}
            </select>
          </div>

          {/* Roof Type */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Roof Type
            </label>
            <select
              name="roofType"
              value={formData.roofType}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-50/70 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all cursor-pointer"
            >
              {roofTypes.map((rt) => (
                <option key={rt} value={rt}>
                  {rt}
                </option>
              ))}
            </select>
          </div>

          {/* Material Grade */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Material Grade
            </label>
            <input
              type="text"
              name="materialGrade"
              placeholder="e.g. M25 Concrete / Fe500 TMT Steel"
              value={formData.materialGrade}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-50/70 border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all"
            />
          </div>
        </div>
      </Card>

      {/* Section 4: Finish Information */}
      <Card className="p-6 bg-white border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-slate-100">
          <div className="w-7 h-7 rounded-md bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold text-xs">
            4
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Finish Specification Quality</h2>
            <p className="text-[11px] text-slate-500">Architectural finishing schedule benchmark and coefficient</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {finishQualities.map((qual) => (
            <label
              key={qual}
              className={`p-3.5 rounded-lg border flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                formData.finishQuality === qual
                  ? 'border-amber-600 bg-amber-50/50 text-amber-900 font-semibold ring-1 ring-amber-600'
                  : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100/70'
              }`}
            >
              <input
                type="radio"
                name="finishQuality"
                value={qual}
                checked={formData.finishQuality === qual}
                onChange={handleChange}
                className="sr-only"
              />
              <span className="text-xs font-bold">{qual}</span>
              <span className="text-[10px] text-slate-500 mt-0.5">
                {qual === 'Economy' && 'Basic utility specs'}
                {qual === 'Standard' && 'Commercial grade'}
                {qual === 'Premium' && 'High-end specs'}
                {qual === 'Luxury' && 'Bespoke custom specs'}
              </span>
            </label>
          ))}
        </div>
      </Card>

      {/* Section 5: Additional Information */}
      <Card className="p-6 bg-white border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-slate-100">
          <div className="w-7 h-7 rounded-md bg-slate-500/10 text-slate-700 flex items-center justify-center font-bold text-xs">
            5
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Additional Project Notes</h2>
            <p className="text-[11px] text-slate-500">Site constraints, special conditions, or client remarks</p>
          </div>
        </div>

        <div>
          <textarea
            name="description"
            rows={3}
            placeholder="Add relevant engineering notes, geotechnical data notes, or procurement assumptions..."
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-50/70 border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all"
          />
        </div>
      </Card>

      {/* Bottom CTA Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Link href="/projects">
          <Button type="button" variant="outline" size="md">
            Cancel
          </Button>
        </Link>
        <Button
          type="submit"
          variant="amber"
          size="md"
          disabled={isSubmitting}
          className="font-semibold shadow-xs px-6"
        >
          {isSubmitting ? 'Saving Project...' : 'Save & Configure'}
        </Button>
      </div>
    </form>
  );
}
