'use client';

import React, { useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  User,
  Building,
  Sliders,
  Check,
  Save,
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'company' | 'preferences'>('profile');
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    name: 'Lead Civil Engineer',
    email: 'engineer@kastoras.internal',
    designation: 'Senior Project Manager / Estimator',
    unitSystem: 'Metric (m², m³, MT)',
    currency: 'INR (₹)',
  });

  const [company, setCompany] = useState({
    name: 'Kastoras Civil Engineering Labs',
    taxId: 'GSTIN-07AAAAA0000A1Z5',
    defaultMeasurementCode: 'CPWD / IS 1200',
    headquarters: 'NCR Regional Office',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl mx-auto pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Platform Settings
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Configure engineering preferences, measurement standards, and organizational parameters.
            </p>
          </div>

          {saved && (
            <Badge variant="emerald" className="self-start sm:self-auto py-1 px-3">
              <Check className="w-3.5 h-3.5 mr-1" />
              Settings saved locally
            </Badge>
          )}
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold text-slate-600">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`pb-3 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'profile'
                ? 'text-slate-900 border-b-2 border-amber-600 font-bold'
                : 'hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('company')}
            className={`pb-3 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'company'
                ? 'text-slate-900 border-b-2 border-amber-600 font-bold'
                : 'hover:text-slate-900'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Company & Organization</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preferences')}
            className={`pb-3 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'preferences'
                ? 'text-slate-900 border-b-2 border-amber-600 font-bold'
                : 'hover:text-slate-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Engineering Preferences</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Profile Section */}
          {activeTab === 'profile' && (
            <Card className="p-6 bg-white border-slate-200 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-base">
                  KS
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Engineer Profile</h3>
                  <p className="text-xs text-slate-500">Kastoras Workspace Admin</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">Engineering Designation</label>
                  <input
                    type="text"
                    value={profile.designation}
                    onChange={(e) => setProfile({ ...profile, designation: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">Contact Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">Default Currency</label>
                  <input
                    type="text"
                    value={profile.currency}
                    onChange={(e) => setProfile({ ...profile, currency: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Company Section */}
          {activeTab === 'company' && (
            <Card className="p-6 bg-white border-slate-200 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
                Organization & Practice Credentials
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">Company / Enterprise Name</label>
                  <input
                    type="text"
                    value={company.name}
                    onChange={(e) => setCompany({ ...company, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">Corporate / GST Identification</label>
                  <input
                    type="text"
                    value={company.taxId}
                    onChange={(e) => setCompany({ ...company, taxId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">Regional HQ Office</label>
                  <input
                    type="text"
                    value={company.headquarters}
                    onChange={(e) => setCompany({ ...company, headquarters: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">Default Standard of Measurement</label>
                  <input
                    type="text"
                    value={company.defaultMeasurementCode}
                    onChange={(e) =>
                      setCompany({ ...company, defaultMeasurementCode: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Preferences Section */}
          {activeTab === 'preferences' && (
            <Card className="p-6 bg-white border-slate-200 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
                Civil Engineering Defaults
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <span className="font-semibold text-slate-800 block">Unit System</span>
                    <span className="text-slate-500 text-[11px]">Primary dimensional standard for takeoffs</span>
                  </div>
                  <Badge variant="slate" className="font-mono">Metric (m², m³, MT)</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <span className="font-semibold text-slate-800 block">Carbon Emission Standard</span>
                    <span className="text-slate-500 text-[11px]">Lifecycle boundary A1-A5 cradle-to-gate factors</span>
                  </div>
                  <Badge variant="emerald" className="font-mono">ICE Database v3.0</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <span className="font-semibold text-slate-800 block">Database Sync Mode</span>
                    <span className="text-slate-500 text-[11px]">Supabase App Router client synchronization</span>
                  </div>
                  <Badge variant="blue" className="font-mono">Active (Anonymous Key)</Badge>
                </div>
              </div>
            </Card>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="amber"
              size="sm"
              icon={<Save className="w-3.5 h-3.5" />}
              className="font-semibold shadow-xs"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
