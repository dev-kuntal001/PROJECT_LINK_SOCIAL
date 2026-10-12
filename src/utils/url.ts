export function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  if (trimmed.startsWith('mailto:')) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export function formatDisplayUrl(url: string): string {
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    return parsed.hostname + (parsed.pathname !== '/' ? parsed.pathname : '');
  } catch {
    return url.replace(/^https?:\/\//, '');
  }
}

export type DetectedPlatform = 
  | 'github'
  | 'twitter'
  | 'instagram'
  | 'linkedin'
  | 'youtube'
  | 'spotify'
  | 'discord'
  | 'tiktok'
  | 'twitch'
  | 'substack'
  | 'medium'
  | 'mail'
  | 'globe';

export function detectPlatform(url: string): { platform: DetectedPlatform; label: string } {
  const lower = url.toLowerCase();

  if (lower.includes('github.com')) return { platform: 'github', label: 'GitHub' };
  if (lower.includes('twitter.com') || lower.includes('x.com')) return { platform: 'twitter', label: 'X (Twitter)' };
  if (lower.includes('instagram.com')) return { platform: 'instagram', label: 'Instagram' };
  if (lower.includes('linkedin.com')) return { platform: 'linkedin', label: 'LinkedIn' };
  if (lower.includes('youtube.com') || lower.includes('youtu.be')) return { platform: 'youtube', label: 'YouTube' };
  if (lower.includes('spotify.com')) return { platform: 'spotify', label: 'Spotify' };
  if (lower.includes('discord.com') || lower.includes('discord.gg')) return { platform: 'discord', label: 'Discord' };
  if (lower.includes('tiktok.com')) return { platform: 'tiktok', label: 'TikTok' };
  if (lower.includes('twitch.tv')) return { platform: 'twitch', label: 'Twitch' };
  if (lower.includes('substack.com')) return { platform: 'substack', label: 'Substack' };
  if (lower.includes('medium.com')) return { platform: 'medium', label: 'Medium' };
  if (lower.startsWith('mailto:')) return { platform: 'mail', label: 'Email' };

  return { platform: 'globe', label: 'Website' };
}
