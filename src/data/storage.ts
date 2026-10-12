import { LinkItemData, ProfileData } from '../types';
import { INITIAL_LINKS, INITIAL_PROFILE } from './mockData';
import { normalizeUrl } from '../utils/url';

const STORAGE_KEYS = {
  PROFILE: 'linkbio_profile_v1',
  LINKS: 'linkbio_links_v1',
};

class StorageService {
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  // Profile operations
  getProfile(): ProfileData {
    if (!this.isBrowser()) return INITIAL_PROFILE;
    try {
      const data = window.localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (data) {
        const parsed = JSON.parse(data);
        if (!parsed.theme || parsed.theme === 'midnight-indigo') {
          parsed.theme = 'gdg-cream';
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Error reading profile from localStorage:', e);
    }
    this.saveProfile(INITIAL_PROFILE);
    return INITIAL_PROFILE;
  }

  saveProfile(profile: ProfileData): ProfileData {
    const updated = {
      ...profile,
      updatedAt: new Date().toISOString(),
    };
    if (this.isBrowser()) {
      try {
        window.localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving profile to localStorage:', e);
      }
    }
    return updated;
  }

  // Links operations
  getLinks(): LinkItemData[] {
    if (!this.isBrowser()) return INITIAL_LINKS;
    try {
      const data = window.localStorage.getItem(STORAGE_KEYS.LINKS);
      if (data) {
        const parsed: LinkItemData[] = JSON.parse(data);
        return parsed.sort((a, b) => a.sortOrder - b.sortOrder);
      }
    } catch (e) {
      console.warn('Error reading links from localStorage:', e);
    }
    this.saveLinks(INITIAL_LINKS);
    return INITIAL_LINKS;
  }

  saveLinks(links: LinkItemData[]): LinkItemData[] {
    const sorted = [...links].sort((a, b) => a.sortOrder - b.sortOrder);
    if (this.isBrowser()) {
      try {
        window.localStorage.setItem(STORAGE_KEYS.LINKS, JSON.stringify(sorted));
      } catch (e) {
        console.error('Error saving links to localStorage:', e);
      }
    }
    return sorted;
  }

  addLink(input: { title: string; url: string; icon?: string }): LinkItemData {
    const current = this.getLinks();
    const maxOrder = current.reduce((max, l) => Math.max(max, l.sortOrder), -1);
    const newLink: LinkItemData = {
      id: `link_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      profileId: this.getProfile().id,
      title: input.title.trim() || 'Untitled Link',
      url: normalizeUrl(input.url),
      sortOrder: maxOrder + 1,
      enabled: true,
      icon: input.icon,
      clicks: 0,
      createdAt: new Date().toISOString(),
      featured: false,
    };
    const updated = [...current, newLink];
    this.saveLinks(updated);
    return newLink;
  }

  updateLink(id: string, updates: Partial<LinkItemData>): LinkItemData[] {
    const current = this.getLinks();
    const updated = current.map(link => {
      if (link.id === id) {
        const patched = { ...link, ...updates };
        if (updates.url) {
          patched.url = normalizeUrl(updates.url);
        }
        return patched;
      }
      return link;
    });
    return this.saveLinks(updated);
  }

  deleteLink(id: string): LinkItemData[] {
    const current = this.getLinks();
    const filtered = current.filter(link => link.id !== id);
    // Re-index sort order
    const reindexed = filtered.map((l, idx) => ({ ...l, sortOrder: idx }));
    return this.saveLinks(reindexed);
  }

  reorderLinks(orderedIds: string[]): LinkItemData[] {
    const current = this.getLinks();
    const idMap = new Map(current.map(l => [l.id, l]));
    const reordered: LinkItemData[] = [];

    orderedIds.forEach((id, index) => {
      const item = idMap.get(id);
      if (item) {
        reordered.push({ ...item, sortOrder: index });
        idMap.delete(id);
      }
    });

    // Append any remaining
    idMap.forEach(item => {
      reordered.push({ ...item, sortOrder: reordered.length });
    });

    return this.saveLinks(reordered);
  }

  incrementClicks(id: string): void {
    const current = this.getLinks();
    const updated = current.map(link => {
      if (link.id === id) {
        return { ...link, clicks: (link.clicks || 0) + 1 };
      }
      return link;
    });
    this.saveLinks(updated);
  }

  resetAnalytics(): LinkItemData[] {
    const current = this.getLinks();
    const updated = current.map(l => ({ ...l, clicks: 0 }));
    return this.saveLinks(updated);
  }

  resetToDefaults(): { profile: ProfileData; links: LinkItemData[] } {
    this.saveProfile(INITIAL_PROFILE);
    this.saveLinks(INITIAL_LINKS);
    return { profile: INITIAL_PROFILE, links: INITIAL_LINKS };
  }

  exportData(): string {
    const data = {
      profile: this.getProfile(),
      links: this.getLinks(),
      exportedAt: new Date().toISOString(),
      version: '1.0',
    };
    return JSON.stringify(data, null, 2);
  }

  importData(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.profile && Array.isArray(parsed.links)) {
        this.saveProfile(parsed.profile);
        this.saveLinks(parsed.links);
        return true;
      }
    } catch (e) {
      console.error('Failed to import data:', e);
    }
    return false;
  }
}

export const storage = new StorageService();
