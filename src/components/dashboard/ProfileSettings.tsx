import React, { useRef, useState } from 'react';
import { ProfileData, SocialLinks } from '../../types';
import {
  GithubIcon,
  TwitterIcon,
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
  DiscordIcon,
  SpotifyIcon,
  MailIcon,
  CheckIcon,
} from '../icons';

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
  const [socials, setSocials] = useState<SocialLinks>(profile.socials || {});
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    });
    onNotify('Profile settings saved successfully!', 'success');
  };

  const handleSocialChange = (key: keyof SocialLinks, value: string) => {
    setSocials((prev) => ({
      ...prev,
      [key]: value.trim() ? value.trim() : undefined,
    }));
  };

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
                className="w-full h-full object-cover filter grayscale contrast-110"
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
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#111111]">
          Connected Social Accounts
        </h3>
        <p className="text-xs text-neutral-600">
          Add full URLs or usernames to show social icon badges on your bio page.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* GitHub */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-neutral-700 mb-1">
              <GithubIcon className="w-3.5 h-3.5 text-[#111111]" />
              <span>GitHub</span>
            </label>
            <input
              type="text"
              value={socials.github || ''}
              onChange={(e) => handleSocialChange('github', e.target.value)}
              placeholder="https://github.com/gdg-fiem"
              className="w-full px-3 py-2 rounded-xl bg-neutral-50 border-2 border-[#111111] text-xs font-mono text-[#111111] focus:outline-none focus:border-[#4285F4]"
            />
          </div>

          {/* LinkedIn */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-neutral-700 mb-1">
              <LinkedinIcon className="w-3.5 h-3.5 text-[#4285F4]" />
              <span>LinkedIn</span>
            </label>
            <input
              type="text"
              value={socials.linkedin || ''}
              onChange={(e) => handleSocialChange('linkedin', e.target.value)}
              placeholder="https://linkedin.com/company/gdgfiem"
              className="w-full px-3 py-2 rounded-xl bg-neutral-50 border-2 border-[#111111] text-xs font-mono text-[#111111] focus:outline-none focus:border-[#4285F4]"
            />
          </div>

          {/* Instagram */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-neutral-700 mb-1">
              <InstagramIcon className="w-3.5 h-3.5 text-[#EA4335]" />
              <span>Instagram</span>
            </label>
            <input
              type="text"
              value={socials.instagram || ''}
              onChange={(e) => handleSocialChange('instagram', e.target.value)}
              placeholder="https://instagram.com/gdgfiem"
              className="w-full px-3 py-2 rounded-xl bg-neutral-50 border-2 border-[#111111] text-xs font-mono text-[#111111] focus:outline-none focus:border-[#4285F4]"
            />
          </div>

          {/* Twitter / X */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-neutral-700 mb-1">
              <TwitterIcon className="w-3.5 h-3.5 text-[#111111]" />
              <span>X (Twitter)</span>
            </label>
            <input
              type="text"
              value={socials.twitter || ''}
              onChange={(e) => handleSocialChange('twitter', e.target.value)}
              placeholder="https://x.com/gdgfiem"
              className="w-full px-3 py-2 rounded-xl bg-neutral-50 border-2 border-[#111111] text-xs font-mono text-[#111111] focus:outline-none focus:border-[#4285F4]"
            />
          </div>

          {/* YouTube */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-neutral-700 mb-1">
              <YoutubeIcon className="w-3.5 h-3.5 text-[#EA4335]" />
              <span>YouTube</span>
            </label>
            <input
              type="text"
              value={socials.youtube || ''}
              onChange={(e) => handleSocialChange('youtube', e.target.value)}
              placeholder="https://youtube.com/@gdgfiem"
              className="w-full px-3 py-2 rounded-xl bg-neutral-50 border-2 border-[#111111] text-xs font-mono text-[#111111] focus:outline-none focus:border-[#4285F4]"
            />
          </div>

          {/* Discord */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-neutral-700 mb-1">
              <DiscordIcon className="w-3.5 h-3.5 text-[#4285F4]" />
              <span>Discord Community</span>
            </label>
            <input
              type="text"
              value={socials.discord || ''}
              onChange={(e) => handleSocialChange('discord', e.target.value)}
              placeholder="https://discord.gg/..."
              className="w-full px-3 py-2 rounded-xl bg-neutral-50 border-2 border-[#111111] text-xs font-mono text-[#111111] focus:outline-none focus:border-[#4285F4]"
            />
          </div>

          {/* Email */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-neutral-700 mb-1">
              <MailIcon className="w-3.5 h-3.5 text-[#34A853]" />
              <span>Official Email</span>
            </label>
            <input
              type="email"
              value={socials.email || ''}
              onChange={(e) => handleSocialChange('email', e.target.value)}
              placeholder="gdg@fiem.edu.in"
              className="w-full px-3 py-2 rounded-xl bg-neutral-50 border-2 border-[#111111] text-xs font-mono text-[#111111] focus:outline-none focus:border-[#4285F4]"
            />
          </div>

          {/* Spotify */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-neutral-700 mb-1">
              <SpotifyIcon className="w-3.5 h-3.5 text-[#34A853]" />
              <span>Spotify Playlist</span>
            </label>
            <input
              type="text"
              value={socials.spotify || ''}
              onChange={(e) => handleSocialChange('spotify', e.target.value)}
              placeholder="https://open.spotify.com/..."
              className="w-full px-3 py-2 rounded-xl bg-neutral-50 border-2 border-[#111111] text-xs font-mono text-[#111111] focus:outline-none focus:border-[#4285F4]"
            />
          </div>
        </div>
      </div>

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
