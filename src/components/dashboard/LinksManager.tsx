import React, { useState } from 'react';
import { LinkItemData } from '../../types';
import { detectPlatform, formatDisplayUrl } from '../../utils/url';
import {
  PlusIcon,
  TrashIcon,
  EditIcon,
  CheckIcon,
  XCloseIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  EyeOffIcon,
  ExternalLinkIcon,
  SearchIcon,
  SparklesIcon,
  renderPlatformIcon,
} from '../icons';

interface LinksManagerProps {
  links: LinkItemData[];
  onAddLink: (data: { title: string; url: string; icon?: string }) => void;
  onUpdateLink: (id: string, updates: Partial<LinkItemData>) => void;
  onDeleteLink: (id: string) => void;
  onReorder: (orderedIds: string[]) => void;
  onToggleEnabled: (id: string) => void;
  onNotify: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const LinksManager: React.FC<LinksManagerProps> = ({
  links,
  onAddLink,
  onUpdateLink,
  onDeleteLink,
  onReorder,
  onToggleEnabled,
  onNotify,
}) => {
  // Add form state
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [urlError, setUrlError] = useState('');

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editUrl, setEditUrl] = useState('');

  // Delete safeguard state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Handle URL detection in real time for Add form
  const detectedNew = newUrl ? detectPlatform(newUrl) : null;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setUrlError('Please provide a title for this link');
      return;
    }
    if (!newUrl.trim()) {
      setUrlError('Please provide a destination URL');
      return;
    }

    const platform = detectPlatform(newUrl);
    onAddLink({
      title: newTitle.trim(),
      url: newUrl.trim(),
      icon: platform.platform,
    });

    setNewTitle('');
    setNewUrl('');
    setIsAdding(false);
    setUrlError('');
    onNotify('Link published successfully!', 'success');
  };

  const handleStartEdit = (link: LinkItemData) => {
    setEditingId(link.id);
    setEditTitle(link.title);
    setEditUrl(link.url);
  };

  const handleSaveEdit = (id: string) => {
    if (!editTitle.trim()) return;
    const platform = detectPlatform(editUrl);
    onUpdateLink(id, {
      title: editTitle.trim(),
      url: editUrl.trim(),
      icon: platform.platform,
    });
    setEditingId(null);
    onNotify('Link updated!', 'success');
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= links.length) return;

    const reordered = [...links];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    onReorder(reordered.map((l) => l.id));
  };

  const handleToggleFeatured = (link: LinkItemData) => {
    onUpdateLink(link.id, { featured: !link.featured });
    onNotify(link.featured ? 'Spotlight removed' : 'Highlighted as Featured Link!', 'info');
  };

  const filteredLinks = links.filter((l) =>
    l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111]">
        <div>
          <div className="editorial-badge mb-1">LINKS IN BIO</div>
          <h2 className="text-xl font-black text-[#111111] tracking-tight">Active Links Hub</h2>
          <p className="text-xs text-neutral-600 mt-0.5">
            Create, reorder, and toggle public community links in real time.
          </p>
        </div>

        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-[#111111] border-2 border-[#111111] shadow-[3px_3px_0px_#4285F4] hover:shadow-[1px_1px_0px_#4285F4] hover:translate-x-0.5 hover:translate-y-0.5 transition active:scale-95"
          >
            <PlusIcon className="w-4 h-4 text-[#FBBC04]" />
            <span>Add New Link</span>
          </button>
        )}
      </div>

      {/* Add New Link Card / Form */}
      {isAdding && (
        <div className="p-5 rounded-2xl bg-white border-2 border-[#111111] shadow-[6px_6px_0px_#4285F4] animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4285F4]" />
              <h3 className="font-bold text-sm text-[#111111] uppercase tracking-wide">
                Create New Link
              </h3>
            </div>
            <button
              onClick={() => {
                setIsAdding(false);
                setUrlError('');
              }}
              className="text-neutral-500 hover:text-black p-1 border border-neutral-300 rounded-md"
            >
              <XCloseIcon className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Link Title / Label
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Official GDG FIEM Portal, RSVP Hackathon, Github Repo..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border-2 border-[#111111] text-[#111111] placeholder-neutral-400 text-sm focus:outline-none focus:border-[#4285F4] transition shadow-inner"
                autoFocus
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                  Target Destination URL
                </label>
                {detectedNew && (
                  <span className="text-[11px] text-[#4285F4] font-bold font-mono">
                    Detected: {detectedNew.label}
                  </span>
                )}
              </div>
              <input
                type="text"
                value={newUrl}
                onChange={(e) => {
                  setNewUrl(e.target.value);
                  if (urlError) setUrlError('');
                }}
                placeholder="e.g. gdgfiem.club or https://github.com/gdg-fiem"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border-2 ${
                  urlError ? 'border-[#EA4335]' : 'border-[#111111]'
                } text-[#111111] placeholder-neutral-400 text-sm focus:outline-none focus:border-[#4285F4] transition shadow-inner`}
              />
              <p className="text-[11px] text-neutral-500 mt-1 font-mono">
                Automatic <span className="font-bold text-[#4285F4]">https://</span> normalization is applied if omitted.
              </p>
              {urlError && <p className="text-xs text-[#EA4335] font-bold mt-1">{urlError}</p>}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-600 hover:text-black border border-neutral-300 bg-neutral-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide text-white bg-[#111111] border-2 border-[#111111] shadow-[3px_3px_0px_#34A853] hover:shadow-[1px_1px_0px_#34A853] hover:translate-x-0.5 hover:translate-y-0.5 transition active:scale-95"
              >
                <PlusIcon className="w-3.5 h-3.5 text-[#34A853]" />
                <span>Publish Link</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter / Search Bar */}
      {links.length > 2 && (
        <div className="relative">
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your links..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border-2 border-[#111111] text-sm text-[#111111] placeholder-neutral-500 focus:outline-none focus:border-[#4285F4] shadow-[3px_3px_0px_#111111] transition"
          />
        </div>
      )}

      {/* Links List */}
      <div className="space-y-3">
        {filteredLinks.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-neutral-300 bg-white/70">
            <div className="w-12 h-12 rounded-xl bg-neutral-100 border-2 border-[#111111] text-[#111111] flex items-center justify-center mx-auto mb-3 shadow-[2px_2px_0px_#111111]">
              <PlusIcon className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-[#111111] text-sm">
              {searchQuery ? 'No matching links found' : 'No links added yet'}
            </h4>
            <p className="text-xs text-neutral-600 max-w-sm mx-auto mt-1 mb-4">
              {searchQuery
                ? 'Try a different search keyword.'
                : 'Share official GDG FIEM resources, registrations, events, or social channels.'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setIsAdding(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#111111] border-2 border-[#111111] shadow-[3px_3px_0px_#4285F4] hover:shadow-[1px_1px_0px_#4285F4] transition"
              >
                <PlusIcon className="w-3.5 h-3.5 text-[#FBBC04]" />
                <span>Add Your First Link</span>
              </button>
            )}
          </div>
        ) : (
          filteredLinks.map((link, index) => {
            const isEditing = editingId === link.id;
            const isDeleting = deletingId === link.id;
            const detected = detectPlatform(link.url);

            return (
              <div
                key={link.id}
                className={`group rounded-2xl border-2 border-[#111111] transition-all duration-200 ${
                  link.enabled
                    ? 'bg-white shadow-[4px_4px_0px_#111111] hover:shadow-[6px_6px_0px_#4285F4] hover:-translate-x-0.5 hover:-translate-y-0.5'
                    : 'bg-neutral-100 opacity-60 shadow-[2px_2px_0px_#111111]'
                } ${link.featured ? 'ring-2 ring-[#FBBC04]' : ''}`}
              >
                {/* INLINE EDIT MODE */}
                {isEditing ? (
                  <div className="p-4 space-y-3 bg-[#FAF8F3] rounded-2xl">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#4285F4]">
                        Editing Link
                      </span>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-neutral-500 hover:text-black border border-neutral-300 rounded p-1 bg-white"
                      >
                        <XCloseIcon className="w-4 h-4" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Title"
                      className="w-full px-3 py-2 rounded-xl bg-white border-2 border-[#111111] text-sm text-[#111111] focus:outline-none focus:border-[#4285F4]"
                    />

                    <input
                      type="text"
                      value={editUrl}
                      onChange={(e) => setEditUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 rounded-xl bg-white border-2 border-[#111111] text-sm text-[#111111] focus:outline-none focus:border-[#4285F4]"
                    />

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-neutral-600 hover:text-black border border-neutral-300 bg-white"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveEdit(link.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#111111] border-2 border-[#111111] shadow-[2px_2px_0px_#34A853]"
                      >
                        <CheckIcon className="w-3.5 h-3.5 text-[#34A853]" />
                        <span>Save Changes</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* NORMAL CARD VIEW */
                  <div className="p-4 flex items-center justify-between gap-3">
                    {/* Left: Reorder Controls + Platform Icon */}
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Sort Order buttons */}
                      <div className="flex flex-col gap-0.5 text-neutral-600">
                        <button
                          onClick={() => handleMove(index, 'up')}
                          disabled={index === 0}
                          title="Move up"
                          className="hover:text-black disabled:opacity-20 transition p-0.5"
                        >
                          <ArrowUpIcon className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMove(index, 'down')}
                          disabled={index === links.length - 1}
                          title="Move down"
                          className="hover:text-black disabled:opacity-20 transition p-0.5"
                        >
                          <ArrowDownIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Icon */}
                      <div className="w-10 h-10 rounded-xl bg-neutral-100 border-2 border-[#111111] flex items-center justify-center shrink-0 text-[#111111] shadow-[2px_2px_0px_#111111]">
                        {renderPlatformIcon(link.icon || detected.platform, 'w-5 h-5')}
                      </div>

                      {/* Title & URL preview */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4
                            onClick={() => handleStartEdit(link)}
                            title="Click to edit title"
                            className="text-sm font-bold text-[#111111] truncate cursor-pointer hover:text-[#4285F4] transition-colors"
                          >
                            {link.title}
                          </h4>
                          {link.featured && (
                            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-black uppercase bg-[#FBBC04] text-[#111111] border border-[#111111]">
                              <SparklesIcon className="w-2.5 h-2.5" />
                              Spotlight
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono mt-0.5">
                          <span className="truncate max-w-[200px] sm:max-w-xs">
                            {formatDisplayUrl(link.url)}
                          </span>
                          <span>&bull;</span>
                          <span className="text-neutral-700 font-bold">
                            {link.clicks || 0} taps
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions (Toggle, Spotlight, Edit, Delete) */}
                    <div className="flex items-center gap-1 shrink-0">
                      {/* Spotlight Star */}
                      <button
                        onClick={() => handleToggleFeatured(link)}
                        title={link.featured ? 'Remove spotlight' : 'Make spotlight'}
                        className={`p-2 rounded-lg border border-neutral-300 transition ${
                          link.featured
                            ? 'text-[#111111] bg-[#FBBC04] border-[#111111]'
                            : 'text-neutral-400 hover:text-black hover:bg-neutral-100'
                        }`}
                      >
                        <SparklesIcon className="w-4 h-4" />
                      </button>

                      {/* Enable/Disable Toggle */}
                      <button
                        onClick={() => onToggleEnabled(link.id)}
                        title={link.enabled ? 'Hide from public view' : 'Show on public view'}
                        className={`p-2 rounded-lg border border-neutral-300 transition ${
                          link.enabled
                            ? 'text-[#34A853] bg-emerald-50 hover:bg-emerald-100'
                            : 'text-neutral-400 bg-neutral-100 hover:text-black'
                        }`}
                      >
                        {link.enabled ? (
                          <EyeIcon className="w-4 h-4" />
                        ) : (
                          <EyeOffIcon className="w-4 h-4" />
                        )}
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => handleStartEdit(link)}
                        title="Edit link details"
                        className="p-2 rounded-lg text-neutral-600 hover:text-black hover:bg-neutral-100 border border-neutral-300 transition"
                      >
                        <EditIcon className="w-4 h-4" />
                      </button>

                      {/* Delete Button / Confirm */}
                      {isDeleting ? (
                        <div className="flex items-center gap-1 bg-rose-50 border border-[#EA4335] rounded-lg p-1">
                          <button
                            onClick={() => {
                              onDeleteLink(link.id);
                              setDeletingId(null);
                              onNotify('Link deleted', 'info');
                            }}
                            className="px-2 py-1 text-[11px] font-bold text-white bg-[#EA4335] rounded hover:bg-rose-700 transition"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setDeletingId(null)}
                            className="p-1 text-neutral-600 hover:text-black"
                          >
                            <XCloseIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeletingId(link.id)}
                          title="Delete link"
                          className="p-2 rounded-lg text-neutral-400 hover:text-[#EA4335] hover:bg-rose-50 border border-neutral-300 transition"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      )}

                      {/* External preview */}
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Test link destination"
                        className="p-2 rounded-lg text-neutral-400 hover:text-[#4285F4] hover:bg-blue-50 border border-neutral-300 transition"
                      >
                        <ExternalLinkIcon className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
