import SvgIcon from '../../components/SvgIcon';
import AdminLayout from '../../components/admin/AdminLayout';
import { usePortfolio } from '../../context/PortfolioContext';

export default function AdminSkillsPage() {
  const { cms, toggleSkillVisibility, toggleOrbitalSkill } = usePortfolio();

  const visibleGridCount = cms.skills.filter((s) => s.visible).length;
  const activeOrbitalCount = cms.orbitalSkills.filter((o) => o.active).length;

  return (
    <AdminLayout breadcrumb="Skills">
      <div className="flex flex-col w-full px-4 md:px-0 pt-4 pb-space-xl gap-space-lg">
        <div className="flex flex-col gap-space-sm">
          <div className="flex items-center gap-1.5 font-label-code text-label-code text-accent-teal">
            <span className="inline-block w-2 h-2 rounded-full bg-accent-teal animate-pulse"></span>
            <span>CMS_STACK::SKILLS_MATRIX</span>
          </div>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-medium tracking-tight">
            Tools &amp; Tech Constellation
          </h1>
          <div className="flex flex-wrap items-center gap-space-sm font-label-caps text-label-caps uppercase text-text-muted-dark">
            <span className="text-primary font-medium">
              {visibleGridCount}/{cms.skills.length} Grid Active
            </span>
            <span>•</span>
            <span className="text-accent-teal">{activeOrbitalCount} Orbital Pinned</span>
          </div>
        </div>

        {/* Orbital Ring Skills */}
        <div className="rounded-xl bg-surface-container-low p-space-sm flex flex-col gap-2.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps text-text-muted-dark uppercase tracking-wider">
              Orbital Ring Skills
            </span>
            <span className="font-label-code text-label-code text-text-muted-dark">
              {activeOrbitalCount} of {cms.orbitalSkills.length} visible
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {cms.orbitalSkills.map((pill) => (
              <button
                key={pill.id}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-[0.75rem] font-label-code text-label-code transition-all active:scale-95 cursor-pointer ${
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

        {/* Public Grid Skills Matrix */}
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps text-text-muted-dark uppercase tracking-wider">
              Portfolio Stack Tiles
            </span>
            <span className="font-label-code text-label-code text-accent-teal">
              live visibility
            </span>
          </div>

          <div className="rounded-xl bg-surface-container-low p-space-sm grid grid-cols-1 sm:grid-cols-2 gap-1.5 shadow-sm">
            {cms.skills.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-surface-dark flex items-center justify-center font-label-code text-label-code text-primary shrink-0">
                    {skill.symbol}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-body-sm text-body-sm text-primary font-medium truncate">
                      {skill.name}
                    </span>
                    <span className="font-label-code text-[11px] text-text-muted-dark uppercase">
                      {skill.category}
                    </span>
                  </div>
                </div>

                <button
                  aria-pressed={skill.visible}
                  aria-label={`Toggle ${skill.name}`}
                  dir="ltr"
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-[0.75rem] transition-colors ${
                    skill.visible ? 'bg-accent-teal' : 'bg-surface-container-highest'
                  }`}
                  onClick={() => toggleSkillVisibility(skill.id)}
                  type="button"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-[0.75rem] bg-surface-dark transition-transform m-0.5 ${
                      skill.visible ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                  ></span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
