import { useState } from 'react';
import SvgIcon from '../../components/SvgIcon';
import AdminLayout from '../../components/admin/AdminLayout';
import { usePortfolio } from '../../context/PortfolioContext';

export default function AdminSectionsPage() {
  const {
    cms,
    toggleSectionVisibility,
    reorderSections,
    addCustomSection,
    removeSection,
  } = usePortfolio();

  const [title, setTitle] = useState('');
  const [anchor, setAnchor] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [showCreator, setShowCreator] = useState(false);

  const activeCount = cms.sections.filter((s) => s.visible).length;

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    addCustomSection(
      title.trim(),
      anchor.trim() || `#${title.trim().toLowerCase().replace(/\s+/g, '-')}`,
      contentEn.trim()
    );
    setTitle('');
    setAnchor('');
    setContentEn('');
    setShowCreator(false);
  };

  return (
    <AdminLayout breadcrumb="Sections">
      <div className="flex flex-col w-full px-4 md:px-0 pt-4 pb-space-xl gap-space-lg">
        <div className="flex flex-col gap-space-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 font-label-code text-label-code text-accent-teal">
                <span className="inline-block w-2 h-2 rounded-full bg-accent-teal animate-pulse"></span>
                <span>CMS_LAYOUT::NODES</span>
              </div>
              <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-medium tracking-tight mt-0.5">
                Layout Flow Controller
              </h1>
            </div>
            <button
              className="flex items-center gap-1.5 bg-primary text-on-primary font-label-code text-label-code px-3 py-2 rounded-lg font-medium shadow-sm active:scale-95 transition-transform cursor-pointer"
              onClick={() => setShowCreator((prev) => !prev)}
              type="button"
            >
              <SvgIcon className="w-[18px] h-[18px]" name="add" />
              <span>Section</span>
            </button>
          </div>
          <div className="flex items-center gap-space-sm font-label-caps text-label-caps uppercase text-text-muted-dark">
            <span className="text-primary font-medium">{activeCount} Active</span>
            <span>•</span>
            <span className="text-accent-teal">{cms.sections.length - activeCount} Hidden</span>
            <span>•</span>
            <span>Live Public Sync</span>
          </div>
        </div>

        {showCreator && (
          <form
            onSubmit={handleAdd}
            className="rounded-xl bg-surface-container-low p-space-md flex flex-col gap-space-sm shadow-sm"
          >
            <span className="font-label-caps text-label-caps text-accent-teal uppercase">
              New Custom Layout Node
            </span>
            <input
              className="bg-surface-dark text-on-surface font-body-sm text-body-sm px-3 py-2 rounded-lg outline-none placeholder:text-text-muted-dark"
              placeholder="Section Title (e.g. Speaking & Articles)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <input
              className="bg-surface-dark text-on-surface font-label-code text-label-code px-3 py-2 rounded-lg outline-none placeholder:text-text-muted-dark"
              placeholder="Anchor ID (e.g. #articles)"
              value={anchor}
              onChange={(e) => setAnchor(e.target.value)}
            />
            <textarea
              className="bg-surface-dark text-on-surface font-body-sm text-body-sm px-3 py-2 rounded-lg outline-none resize-none placeholder:text-text-muted-dark"
              placeholder="Section summary copy..."
              rows={2}
              value={contentEn}
              onChange={(e) => setContentEn(e.target.value)}
            />
            <div className="flex items-center gap-2 pt-1">
              <button
                type="submit"
                className="flex-1 py-2 rounded-lg bg-primary text-on-primary font-label-code text-label-code font-medium cursor-pointer"
              >
                Append Section
              </button>
              <button
                type="button"
                onClick={() => setShowCreator(false)}
                className="px-3 py-2 rounded-lg bg-surface-container-high text-text-muted-dark font-label-code text-label-code cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="rounded-xl bg-surface-container-low p-space-sm flex flex-col gap-2 shadow-sm">
          {cms.sections.map((sec, idx) => (
            <div
              key={sec.id}
              className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-high transition-colors hover:bg-surface-container-highest"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex flex-col">
                  <button
                    aria-label="Move section up"
                    disabled={idx === 0}
                    onClick={() => reorderSections(idx, idx - 1)}
                    className="text-text-muted-dark hover:text-primary disabled:opacity-30 cursor-pointer leading-none"
                    type="button"
                  >
                    <SvgIcon className="w-4 h-4" name="keyboard_arrow_up" />
                  </button>
                  <button
                    aria-label="Move section down"
                    disabled={idx === cms.sections.length - 1}
                    onClick={() => reorderSections(idx, idx + 1)}
                    className="text-text-muted-dark hover:text-primary disabled:opacity-30 cursor-pointer leading-none"
                    type="button"
                  >
                    <SvgIcon className="w-4 h-4" name="keyboard_arrow_down" />
                  </button>
                </div>
                <div
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    sec.visible ? 'bg-accent-teal' : 'bg-text-muted-dark/40'
                  }`}
                ></div>
                <div className="flex flex-col min-w-0">
                  <span className="font-body-sm text-body-sm text-primary font-medium truncate">
                    {sec.title}
                  </span>
                  <span className="font-label-code text-label-code text-text-muted-dark">
                    {sec.anchor} • #{idx + 1}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  aria-label={`Toggle ${sec.title}`}
                  aria-pressed={sec.visible}
                  dir="ltr"
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-[0.75rem] transition-colors ${
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
                {sec.isCustom && (
                  <button
                    aria-label="Delete custom section"
                    className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-text-muted-dark hover:text-error transition-colors cursor-pointer"
                    onClick={() => removeSection(sec.id)}
                    type="button"
                  >
                    <SvgIcon className="w-4 h-4" name="delete_outline" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
