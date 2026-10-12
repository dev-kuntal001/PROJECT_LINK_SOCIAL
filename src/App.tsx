import { useCallback, useEffect, useRef, useState } from 'react';
import { ActiveTab, LinkItemData, ProfileData } from './types';
import { storage } from './data/storage';

import { Navbar } from './components/Navbar';
import { ToastContainer, ToastMessage } from './components/Toast';
import { LinksManager } from './components/dashboard/LinksManager';
import { AppearanceSettings } from './components/dashboard/AppearanceSettings';
import { ProfileSettings } from './components/dashboard/ProfileSettings';
import { AnalyticsView } from './components/dashboard/AnalyticsView';
import { PhoneMockup } from './components/preview/PhoneMockup';
import { PublicBioPage } from './components/public/PublicBioPage';

// ─── Types ───────────────────────────────────────────────────────────────────

type AppView = 'dashboard' | 'public';

// ─── Helpers ─────────────────────────────────────────────────────────────────

let toastCounter = 0;
const genToastId = () => `toast_${++toastCounter}_${Date.now()}`;

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [profile, setProfile] = useState<ProfileData>(() => storage.getProfile());
  const [links, setLinks] = useState<LinkItemData[]>(() => storage.getLinks());
 const getInitialView = (): AppView =>
  window.location.hash.startsWith('#/') &&
  window.location.hash.length > 2
    ? 'public'
    : 'dashboard';

const [currentView, setCurrentView] = useState<AppView>(getInitialView);
const [showBackToDashboard, setShowBackToDashboard] = useState(false);
useEffect(() => {
  const syncViewWithHash = () => {
    const hash = window.location.hash;
    setCurrentView(
      hash.startsWith('#/') && hash.length > 2
        ? 'public'
        : 'dashboard'
    );
  };

  window.addEventListener('hashchange', syncViewWithHash);
  return () => window.removeEventListener('hashchange', syncViewWithHash);
}, []);
  const [activeTab, setActiveTab] = useState<ActiveTab>('links');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Keep a ref to links so callbacks avoid stale closures
  const linksRef = useRef(links);
  useEffect(() => { linksRef.current = links; }, [links]);

  // ── Toast helpers ──────────────────────────────────────────────────────────
  const notify = useCallback(
    (message: string, type: ToastMessage['type'] = 'success') => {
      const id = genToastId();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── Profile mutations ──────────────────────────────────────────────────────
  const handleUpdateProfile = useCallback((updates: Partial<ProfileData>) => {
    setProfile((prev) => {
      const merged = { ...prev, ...updates };
      storage.saveProfile(merged);
      return merged;
    });
  }, []);

  // ── Link mutations ─────────────────────────────────────────────────────────
  const handleAddLink = useCallback(
    (data: { title: string; url: string; icon?: string }) => {
      const newLink = storage.addLink(data);
      setLinks(storage.getLinks());
      return newLink;
    },
    []
  );

  const handleUpdateLink = useCallback(
    (id: string, updates: Partial<LinkItemData>) => {
      const updated = storage.updateLink(id, updates);
      setLinks(updated);
    },
    []
  );

  const handleDeleteLink = useCallback((id: string) => {
    const updated = storage.deleteLink(id);
    setLinks(updated);
  }, []);

  const handleReorder = useCallback((orderedIds: string[]) => {
    const updated = storage.reorderLinks(orderedIds);
    setLinks(updated);
  }, []);

  const handleToggleEnabled = useCallback((id: string) => {
    setLinks((prev) => {
      const updated = prev.map((l) =>
        l.id === id ? { ...l, enabled: !l.enabled } : l
      );
      storage.saveLinks(updated);
      return updated;
    });
  }, []);

  const handleLinkClick = useCallback((linkId: string) => {
    storage.incrementClicks(linkId);
    setLinks(storage.getLinks());
  }, []);

  const handleResetAnalytics = useCallback(() => {
    const updated = storage.resetAnalytics();
    setLinks(updated);
  }, []);

  // ── View / Navigation ──────────────────────────────────────────────────────
 
  const handleSwitchView = useCallback((view: AppView) => {
  setCurrentView(view);
  setShowBackToDashboard(view === 'public');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);


  // Opens the actual public profile URL in a real new browser tab
 
const handleOpenLiveView = useCallback(() => {
  const username = profile.username || 'user';
  const url = `${window.location.origin}${window.location.pathname}${window.location.search}#/${username}`;

  window.open(url, '_blank', 'noopener,noreferrer');
}, [profile.username]);

  const handleCopyLink = useCallback(() => {
    const url = `${window.location.origin}/#/${profile.username}`;
    navigator.clipboard
      .writeText(url)
      .then(() => notify(`Copied! linkbio.me/${profile.username}`, 'success'))
      .catch(() => notify('Failed to copy link', 'error'));
  }, [profile.username, notify]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gdg-grid text-[#111111]">
      {/* Toast Notification Layer */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* ── Public Bio Page View — clean, no dashboard chrome ── */}
      {currentView === 'public' ? (
        <div className="min-h-screen">
         
        <PublicBioPage
        profile={profile}
        links={links}
        onLinkClick={handleLinkClick}
        isMockup={false}
        onBackToDashboard={
        showBackToDashboard
        ? () => {
          setShowBackToDashboard(false);
             window.history.replaceState(
              null,
              '',
              window.location.pathname + window.location.search
            );
            handleSwitchView('dashboard');
          }
        : undefined
          }
          />

        </div>
      ) : (

        /* ── Dashboard View ── */
        <div className="min-h-screen flex flex-col">
          <Navbar
            currentView={currentView}
            onSwitchView={handleSwitchView}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            profile={profile}
            linksCount={links.length}
            onCopyLink={handleCopyLink}
          />

          {/* Dashboard body: split panel layout */}
          <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex gap-8">
              {/* ── Left Panel: Tab Content ── */}
              <div className="flex-1 min-w-0 space-y-6">
                {activeTab === 'links' && (
                  <LinksManager
                    links={links}
                    onAddLink={handleAddLink}
                    onUpdateLink={handleUpdateLink}
                    onDeleteLink={handleDeleteLink}
                    onReorder={handleReorder}
                    onToggleEnabled={handleToggleEnabled}
                    onNotify={notify}
                  />
                )}

                {activeTab === 'appearance' && (
                  <AppearanceSettings
                    profile={profile}
                    onUpdateProfile={handleUpdateProfile}
                    onNotify={notify}
                  />
                )}

                {activeTab === 'profile' && (
                  <ProfileSettings
                    profile={profile}
                    onUpdateProfile={handleUpdateProfile}
                    onNotify={notify}
                  />
                )}

                {activeTab === 'analytics' && (
                  <AnalyticsView
                    links={links}
                    onResetAnalytics={handleResetAnalytics}
                    onNotify={notify}
                  />
                )}
              </div>

              {/* ── Right Panel: Live Phone Preview (desktop only) ── */}
              <aside className="hidden xl:block w-[420px] shrink-0">
                <div className="sticky top-28">
                  <PhoneMockup
                    profile={profile}
                    links={links}
                    onLinkClick={handleLinkClick}
                    onOpenPublicTab={handleOpenLiveView}
                  />
                </div>
              </aside>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
