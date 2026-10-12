import React, { useState } from 'react';
import { LinkItemData, ProfileData } from '../../types';
import { PublicBioPage } from '../public/PublicBioPage';
import {
  ExternalLinkIcon,
  RefreshCwIcon,
  SmartphoneIcon,
  MonitorIcon,
} from '../icons';

interface PhoneMockupProps {
  profile: ProfileData;
  links: LinkItemData[];
  onLinkClick?: (linkId: string) => void;
  onOpenPublicTab: () => void;
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({
  profile,
  links,
  onLinkClick,
  onOpenPublicTab,
}) => {
  const [key, setKey] = useState(0);
  const [deviceMode, setDeviceMode] = useState<'phone' | 'wide'>('phone');

  const handleRefresh = () => {
    setKey((prev) => prev + 1);
  };

  const currentTime = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return (
    <div className="flex flex-col items-center justify-start h-full">
      {/* Mockup Toolbar Header */}
      <div className="w-full max-w-sm mb-3 flex items-center justify-between px-2 text-xs text-neutral-600">
        <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px]">
          <span className="w-2 h-2 rounded-full bg-[#34A853]"></span>
          <span>Live Mobile Preview</span>
        </div>

        <div className="flex items-center gap-1 bg-white border-2 border-[#111111] p-1 rounded-xl shadow-[2px_2px_0px_#111111]">
          <button
            onClick={() => setDeviceMode('phone')}
            title="Mobile iPhone View"
            className={`p-1.5 rounded-lg transition ${
              deviceMode === 'phone' ? 'bg-[#111111] text-white' : 'text-neutral-700 hover:text-black'
            }`}
          >
            <SmartphoneIcon className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeviceMode('wide')}
            title="Wider View"
            className={`p-1.5 rounded-lg transition ${
              deviceMode === 'wide' ? 'bg-[#111111] text-white' : 'text-neutral-700 hover:text-black'
            }`}
          >
            <MonitorIcon className="w-3.5 h-3.5" />
          </button>
          <div className="w-px h-3.5 bg-neutral-300 mx-0.5"></div>
          <button
            onClick={handleRefresh}
            title="Refresh preview"
            className="p-1.5 rounded-lg text-neutral-700 hover:text-black transition"
          >
            <RefreshCwIcon className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onOpenPublicTab}
            title="Open in new tab"
            className="p-1.5 rounded-lg text-neutral-700 hover:text-[#4285F4] transition"
          >
            <ExternalLinkIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Simulated Address Bar */}
      <div className="w-full max-w-sm mb-4 bg-white border-2 border-[#111111] rounded-full px-3.5 py-1.5 flex items-center justify-between text-[11px] text-neutral-700 font-mono shadow-[3px_3px_0px_#111111]">
        <span className="flex items-center gap-1.5 text-neutral-500 font-medium">
          <span className="text-[#34A853] font-bold">🔒</span> gdgfiem.club/#/
        </span>
        <span className="text-[#111111] font-bold truncate">
          {profile.username || 'user'}
        </span>
        <span className="text-[10px] text-neutral-400 font-sans uppercase font-bold">LIVE</span>
      </div>

      {/* Phone Hardware Mockup Frame */}
      <div
        className={`relative transition-all duration-300 ${
          deviceMode === 'phone' ? 'w-[340px] sm:w-[360px]' : 'w-[420px]'
        }`}
        style={{
          height: '710px',
        }}
      >
        {/* Outer Titanium Bezel */}
        <div className="w-full h-full rounded-[48px] p-3.5 bg-gradient-to-b from-slate-700 via-slate-900 to-black shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.1)] border border-slate-700/60 flex flex-col relative overflow-hidden">
          {/* Inner Display Screen */}
          <div className="relative w-full h-full rounded-[38px] overflow-hidden bg-slate-950 flex flex-col border border-white/5 shadow-inner">
            {/* Status Bar */}
            <div className="h-8 w-full bg-transparent px-6 flex items-center justify-between text-[11px] font-semibold text-white/90 z-20 shrink-0 pointer-events-none select-none">
              <span>{currentTime}</span>

              {/* Dynamic Island Speaker Notch */}
              <div className="w-20 h-4 bg-black rounded-full flex items-center justify-end px-2 gap-1 border border-white/10 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-800"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-900/40"></span>
              </div>

              {/* Status Icons */}
              <div className="flex items-center gap-1 text-[10px]">
                <span>5G</span>
                <span className="text-xs">⚡</span>
              </div>
            </div>

            {/* Scrollable Public Page Preview */}
            <div
              key={key}
              className="flex-1 w-full overflow-y-auto overscroll-contain relative custom-scrollbar"
            >
              <PublicBioPage
                profile={profile}
                links={links}
                onLinkClick={onLinkClick}
                isMockup={true}
              />
            </div>

            {/* Home Bar indicator */}
            <div className="h-4 w-full bg-transparent flex items-center justify-center shrink-0 pointer-events-none select-none z-20 pb-1">
              <div className="w-28 h-1 bg-white/40 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
