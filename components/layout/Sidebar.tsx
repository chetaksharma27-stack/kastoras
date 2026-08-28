'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderKanban,
  Calculator,
  Layers,
  Leaf,
  BookOpen,
  FileBarChart2,
  Settings,
  HelpCircle,
  Building2,
  HardHat,
} from 'lucide-react';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export function Sidebar({ onCloseMobile }: SidebarProps) {
  const pathname = usePathname();

  const mainNav = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, exact: true },
    { name: 'Projects', href: '/projects', icon: FolderKanban },
    {
      name: 'Cost Estimation',
      href: '/estimates',
      icon: Calculator,
      moduleTag: 'M1',
      accentColor: 'text-amber-400',
    },
    {
      name: 'BOQ Generator',
      href: '/boq',
      icon: Layers,
      moduleTag: 'M2',
      accentColor: 'text-blue-400',
    },
    {
      name: 'Carbon Analysis',
      href: '/carbon',
      icon: Leaf,
      moduleTag: 'M3',
      accentColor: 'text-emerald-400',
    },
  ];

  const resourceNav = [
    { name: 'Construction Library', href: '/library', icon: BookOpen },
    { name: 'Reports', href: '/reports', icon: FileBarChart2 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const isActive = (href: string, exact = false) => {
    if (exact) {
      return pathname === href;
    }
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-[#0B1329] text-slate-300 flex flex-col h-full border-r border-[#1E293B] select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#1E293B] flex flex-col gap-1">
        <Link
          href="/"
          onClick={onCloseMobile}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-xs group-hover:border-amber-400/50 transition-colors">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-wider text-white">KASTORAS</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                V1
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium tracking-tight">
              Construction Intelligence
            </p>
          </div>
        </Link>
        <div className="mt-2 text-[10px] text-slate-500 font-mono tracking-wide">
          From Drawings to Decisions.
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        <div>
          <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500 font-mono">
            Platform Modules
          </div>
          <nav className="space-y-1">
            {mainNav.map((item) => {
              const active = isActive(item.href, item.exact);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                    active
                      ? 'bg-amber-500/15 text-white font-semibold border border-amber-500/30'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-[#16223F]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        active
                          ? 'text-amber-400'
                          : item.accentColor || 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>
                  {item.moduleTag && (
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        active
                          ? 'bg-amber-400/20 text-amber-300'
                          : 'bg-slate-800/80 text-slate-400'
                      }`}
                    >
                      {item.moduleTag}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Resources Divider */}
        <div className="pt-2 border-t border-[#1E293B]">
          <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500 font-mono">
            Resources & Tools
          </div>
          <nav className="space-y-1">
            {resourceNav.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                    active
                      ? 'bg-[#16223F] text-white border border-[#2A3B60]'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-[#16223F]'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      active ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom User & Help Section */}
      <div className="p-3 border-t border-[#1E293B] bg-[#080E1F] space-y-2">
        <div className="flex items-center justify-between p-2 rounded-lg bg-[#111C38] border border-[#1E2E52]">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-md bg-slate-700/80 border border-slate-600 flex items-center justify-center text-slate-200 shrink-0">
              <HardHat className="w-4 h-4 text-amber-400" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">Lead Engineer</p>
              <p className="text-[10px] text-slate-400 truncate">Civil & Structural</p>
            </div>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Connected" />
        </div>

        <div className="flex items-center justify-between px-2 pt-1 text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            <span>Kastoras Docs</span>
          </span>
          <span className="font-mono text-[10px] text-slate-500">v1.0.0</span>
        </div>
      </div>
    </aside>
  );
}
