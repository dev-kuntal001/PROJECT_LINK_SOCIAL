import { LinkItemData, ProfileData } from '../types';
import { storage } from '../data/storage';

const API_BASE_URL = (((import.meta as any).env?.VITE_API_BASE_URL as string) || '').replace(/\/$/, '');

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PublicProfilePayload {
  profile: ProfileData;
  links: LinkItemData[];
}

export const apiAdapter = {
  /**
   * Health check endpoint
   */
  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/health`);
      const data = await res.json();
      return data.status === 'ok';
    } catch {
      return false;
    }
  },

  /**
   * Fetch public profile and enabled links (Used by main GDG FIEM website)
   */
  async getPublicProfile(username: string): Promise<PublicProfilePayload> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/public/${encodeURIComponent(username)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          return {
            profile: json.profile,
            links: json.links,
          };
        }
      }
    } catch (err) {
      console.warn('API fetch failed, falling back to local storage cache:', err);
    }

    // Fallback to local storage if API is offline
    const profile = storage.getProfile();
    const links = storage.getLinks().filter((l) => l.enabled);
    return { profile, links };
  },

  /**
   * Track link tap / click count
   */
  async recordClick(linkId: string): Promise<void> {
    // 1. Update local storage for immediate offline/client responsiveness
    storage.incrementClicks(linkId);

    // 2. Sync to backend API if reachable
    try {
      await fetch(`${API_BASE_URL}/api/links/${encodeURIComponent(linkId)}/click`, {
        method: 'POST',
      });
    } catch (e) {
      console.warn('Click sync to remote API failed (recorded locally):', e);
    }
  },

  /**
   * Fetch full profile (dashboard)
   */
  async getProfile(): Promise<ProfileData> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/profile`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.profile) {
          storage.saveProfile(json.profile);
          return json.profile;
        }
      }
    } catch {
      // Fallback
    }
    return storage.getProfile();
  },

  /**
   * Update profile
   */
  async updateProfile(updates: Partial<ProfileData>): Promise<ProfileData> {
    const local = storage.saveProfile({ ...storage.getProfile(), ...updates });
    try {
      await fetch(`${API_BASE_URL}/api/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch {
      // Saved locally
    }
    return local;
  },

  /**
   * Fetch all links
   */
  async getLinks(): Promise<LinkItemData[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/links`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.links)) {
          storage.saveLinks(json.links);
          return json.links;
        }
      }
    } catch {
      // Fallback
    }
    return storage.getLinks();
  },

  /**
   * Add new link
   */
  async addLink(input: { title: string; url: string; icon?: string }): Promise<LinkItemData> {
    const localLink = storage.addLink(input);
    try {
      await fetch(`${API_BASE_URL}/api/links`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
    } catch {
      // Saved locally
    }
    return localLink;
  },

  /**
   * Reorder links
   */
  async reorderLinks(orderedIds: string[]): Promise<LinkItemData[]> {
    const localLinks = storage.reorderLinks(orderedIds);
    try {
      await fetch(`${API_BASE_URL}/api/links/reorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds }),
      });
    } catch {
      // Saved locally
    }
    return localLinks;
  },
};
