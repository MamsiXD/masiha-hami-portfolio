import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SvgIcon from '../../components/SvgIcon';
import AdminLayout from '../../components/admin/AdminLayout';
import { usePortfolio } from '../../context/PortfolioContext';
import { SPOTLIGHT_THUMBNAIL_URL } from '../../data/initialData';

export default function AdminOverviewPage() {
  const navigate = useNavigate();
  const {
    language,
    toggleLanguage,
    rtlSimulated,
    setRtlSimulated,
    cms,
    toggleSectionVisibility,
    reorderSections,
    addCustomSection,
    toggleOrbitalSkill,
    toggleProjectFeatured,
  } = usePortfolio();

  const [draggedIdx, setDraggedIdx] = useState(null);
  const [showAddSection, setShowAddSection] = useState(false);
  const [newSecTitle, setNewSecTitle] = useState('');
  const [newSecAnchor, setNewSecAnchor] = useState('');

  const activeProjectsCount = cms.projects.length;
  const featuredProjectsCount = cms.projects.filter((p) => p.featured).length;
  const visibleSkillsCount = cms.skills.filter((s) => s.visible).length;
  const activeSectionsCount = cms.sections.filter((s) => s.visible).length;
  const hiddenSectionsCount = cms.sections.length - activeSectionsCount;
  const activeOrbitalCount = cms.orbitalSkills.filter((o) => o.active).length;

  const spotlightProject =
    cms.projects.find((p) => p.featured) ?? cms.projects[0];

  const handleAddCustomSection = (e) => {
    e.preventDefault();
    if (!newSecTitle.trim()) return;
    addCustomSection(
      newSecTitle.trim(),
      newSecAnchor.trim() || `#${newSecTitle.trim().toLowerCase().replace(/\s+/g, '-')}`
    );
    setNewSecTitle('');
    setNewSecAnchor('');
    setShowAddSection(false);
  };

  return (
    <AdminLayout breadcrumb="Overview">
      <div className="flex flex-col w-full px-4 md:px-0 pt-4 pb-space-xl gap-space-lg">
        {/* Top Hero Status Card */}
        <div className="relative w-full rounded-xl bg-surface-container-low p-space-md shadow-md overflow-hidden flex flex-col gap-space-sm">
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-accent-teal/10 rounded-[0.75rem] blur-2xl pointer-events-none"></div>
          <div className="flex flex-wrap items-center justify-between gap-space-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-teal opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-teal"></span>
              </span>
              <span className="font-label-code text-label-code text-accent-teal uppercase tracking-wider">
                Live &amp; Synced
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-[0.75rem] bg-surface-container-highest text-on-surface font-label-caps text-label-caps uppercase">
              v1.2 Production
            </span>
          </div>

          <div className="flex flex-col gap-0.5">
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-medium tracking-tight">
              Portfolio Control Panel
            </h1>
            <p className="font-body-sm text-body-sm text-text-muted-dark">
              Masiha Hami — Architect &amp; Frontend Lead
            </p>
          </div>

          {/* Quick Control Bar */}
          <div className="flex flex-wrap items-center gap-space-xs pt-1">
            <Link
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-primary text-on-primary font-body-sm text-body-sm font-medium shadow-sm transition-transform active:scale-[0.98]"
              to="/"
            >
              <span>View Public Site</span>
              <SvgIcon className="w-4 h-4" name="arrow_outward" />
            </Link>
            <button
              className="flex items-center gap-1.5 py-2 px-3 rounded-lg bg-surface-container-high text-on-surface font-label-code text-label-code transition-colors hover:bg-surface-container-highest active:scale-[0.98] cursor-pointer"
              onClick={toggleLanguage}
              type="button"
            >
              <SvgIcon className="w-4 h-4 text-accent-teal" name="translate" />
              <span className="font-medium">
                {language === 'en' ? (
                  <>
                    EN <span className="text-text-muted-dark">↔</span> FA
                  </>
                ) : (
                  <>
                    FA <span className="text-text-muted-dark">↔</span> EN
                  </>
                )}
              </span>
            </button>
          </div>
        </div>

        {/* Summary Metric Grid */}
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps text-text-muted-dark uppercase tracking-wider">
              Telemetry &amp; Content Stats
            </span>
            <span className="font-label-code text-label-code text-accent-teal">
              all systems optimal
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-space-xs">
            {/* Card 1 */}
            <Link
              to="/admin/projects"
              className="rounded-xl bg-surface-container-low p-space-sm flex flex-col justify-between gap-2 shadow-sm transition-all hover:bg-surface-container"
            >
              <div className="flex items-center justify-between text-text-muted-dark">
                <span className="font-label-caps text-label-caps uppercase">Projects</span>
                <SvgIcon className="w-[18px] h-[18px]" name="folder_code" />
              </div>
              <div>
                <div className="font-headline-md text-headline-md text-primary font-semibold">
                  {activeProjectsCount} Active
                </div>
                <div className="font-label-code text-label-code text-accent-teal">
                  {featuredProjectsCount} Featured
                </div>
              </div>
            </Link>

            {/* Card 2 */}
            <Link
              to="/admin/skills"
              className="rounded-xl bg-surface-container-low p-space-sm flex flex-col justify-between gap-2 shadow-sm transition-all hover:bg-surface-container"
            >
              <div className="flex items-center justify-between text-text-muted-dark">
                <span className="font-label-caps text-label-caps uppercase">Skills Matrix</span>
                <SvgIcon className="w-[18px] h-[18px]" name="terminal" />
              </div>
              <div>
                <div className="font-headline-md text-headline-md text-primary font-semibold">
                  {cms.skills.length} Configured
                </div>
                <div className="font-label-code text-label-code text-text-muted-dark">
                  {visibleSkillsCount === cms.skills.length
                    ? 'All Visible'
                    : `${visibleSkillsCount} Visible`}
                </div>
              </div>
            </Link>

            {/* Card 3 */}
            <div className="rounded-xl bg-surface-container-low p-space-sm flex flex-col justify-between gap-2 shadow-sm transition-all hover:bg-surface-container">
              <div className="flex items-center justify-between text-text-muted-dark">
                <span className="font-label-caps text-label-caps uppercase">Experience</span>
                <SvgIcon className="w-[18px] h-[18px]" name="work_history" />
              </div>
              <div>
                <div className="font-headline-md text-headline-md text-primary font-semibold">
                  1 Entry
                </div>
                <div className="font-label-code text-label-code text-text-muted-dark">
                  Internship Tech
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="rounded-xl bg-surface-container-low p-space-sm flex flex-col justify-between gap-2 shadow-sm transition-all hover:bg-surface-container">
              <div className="flex items-center justify-between text-text-muted-dark">
                <span className="font-label-caps text-label-caps uppercase">Credentials</span>
                <SvgIcon className="w-[18px] h-[18px]" name="verified" />
              </div>
              <div>
                <div className="font-headline-md text-headline-md text-primary font-semibold">
                  2 Verified
                </div>
                <div className="font-label-code text-label-code text-accent-teal">
                  On-Chain / ID
                </div>
              </div>
            </div>

            {/* Card 5 */}
            <Link
              to="/admin/sections"
              className="rounded-xl bg-surface-container-low p-space-sm flex flex-col justify-between gap-2 shadow-sm transition-all hover:bg-surface-container"
            >
              <div className="flex items-center justify-between text-text-muted-dark">
                <span className="font-label-caps text-label-caps uppercase">Layout Nodes</span>
                <SvgIcon className="w-[18px] h-[18px]" name="view_quilt" />
              </div>
              <div>
                <div className="font-headline-md text-headline-md text-primary font-semibold">
                  {activeSectionsCount} Active
                </div>
                <div className="font-label-code text-label-code text-text-muted-dark">
                  {hiddenSectionsCount} Hidden
                </div>
              </div>
            </Link>

            {/* Card 6 */}
            <Link
              to="/admin/settings"
              className="rounded-xl bg-surface-container-low p-space-sm flex flex-col justify-between gap-2 shadow-sm transition-all hover:bg-surface-container"
            >
              <div className="flex items-center justify-between text-text-muted-dark">
                <span className="font-label-caps text-label-caps uppercase">Localization</span>
                <SvgIcon className="w-[18px] h-[18px]" name="g_translate" />
              </div>
              <div>
                <div className="font-headline-md text-headline-md text-primary font-semibold">
                  100% Synced
                </div>
                <div className="font-label-code text-label-code text-accent-teal">
                  EN + FA Matrix
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Desktop 2-Column Management Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg items-start">
          {/* Section Architecture Quick Controller */}
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <SvgIcon className="w-[18px] h-[18px] text-accent-teal" name="tune" />
                <span className="font-headline-md text-headline-md text-primary font-medium">
                  Layout Flow Controller
                </span>
              </div>
              <span className="font-label-code text-label-code text-text-muted-dark">
                Order • Status
              </span>
            </div>

            <div className="rounded-xl bg-surface-container-low p-space-sm flex flex-col gap-2 shadow-sm">
              <div className="flex flex-col gap-1.5" id="section-list">
                {cms.sections.map((sec, idx) => (
                  <div
                    key={sec.id}
                    draggable
                    onDragStart={() => setDraggedIdx(idx)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (draggedIdx !== null && draggedIdx !== idx) {
                        reorderSections(draggedIdx, idx);
                      }
                      setDraggedIdx(null);
                    }}
                    onDragEnd={() => setDraggedIdx(null)}
                    className={`section-row flex items-center justify-between gap-2 p-2 rounded-lg bg-surface-container-high transition-colors hover:bg-surface-container-highest ${
                      draggedIdx === idx ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <button
                        aria-label="Drag section"
                        className="hidden sm:inline-flex text-text-muted-dark hover:text-primary cursor-grab active:cursor-grabbing p-0.5"
                        type="button"
                      >
                        <SvgIcon className="w-[18px] h-[18px]" name="drag_indicator" />
                      </button>
                      <div className="flex flex-col sm:hidden shrink-0">
                        <button
                          aria-label={`Move ${sec.title} up`}
                          className="text-text-muted-dark hover:text-primary disabled:opacity-30 cursor-pointer leading-none"
                          disabled={idx === 0}
                          onClick={() => reorderSections(idx, idx - 1)}
                          type="button"
                        >
                          <SvgIcon className="w-[15px] h-[15px]" name="keyboard_arrow_up" />
                        </button>
                        <button
                          aria-label={`Move ${sec.title} down`}
                          className="text-text-muted-dark hover:text-primary disabled:opacity-30 cursor-pointer leading-none"
                          disabled={idx === cms.sections.length - 1}
                          onClick={() => reorderSections(idx, idx + 1)}
                          type="button"
                        >
                          <SvgIcon className="w-[15px] h-[15px]" name="keyboard_arrow_down" />
                        </button>
                      </div>
                      <div
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          sec.visible ? 'bg-accent-teal' : 'bg-text-muted-dark/50'
                        }`}
                      ></div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-body-sm text-body-sm text-primary font-medium truncate">
                          {sec.title}
                        </span>
                        <span className="font-label-code text-label-code text-text-muted-dark truncate">
                          {sec.anchor}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        aria-pressed={sec.visible}
                        aria-label={`Toggle ${sec.title}`}
                        dir="ltr"
                        className={`toggle-pill relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-[0.75rem] transition-colors ${
                          sec.visible ? 'bg-accent-teal' : 'bg-surface-container-highest'
                        }`}
                        onClick={() => toggleSectionVisibility(sec.id)}
                        type="button"
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-[0.75rem] bg-surface-dark transition-transform m-0.5 ${
                            sec.visible ? 'translate-x-4' : 'translate-x-0.5'
                          }`}
                        ></span>
                      </button>
                      <button
                        aria-label={`Edit ${sec.title}`}
                        className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                        onClick={() => navigate('/admin/sections')}
                        type="button"
                      >
                        <SvgIcon className="w-4 h-4" name="edit" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {showAddSection && (
                <form
                  onSubmit={handleAddCustomSection}
                  className="p-2.5 rounded-lg bg-surface-dark flex flex-col gap-2"
                >
                  <input
                    className="bg-surface-container-low text-on-surface font-body-sm text-body-sm px-2.5 py-1.5 rounded-lg outline-none placeholder:text-text-muted-dark"
                    placeholder="Section title (e.g. Open Source Notes)"
                    value={newSecTitle}
                    onChange={(e) => setNewSecTitle(e.target.value)}
                    required
                  />
                  <input
                    className="bg-surface-container-low text-on-surface font-label-code text-label-code px-2.5 py-1.5 rounded-lg outline-none placeholder:text-text-muted-dark"
                    placeholder="#custom-anchor"
                    value={newSecAnchor}
                    onChange={(e) => setNewSecAnchor(e.target.value)}
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-1.5 rounded-lg bg-primary text-on-primary font-label-code text-label-code font-medium cursor-pointer"
                    >
                      Create Node
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddSection(false)}
                      className="px-3 py-1.5 rounded-lg bg-surface-container-high text-text-muted-dark font-label-code text-label-code cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <button
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-surface-container-high text-primary hover:bg-surface-container-highest transition-colors font-body-sm text-body-sm mt-1 active:scale-[0.99] cursor-pointer"
                onClick={() => setShowAddSection((prev) => !prev)}
                type="button"
              >
                <SvgIcon className="w-[18px] h-[18px]" name="add" />
                <span>Add Custom Section</span>
              </button>
            </div>
          </div>

          {/* Quick Management Hub: Project Queue & Orbital Skills */}
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <SvgIcon className="w-[18px] h-[18px] text-accent-teal" name="hub" />
                <span className="font-headline-md text-headline-md text-primary font-medium">
                  Quick Management Hub
                </span>
              </div>
              <span className="font-label-caps text-label-caps text-text-muted-dark uppercase">
                Rapid Edit
              </span>
            </div>

            {/* Active Featured Project Card */}
            {spotlightProject && (
              <div className="rounded-xl bg-surface-container-low p-space-sm flex flex-col gap-space-sm shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-label-caps text-label-caps text-text-muted-dark uppercase tracking-wider">
                    Spotlight Project
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[0.75rem] bg-accent-teal/15 text-accent-teal font-label-code text-label-code">
                    <SvgIcon className="w-3 h-3" name="star" />
                    Featured
                  </span>
                </div>

                <div className="flex gap-space-sm items-center">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-surface-container-high shrink-0 relative">
                    <img
                      alt={spotlightProject.thumbnailAlt}
                      className="w-full h-full object-cover"
                      src={
                        spotlightProject.id === 'prj_mod_01'
                          ? SPOTLIGHT_THUMBNAIL_URL
                          : spotlightProject.thumbnailUrl
                      }
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-body-md text-body-md text-primary font-medium truncate">
                      {spotlightProject.titleEn}
                    </span>
                    <span className="font-label-code text-label-code text-text-muted-dark truncate">
                      {spotlightProject.adminTags.join(' • ')}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-teal"></span>
                      <span className="font-label-caps text-label-caps text-accent-teal">
                        {spotlightProject.publiclyVisible ? 'Publicly Visible' : 'Draft Only'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-space-xs pt-1">
                  <button
                    className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-body-sm text-body-sm transition-colors active:scale-[0.98] cursor-pointer"
                    onClick={() => navigate(`/admin/projects?edit=${spotlightProject.id}`)}
                    type="button"
                  >
                    <SvgIcon className="w-4 h-4" name="edit_note" />
                    <span>Quick Edit</span>
                  </button>
                  <button
                    className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-primary font-body-sm text-body-sm transition-colors active:scale-[0.98] cursor-pointer"
                    onClick={() => toggleProjectFeatured(spotlightProject.id)}
                    type="button"
                  >
                    <SvgIcon
                      className={`w-4 h-4 ${
                        spotlightProject.featured ? 'text-accent-teal' : 'text-text-muted-dark'
                      }`}
                      name={spotlightProject.featured ? 'toggle_on' : 'toggle_off'}
                    />
                    <span>{spotlightProject.featured ? 'Featured On' : 'Featured Off'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Floating Hero Skills Pill Toggle */}
            <div className="rounded-xl bg-surface-container-low p-space-sm flex flex-col gap-2.5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps text-text-muted-dark uppercase tracking-wider">
                  Orbital Ring Skills
                </span>
                <span className="font-label-code text-label-code text-text-muted-dark">
                  {activeOrbitalCount} of {cms.orbitalSkills.length} visible
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5" id="skills-toggle-list">
                {cms.orbitalSkills.map((pill) => (
                  <button
                    key={pill.id}
                    className={`skill-pill inline-flex items-center gap-1.5 px-3 py-1 rounded-[0.75rem] font-label-code text-label-code transition-all active:scale-95 cursor-pointer ${
                      pill.active
                        ? 'bg-primary text-on-primary font-medium shadow-sm'
                        : 'bg-surface-container-high text-text-muted-dark'
                    }`}
                    onClick={() => toggleOrbitalSkill(pill.id)}
                    type="button"
                  >
                    <SvgIcon
                      className="w-[14px] h-[14px]"
                      name={pill.active ? 'check' : 'add'}
                    />
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bilingual Editing Status & RTL Simulator */}
        <div className="rounded-xl bg-surface-container-low p-space-sm flex flex-col gap-space-sm shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <SvgIcon className="w-[18px] h-[18px] text-accent-teal" name="language" />
              <span className="font-headline-md text-headline-md text-primary font-medium">
                Bilingual Status
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-[0.75rem] bg-surface-container-highest text-accent-teal font-label-code text-label-code">
              Zero Drift
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-xs">
            {/* English LTR */}
            <div className="p-space-sm rounded-lg bg-surface-container-high flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="font-label-code text-label-code text-primary font-semibold">
                  EN (US)
                </span>
                <span className="font-label-caps text-label-caps text-accent-teal uppercase">
                  Primary
                </span>
              </div>
              <span className="font-body-sm text-body-sm text-text-muted-dark">
                English • LTR Matrix
              </span>
              <div className="flex items-center gap-1 text-accent-teal font-label-code text-label-code mt-1">
                <SvgIcon className="w-[14px] h-[14px]" name="check_circle" />
                <span>100% Translated</span>
              </div>
            </div>

            {/* Persian RTL */}
            <div className="p-space-sm rounded-lg bg-surface-container-high flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="font-label-code text-label-code text-primary font-semibold">
                  FA (IR)
                </span>
                <span className="font-label-caps text-label-caps text-text-muted-dark uppercase">
                  Persian
                </span>
              </div>
              <span className="font-body-sm text-body-sm text-text-muted-dark">
                فارسی • RTL Matrix
              </span>
              <div className="flex items-center gap-1 text-accent-teal font-label-code text-label-code mt-1">
                <SvgIcon className="w-[14px] h-[14px]" name="check_circle" />
                <span>0 Missing Keys</span>
              </div>
            </div>
          </div>

          {/* RTL Simulator Switch */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="flex flex-col min-w-0">
              <span className="font-body-sm text-body-sm text-primary font-medium">
                Simulate Persian Layout (RTL)
              </span>
              <span className="font-label-code text-label-code text-text-muted-dark">
                Inspect bi-directional mirror state
              </span>
            </div>
            <button
              aria-pressed={rtlSimulated}
              aria-label="Simulate Persian Layout (RTL)"
              dir="ltr"
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-[0.75rem] transition-colors ${
                rtlSimulated ? 'bg-accent-teal' : 'bg-surface-container-highest'
              }`}
              onClick={() => setRtlSimulated(!rtlSimulated)}
              type="button"
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-[0.75rem] bg-primary transition-transform m-0.5 ${
                  rtlSimulated ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              ></span>
            </button>
          </div>
        </div>

        {/* Recent Activity & Deployment Audit Trail */}
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <SvgIcon className="w-[18px] h-[18px] text-accent-teal" name="history" />
              <span className="font-headline-md text-headline-md text-primary font-medium">
                Audit &amp; Deployments
              </span>
            </div>
            <span className="font-label-code text-label-code text-text-muted-dark">
              immutable log
            </span>
          </div>

          <div className="rounded-xl bg-surface-container-low p-space-sm flex flex-col gap-2.5 shadow-sm">
            {cms.auditLogs.slice(0, 5).map((log, index) => (
              <div
                key={log.id}
                className={`flex items-start gap-space-xs ${
                  index < Math.min(cms.auditLogs.length, 5) - 1 ? 'pb-2' : ''
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg bg-surface-container-high flex items-center justify-center ${log.iconColorClass} shrink-0 mt-0.5`}
                >
                  <SvgIcon className="w-4 h-4" name={log.icon} />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-body-sm text-body-sm text-primary font-medium truncate">
                      {log.title}
                    </span>
                    <span className="font-label-code text-label-code text-text-muted-dark shrink-0">
                      {log.timeAgo}
                    </span>
                  </div>
                  <span className="font-label-code text-label-code text-text-muted-dark">
                    {log.detailPrefix}
                    <span className={log.detailHighlightClass}>{log.detailHighlight}</span>
                    {log.detailSuffix ?? ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
