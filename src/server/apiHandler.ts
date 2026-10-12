import { INITIAL_LINKS, INITIAL_PROFILE } from '../data/mockData';
import { LinkItemData, ProfileData } from '../types';

// Standalone request and response interfaces compatible with Node / Connect / Vite middleware
export interface ApiRequest {
  url?: string;
  method?: string;
  on(event: string, listener: (...args: any[]) => void): void;
}

export interface ApiResponse {
  writeHead(statusCode: number, headers?: Record<string, string>): void;
  end(data?: string): void;
}

// In-memory data store for server-side endpoints
let serverProfile: ProfileData = { ...INITIAL_PROFILE };
let serverLinks: LinkItemData[] = [...INITIAL_LINKS];

function parseJsonBody<T>(req: ApiRequest): Promise<T> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk: any) => {
      body += String(chunk);
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : ({} as T));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res: ApiResponse, status: number, data: unknown) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(JSON.stringify(data));
}

export async function handleApiRequest(req: ApiRequest, res: ApiResponse): Promise<boolean> {
  const url = req.url || '';
  if (!url.startsWith('/api')) {
    return false;
  }

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    res.end();
    return true;
  }

  const parsedUrl = new URL(url, 'http://localhost');
  const pathname = parsedUrl.pathname;
  const method = req.method || 'GET';

  // 1. Health check
  if (pathname === '/api/health') {
    sendJson(res, 200, {
      status: 'ok',
      service: 'gdg-fiem-linktree',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    });
    return true;
  }

  // 2. Public profile endpoint for the main website to consume: GET /api/public/:username
  if (pathname.startsWith('/api/public/')) {
    const slug = pathname.replace('/api/public/', '').trim();
    if (slug === serverProfile.username || slug === 'gdgfiem') {
      const publicLinks = serverLinks.filter((l) => l.enabled);
      sendJson(res, 200, {
        success: true,
        profile: serverProfile,
        links: publicLinks,
      });
      return true;
    } else {
      sendJson(res, 404, { success: false, error: 'Profile not found' });
      return true;
    }
  }

  // 3. Profile endpoints: GET /api/profile, PUT /api/profile
  if (pathname === '/api/profile') {
    if (method === 'GET') {
      sendJson(res, 200, { success: true, profile: serverProfile });
      return true;
    }
    if (method === 'PUT' || method === 'PATCH') {
      try {
        const body = await parseJsonBody<Partial<ProfileData>>(req);
        serverProfile = {
          ...serverProfile,
          ...body,
          updatedAt: new Date().toISOString(),
        };
        sendJson(res, 200, { success: true, profile: serverProfile });
      } catch {
        sendJson(res, 400, { success: false, error: 'Invalid JSON payload' });
      }
      return true;
    }
  }

  // 4. Links endpoints: GET /api/links, POST /api/links, POST /api/links/reorder
  if (pathname === '/api/links') {
    if (method === 'GET') {
      sendJson(res, 200, { success: true, links: serverLinks });
      return true;
    }
    if (method === 'POST') {
      try {
        const body = await parseJsonBody<{ title: string; url: string; icon?: string }>(req);
        const maxOrder = serverLinks.reduce((max, l) => Math.max(max, l.sortOrder), -1);
        const newLink: LinkItemData = {
          id: `link_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          profileId: serverProfile.id,
          title: body.title || 'Untitled',
          url: body.url,
          sortOrder: maxOrder + 1,
          enabled: true,
          icon: body.icon,
          clicks: 0,
          createdAt: new Date().toISOString(),
          featured: false,
        };
        serverLinks.push(newLink);
        sendJson(res, 201, { success: true, link: newLink });
      } catch {
        sendJson(res, 400, { success: false, error: 'Invalid link payload' });
      }
      return true;
    }
  }

  // Reorder links: POST /api/links/reorder
  if (pathname === '/api/links/reorder' && method === 'POST') {
    try {
      const body = await parseJsonBody<{ orderedIds: string[] }>(req);
      const idMap = new Map(serverLinks.map((l) => [l.id, l]));
      const reordered: LinkItemData[] = [];
      body.orderedIds.forEach((id, idx) => {
        const item = idMap.get(id);
        if (item) {
          reordered.push({ ...item, sortOrder: idx });
          idMap.delete(id);
        }
      });
      idMap.forEach((item) => {
        reordered.push({ ...item, sortOrder: reordered.length });
      });
      serverLinks = reordered;
      sendJson(res, 200, { success: true, links: serverLinks });
    } catch {
      sendJson(res, 400, { success: false, error: 'Failed to reorder links' });
    }
    return true;
  }

  // Single link endpoints: /api/links/:id
  if (pathname.startsWith('/api/links/')) {
    const segments = pathname.split('/').filter(Boolean);
    const linkId = segments[2];

    // Click tracking: POST /api/links/:id/click
    if (segments[3] === 'click' && method === 'POST') {
      const link = serverLinks.find((l) => l.id === linkId);
      if (link) {
        link.clicks = (link.clicks || 0) + 1;
        sendJson(res, 200, { success: true, clicks: link.clicks });
      } else {
        sendJson(res, 404, { success: false, error: 'Link not found' });
      }
      return true;
    }

    if (method === 'PUT' || method === 'PATCH') {
      try {
        const body = await parseJsonBody<Partial<LinkItemData>>(req);
        serverLinks = serverLinks.map((l) => (l.id === linkId ? { ...l, ...body } : l));
        const updated = serverLinks.find((l) => l.id === linkId);
        sendJson(res, 200, { success: true, link: updated });
      } catch {
        sendJson(res, 400, { success: false, error: 'Failed to update link' });
      }
      return true;
    }

    if (method === 'DELETE') {
      serverLinks = serverLinks.filter((l) => l.id !== linkId);
      sendJson(res, 200, { success: true, message: 'Link deleted' });
      return true;
    }
  }

  sendJson(res, 404, { success: false, error: 'API endpoint not found' });
  return true;
}
