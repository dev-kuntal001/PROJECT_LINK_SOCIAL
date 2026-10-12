import React, { useState } from 'react';
import { LinkItemData } from '../../types';
import { formatDisplayUrl } from '../../utils/url';
import {
  RefreshCwIcon,
  SparklesIcon,
  CheckIcon,
  XCloseIcon,
} from '../icons';

interface AnalyticsViewProps {
  links: LinkItemData[];
  onResetAnalytics: () => void;
  onNotify: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  links,
  onResetAnalytics,
  onNotify,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);

  const totalClicks = links.reduce((sum, l) => sum + (l.clicks || 0), 0);
  const activeCount = links.filter((l) => l.enabled).length;
  const sortedByClicks = [...links].sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
  const topLink = sortedByClicks[0];
  const avgClicks = links.length > 0 ? Math.round(totalClicks / links.length) : 0;

  const handleReset = () => {
    onResetAnalytics();
    setConfirmReset(false);
    onNotify('Analytics reset to zero', 'info');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111]">
        <div>
          <div className="editorial-badge mb-1">METRICS &amp; REACH</div>
          <h2 className="text-xl font-black text-[#111111] tracking-tight">Traffic &amp; Engagement</h2>
          <p className="text-xs text-neutral-600 mt-0.5">
            Real-time tap insights, link conversions, and audience engagement metrics.
          </p>
        </div>

        {confirmReset ? (
          <div className="flex items-center gap-2 bg-rose-50 border-2 border-[#EA4335] px-3 py-1.5 rounded-xl shadow-[2px_2px_0px_#EA4335]">
            <span className="text-xs text-[#EA4335] font-bold">Reset counters?</span>
            <button
              onClick={handleReset}
              className="p-1 rounded bg-[#EA4335] text-white text-xs hover:bg-rose-700 font-bold"
              title="Confirm"
            >
              <CheckIcon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setConfirmReset(false)}
              className="p-1 rounded bg-neutral-200 text-neutral-700 hover:text-black text-xs"
              title="Cancel"
            >
              <XCloseIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmReset(true)}
            disabled={totalClicks === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-neutral-600 hover:text-[#EA4335] hover:bg-rose-50 border border-neutral-300 disabled:opacity-40 disabled:pointer-events-none transition"
          >
            <RefreshCwIcon className="w-3.5 h-3.5" />
            <span>Reset Stats</span>
          </button>
        )}
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Clicks */}
        <div className="p-5 rounded-2xl bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#4285F4]">
          <div className="flex items-center justify-between text-neutral-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Taps</span>
            <span className="text-[#4285F4] font-black text-sm">#1</span>
          </div>
          <div className="text-3xl font-black text-[#111111] tracking-tight">
            {totalClicks.toLocaleString()}
          </div>
          <p className="text-[11px] text-neutral-500 mt-1 font-mono">
            Across {links.length} community links
          </p>
        </div>

        {/* Active Links */}
        <div className="p-5 rounded-2xl bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#34A853]">
          <div className="flex items-center justify-between text-neutral-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Live Links</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#34A853]" />
          </div>
          <div className="text-3xl font-black text-[#111111] tracking-tight">
            {activeCount}
          </div>
          <p className="text-[11px] text-neutral-500 mt-1 font-mono">
            Published to public profile
          </p>
        </div>

        {/* Average Clicks */}
        <div className="p-5 rounded-2xl bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#FBBC04]">
          <div className="flex items-center justify-between text-neutral-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Taps / Link</span>
            <span className="text-xs font-bold font-mono text-[#FBBC04]">AVG</span>
          </div>
          <div className="text-3xl font-black text-[#111111] tracking-tight">
            {avgClicks}
          </div>
          <p className="text-[11px] text-neutral-500 mt-1 font-mono">
            Average per destination
          </p>
        </div>

        {/* Top Destination */}
        <div className="p-5 rounded-2xl bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#EA4335]">
          <div className="flex items-center justify-between text-neutral-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Top Link</span>
            <SparklesIcon className="w-4 h-4 text-[#EA4335]" />
          </div>
          <div className="text-sm font-bold text-[#111111] truncate mb-1">
            {topLink?.title || 'None'}
          </div>
          <p className="text-[11px] text-[#EA4335] font-bold font-mono">
            {topLink?.clicks || 0} taps ({totalClicks > 0 ? Math.round(((topLink?.clicks || 0) / totalClicks) * 100) : 0}%)
          </p>
        </div>
      </div>

      {/* Engagement Ranking Breakdown */}
      <div className="p-6 rounded-2xl bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#111111]">
            Tap Performance by Link
          </h3>
          <span className="text-xs font-mono text-neutral-500 font-bold">
            Sorted by most active
          </span>
        </div>

        {sortedByClicks.length === 0 ? (
          <div className="text-center py-8 text-neutral-500 text-xs">
            No link data recorded yet.
          </div>
        ) : (
          <div className="space-y-3">
            {sortedByClicks.map((link, idx) => {
              const percentage = totalClicks > 0 ? Math.round(((link.clicks || 0) / totalClicks) * 100) : 0;
              const barColors = ['bg-[#4285F4]', 'bg-[#EA4335]', 'bg-[#FBBC04]', 'bg-[#34A853]'];
              const barColor = barColors[idx % barColors.length];

              return (
                <div
                  key={link.id}
                  className="p-3.5 rounded-xl border-2 border-neutral-200 bg-neutral-50 space-y-2 hover:border-[#111111] transition"
                >
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-5 h-5 rounded-md bg-[#111111] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <span className="font-bold text-[#111111] truncate block">
                          {link.title}
                        </span>
                        <span className="text-[11px] font-mono text-neutral-500 truncate block">
                          {formatDisplayUrl(link.url)}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-bold text-[#111111] font-mono text-sm">
                        {link.clicks || 0}
                      </span>
                      <span className="text-[10px] text-neutral-500 block font-mono">
                        {percentage}% of traffic
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-neutral-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${barColor} transition-all duration-500`}
                      style={{ width: `${Math.max(percentage, 3)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
