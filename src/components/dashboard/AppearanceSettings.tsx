import React from 'react';
import { ButtonStyle, ProfileData, ThemeId } from '../../types';
import { THEMES } from '../../themes/themeConfig';
import { CheckIcon, SparklesIcon, ShieldCheckIcon } from '../icons';

interface AppearanceSettingsProps {
  profile: ProfileData;
  onUpdateProfile: (updates: Partial<ProfileData>) => void;
  onNotify: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const BUTTON_STYLES: { id: ButtonStyle; name: string; previewClass: string }[] = [
  { id: 'brutal-black', name: 'GDG Brutal Black', previewClass: 'rounded-xl bg-[#111111] text-white border-2 border-[#111111] shadow-[3px_3px_0px_#4285F4]' },
  { id: 'brutal-white', name: 'Editorial White', previewClass: 'rounded-xl bg-white text-[#111111] border-2 border-[#111111] shadow-[3px_3px_0px_#111111]' },
  { id: 'pill', name: 'Full Pill', previewClass: 'rounded-full bg-white text-[#111111] border-2 border-[#111111] shadow-[2px_2px_0px_#111111]' },
  { id: 'rounded-2xl', name: 'Rounded 2XL', previewClass: 'rounded-2xl bg-white text-[#111111] border-2 border-[#111111] shadow-[3px_3px_0px_#111111]' },
  { id: 'rounded-lg', name: 'Crisp Radius', previewClass: 'rounded-lg bg-white text-[#111111] border-2 border-[#111111] shadow-[2px_2px_0px_#111111]' },
  { id: 'glass-outline', name: 'Glass Outline', previewClass: 'rounded-2xl border-2 border-neutral-400 bg-white/70 text-[#111111]' },
  { id: 'elevated-solid', name: 'Elevated 3D', previewClass: 'rounded-2xl bg-white text-[#111111] border-2 border-[#111111] shadow-[0_4px_0_0_#111111]' },
];

export const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({
  profile,
  onUpdateProfile,
  onNotify,
}) => {
  const handleSelectTheme = (themeId: ThemeId) => {
    onUpdateProfile({ theme: themeId });
    onNotify(`Theme switched to ${THEMES[themeId].name}`, 'success');
  };

  const handleSelectButtonStyle = (style: ButtonStyle) => {
    onUpdateProfile({ buttonStyle: style });
    onNotify(`Button style updated`, 'info');
  };

  const handleToggleVerified = () => {
    onUpdateProfile({ verified: !profile.verified });
    onNotify(profile.verified ? 'Verified badge hidden' : 'Verified badge enabled', 'info');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111]">
        <div className="editorial-badge mb-1">VISUAL STYLING</div>
        <h2 className="text-xl font-black text-[#111111] tracking-tight">Theme &amp; Appearance</h2>
        <p className="text-xs text-neutral-600 mt-0.5">
          Select your visual theme, button shape, and GDG FIEM styling elements.
        </p>
      </div>

      {/* Preset Themes Grid */}
      <div className="p-6 rounded-2xl bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111] space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-[#111111] flex items-center gap-2 uppercase tracking-wide">
            <span>Color Atmosphere</span>
            <SparklesIcon className="w-4 h-4 text-[#FBBC04]" />
          </label>
          <span className="text-xs text-[#4285F4] font-mono font-bold">
            {THEMES[profile.theme]?.name || 'Editorial Ivory'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(THEMES).map((thm) => {
            const isSelected = profile.theme === thm.id;

            return (
              <button
                key={thm.id}
                onClick={() => handleSelectTheme(thm.id)}
                className={`relative flex flex-col p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                  isSelected
                    ? 'border-[#111111] bg-[#FAF8F3] shadow-[4px_4px_0px_#4285F4] -translate-x-0.5 -translate-y-0.5'
                    : 'border-neutral-300 bg-white hover:border-[#111111] hover:shadow-[3px_3px_0px_#111111]'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-8 h-8 rounded-lg border-2 border-[#111111] ${thm.previewBg}`} />
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#111111] text-white flex items-center justify-center">
                      <CheckIcon className="w-3 h-3 text-[#34A853]" />
                    </div>
                  )}
                </div>

                <span className="text-sm font-bold text-[#111111] mb-1">
                  {thm.name}
                </span>
                <span className="text-[11px] text-neutral-600 line-clamp-2 leading-relaxed">
                  {thm.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Button Styles Selection */}
      <div className="p-6 rounded-2xl bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111] space-y-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-[#111111]">
            Button Shape &amp; Card Style
          </h3>
          <p className="text-xs text-neutral-600 mt-0.5">
            Choose how your public link buttons appear on mobile and desktop.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {BUTTON_STYLES.map((style) => {
            const isSelected = profile.buttonStyle === style.id;

            return (
              <button
                key={style.id}
                onClick={() => handleSelectButtonStyle(style.id)}
                className={`p-3.5 rounded-xl border-2 text-left flex items-center justify-between transition-all ${
                  isSelected
                    ? 'border-[#111111] bg-[#FAF8F3] shadow-[3px_3px_0px_#4285F4]'
                    : 'border-neutral-300 bg-white hover:border-[#111111]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-16 h-8 flex items-center justify-center text-[10px] font-bold ${style.previewClass}`}>
                    Link
                  </div>
                  <span className="text-xs font-bold text-[#111111]">
                    {style.name}
                  </span>
                </div>

                {isSelected && (
                  <CheckIcon className="w-4 h-4 text-[#34A853] shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Trust & Verification Badges */}
      <div className="p-6 rounded-2xl bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111] flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheckIcon className="w-5 h-5 text-[#4285F4]" />
            <h3 className="text-sm font-bold uppercase tracking-wide text-[#111111]">
              Verified Chapter Badge
            </h3>
          </div>
          <p className="text-xs text-neutral-600 mt-1 max-w-md">
            Display the official verification badge next to your chapter display name.
          </p>
        </div>

        <button
          onClick={handleToggleVerified}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors border-2 border-[#111111] ${
            profile.verified ? 'bg-[#34A853]' : 'bg-neutral-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform border border-[#111111] ${
              profile.verified ? 'translate-x-5' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );
};
