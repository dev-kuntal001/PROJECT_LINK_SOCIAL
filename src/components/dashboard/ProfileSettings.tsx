import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CustomSocialPlatform, ProfileData, SocialLinks } from '../../types';
import {
  CheckIcon,
  PlusIcon,
  XCloseIcon,
  renderPlatformIcon,
} from '../icons';
import {
  AVAILABLE_CUSTOM_ICONS,
  PREDEFINED_PLATFORMS,
  getPlatformColor,
  getPlatformConfig,
  getPlatformIconName,
  getPlatformLabel,
} from '../../data/socialPlatforms';

interface ProfileSettingsProps {
  profile: ProfileData;
  onUpdateProfile: (updates: Partial<ProfileData>) => void;
  onNotify: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&h=400&q=80',
];

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  profile,
  onUpdateProfile,
  onNotify,
}) => {
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [socials, setSocials] = useState<SocialLinks>(() => ({ ...(profile.socials || {}) }));
  const [customSocialPlatforms, setCustomSocialPlatforms] = useState<Record<string, CustomSocialPlatform>>(
    () => ({ ...(profile.customSocialPlatforms || {}) })
  );
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add social modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPlatformType, setNewPlatformType] = useState<string>('github');
  const [newCustomName, setNewCustomName] = useState('');
  const [newCustomIcon, setNewCustomIcon] = useState('globe');
  const [newAccountValue, setNewAccountValue] = useState('');
  const [addError, setAddError] = useState<string | null>(null);

  // Keep state in sync if profile updates externally
  useEffect(() => {
    setDisplayName(profile.displayName);
    setUsername(profile.username);
    setBio(profile.bio);
    setAvatarUrl(profile.avatarUrl);
    setSocials({ ...(profile.socials || {}) });
    setCustomSocialPlatforms({ ...(profile.customSocialPlatforms || {}) });
  }, [profile]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setUploadError('Only PNG, JPG/JPEG, and WebP files are accepted.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File must be smaller than 5 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setAvatarUrl(dataUrl);
    };
    reader.onerror = () => setUploadError('Failed to read file. Please try again.');
    reader.readAsDataURL(file);
    // Reset input so the same file can be re-selected
    e.target.value = '';
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '') || 'user';
    onUpdateProfile({
      displayName: displayName.trim() || 'Anonymous',
      username: cleanUsername,
      bio: bio.trim(),
      avatarUrl: avatarUrl.trim(),
      socials,
      customSocialPlatforms,
    });
    onNotify('Profile settings saved successfully!', 'success');
  };

  const handleSocialChange = (key: string, value: string) => {
    setSocials((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSocialBlur = (key: string, value: string) => {
    const updatedSocials = {
      ...socials,
      [key]: value.trim(),
    };
    onUpdateProfile({
      socials: updatedSocials,
      customSocialPlatforms,
    });
  };

  const handleRemoveSocial = (key: string) => {
    const platformLabel = getPlatformLabel(key, customSocialPlatforms);
    const nextSocials = { ...socials };
    delete nextSocials[key];
    setSocials(nextSocials);

    let nextCustom = customSocialPlatforms;
    if (customSocialPlatforms && customSocialPlatforms[key]) {
      nextCustom = { ...customSocialPlatforms };
      delete nextCustom[key];
      setCustomSocialPlatforms(nextCustom);
    }

    onUpdateProfile({
      socials: nextSocials,
      customSocialPlatforms: nextCustom,
    });
    onNotify(`Removed ${platformLabel}`, 'info');
  };

  const handleOpenAddModal = () => {
    const availablePredefined = PREDEFINED_PLATFORMS.find((p) => !(p.key in socials));
    setNewPlatformType(availablePredefined ? availablePredefined.key : 'custom');
    setNewCustomName('');
    setNewCustomIcon('globe');
    setNewAccountValue('');
    setAddError(null);
    setShowAddModal(true);
  };

  const handleAddSocialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);

    const isCustom = newPlatformType === 'custom';
    let targetKey = newPlatformType;
    let label = '';
    let icon = 'globe';

    if (isCustom) {
      const trimmedName = newCustomName.trim();
      if (!trimmedName) {
        setAddError('Please enter a platform name.');
        return;
      }
      label = trimmedName;
      icon = newCustomIcon || 'globe';
      targetKey = 'custom_' + trimmedName.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Date.now().toString(36);
    } else {
      const predefined = PREDEFINED_PLATFORMS.find((p) => p.key === newPlatformType);
      if (!predefined) {
        setAddError('Please select a valid platform.');
        return;
      }
      if (targetKey in socials) {
        setAddError(`${predefined.name} is already connected.`);
        return;
      }
      label = predefined.name;
      icon = predefined.iconName;
    }

    const trimmedValue = newAccountValue.trim();
    if (!trimmedValue) {
      setAddError('Please enter a URL, username, or email.');
      return;
    }

    if (targetKey === 'email' || newPlatformType === 'email') {
      const emailCandidate = trimmedValue.replace(/^mailto:/i, '').trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailCandidate)) {
        setAddError('Please enter a valid email address (e.g. gdg@fiem.edu.in).');
        return;
      }
    }

    const nextSocials: SocialLinks = {
      ...socials,
      [targetKey]: trimmedValue,
    };
    setSocials(nextSocials);

    let nextCustom = customSocialPlatforms;
    if (isCustom) {
      nextCustom = {
        ...customSocialPlatforms,
        [targetKey]: { name: label, icon },
      };
      setCustomSocialPlatforms(nextCustom);
    }

    onUpdateProfile({
      socials: nextSocials,
      customSocialPlatforms: nextCustom,
    });

    onNotify(`Added ${label} successfully!`, 'success');
    setShowAddModal(false);
  };

  const activeSocialKeys = Object.keys(socials);

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111]">
        <div className="editorial-badge mb-1">PROFILE DETAILS</div>
        <h2 className="text-xl font-black text-[#111111] tracking-tight">Identity &amp; Socials</h2>
        <p className="text-xs text-neutral-600 mt-0.5">
          Customize your chapter name, photo, editorial bio, and connected links.
        </p>
      </div>

      {/* Basic Profile Info */}
      <div className="p-6 rounded-2xl bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111] space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#111111]">
          General Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border-2 border-[#111111] text-[#111111] placeholder-neutral-400 text-sm focus:outline-none focus:border-[#4285F4] transition shadow-inner"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
              Public Username / URL Slug
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 text-sm font-mono font-bold">
                /
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                className="w-full pl-7 pr-3.5 py-2.5 rounded-xl bg-neutral-50 border-2 border-[#111111] text-[#111111] placeholder-neutral-400 text-sm font-mono focus:outline-none focus:border-[#4285F4] transition shadow-inner"
                required
              />
            </div>
            <p className="text-[11px] text-neutral-500 mt-1 font-mono">
              Live link: <code className="text-[#4285F4] font-bold">gdgfiem.club/#{username || 'user'}</code>
            </p>
          </div>
        </div>

        {/* Bio Text */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
              Editorial Bio / Motto
            </label>
            <span className="text-[11px] text-neutral-500 font-mono">{bio.length}/160</span>
          </div>
          <textarea
            value={bio}
            maxLength={160}
            rows={3}
            onChange={(e) => setBio(e.target.value)}
            placeholder="e.g. Beyond the Code. Beyond the Ordinary. Future Institute of Engineering and Management..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border-2 border-[#111111] text-[#111111] placeholder-neutral-400 text-sm focus:outline-none focus:border-[#4285F4] transition resize-none shadow-inner"
          />
        </div>

        {/* Avatar Section */}
        <div className="pt-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
            Profile Avatar / Photo
          </label>
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#111111] shrink-0 bg-neutral-100 shadow-[2px_2px_0px_#111111]">
              <img
                src={avatarUrl}
                alt="Avatar Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80';
                }}
              />
            </div>

            <div className="flex-1 space-y-2">
              {/* URL input row + Upload button */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="flex-1 px-3.5 py-2 rounded-xl bg-neutral-50 border-2 border-[#111111] text-xs font-mono text-[#111111] focus:outline-none focus:border-[#4285F4] shadow-inner"
                />
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="shrink-0 px-3 py-2 rounded-xl text-xs font-bold bg-white border-2 border-[#111111] shadow-[2px_2px_0px_#4285F4] hover:shadow-[1px_1px_0px_#4285F4] hover:translate-x-0.5 hover:translate-y-0.5 transition whitespace-nowrap"
                >
                  📷 Upload Photo
                </button>
              </div>

              {/* Upload error */}
              {uploadError && (
                <p className="text-[11px] text-[#EA4335] font-mono font-bold">{uploadError}</p>
              )}

              <p className="text-[10px] text-neutral-500 font-mono">
                Upload PNG, JPG, or WebP (max 5 MB). Saved locally — no external service required.
              </p>

              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-neutral-500">
                  Quick presets:
                </span>
                <div className="flex items-center gap-1.5">
                  {PRESET_AVATARS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatarUrl(url)}
                      className="w-6 h-6 rounded-full overflow-hidden border border-[#111111] hover:scale-110 transition-transform"
                    >
                      <img src={url} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Social Links Form */}
      <div className="p-6 rounded-2xl bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#111111]">
              Connected Social Accounts
            </h3>
            <p className="text-xs text-neutral-600">
              Add full URLs or usernames to show social icon badges on your bio page.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white border-2 border-[#111111] shadow-[2px_2px_0px_#111111] hover:shadow-[1px_1px_0px_#111111] hover:translate-x-0.5 hover:translate-y-0.5 transition cursor-pointer"
          >
            <PlusIcon className="w-3.5 h-3.5 text-[#34A853]" />
            <span>+ Add Social</span>
          </button>
        </div>

        {activeSocialKeys.length === 0 ? (
          <div className="p-6 rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50/50 text-center space-y-2">
            <p className="text-xs font-mono text-neutral-500">
              No connected social accounts yet.
            </p>
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-white border-2 border-[#111111] shadow-[2px_2px_0px_#111111] hover:shadow-[1px_1px_0px_#111111] transition"
            >
              <PlusIcon className="w-3.5 h-3.5 text-[#34A853]" />
              <span>Add your first account</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {activeSocialKeys.map((key) => {
              const platformLabel = getPlatformLabel(key, customSocialPlatforms);
              const platformIcon = getPlatformIconName(key, customSocialPlatforms);
              const platformColor = getPlatformColor(key, customSocialPlatforms);
              const config = getPlatformConfig(key);
              const placeholder = config?.placeholder || 'https://... or @username';
              const inputType = config?.inputType || 'text';

              return (
                <div key={key} className="group relative">
                  <div className="flex items-center justify-between mb-1">
                    <label className="flex items-center gap-2 text-xs font-bold text-neutral-700">
                      <span style={{ color: platformColor }}>
                        {renderPlatformIcon(platformIcon, 'w-3.5 h-3.5')}
                      </span>
                      <span>{platformLabel}</span>
                    </label>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemoveSocial(key);
                      }}
                      title={`Remove ${platformLabel}`}
                      aria-label={`Remove ${platformLabel}`}
                      className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-neutral-400 hover:text-[#EA4335] hover:bg-neutral-100 px-1 py-0.5 rounded transition text-xs font-bold leading-none cursor-pointer"
                    >
                      <XCloseIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <input
                    type={inputType}
                    value={socials[key] ?? ''}
                    onChange={(e) => handleSocialChange(key, e.target.value)}
                    onBlur={(e) => handleSocialBlur(key, e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 border-2 border-[#111111] text-xs font-mono text-[#111111] focus:outline-none focus:border-[#4285F4]"
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Social Modal */}
      {showAddModal &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className="fixed inset-0 top-0 left-0 right-0 bottom-0 w-screen h-screen z-[99999] flex items-center justify-center p-4 bg-white/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md rounded-2xl p-6 relative border-2 border-[#111111] bg-[#F4F1E9] text-[#111111] shadow-[6px_6px_0px_#111111] space-y-4">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-1 border-2 border-[#111111] rounded-lg bg-white text-[#111111] shadow-[2px_2px_0px_#111111] hover:translate-x-0.5 hover:translate-y-0.5 transition cursor-pointer"
            >
              <XCloseIcon className="w-4 h-4" />
            </button>

            <div>
              <div className="editorial-badge mb-1.5">SOCIAL CHANNELS</div>
              <h3 className="text-lg font-black text-[#111111] tracking-tight">
                Add Connected Social Account
              </h3>
              <p className="text-xs text-neutral-600 mt-0.5">
                Select a supported social network or set up a custom platform.
              </p>
            </div>

            {addError && (
              <div className="p-2.5 rounded-xl bg-red-100 border-2 border-[#EA4335] text-xs text-[#EA4335] font-bold">
                {addError}
              </div>
            )}

            <div className="space-y-3.5">
              {/* Platform Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Choose Platform
                </label>
                <select
                  value={newPlatformType}
                  onChange={(e) => {
                    setNewPlatformType(e.target.value);
                    setAddError(null);
                  }}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border-2 border-[#111111] text-xs font-bold text-[#111111] focus:outline-none focus:border-[#4285F4] shadow-inner"
                >
                  <optgroup label="Supported Platforms">
                    {PREDEFINED_PLATFORMS.map((plat) => {
                      const isAlreadyAdded = plat.key in socials;
                      return (
                        <option key={plat.key} value={plat.key} disabled={isAlreadyAdded}>
                          {plat.name} {isAlreadyAdded ? '(Already connected)' : ''}
                        </option>
                      );
                    })}
                  </optgroup>
                  <optgroup label="Custom Platform">
                    <option value="custom">➕ Custom Platform...</option>
                  </optgroup>
                </select>
              </div>

              {/* Custom Platform Details */}
              {newPlatformType === 'custom' && (
                <div className="space-y-3 p-3.5 rounded-xl border-2 border-[#111111] bg-white shadow-inner">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Custom Platform Name
                    </label>
                    <input
                      type="text"
                      value={newCustomName}
                      onChange={(e) => setNewCustomName(e.target.value)}
                      placeholder="e.g. Threads, Mastodon, Telegram, Behance"
                      className="w-full px-3 py-2 rounded-xl bg-neutral-50 border-2 border-[#111111] text-xs font-mono text-[#111111] focus:outline-none focus:border-[#4285F4]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Choose Platform Icon
                    </label>
                    <div className="grid grid-cols-7 gap-1.5 max-h-32 overflow-y-auto p-1 custom-scrollbar">
                      {AVAILABLE_CUSTOM_ICONS.map((icon) => (
                        <button
                          key={icon.id}
                          type="button"
                          onClick={() => setNewCustomIcon(icon.id)}
                          title={icon.label}
                          className={`w-9 h-9 rounded-lg border-2 flex items-center justify-center transition cursor-pointer ${
                            newCustomIcon === icon.id
                              ? 'border-[#4285F4] bg-[#4285F4]/10 text-[#4285F4] shadow-[2px_2px_0px_#4285F4]'
                              : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-neutral-400'
                          }`}
                        >
                          {renderPlatformIcon(icon.id, 'w-4 h-4')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* URL / Username / Email Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  {newPlatformType === 'email' ? 'Email Address' : 'URL or Username'}
                </label>
                <input
                  type={newPlatformType === 'email' ? 'email' : 'text'}
                  value={newAccountValue}
                  onChange={(e) => setNewAccountValue(e.target.value)}
                  placeholder={
                    newPlatformType === 'custom'
                      ? 'https://example.com/handle or @username'
                      : getPlatformConfig(newPlatformType)?.placeholder || 'https://...'
                  }
                  className="w-full px-3 py-2.5 rounded-xl bg-white border-2 border-[#111111] text-xs font-mono text-[#111111] focus:outline-none focus:border-[#4285F4] shadow-inner"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white border-2 border-[#111111] shadow-[2px_2px_0px_#111111] hover:translate-x-0.5 hover:translate-y-0.5 transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAddSocialSubmit}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#111111] border-2 border-[#111111] shadow-[2px_2px_0px_#4285F4] hover:translate-x-0.5 hover:translate-y-0.5 transition cursor-pointer"
              >
                <PlusIcon className="w-3.5 h-3.5 text-[#34A853]" />
                <span>Add Account</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Save Button */}
      <div className="flex items-center justify-end">
        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-[#111111] border-2 border-[#111111] shadow-[4px_4px_0px_#4285F4] hover:shadow-[2px_2px_0px_#4285F4] hover:translate-x-0.5 hover:translate-y-0.5 transition active:scale-95"
        >
          <CheckIcon className="w-4 h-4 text-[#34A853]" />
          <span>Save Profile Changes</span>
        </button>
      </div>
    </form>
  );
};
