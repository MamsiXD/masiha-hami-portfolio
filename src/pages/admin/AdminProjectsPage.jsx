import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SvgIcon from '../../components/SvgIcon';
import AdminLayout from '../../components/admin/AdminLayout';
import { usePortfolio } from '../../context/PortfolioContext';
import { EDITOR_COVER_URL } from '../../data/initialData';

export default function AdminProjectsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editorRef = useRef(null);
  const loadedIdRef = useRef(null);

  const {
    cms,
    toggleProjectFeatured,
    toggleProjectVisibility,
    saveProject,
    createProject,
    deleteProject,
    reorderProjects,
  } = usePortfolio();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState('all');
  const [selectedId, setSelectedId] = useState(
    () => searchParams.get('edit') || cms.projects[0]?.id || ''
  );
  const [editorLang, setEditorLang] = useState('en');
  const [newTagInput, setNewTagInput] = useState('');
  const [saveBanner, setSaveBanner] = useState('Auto-saved 2m ago');
  const [draggedIdx, setDraggedIdx] = useState(null);

  const selectedSource = useMemo(
    () => cms.projects.find((p) => p.id === selectedId) ?? cms.projects[0],
    [cms.projects, selectedId]
  );

  const [draft, setDraft] = useState(selectedSource ?? null);

  useEffect(() => {
    if (!selectedSource) {
      loadedIdRef.current = null;
      setDraft(null);
      return;
    }
    if (loadedIdRef.current !== selectedSource.id) {
      loadedIdRef.current = selectedSource.id;
      setDraft({
        ...selectedSource,
        tags: [...selectedSource.tags],
        adminTags: [...selectedSource.adminTags],
      });
    } else {
      setDraft((prev) =>
        prev
          ? {
              ...prev,
              featured: selectedSource.featured,
              publiclyVisible: selectedSource.publiclyVisible,
              statusBadge: selectedSource.statusBadge,
              sortOrder: selectedSource.sortOrder,
            }
          : prev
      );
    }
  }, [selectedSource]);

  useEffect(() => {
    const editParam = searchParams.get('edit');
    if (editParam && cms.projects.some((p) => p.id === editParam)) {
      setSelectedId(editParam);
      if (window.innerWidth < 1024) {
        setTimeout(() => {
          editorRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 80);
      }
    }
  }, [searchParams, cms.projects]);

  const publishedCount = cms.projects.filter((p) => p.publiclyVisible).length;
  const draftCount = cms.projects.filter((p) => !p.publiclyVisible).length;
  const featuredCount = cms.projects.filter((p) => p.featured).length;

  const filteredProjects = useMemo(() => {
    return cms.projects.filter((p) => {
      if (filterTab === 'featured' && !p.featured) return false;
      if (filterTab === 'webapps' && p.categoryGroup !== 'Web Applications') return false;
      if (filterTab === 'mfe' && p.categoryGroup !== 'Micro-Frontends') return false;
      if (filterTab === 'drafts' && p.publiclyVisible) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const hay = `${p.titleEn} ${p.titleFa} ${p.slug} ${p.adminTags.join(' ')} ${p.tags.join(' ')}`.toLowerCase();
        return hay.includes(q);
      }
      return true;
    });
  }, [cms.projects, filterTab, searchQuery]);

  const handleSelectForEdit = (id) => {
    setSelectedId(id);
    if (window.innerWidth < 1024) {
      setTimeout(() => {
        editorRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 40);
    }
  };

  const handleCreateNew = () => {
    const created = createProject();
    setSelectedId(created.id);
    setFilterTab('all');
    setSearchQuery('');
    setSaveBanner('New draft initialized');
    if (window.innerWidth < 1024) {
      setTimeout(() => {
        editorRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    }
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && newTagInput.trim() && draft) {
      e.preventDefault();
      const val = newTagInput.trim();
      if (!draft.adminTags.includes(val)) {
        setDraft({
          ...draft,
          adminTags: [...draft.adminTags, val],
          tags: [...draft.tags, val],
        });
      }
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    if (!draft) return;
    setDraft({
      ...draft,
      adminTags: draft.adminTags.filter((t) => t !== tagToRemove),
      tags: draft.tags.filter((t) => t !== tagToRemove),
    });
  };

  const handleSaveLive = () => {
    if (!draft) return;
    saveProject({
      ...draft,
      descriptionEn: draft.editorDescEn,
      descriptionFa: draft.editorDescFa,
    });
    setSaveBanner('Synced live just now');
  };

  const handleDiscard = () => {
    if (selectedSource) {
      setDraft({
        ...selectedSource,
        tags: [...selectedSource.tags],
        adminTags: [...selectedSource.adminTags],
      });
      setSaveBanner('Local changes discarded');
    }
  };

  const handleDeleteCurrent = () => {
    if (!draft) return;
    const next = cms.projects.find((p) => p.id !== draft.id);
    deleteProject(draft.id);
    if (next) {
      setSelectedId(next.id);
    }
  };

  return (
    <AdminLayout breadcrumb="Projects">
      <div className="flex flex-col w-full px-4 md:px-0 pt-4 pb-space-xl">
        {/* Top Meta & Quick Statistics Bar */}
        <div className="flex flex-col gap-space-sm pb-space-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 font-label-code text-label-code text-accent-teal">
                <span className="inline-block w-2 h-2 rounded-full bg-accent-teal animate-pulse"></span>
                <span>CMS_REPO::PROJECTS</span>
              </div>
              <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-medium tracking-tight mt-0.5">
                Catalog &amp; Editor
              </h1>
            </div>
            <button
              className="flex items-center gap-1.5 bg-primary text-on-primary font-label-code text-label-code px-3 py-2 rounded-lg font-medium shadow-sm active:scale-95 transition-transform cursor-pointer shrink-0"
              onClick={handleCreateNew}
              type="button"
            >
              <SvgIcon className="w-[18px] h-[18px]" name="add" />
              <span>New</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-space-sm font-label-caps text-label-caps uppercase text-text-muted-dark">
            <span className="text-primary font-medium">{publishedCount} Published</span>
            <span>•</span>
            <span className="text-accent-teal">{draftCount} Draft</span>
            <span>•</span>
            <span>Storage Sync: OK</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
          {/* Left Column: Search, Filter & Project Stack */}
          <div className="lg:col-span-6 flex flex-col">
            {/* Search & Filter Ribbon */}
            <div className="flex flex-col gap-space-sm mt-space-xs">
              <div className="relative w-full">
                <SvgIcon
                  className="w-[18px] h-[18px] absolute start-3 top-1/2 -translate-y-1/2 text-text-muted-dark pointer-events-none"
                  name="search"
                />
                <input
                  className="w-full bg-surface-container-low text-on-surface font-body-sm text-body-sm ps-9 pe-3 py-2 rounded-lg outline-none placeholder:text-text-muted-dark focus:bg-surface-container transition-colors"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, stack (e.g. Next.js, WebGL)..."
                  type="text"
                  value={searchQuery}
                />
              </div>

              {/* Category Pills Ribbon */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-nowrap">
                {[
                  { id: 'all', label: `All (${cms.projects.length})` },
                  { id: 'featured', label: `★ Featured (${featuredCount})` },
                  { id: 'webapps', label: 'Web Apps' },
                  { id: 'mfe', label: 'Micro-Frontends' },
                  { id: 'drafts', label: `Drafts (${draftCount})` },
                ].map((pill) => {
                  const active = filterTab === pill.id;
                  return (
                    <button
                      key={pill.id}
                      className={`px-3 py-1 rounded-[0.75rem] font-label-caps text-label-caps uppercase transition-colors cursor-pointer ${
                        active
                          ? 'bg-primary text-on-primary'
                          : 'bg-surface-container-high text-on-surface-variant hover:text-primary'
                      }`}
                      onClick={() => setFilterTab(pill.id)}
                      type="button"
                    >
                      {pill.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section: Active Projects Stack */}
            <div className="flex flex-col gap-space-sm mt-space-md">
              <div className="flex items-center justify-between font-label-caps text-label-caps text-text-muted-dark uppercase tracking-wider">
                <span>Reorderable Stack (Press &amp; Drag)</span>
                <span className="font-label-code text-[10px]">SYNC_ID #882</span>
              </div>

              {filteredProjects.map((project, idx) => {
                const isDraft = !project.publiclyVisible;
                const globalIndex = cms.projects.findIndex((p) => p.id === project.id);
                const displayIndex = String(globalIndex + 1).padStart(2, '0');
                const isSelected = project.id === selectedId;

                return (
                  <div
                    key={project.id}
                    draggable
                    onDragStart={() => setDraggedIdx(globalIndex)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (draggedIdx !== null && draggedIdx !== globalIndex) {
                        reorderProjects(draggedIdx, globalIndex);
                      }
                      setDraggedIdx(null);
                    }}
                    onDragEnd={() => setDraggedIdx(null)}
                    className={`rounded-xl p-space-sm flex flex-col gap-space-xs shadow-sm transition-all ${
                      isDraft
                        ? 'bg-surface-container-low/70 opacity-90 hover:opacity-100'
                        : 'bg-surface-container-low hover:bg-surface-container'
                    } ${isSelected ? 'ring-1 ring-accent-teal/40' : ''}`}
                  >
                    <div className="flex items-start gap-space-sm">
                      <button
                        aria-label="Reorder project"
                        className="text-text-muted-dark hover:text-primary mt-1 p-1 touch-none cursor-grab active:cursor-grabbing"
                        type="button"
                      >
                        <SvgIcon className="w-5 h-5" name="drag_indicator" />
                      </button>

                      <div className="w-16 h-16 rounded-lg bg-surface-container-highest overflow-hidden relative shrink-0">
                        <img
                          alt={project.thumbnailAlt}
                          className="w-full h-full object-cover"
                          src={project.thumbnailUrl}
                        />
                        <div
                          className={`absolute top-1 left-1 bg-surface-dark/80 backdrop-blur-md rounded-[2px] px-1 py-0.5 font-label-code text-[9px] ${
                            idx === 0 && project.featured
                              ? 'text-accent-teal'
                              : isDraft
                              ? 'text-text-muted-light'
                              : 'text-text-muted-dark'
                          }`}
                        >
                          {displayIndex}
                        </div>
                      </div>

                      <div className="flex flex-col flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h2 className="font-headline-md text-headline-md text-primary font-medium truncate">
                            {project.titleEn}
                          </h2>
                          {isDraft ? (
                            <SvgIcon
                              className="w-[18px] h-[18px] text-text-muted-dark"
                              name="visibility_off"
                            />
                          ) : (
                            <button
                              className={`transition-transform hover:scale-110 cursor-pointer ${
                                project.featured
                                  ? 'text-accent-teal'
                                  : 'text-text-muted-dark hover:text-accent-teal'
                              }`}
                              onClick={() => toggleProjectFeatured(project.id)}
                              title={project.featured ? 'Featured Project' : 'Mark Featured'}
                              type="button"
                            >
                              <SvgIcon
                                className="w-[18px] h-[18px]"
                                name={project.featured ? 'star-fill' : 'star'}
                              />
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span
                            className={`px-1.5 py-0.5 rounded-[2px] font-label-caps text-[10px] uppercase font-medium ${
                              isDraft
                                ? 'bg-surface-container-high text-text-muted-dark'
                                : 'bg-surface-container-highest text-accent-teal'
                            }`}
                          >
                            {project.statusBadge}
                          </span>
                          {project.featured && !isDraft && (
                            <span className="bg-surface-container-highest text-primary-fixed-dim px-1.5 py-0.5 rounded-[2px] font-label-caps text-[10px] uppercase">
                              Featured
                            </span>
                          )}
                          <span className="font-label-code text-[11px] text-text-muted-dark truncate">
                            {project.slug}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-1 mt-1.5">
                          {project.adminTags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="bg-surface-container px-2 py-0.5 rounded-[0.75rem] font-label-code text-[10px] text-on-surface-variant"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Footer */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 mt-1 bg-surface-container-lowest/50 rounded-lg px-2 py-1.5">
                      {isDraft ? (
                        <span className="font-label-code text-[11px] text-text-muted-dark">
                          Not visible to public
                        </span>
                      ) : (
                        <div className="flex items-center gap-3">
                          {project.liveDemoUrl && (
                            <a
                              className="flex items-center gap-1 font-label-code text-label-code text-text-muted-dark hover:text-primary"
                              href={project.liveDemoUrl}
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              <SvgIcon className="w-[14px] h-[14px]" name="link" />
                              <span>{project.liveDemoLabel || 'Live Demo'}</span>
                            </a>
                          )}
                          {project.repoUrl && (
                            <a
                              className="flex items-center gap-1 font-label-code text-label-code text-text-muted-dark hover:text-primary"
                              href={project.repoUrl}
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              <SvgIcon className="w-[14px] h-[14px]" name="code" />
                              <span>{project.repoLabel || 'GitHub'}</span>
                            </a>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-1">
                        <button
                          className="p-1.5 text-text-muted-dark hover:text-primary transition-colors cursor-pointer"
                          onClick={() => toggleProjectVisibility(project.id)}
                          title={isDraft ? 'Publish' : 'Toggle Visibility'}
                          type="button"
                        >
                          <SvgIcon
                            className="w-[18px] h-[18px]"
                            name={isDraft ? 'publish' : 'visibility'}
                          />
                        </button>
                        <button
                          className={`p-1.5 transition-colors cursor-pointer ${
                            isSelected
                              ? 'text-accent-teal hover:text-primary'
                              : 'text-text-muted-dark hover:text-accent-teal'
                          }`}
                          onClick={() => handleSelectForEdit(project.id)}
                          title="Edit in Editor"
                          type="button"
                        >
                          <SvgIcon className="w-[18px] h-[18px]" name="edit_note" />
                        </button>
                        <button
                          className="p-1.5 text-text-muted-dark hover:text-error transition-colors cursor-pointer"
                          onClick={() => deleteProject(project.id)}
                          title="Archive Project"
                          type="button"
                        >
                          <SvgIcon className="w-[18px] h-[18px]" name="delete_outline" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredProjects.length === 0 && (
                <div className="rounded-xl bg-surface-container-low p-6 text-center font-label-code text-label-code text-text-muted-dark">
                  No projects match your current filter.
                </div>
              )}
            </div>
          </div>

          {/* Detailed Project Editor Form Section */}
          {draft && (
            <div
              ref={editorRef}
              className="lg:col-span-6 lg:sticky lg:top-20 flex flex-col gap-space-sm scroll-mt-20"
              id="editorSection"
            >
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <SvgIcon className="w-5 h-5 text-accent-teal" name="tune" />
                  <h2 className="font-headline-md text-headline-md text-primary font-medium tracking-tight">
                    Active Project Editor
                  </h2>
                </div>
                <span className="font-label-code text-[11px] text-text-muted-dark bg-surface-container-high px-2 py-0.5 rounded-[2px]">
                  ID: {draft.codeId}
                </span>
              </div>

              {/* Bilingual Switcher Tabs (LTR & RTL) */}
              <div className="bg-surface-container-lowest p-1 rounded-xl flex items-center gap-1">
                <button
                  className={`flex-1 py-1.5 text-center rounded-lg font-label-code text-label-code transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    editorLang === 'en'
                      ? 'bg-surface-container-high text-primary font-medium shadow-sm'
                      : 'text-text-muted-dark hover:text-primary'
                  }`}
                  onClick={() => setEditorLang('en')}
                  type="button"
                >
                  {editorLang === 'en' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-teal"></span>
                  )}
                  <span>EN (English - LTR)</span>
                </button>
                <button
                  className={`flex-1 py-1.5 text-center rounded-lg font-label-code text-label-code transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    editorLang === 'fa'
                      ? 'bg-surface-container-high text-primary font-medium shadow-sm'
                      : 'text-text-muted-dark hover:text-primary'
                  }`}
                  onClick={() => setEditorLang('fa')}
                  type="button"
                >
                  {editorLang === 'fa' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-teal"></span>
                  )}
                  <span>FA (فارسی - RTL)</span>
                </button>
              </div>

              {/* Form Container */}
              <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-md shadow-md">
                {/* English Fields */}
                {editorLang === 'en' ? (
                  <div className="flex flex-col gap-space-sm">
                    <div className="flex flex-col gap-1">
                      <label className="font-label-code text-label-code text-text-muted-dark">
                        Project Title (EN)
                      </label>
                      <input
                        className="bg-surface-dark text-on-surface font-body-md text-body-md px-3 py-2 rounded-lg outline-none focus:bg-surface-container-highest transition-colors"
                        onChange={(e) => setDraft({ ...draft, titleEn: e.target.value })}
                        type="text"
                        value={draft.titleEn}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-label-code text-label-code text-text-muted-dark">
                        Short Description / Subtitle (EN)
                      </label>
                      <textarea
                        className="bg-surface-dark text-on-surface font-body-md text-body-md px-3 py-2 rounded-lg outline-none resize-none focus:bg-surface-container-highest transition-colors"
                        onChange={(e) => setDraft({ ...draft, editorDescEn: e.target.value })}
                        rows={3}
                        value={draft.editorDescEn}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-space-sm" dir="rtl">
                    <div className="flex flex-col gap-1">
                      <label className="font-label-code text-label-code text-text-muted-dark font-normal">
                        عنوان پروژه (فارسی)
                      </label>
                      <input
                        className="bg-surface-dark text-on-surface font-body-md text-body-md px-3 py-2 rounded-lg outline-none focus:bg-surface-container-highest transition-colors"
                        onChange={(e) => setDraft({ ...draft, titleFa: e.target.value })}
                        type="text"
                        value={draft.titleFa}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-label-code text-label-code text-text-muted-dark font-normal">
                        توضیحات کوتاه پروژه (فارسی)
                      </label>
                      <textarea
                        className="bg-surface-dark text-on-surface font-body-md text-body-md px-3 py-2 rounded-lg outline-none resize-none focus:bg-surface-container-highest transition-colors leading-relaxed"
                        onChange={(e) => setDraft({ ...draft, editorDescFa: e.target.value })}
                        rows={3}
                        value={draft.editorDescFa}
                      />
                    </div>
                  </div>
                )}

                {/* Cover Media Upload & Preview Section */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-label-code text-label-code text-text-muted-dark">
                      Thumbnail &amp; Hero Banner
                    </label>
                    <span className="font-label-code text-[10px] text-text-muted-dark">
                      1200x800 WEBP / PNG
                    </span>
                  </div>
                  <div className="relative bg-surface-dark rounded-xl p-3 flex items-center gap-space-sm">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-surface-container-highest shrink-0">
                      <img
                        alt={draft.thumbnailAlt}
                        className="w-full h-full object-cover"
                        src={draft.id === 'prj_mod_01' ? EDITOR_COVER_URL : draft.thumbnailUrl}
                      />
                    </div>
                    <div className="flex flex-col justify-between flex-1 min-w-0">
                      <div className="flex flex-col">
                        <span className="font-label-code text-label-code text-primary truncate">
                          {draft.coverFilename}
                        </span>
                        <span className="font-label-code text-[11px] text-text-muted-dark">
                          {draft.coverMeta}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          className="bg-surface-container text-primary hover:bg-surface-container-high px-2.5 py-1 rounded-[2px] font-label-code text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                          onClick={() =>
                            setDraft({
                              ...draft,
                              coverFilename: `cover_rev_${Math.floor(Math.random() * 90 + 10)}.webp`,
                            })
                          }
                          type="button"
                        >
                          <SvgIcon className="w-[14px] h-[14px]" name="sync" />
                          <span>Replace</span>
                        </button>
                        <button
                          className="bg-surface-container text-error hover:bg-error-container hover:text-on-error px-2.5 py-1 rounded-[2px] font-label-code text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                          onClick={() =>
                            setDraft({
                              ...draft,
                              coverFilename: 'default_placeholder.webp',
                            })
                          }
                          type="button"
                        >
                          <SvgIcon className="w-[14px] h-[14px]" name="delete" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tech Stack Manager */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-code text-label-code text-text-muted-dark">
                    Tech Stack Tags
                  </label>
                  <div className="flex flex-wrap gap-1.5 p-2 bg-surface-dark rounded-lg min-h-[44px]">
                    {draft.adminTags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-surface-container-high text-primary px-2.5 py-0.5 rounded-[0.75rem] font-label-code text-label-code flex items-center gap-1"
                      >
                        <span>{tag}</span>
                        <button
                          className="text-text-muted-dark hover:text-primary leading-none text-sm cursor-pointer"
                          onClick={() => handleRemoveTag(tag)}
                          type="button"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    <div className="flex items-center gap-1 min-w-[90px] flex-1">
                      <SvgIcon className="w-[14px] h-[14px] text-text-muted-dark" name="add" />
                      <input
                        className="w-full bg-transparent text-primary font-label-code text-label-code outline-none placeholder:text-text-muted-dark"
                        onChange={(e) => setNewTagInput(e.target.value)}
                        onKeyDown={handleAddTag}
                        placeholder="Add tech..."
                        type="text"
                        value={newTagInput}
                      />
                    </div>
                  </div>
                </div>

                {/* URL Configuration */}
                <div className="flex flex-col gap-space-sm">
                  <div className="flex flex-col gap-1">
                    <label className="font-label-code text-label-code text-text-muted-dark">
                      Live Demo Destination
                    </label>
                    <div className="flex items-center gap-1.5">
                      <div className="relative flex-1">
                        <SvgIcon
                          className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-text-muted-dark pointer-events-none"
                          name="public"
                        />
                        <input
                          className="w-full bg-surface-dark text-on-surface font-label-code text-label-code ps-8 pe-3 py-2 rounded-lg outline-none focus:bg-surface-container-highest transition-colors"
                          onChange={(e) => setDraft({ ...draft, liveDemoUrl: e.target.value })}
                          type="url"
                          value={draft.liveDemoUrl}
                        />
                      </div>
                      <a
                        className="bg-surface-container text-on-surface p-2 rounded-lg hover:text-primary transition-colors flex items-center justify-center"
                        href={draft.liveDemoUrl || '#'}
                        rel="noopener noreferrer"
                        target="_blank"
                        title="Test Live Link"
                      >
                        <SvgIcon className="w-[18px] h-[18px]" name="open_in_new" />
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-label-code text-label-code text-text-muted-dark">
                      Source Code / Repository URL
                    </label>
                    <div className="relative">
                      <SvgIcon
                        className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-text-muted-dark pointer-events-none"
                        name="terminal"
                      />
                      <input
                        className="w-full bg-surface-dark text-on-surface font-label-code text-label-code ps-8 pe-3 py-2 rounded-lg outline-none focus:bg-surface-container-highest transition-colors"
                        onChange={(e) => setDraft({ ...draft, repoUrl: e.target.value })}
                        type="url"
                        value={draft.repoUrl}
                      />
                    </div>
                  </div>
                </div>

                {/* Visibility & Feature Toggles */}
                <div className="flex flex-col gap-space-sm pt-2 bg-surface-container-lowest/60 p-space-sm rounded-lg">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex flex-col min-w-0">
                      <span className="font-body-sm text-body-sm text-primary font-medium">
                        Publicly Visible
                      </span>
                      <span className="font-label-code text-[11px] text-text-muted-dark">
                        Expose on public portfolio pages
                      </span>
                    </div>
                    <button
                      aria-label="Toggle publicly visible"
                      aria-pressed={draft.publiclyVisible}
                      dir="ltr"
                      className={`w-12 h-6 rounded-[0.75rem] p-0.5 transition-colors relative flex items-center cursor-pointer shrink-0 ${
                        draft.publiclyVisible
                          ? 'bg-accent-teal'
                          : 'bg-surface-container-highest'
                      }`}
                      onClick={() =>
                        setDraft({ ...draft, publiclyVisible: !draft.publiclyVisible })
                      }
                      type="button"
                    >
                      <div
                        className={`w-5 h-5 rounded-[0.75rem] bg-surface-dark transition-transform ${
                          draft.publiclyVisible ? 'translate-x-6' : 'translate-x-0.5'
                        }`}
                      ></div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex flex-col min-w-0">
                      <span className="font-body-sm text-body-sm text-primary font-medium">
                        Hero Showcase Pin
                      </span>
                      <span className="font-label-code text-[11px] text-text-muted-dark">
                        Feature inside top visual stream
                      </span>
                    </div>
                    <button
                      aria-label="Toggle featured showcase pin"
                      aria-pressed={draft.featured}
                      dir="ltr"
                      className={`w-12 h-6 rounded-[0.75rem] p-0.5 transition-colors relative flex items-center cursor-pointer shrink-0 ${
                        draft.featured ? 'bg-accent-teal' : 'bg-surface-container-highest'
                      }`}
                      onClick={() => setDraft({ ...draft, featured: !draft.featured })}
                      type="button"
                    >
                      <div
                        className={`w-5 h-5 rounded-[0.75rem] bg-surface-dark transition-transform ${
                          draft.featured ? 'translate-x-6' : 'translate-x-0.5'
                        }`}
                      ></div>
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="flex flex-col min-w-0">
                      <span className="font-body-sm text-body-sm text-primary font-medium">
                        Category Group
                      </span>
                      <span className="font-label-code text-[11px] text-text-muted-dark">
                        Classification filter taxonomy
                      </span>
                    </div>
                    <select
                      className="bg-surface-dark text-primary font-label-code text-label-code px-3 py-1.5 rounded-lg outline-none border-none max-w-full"
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          categoryGroup: e.target.value,
                        })
                      }
                      value={draft.categoryGroup}
                    >
                      <option value="Web Applications">Web Applications</option>
                      <option value="Micro-Frontends">Micro-Frontends</option>
                      <option value="Creative Canvas / 3D">Creative Canvas / 3D</option>
                      <option value="Infrastructure & Tooling">Infrastructure &amp; Tooling</option>
                    </select>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="flex flex-col min-w-0">
                      <span className="font-body-sm text-body-sm text-primary font-medium">
                        Sort Order Weight
                      </span>
                      <span className="font-label-code text-[11px] text-text-muted-dark">
                        Lower weights show up first (0-99)
                      </span>
                    </div>
                    <input
                      className="w-16 bg-surface-dark text-primary font-label-code text-label-code text-center py-1.5 rounded-lg outline-none"
                      onChange={(e) => {
                        const parsed = Number.parseInt(e.target.value, 10);
                        setDraft({
                          ...draft,
                          sortOrder: Number.isNaN(parsed) ? 0 : parsed,
                        });
                      }}
                      type="number"
                      value={draft.sortOrder}
                    />
                  </div>
                </div>

                {/* Editor Bottom Action Hub */}
                <div className="flex flex-col gap-2 pt-2">
                  <div className="flex items-center justify-between font-label-code text-[11px] text-text-muted-dark px-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-accent-teal"></span>
                      <span>{saveBanner}</span>
                    </div>
                    <span>Draft Revision v1.4</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      className="flex-1 bg-primary text-on-primary font-label-code text-label-code py-2.5 rounded-lg font-medium flex items-center justify-center gap-1.5 active:scale-95 transition-transform shadow-md cursor-pointer"
                      onClick={handleSaveLive}
                      type="button"
                    >
                      <SvgIcon className="w-[18px] h-[18px]" name="publish" />
                      <span>Save &amp; Sync Live</span>
                    </button>
                    <button
                      className="bg-surface-container hover:bg-surface-container-high text-primary font-label-code text-label-code px-3 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      onClick={() => navigate('/')}
                      title="Preview Public Card"
                      type="button"
                    >
                      <SvgIcon className="w-[18px] h-[18px]" name="preview" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      className="font-label-code text-[11px] text-text-muted-dark hover:text-primary transition-colors cursor-pointer"
                      onClick={handleDiscard}
                      type="button"
                    >
                      Discard Local Changes
                    </button>
                    <button
                      className="font-label-code text-[11px] text-error hover:underline transition-colors flex items-center gap-1 cursor-pointer"
                      onClick={handleDeleteCurrent}
                      type="button"
                    >
                      <SvgIcon className="w-[14px] h-[14px]" name="delete_forever" />
                      <span>Delete Project</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
