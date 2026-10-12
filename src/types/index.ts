export type ThemeId = 
  | 'gdg-cream'
  | 'gdg-dark'
  | 'minimal-light'
  | 'midnight-indigo'
  | 'glass-frost'
  | 'oled-dark'
  | 'sunset-vibes'
  | 'cyber-emerald';

export type ButtonStyle = 
  | 'brutal-black' 
  | 'brutal-white' 
  | 'pill' 
  | 'rounded-2xl' 
  | 'rounded-lg' 
  | 'glass-outline' 
  | 'elevated-solid';

export interface SocialLinks {
  instagram?: string;
  twitter?: string; // X
  github?: string;
  linkedin?: string;
  youtube?: string;
  discord?: string;
  email?: string;
  spotify?: string;
  tiktok?: string;
  twitch?: string;
  website?: string;
}

export interface LinkItemData {
  id: string;
  profileId: string;
  title: string;
  url: string; // Auto-normalized to prepend https:// if omitted
  sortOrder: number; // Integer for ranking
  enabled: boolean; // Published vs hidden
  icon?: string; // Platform icon name or custom emoji/icon
  clicks: number; // Click counter for analytics
  createdAt: string; // ISO timestamp
  featured?: boolean; // Spotlight badge or pulse
}

export interface ProfileData {
  id: string;
  username: string; // Slug used in public URL e.g. /alexrivera
  displayName: string;
  bio: string;
  avatarUrl: string;
  theme: ThemeId;
  buttonStyle: ButtonStyle;
  verified: boolean;
  socials: SocialLinks;
  createdAt: string;
  updatedAt: string;
}

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  description: string;
  previewBg: string; // Tailwind or CSS background for selector badge
  bgClass: string; // Main background CSS
  textPrimary: string;
  textSecondary: string;
  cardBg: string;
  cardBorder: string;
  cardHover: string;
  cardText: string;
  cardSubtext: string;
  accentColor: string;
  socialIconBg: string;
  socialIconHover: string;
  tagBg: string;
}

export type ActiveTab = 'links' | 'appearance' | 'profile' | 'analytics';
