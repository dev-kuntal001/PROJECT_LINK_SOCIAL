import React from 'react';
import { ActiveTab, ProfileData } from '../types';
import {
  ExternalLinkIcon,
  CopyIcon,
  PaletteIcon,
  BarChartIcon,
  UserIcon,
  GripVerticalIcon,
  GdgLogoIcon,
} from './icons';

interface NavbarProps {
  currentView: 'dashboard' | 'public';
  onSwitchView: (view: 'dashboard' | 'public') => void;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  profile: ProfileData;
  linksCount: number;
  onCopyLink: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSwitchView,
  activeTab,
  onTabChange,
  profile,
  linksCount,
  onCopyLink,
}) => {
  const publicSlug = `/${profile.username || 'user'}`;

  return (
    <header className="sticky top-0 z-40 w-full px-4 sm:px-6 py-3 bg-[#F4F1E9]/80 backdrop-blur-md border-b border-black/10">
      <div className="max-w-7xl mx-auto">
        {/* Floating Pill Header Bar matching the reference website */}
        <div className="rounded-full bg-white/95 border-2 border-[#111111] px-4 sm:px-6 py-2.5 shadow-[4px_4px_0px_#111111] flex items-center justify-between transition-all">
          {/* Logo & Brand */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => onSwitchView('dashboard')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="flex items-center gap-2 bg-[#111111] text-white px-3 py-1.5 rounded-full text-xs font-black tracking-wider shadow-sm">
                <GdgLogoIcon className="w-8 h-5" />
                <span className="text-[11px] tracking-widest uppercase">GDG OC FIEM</span>
              </div>
            </button>

            {/* Desktop View Switcher */}
            <div className="hidden md:flex items-center bg-[#F4F1E9] border border-neutral-300 rounded-full p-1 text-xs">
              <button
                onClick={() => onSwitchView('dashboard')}
                className={`px-3 py-1 rounded-full font-bold transition-all ${
                  currentView === 'dashboard'
                    ? 'bg-[#111111] text-white shadow-sm'
                    : 'text-neutral-600 hover:text-black'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => onSwitchView('public')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-bold transition-all ${
                  currentView === 'public'
                    ? 'bg-[#111111] text-white shadow-sm'
                    : 'text-neutral-600 hover:text-black'
                }`}
              >
                <span>Public Profile</span>
                <span className="text-[10px] opacity-75 font-mono">
                  {publicSlug}
                </span>
              </button>
            </div>
          </div>

          {/* Quick Actions (Copy Link & Toggle View) */}
          <div className="flex items-center gap-2">
            <button
              onClick={onCopyLink}
              title="Copy public link to clipboard"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-[#111111] bg-white hover:bg-neutral-50 border-2 border-[#111111] shadow-[2px_2px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 transition"
            >
              <CopyIcon className="w-3.5 h-3.5 text-[#4285F4]" />
              <span className="hidden sm:inline">Copy Link</span>
              <span className="text-[10px] font-mono text-neutral-500 hidden md:inline">
                {publicSlug}
              </span>
            </button>

            {currentView === 'dashboard' ? (
              <button
                onClick={() => window.open(`${window.location.origin}/#/${profile.username || 'user'}`, '_blank', 'noopener,noreferrer')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-[#111111] border-2 border-[#111111] shadow-[2px_2px_0px_#4285F4] hover:shadow-[3px_3px_0px_#4285F4] active:translate-x-0.5 active:translate-y-0.5 transition"
              >
                <span>Live View</span>
                <ExternalLinkIcon className="w-3.5 h-3.5 text-[#FBBC04]" />
              </button>
            ) : (
              <button
                onClick={() => onSwitchView('dashboard')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-[#111111] border-2 border-[#111111] shadow-[2px_2px_0px_#111111] hover:bg-neutral-800 transition"
              >
                <span>Dashboard</span>
              </button>
            )}
          </div>
        </div>

        {/* Dashboard Tabs for Navigation */}
        {currentView === 'dashboard' && (
          <div className="flex items-center justify-center gap-2 overflow-x-auto pt-3 pb-1">
            <button
              onClick={() => onTabChange('links')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border-2 ${
                activeTab === 'links'
                  ? 'bg-[#111111] text-white border-[#111111] shadow-[2px_2px_0px_#4285F4]'
                  : 'bg-white text-neutral-700 border-neutral-300 hover:border-black'
              }`}
            >
              <GripVerticalIcon className="w-3.5 h-3.5" />
              <span>Links Manager</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-neutral-200 text-black font-mono font-bold">
                {linksCount}
              </span>
            </button>

            <button
              onClick={() => onTabChange('appearance')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border-2 ${
                activeTab === 'appearance'
                  ? 'bg-[#111111] text-white border-[#111111] shadow-[2px_2px_0px_#EA4335]'
                  : 'bg-white text-neutral-700 border-neutral-300 hover:border-black'
              }`}
            >
              <PaletteIcon className="w-3.5 h-3.5" />
              <span>Themes & Styles</span>
            </button>

            <button
              onClick={() => onTabChange('profile')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border-2 ${
                activeTab === 'profile'
                  ? 'bg-[#111111] text-white border-[#111111] shadow-[2px_2px_0px_#FBBC04]'
                  : 'bg-white text-neutral-700 border-neutral-300 hover:border-black'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Profile & Socials</span>
            </button>

            <button
              onClick={() => onTabChange('analytics')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border-2 ${
                activeTab === 'analytics'
                  ? 'bg-[#111111] text-white border-[#111111] shadow-[2px_2px_0px_#34A853]'
                  : 'bg-white text-neutral-700 border-neutral-300 hover:border-black'
              }`}
            >
              <BarChartIcon className="w-3.5 h-3.5" />
              <span>Analytics</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
