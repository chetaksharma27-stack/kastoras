'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Breadcrumbs } from './Breadcrumbs';
import { Button } from '../ui/Button';
import {
  Menu,
  Search,
  Bell,
  Plus,
  X,
} from 'lucide-react';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export function Header({ onOpenMobileMenu }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Left section: Mobile toggle + Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Breadcrumbs />
      </div>

      {/* Right section: Search, Notifications, New Project CTA, Avatar */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Search input */}
        <div className="relative hidden md:block w-56 lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects, rates, items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-1.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-xs text-slate-800 placeholder-slate-400 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all font-sans"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded px-1 shadow-2xs">
            /
          </kbd>
        </div>

        {/* Notifications Dropdown Toggle */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 relative transition-colors focus:outline-none"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 p-4 z-50 text-xs animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-semibold text-slate-900">System Notifications</span>
                <button
                  type="button"
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="py-3 space-y-2.5">
                <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/60">
                  <p className="font-semibold text-amber-900">Kastoras V1 Initialized</p>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    Ready to configure your construction projects, cost estimates, BOQs, and carbon calculations.
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60">
                  <p className="font-semibold text-slate-800">Database Engine Connected</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Supabase client verified and active for App Router.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick New Project CTA */}
        <Link href="/projects/new">
          <Button
            size="sm"
            variant="amber"
            icon={<Plus className="w-3.5 h-3.5" />}
            className="hidden sm:inline-flex shadow-xs"
          >
            New Project
          </Button>
        </Link>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-amber-400 font-bold text-xs flex items-center justify-center border border-slate-800 shadow-2xs">
            KS
          </div>
        </div>
      </div>
    </header>
  );
}
