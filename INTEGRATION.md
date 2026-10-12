# GDG on Campus FIEM — Linktree Integration Specification

This document details how the separate **GDG on Campus FIEM Main Website** communicates with this Linktree application.

---

## 1. Architecture Overview

- **Linktree Repository**: Standalone application providing mobile-first bio link publishing, profile management, metrics, and theme customization.
- **Main Website Repository**: The central GDG FIEM community portal (events, gallery, domains, team, sponsor).
- **Communication Modes**:
  1. **Direct Navigation / Iframe Embed**: Embed public profile or route directly to `/#/gdgfiem`.
  2. **Headless JSON REST API**: Query public profile and links from the Linktree backend to render link cards natively on the main website.

---

## 2. API Endpoints Contract

All endpoints support CORS (`Access-Control-Allow-Origin: *`) and return JSON.

### A. Health Check
```http
GET /api/health
```
**Response (200 OK):**
```json
{
  "status": "ok",
  "service": "gdg-fiem-linktree",
  "timestamp": "2026-10-11T10:15:00.000Z",
  "version": "1.0.0"
}
```

---

### B. Public Profile Retrieval (For Main Website)
Used by the main website to fetch published links and profile details without authentication:
```http
GET /api/public/:username
```
Example: `GET /api/public/gdgfiem`

**Response (200 OK):**
```json
{
  "success": true,
  "profile": {
    "id": "prof_alex_1",
    "username": "gdgfiem",
    "displayName": "GDG on Campus FIEM",
    "bio": "Where curious minds come together to explore technology, turn bold ideas into reality, and build what's next.",
    "avatarUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80",
    "theme": "gdg-cream",
    "buttonStyle": "brutal-black",
    "verified": true,
    "socials": {
      "github": "https://github.com",
      "instagram": "https://instagram.com",
      "linkedin": "https://linkedin.com",
      "email": "gdg@fiem.edu.in"
    }
  },
  "links": [
    {
      "id": "link_1",
      "title": "🚀 RSVP: GDG Annual Tech Summit",
      "url": "https://gdgfiem.club/events",
      "sortOrder": 0,
      "enabled": true,
      "icon": "globe",
      "clicks": 1420,
      "featured": true
    }
  ]
}
```

---

### C. Link Tap / Click Tracking
When a user taps a link on the main website or public profile:
```http
POST /api/links/:id/click
```
**Response (200 OK):**
```json
{
  "success": true,
  "clicks": 1421
}
```

---

### D. Link Management (Admin / Dashboard)
- `GET /api/links`: List all links
- `POST /api/links`: Create new link `{ "title": "...", "url": "...", "icon": "..." }`
- `PUT /api/links/:id`: Update link `{ "title": "...", "url": "...", "enabled": true }`
- `DELETE /api/links/:id`: Delete link
- `POST /api/links/reorder`: Reorder links `{ "orderedIds": ["id1", "id2", ...] }`

---

## 3. How to Connect from the Main Website

### Option 1: Native Fetch Hook in Main Site (React/Next.js)
```typescript
// In main GDG FIEM website
export async function getGDGLinks() {
  const LINKTREE_URL = process.env.NEXT_PUBLIC_LINKTREE_URL || 'https://links.gdgfiem.club';
  const res = await fetch(`${LINKTREE_URL}/api/public/gdgfiem`, {
    next: { revalidate: 60 }
  });
  return res.json();
}
```

### Option 2: Responsive Embed (Iframe or Modal)
```html
<iframe
  src="https://links.gdgfiem.club/#/gdgfiem"
  title="GDG on Campus FIEM Linktree"
  class="w-full h-[650px] border-none rounded-2xl"
  loading="lazy"
></iframe>
```
