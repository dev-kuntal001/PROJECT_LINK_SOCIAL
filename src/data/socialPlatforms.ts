export interface PlatformConfig {
  key: string;
  name: string;
  iconName: string;
  iconColor: string;
  placeholder: string;
  inputType?: 'text' | 'email' | 'url';
}

export const PREDEFINED_PLATFORMS: PlatformConfig[] = [
  {
    key: 'github',
    name: 'GitHub',
    iconName: 'github',
    iconColor: '#111111',
    placeholder: 'https://github.com/gdg-fiem',
  },
  {
    key: 'linkedin',
    name: 'LinkedIn',
    iconName: 'linkedin',
    iconColor: '#4285F4',
    placeholder: 'https://linkedin.com/company/gdgfiem',
  },
  {
    key: 'instagram',
    name: 'Instagram',
    iconName: 'instagram',
    iconColor: '#EA4335',
    placeholder: 'https://instagram.com/gdgfiem',
  },
  {
    key: 'twitter',
    name: 'X (Twitter)',
    iconName: 'twitter',
    iconColor: '#111111',
    placeholder: 'https://x.com/gdgfiem',
  },
  {
    key: 'youtube',
    name: 'YouTube',
    iconName: 'youtube',
    iconColor: '#EA4335',
    placeholder: 'https://youtube.com/@gdgfiem',
  },
  {
    key: 'discord',
    name: 'Discord Community',
    iconName: 'discord',
    iconColor: '#4285F4',
    placeholder: 'https://discord.gg/...',
  },
  {
    key: 'email',
    name: 'Official Email',
    iconName: 'mail',
    iconColor: '#34A853',
    placeholder: 'gdg@fiem.edu.in',
    inputType: 'email',
  },
  {
    key: 'spotify',
    name: 'Spotify Playlist',
    iconName: 'spotify',
    iconColor: '#34A853',
    placeholder: 'https://open.spotify.com/...',
  },
  {
    key: 'tiktok',
    name: 'TikTok',
    iconName: 'tiktok',
    iconColor: '#111111',
    placeholder: 'https://tiktok.com/@gdgfiem',
  },
  {
    key: 'twitch',
    name: 'Twitch',
    iconName: 'twitch',
    iconColor: '#7c3aed',
    placeholder: 'https://twitch.tv/gdgfiem',
  },
  {
    key: 'website',
    name: 'Website / Portfolio',
    iconName: 'globe',
    iconColor: '#4285F4',
    placeholder: 'https://example.com',
  },
  {
    key: 'substack',
    name: 'Substack',
    iconName: 'substack',
    iconColor: '#EA4335',
    placeholder: 'https://substack.com/@...',
  },
  {
    key: 'medium',
    name: 'Medium',
    iconName: 'medium',
    iconColor: '#111111',
    placeholder: 'https://medium.com/@...',
  },
];

export const AVAILABLE_CUSTOM_ICONS = [
  { id: 'globe', label: 'Globe / Web' },
  { id: 'github', label: 'GitHub' },
  { id: 'twitter', label: 'X / Twitter' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'discord', label: 'Discord' },
  { id: 'mail', label: 'Email' },
  { id: 'spotify', label: 'Spotify' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'twitch', label: 'Twitch' },
  { id: 'substack', label: 'Substack' },
  { id: 'medium', label: 'Medium' },
  { id: 'sparkles', label: 'Sparkles' },
];

export function getPlatformConfig(key: string): PlatformConfig | undefined {
  return PREDEFINED_PLATFORMS.find((p) => p.key === key);
}

export function getPlatformLabel(
  key: string,
  customPlatforms?: Record<string, { name: string; icon?: string }>
): string {
  if (customPlatforms?.[key]?.name) {
    return customPlatforms[key].name;
  }
  const config = getPlatformConfig(key);
  if (config) return config.name;
  return key.charAt(0).toUpperCase() + key.slice(1);
}

export function getPlatformIconName(
  key: string,
  customPlatforms?: Record<string, { name: string; icon?: string }>
): string {
  if (customPlatforms?.[key]?.icon) {
    return customPlatforms[key].icon;
  }
  const config = getPlatformConfig(key);
  if (config) return config.iconName;
  return key;
}

export function getPlatformColor(
  key: string,
  customPlatforms?: Record<string, { name: string; icon?: string }>
): string {
  const config = getPlatformConfig(key);
  if (config) return config.iconColor;
  if (customPlatforms?.[key]) return '#4285F4';
  return '#111111';
}

export function isValidSocialEntry(platform: string, rawVal: string): boolean {
  if (!rawVal) return false;
  const val = rawVal.trim();
  if (!val) return false;

  // Email validation if platform is email or mailto
  if (platform === 'email' || val.startsWith('mailto:')) {
    const emailCandidate = val.replace(/^mailto:/i, '').trim();
    // basic email pattern check
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailCandidate);
  }

  // If it's a URL or username
  if (val.length < 2) return false;
  return true;
}

export function getSocialHref(platform: string, rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (!trimmed) return '#';

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('mailto:')) {
    return trimmed;
  }

  // Handle email addresses
  if (platform === 'email' || (trimmed.includes('@') && !trimmed.includes('/'))) {
    return `mailto:${trimmed.replace(/^mailto:/i, '')}`;
  }

  // Handle platform handles without full domains
  if (platform === 'github' && !trimmed.includes('.')) {
    return `https://github.com/${trimmed.replace(/^@/, '')}`;
  }
  if (platform === 'twitter' && !trimmed.includes('.')) {
    return `https://x.com/${trimmed.replace(/^@/, '')}`;
  }
  if (platform === 'instagram' && !trimmed.includes('.')) {
    return `https://instagram.com/${trimmed.replace(/^@/, '')}`;
  }
  if (platform === 'youtube' && !trimmed.includes('.')) {
    return `https://youtube.com/${trimmed.startsWith('@') ? trimmed : `@${trimmed}`}`;
  }
  if (platform === 'discord' && !trimmed.includes('.')) {
    return `https://discord.gg/${trimmed}`;
  }
  if (platform === 'spotify' && !trimmed.includes('.')) {
    return `https://open.spotify.com/user/${trimmed}`;
  }
  if (platform === 'tiktok' && !trimmed.includes('.')) {
    return `https://tiktok.com/@${trimmed.replace(/^@/, '')}`;
  }
  if (platform === 'twitch' && !trimmed.includes('.')) {
    return `https://twitch.tv/${trimmed.replace(/^@/, '')}`;
  }

  return `https://${trimmed}`;
}
