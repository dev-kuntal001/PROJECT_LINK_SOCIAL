import React, { useState } from 'react';
import { ButtonStyle, LinkItemData, ProfileData, ThemeConfig } from '../../types';
import { THEMES } from '../../themes/themeConfig';
import {
  VerifiedBadgeIcon,
  renderPlatformIcon,
  ExternalLinkIcon,
  SparklesIcon,
  ShareIcon,
  QrCodeIcon,
  CopyIcon,
  CheckIcon,
  XCloseIcon,
  GdgLogoIcon,
} from '../icons';

interface PublicBioPageProps {
  profile: ProfileData;
  links: LinkItemData[];
  onLinkClick?: (linkId: string) => void;
  isMockup?: boolean;
  onBackToDashboard?: () => void;
}

export const PublicBioPage: React.FC<PublicBioPageProps> = ({
  profile,
  links,
  onLinkClick,
  isMockup = false,
  onBackToDashboard,
}) => {
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const theme: ThemeConfig = THEMES[profile.theme] || THEMES['gdg-cream'];
  const activeLinks = links.filter((l) => l.enabled);

  // Check if active theme is a dark aesthetic
  const isDark =
    theme.id === 'gdg-dark' ||
    theme.id === 'midnight-indigo' ||
    theme.id === 'oled-dark' ||
    theme.id === 'sunset-vibes' ||
    theme.id === 'cyber-emerald' ||
    theme.id === 'glass-frost';

  // Responsive button and card styling based on both theme and selected buttonStyle
  const getCardClasses = (style: ButtonStyle) => {
    // 1. Dark themes
    if (isDark) {
      const baseBorder = theme.cardBorder;
      const baseBg = theme.cardBg;
      const baseHover = theme.cardHover;

      switch (style) {
        case 'pill':
          return `rounded-full text-white ${baseBg} ${baseBorder} ${baseHover}`;
        case 'rounded-lg':
          return `rounded-lg text-white ${baseBg} ${baseBorder} ${baseHover}`;
        case 'glass-outline':
          return `rounded-2xl border-2 border-white/20 bg-white/5 backdrop-blur-md text-white hover:border-white/50`;
        case 'elevated-solid':
          return `rounded-2xl text-white ${baseBg} border-2 border-white/20 shadow-[0_6px_0_0_rgba(255,255,255,0.2)] active:translate-y-1`;
        case 'brutal-black':
        case 'brutal-white':
        case 'rounded-2xl':
        default:
          return `rounded-xl text-white ${baseBg} ${baseBorder} ${baseHover}`;
      }
    }

    // 2. Light / GDG Ivory themes
    switch (style) {
      case 'brutal-black':
        return 'rounded-xl bg-[#111111] text-white border-2 border-[#111111] shadow-[4px_4px_0px_#4285F4] hover:shadow-[2px_2px_0px_#4285F4] hover:translate-x-0.5 hover:translate-y-0.5';
      case 'brutal-white':
        return 'rounded-xl bg-white text-[#111111] border-2 border-[#111111] shadow-[4px_4px_0px_#111111] hover:shadow-[6px_6px_0px_#4285F4] hover:-translate-x-0.5 hover:-translate-y-0.5';
      case 'pill':
        return 'rounded-full bg-white text-[#111111] border-2 border-[#111111] shadow-[3px_3px_0px_#111111] hover:shadow-[5px_5px_0px_#4285F4] hover:-translate-y-0.5';
      case 'glass-outline':
        return 'rounded-2xl border-2 border-[#111111]/30 bg-white/70 backdrop-blur-md text-[#111111] hover:border-[#111111] shadow-sm';
      case 'elevated-solid':
        return 'rounded-2xl bg-white text-[#111111] border-2 border-[#111111] shadow-[0_6px_0_0_#111111] active:translate-y-1';
      case 'rounded-lg':
        return 'rounded-lg bg-white text-[#111111] border-2 border-[#111111] shadow-[3px_3px_0px_#111111] hover:-translate-y-0.5';
      case 'rounded-2xl':
      default:
        return 'rounded-2xl bg-white text-[#111111] border-2 border-[#111111] shadow-[4px_4px_0px_#111111] hover:shadow-[6px_6px_0px_#4285F4] hover:-translate-x-0.5 hover:-translate-y-0.5';
    }
  };

  const cardStyleClass = getCardClasses(profile.buttonStyle);

  const handleLinkClick = (link: LinkItemData) => {
    if (onLinkClick) {
      onLinkClick(link.id);
    }
  };

  const handleShare = () => {
    const url = typeof window !== 'undefined' ? window.location.href : `https://linkbio.me/${profile.username}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const socialEntries = Object.entries(profile.socials || {}).filter(
    ([, val]) => Boolean(val && val.trim())
  );

  return (
    <div
      className={`min-h-full w-full transition-colors duration-300 flex flex-col justify-between ${theme.bgClass
        } ${isMockup ? 'py-5 px-3' : 'min-h-screen py-6 px-4 sm:px-6'}`}
    >
      {/* ── Top GDG Branding Header ── */}
      <div className={`w-full max-w-xl mx-auto mb-6 ${isMockup ? 'px-1' : ''}`}>
        {isMockup ? (
          /* Compact pill for phone mockup preview */
          <div
            className={`rounded-full px-4 py-2.5 flex items-center justify-between backdrop-blur-md transition-all ${isDark
              ? 'bg-neutral-900/90 border border-neutral-700 shadow-lg text-white'
              : 'bg-white/90 border border-neutral-300/80 shadow-md text-[#111111]'
              }`}
          >
            <div className="flex items-center gap-2">
              <GdgLogoIcon className={`w-8 h-5 ${isDark ? 'opacity-100' : 'opacity-90'}`} />
              <span className="text-xs font-black tracking-wider uppercase">GDG OC FIEM</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowShareModal(true)}
                aria-label="Share profile"
                className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase flex items-center gap-1.5 transition-all ${isDark
                  ? 'bg-white text-black hover:bg-neutral-200 shadow-sm'
                  : 'bg-[#111111] text-white hover:bg-neutral-800 shadow-sm'
                  }`}
              >
                <ShareIcon className="w-3 h-3 text-[#FBBC04]" />
                <span>Share</span>
              </button>
            </div>
          </div>
        ) : (
          /* Full public branding header */
          <div className={`rounded-2xl px-6 py-5 flex flex-col items-center text-center border-2 shadow-[4px_4px_0px_#111111] ${isDark
            ? 'bg-neutral-900/95 border-neutral-700 text-white'
            : 'bg-white border-[#111111]'
            }`}>
            {onBackToDashboard && (
              <div className="w-full flex justify-start mb-4">
                <button
                  type="button"
                  onClick={onBackToDashboard}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-[#111111] bg-white px-4 py-2 text-sm font-bold text-[#111111] shadow-[3px_3px_0px_#111111] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#111111]"
                >
                  ← Back to Dashboard
                </button>
              </div>
            )}
            <div className="flex items-center gap-3 mb-3">
              <GdgLogoIcon className="w-12 h-8" />
            </div>
            <p className={`text-xl sm:text-2xl font-black tracking-tight leading-tight ${isDark ? 'text-white' : 'text-[#111111]'
              }`}>
              Google Developers Group
            </p>
            <p className="text-sm sm:text-base font-medium mt-1 leading-snug" style={{ color: '#4285F4' }}>
              On Campus Future Institute Of Engineering And Management
            </p>
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={() => setShowShareModal(true)}
                aria-label="Share profile"
                className={`px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wide uppercase flex items-center gap-1.5 transition-all ${isDark
                  ? 'bg-white text-black hover:bg-neutral-200 shadow-sm'
                  : 'bg-[#111111] text-white hover:bg-neutral-800 shadow-sm'
                  }`}
              >
                <ShareIcon className="w-3 h-3 text-[#FBBC04]" />
                <span>Share</span>
              </button>
            </div>
          </div>
        )}
      </div>


      {/* ── Main Bio Container ── */}
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col items-center text-center">
        {/* Editorial Eyebrow Tag */}
        <div
          className={`inline-block px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest mb-4 border ${isDark
            ? 'bg-white/10 text-white border-white/20'
            : 'bg-white text-[#111111] border-[#111111] shadow-[2px_2px_0px_#111111]'
            }`}
        >
          Community &bull; Links
        </div>

        {/* Profile Avatar */}
        <div className="relative mb-4 group">
          <div
            className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden p-1 border-2 transition-all duration-300 ${isDark
              ? 'bg-neutral-900 border-white/40 shadow-[4px_4px_0px_#4285F4]'
              : 'bg-white border-[#111111] shadow-[4px_4px_0px_#111111] group-hover:shadow-[6px_6px_0px_#4285F4]'
              }`}
          >
            {!avatarError && profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.displayName}
                onError={() => setAvatarError(true)}
                className="w-full h-full object-cover rounded-full filter grayscale contrast-110 hover:grayscale-0 transition-all duration-300"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-[#111111] flex items-center justify-center font-bold text-xl text-white font-mono">
                {getInitials(profile.displayName || 'GDG')}
              </div>
            )}
          </div>

          {/* Active Status Beacon */}
          <span
            className="absolute bottom-1 right-2 w-4 h-4 bg-[#34A853] border-2 border-white rounded-full shadow-sm"
            title="Online"
          />
        </div>

        {/* Display Name & Verified Badge */}
        <div className="flex items-center justify-center gap-2 mb-1">
          <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${theme.textPrimary}`}>
            {profile.displayName || 'GDG on Campus FIEM'}
          </h1>
          {profile.verified && (
            <span title="Verified Chapter Member">
              <VerifiedBadgeIcon className="w-5 h-5 text-[#4285F4] shrink-0" />
            </span>
          )}
        </div>

        {/* Subtitle: Chapter Institution in Letterspaced Uppercase */}
        <p
          className={`text-[10px] sm:text-xs font-bold tracking-[0.22em] uppercase mb-2 font-mono ${isDark ? 'text-neutral-300' : 'text-neutral-600'
            }`}
        >
          Future Institute of Engineering and Management
        </p>

        {/* Username Handle */}
        <div
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-mono font-medium mb-3 border ${isDark
            ? 'bg-white/10 border-white/20 text-neutral-200'
            : 'bg-white/80 border-neutral-300 text-neutral-700'
            }`}
        >
          <span>@</span>
          <span>{profile.username || 'gdgfiem'}</span>
        </div>

        {/* Editorial Serif Display Tagline / Bio */}
        {profile.bio && (
          <p
            className={`font-serif italic text-base sm:text-lg leading-relaxed max-w-sm mb-6 px-2 ${isDark ? 'text-neutral-200' : 'text-neutral-800'
              }`}
          >
            &ldquo;{profile.bio}&rdquo;
          </p>
        )}

        {/* Social Links Row */}
        {socialEntries.length > 0 && (
          <div className="flex items-center justify-center flex-wrap gap-2.5 mb-7">
            {socialEntries.map(([platform, url]) => (
              <a
                key={platform}
                href={url.startsWith('http') || url.startsWith('mailto:') ? url : `https://${url}`}
                target="_blank"
                rel="noopener noreferrer"
                title={platform}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${theme.socialIconBg} ${theme.socialIconHover}`}
              >
                {renderPlatformIcon(platform, 'w-4 h-4')}
              </a>
            ))}
          </div>
        )}

        {/* Links Cards List */}
        <div className="w-full space-y-3.5 mb-8">
          {activeLinks.length === 0 ? (
            <div
              className={`p-6 rounded-xl border-2 border-dashed text-center ${isDark ? 'border-neutral-700 bg-white/5 text-neutral-400' : 'border-neutral-300 bg-white/40 text-neutral-500'
                }`}
            >
              <p className="text-xs font-mono">No active links published yet.</p>
            </div>
          ) : (
            activeLinks.map((link) => {
              const hasIcon = Boolean(link.icon);

              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleLinkClick(link)}
                  className={`group relative flex items-center justify-between w-full px-4 py-3.5 transition-all duration-200 ${cardStyleClass} ${link.featured ? 'ring-2 ring-[#FBBC04]' : ''
                    }`}
                >
                  {/* Left: Platform Icon Badge */}
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105 ${isDark
                      ? 'bg-white/10 border-white/20 text-white'
                      : profile.buttonStyle === 'brutal-black'
                        ? 'bg-neutral-800 border-neutral-700 text-white'
                        : 'bg-neutral-50 border-neutral-200 text-[#111111]'
                      }`}
                  >
                    {hasIcon ? (
                      renderPlatformIcon(link.icon || 'globe', 'w-4 h-4')
                    ) : (
                      <span className="text-sm font-bold text-[#4285F4]">⚡</span>
                    )}
                  </div>

                  {/* Center: Title */}
                  <div className="flex-1 px-3 text-center min-w-0">
                    <span
                      className={`block text-sm font-bold tracking-tight truncate ${isDark || profile.buttonStyle === 'brutal-black' ? 'text-white' : 'text-[#111111]'
                        }`}
                    >
                      {link.title}
                    </span>
                  </div>

                  {/* Right: External Link Arrow */}
                  <div
                    className={`w-9 flex justify-end shrink-0 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all ${isDark || profile.buttonStyle === 'brutal-black' ? 'text-white' : 'text-[#111111]'
                      }`}
                  >
                    <ExternalLinkIcon className="w-4 h-4" />
                  </div>

                  {/* Featured Badge */}
                  {link.featured && (
                    <span className="absolute -top-2.5 right-4 flex items-center gap-1 text-[9px] font-black uppercase px-2 py-0.5 rounded border border-[#111111] bg-[#FBBC04] text-[#111111] shadow-[2px_2px_0px_#111111]">
                      <SparklesIcon className="w-2.5 h-2.5" />
                      FEATURED
                    </span>
                  )}
                </a>
              );
            })
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="w-full max-w-md mx-auto text-center pt-4 pb-2">
        <div
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold border backdrop-blur-sm shadow-sm ${isDark
            ? 'bg-neutral-900/80 border-neutral-700 text-neutral-300'
            : 'bg-white/80 border-neutral-300 text-neutral-700'
            }`}
        >
          <GdgLogoIcon className="w-8 h-5 opacity-75" />
          <span>GDG on Campus FIEM</span>
          <span className="text-neutral-400">&bull;</span>
          <span className="font-serif italic font-normal opacity-75">Ordinary ends here.</span>
        </div>
      </footer>

      {/* ── Share Modal ── */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className={`w-full max-w-sm rounded-2xl p-6 relative border-2 ${isDark
              ? 'bg-[#161616] border-neutral-600 text-white shadow-[6px_6px_0px_#4285F4]'
              : 'bg-[#F4F1E9] border-[#111111] text-[#111111] shadow-[6px_6px_0px_#111111]'
              }`}
          >
            <button
              onClick={() => setShowShareModal(false)}
              className={`absolute top-4 right-4 p-1 border rounded-md ${isDark ? 'border-neutral-600 bg-neutral-800 text-white' : 'border-neutral-400 bg-white text-black'
                }`}
            >
              <XCloseIcon className="w-4 h-4" />
            </button>

            <div className="text-center space-y-4">
              <div
                className={`inline-block px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border ${isDark ? 'bg-white/10 text-white border-white/20' : 'bg-white text-black border-black'
                  }`}
              >
                SHARE PROFILE
              </div>

              <div>
                <h3 className="text-lg font-black">
                  {profile.displayName}
                </h3>
                <p className={`text-xs mt-1 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  Share this verified link hub with attendees, students, or collaborators.
                </p>
              </div>

              {/* QR Code Container */}
              <div className="p-4 bg-white border-2 border-[#111111] rounded-xl inline-block shadow-[3px_3px_0px_#111111]">
                <div className="w-36 h-36 flex flex-col items-center justify-center border border-neutral-200 rounded-lg p-2 bg-neutral-50">
                  <QrCodeIcon className="w-20 h-20 text-[#111111]" />
                  <span className="text-[10px] font-mono font-bold text-neutral-600 mt-1">
                    @{profile.username}
                  </span>
                </div>
              </div>

              {/* Copy URL Button */}
              <button
                onClick={handleShare}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs text-white bg-[#111111] border-2 border-[#111111] shadow-[3px_3px_0px_#4285F4] hover:shadow-[1px_1px_0px_#4285F4] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              >
                {copied ? <CheckIcon className="w-4 h-4 text-[#34A853]" /> : <CopyIcon className="w-4 h-4" />}
                <span>{copied ? 'Link Copied to Clipboard!' : 'Copy Public Profile Link'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
