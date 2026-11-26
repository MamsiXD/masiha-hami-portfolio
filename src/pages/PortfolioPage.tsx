import React, { useState } from 'react';
import SvgIcon from '../components/SvgIcon';
import { usePortfolio } from '../context/PortfolioContext';
import { LayoutSection, ProjectItem, SkillCategory } from '../types/portfolio';

type SkillFilter = 'all' | SkillCategory;

const ORBITAL_BADGE_SLOTS = [
  { dotClass: 'bg-cyan-400', posClass: 'top-8 left-6 lg:left-10 animate-float-slow' },
  { dotClass: 'bg-orange-500', posClass: 'top-10 right-6 lg:right-10 animate-float-reverse' },
  { dotClass: 'bg-sky-400', posClass: 'top-40 left-0 lg:left-2 animate-float-slow' },
  { dotClass: 'bg-amber-400', posClass: 'top-40 right-0 lg:right-2 animate-float-reverse' },
  { dotClass: 'bg-blue-500', posClass: 'bottom-28 left-4 lg:left-8 animate-float-slow' },
  { dotClass: 'bg-emerald-500', posClass: 'bottom-28 right-4 lg:right-8 animate-float-reverse' },
  { dotClass: 'bg-indigo-400', posClass: 'bottom-10 left-16 lg:left-24 animate-float-slow' },
  { dotClass: 'bg-purple-500', posClass: 'bottom-10 right-16 lg:right-24 animate-float-reverse' },
];

export default function PortfolioPage() {
  const {
    theme,
    toggleTheme,
    language,
    toggleLanguage,
    t,
    cms,
    addContactMessage,
  } = usePortfolio();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [skillFilter, setSkillFilter] = useState<SkillFilter>('all');
  const [copiedEmail, setCopiedEmail] = useState(false);

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  const currentYear = new Date().getFullYear();

  const visibleSkills = cms.skills.filter(
    (skill) => skill.visible && (skillFilter === 'all' || skill.category === skillFilter)
  );

  const activeOrbitalBadges = cms.orbitalSkills
    .filter((pill) => pill.active)
    .map((pill, idx) => ({
      ...pill,
      ...ORBITAL_BADGE_SLOTS[idx % ORBITAL_BADGE_SLOTS.length],
    }));

  const publicProjects = [...cms.projects]
    .filter((p) => p.publiclyVisible)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const navLinks = cms.sections
    .filter((sec) => sec.visible)
    .flatMap((sec) => {
      switch (sec.portfolioSectionId) {
        case 'hero':
          return [{ href: '#about', label: t('menu_about') }];
        case 'skills':
          return [{ href: '#skills', label: t('menu_skills') }];
        case 'projects':
          return [{ href: '#projects', label: t('menu_projects') }];
        case 'experience':
          return [{ href: '#experience', label: t('menu_experience') }];
        case 'certificates':
          return [{ href: '#certificates', label: t('menu_certificates') }];
        case 'contact':
          return [{ href: '#contact', label: t('menu_contact') }];
        default:
          return [{ href: `#${sec.anchor.replace(/^#+/, '')}`, label: sec.title }];
      }
    });

  const handleCopyEmail = () => {
    const fallbackCopy = () => {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = cms.email;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch {
        // ignore if execCommand fails
      }
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    };

    if (navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(cms.email)
        .then(() => {
          setCopiedEmail(true);
          setTimeout(() => setCopiedEmail(false), 2000);
        })
        .catch(fallbackCopy);
    } else {
      fallbackCopy();
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) return;
    addContactMessage(contactName.trim(), contactEmail.trim(), contactMessage.trim());
    setContactName('');
    setContactEmail('');
    setContactMessage('');
    setFormSuccess(true);
    setTimeout(() => setFormSuccess(false), 4000);
  };

  const renderProjectCard = (project: ProjectItem) => {
    const title = language === 'fa' ? project.titleFa : project.titleEn;
    const desc = language === 'fa' ? project.descriptionFa : project.descriptionEn;
    const featuredLabel = language === 'fa' ? 'پروژه منتخب' : 'Featured Project';
    const sourceLabel =
      project.repoLabel || (language === 'fa' ? 'سورس کد' : 'Source Code');
    const previewLabel =
      project.liveDemoLabel || (language === 'fa' ? 'پیش‌نمایش زنده' : 'Live Preview');

    const renderProjectLinks = () => {
      if (!project.repoUrl && !project.liveDemoUrl) return null;
      return (
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold mt-auto">
          {project.repoUrl && (
            <a
              className="text-slate-700 dark:text-slate-300 hover:text-sky-500 flex items-center gap-1"
              href={project.repoUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span>{sourceLabel}</span>
              <span className="text-slate-400">{language === 'fa' ? '←' : '→'}</span>
            </a>
          )}
          {project.repoUrl && project.liveDemoUrl && (
            <span className="text-slate-300 dark:text-slate-700">•</span>
          )}
          {project.liveDemoUrl && (
            <a
              className="text-sky-500 hover:underline"
              href={project.liveDemoUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              {previewLabel}
            </a>
          )}
        </div>
      );
    };

    if (project.visualVariant === 'browser') {
      return (
        <article
          key={project.id}
          className="glass-card rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-lg flex flex-col"
        >
          <div className="relative h-44 bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 p-4 flex flex-col justify-between overflow-hidden border-b border-slate-800/60">
            <div className="flex justify-between items-start">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-white/10 text-slate-200 backdrop-blur-md">
                {project.featured ? featuredLabel : project.cardTagEn || 'Web App'}
              </span>
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/80 text-xs">
                ↗
              </div>
            </div>
            <div className="w-full bg-slate-900/80 rounded-lg p-3 border border-white/10 shadow-inner">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="w-2 h-2 rounded-full bg-red-500/80"></span>
                <span className="w-2 h-2 rounded-full bg-yellow-500/80"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-500/80"></span>
                <span className="text-[9px] font-mono text-slate-400 ms-2 truncate">
                  portfolio-cms.local
                </span>
              </div>
              <div className="space-y-1">
                <div className="h-2 w-3/4 bg-slate-700/60 rounded"></div>
                <div className="h-2 w-1/2 bg-sky-500/40 rounded"></div>
              </div>
            </div>
          </div>

          <div className="p-5 flex-1 flex flex-col">
            <h3 className="font-serif text-xl tracking-tight text-slate-900 dark:text-white mb-1.5">
              {title}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              {desc}
            </p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-sky-500/10 text-sky-600 dark:text-sky-400"
                >
                  {tag}
                </span>
              ))}
            </div>
            {renderProjectLinks()}
          </div>
        </article>
      );
    }

    if (project.visualVariant === 'ecommerce') {
      return (
        <article
          key={project.id}
          className="glass-card rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-lg flex flex-col"
        >
          <div className="relative h-44 bg-gradient-to-tr from-slate-900 via-teal-950 to-slate-900 p-4 flex flex-col justify-between overflow-hidden border-b border-slate-800/60">
            <div className="flex justify-between items-start">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-white/10 text-slate-200 backdrop-blur-md">
                {project.featured ? featuredLabel : project.cardTagEn || 'Web App'}
              </span>
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/80 text-xs">
                ↗
              </div>
            </div>
            <div className="w-full bg-slate-900/80 rounded-lg p-3 border border-white/10">
              <div className="grid grid-cols-2 gap-2">
                <div className="h-10 bg-teal-500/20 rounded border border-teal-500/30 flex items-center justify-center text-[10px] font-mono text-teal-300">
                  Catalog
                </div>
                <div className="h-10 bg-slate-800 rounded border border-slate-700 flex items-center justify-center text-[10px] font-mono text-slate-400">
                  Cart (0)
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 flex-1 flex flex-col">
            <h3 className="font-serif text-xl tracking-tight text-slate-900 dark:text-white mb-1.5">
              {title}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              {desc}
            </p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-teal-500/10 text-teal-600 dark:text-teal-400"
                >
                  {tag}
                </span>
              ))}
            </div>
            {renderProjectLinks()}
          </div>
        </article>
      );
    }

    if (project.visualVariant === 'compact') {
      return (
        <article
          key={project.id}
          className="glass-card rounded-2xl border p-5 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-serif text-lg tracking-tight text-slate-900 dark:text-white">
                {title}
              </h3>
              <span className="text-[10px] font-mono text-slate-400 shrink-0">
                {project.cardTagEn || 'WordPress'}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              {desc}
            </p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          {renderProjectLinks()}
        </article>
      );
    }

    // Custom / newly published projects from Admin CMS
    return (
      <article
        key={project.id}
        className="glass-card rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-lg flex flex-col"
      >
        <div className="relative h-40 bg-slate-900 overflow-hidden border-b border-slate-800/60">
          <img
            src={project.thumbnailUrl}
            alt={project.thumbnailAlt}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/30 p-4 flex justify-between items-start">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-white/10 text-slate-200 backdrop-blur-md">
              {project.featured ? featuredLabel : project.cardTagEn || project.categoryGroup}
            </span>
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/80 text-xs">
              ↗
            </div>
          </div>
        </div>
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="font-serif text-xl tracking-tight text-slate-900 dark:text-white mb-1.5">
            {title}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            {desc}
          </p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-sky-500/10 text-sky-600 dark:text-sky-400"
              >
                {tag}
              </span>
            ))}
          </div>
          {renderProjectLinks()}
        </div>
      </article>
    );
  };

  const renderSection = (section: LayoutSection) => {
    if (!section.visible) return null;

    switch (section.portfolioSectionId) {
      case 'hero':
        return (
          <React.Fragment key={section.id}>
            {/* BEGIN: HeroSection */}
            <section
              className="relative min-h-[480px] md:min-h-[580px] flex flex-col items-center justify-center text-center py-10 md:py-14 my-2 md:my-4 overflow-hidden scroll-mt-20"
              data-purpose="hero-concentric-container"
              id="hero"
            >
              {/* Background Concentric Orbital Rings */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
                <div className="orbit-ring w-[180px] h-[180px] sm:w-[230px] sm:h-[230px] md:w-[260px] md:h-[260px]"></div>
                <div className="orbit-ring w-[260px] h-[260px] sm:w-[340px] sm:h-[340px] md:w-[380px] md:h-[380px]"></div>
                <div className="orbit-ring w-[340px] h-[340px] sm:w-[450px] sm:h-[450px] md:w-[500px] md:h-[500px]"></div>
                <div className="orbit-ring hidden sm:block sm:w-[560px] sm:h-[560px] md:w-[620px] md:h-[620px]"></div>
                <div className="absolute w-64 h-64 sm:w-80 sm:h-80 bg-sky-500/5 dark:bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
              </div>

              {/* Desktop / Tablet Orbital Floating Badges */}
              <div className="hidden md:block absolute inset-0 max-w-3xl mx-auto pointer-events-none">
                {activeOrbitalBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`absolute ${badge.posClass} pill-badge px-3 py-1.5 rounded-2xl glass-card flex items-center gap-1.5 shadow-sm text-xs font-medium pointer-events-auto`}
                  >
                    <span className={`w-2 h-2 rounded-full ${badge.dotClass}`}></span>
                    <span>{badge.label}</span>
                  </div>
                ))}
              </div>

              {/* Center Hero Core Typography & Call to Action */}
              <div className="relative z-10 px-4 max-w-sm sm:max-w-md flex flex-col items-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/60 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700/60 text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>{language === 'fa' ? cms.heroStatusFa : cms.heroStatusEn}</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-light tracking-tight leading-tight mb-2">
                  <span>{t('hero_salutation')}</span>
                  <span className="font-serif italic font-normal tracking-normal text-slate-900 dark:text-white block mt-1">
                    {t('hero_name')}
                  </span>
                </h1>

                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal tracking-wide mt-2 mb-8 leading-relaxed">
                  {t('hero_subtitle')}
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full sm:w-auto sm:min-w-[300px]">
                  <a
                    className="flex-1 py-2.5 px-5 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold flex items-center justify-center gap-1.5 whitespace-nowrap shadow-sm hover:opacity-90 active:scale-95 transition-all"
                    href="#projects"
                  >
                    <span>{t('hero_btn_projects')}</span>
                    <SvgIcon className="w-3.5 h-3.5" name="arrow-down" />
                  </a>
                  <a
                    className="flex-1 py-2.5 px-5 rounded-full glass-card border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1.5 whitespace-nowrap hover:bg-slate-200/50 dark:hover:bg-slate-800/50 active:scale-95 transition-all"
                    href="#contact"
                  >
                    <span>{t('hero_btn_contact')}</span>
                  </a>
                </div>

                {/* Mobile Orbital Pills Constellation (non-overlapping on < md screens) */}
                {activeOrbitalBadges.length > 0 && (
                  <div className="md:hidden flex flex-wrap items-center justify-center gap-2 mt-8">
                    {activeOrbitalBadges.map((badge) => (
                      <div
                        key={badge.id}
                        className="pill-badge px-2.5 py-1 rounded-2xl glass-card flex items-center gap-1.5 shadow-sm text-[11px] font-medium"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dotClass}`}></span>
                        <span>{badge.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
            {/* END: HeroSection */}

            {/* BEGIN: AboutSection */}
            <section
              className="py-12 border-t border-slate-200 dark:border-slate-800/80 scroll-mt-20"
              data-purpose="about-section"
              id="about"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
                <h2 className="font-serif text-3xl italic tracking-tight font-normal">
                  {t('section_about')}
                </h2>
                <span className="text-xs uppercase tracking-widest text-slate-400 font-mono">
                  01 // Profile
                </span>
              </div>

              <div className="glass-card rounded-2xl p-5 mb-4 shadow-sm border space-y-3">
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {t('about_p1')}
                </p>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {t('about_p2')}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
                <div className="glass-card rounded-xl p-3 border min-w-0">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono tracking-wider mb-1">
                    {t('info_focus_label')}
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">
                    {t('info_focus_val')}
                  </span>
                </div>
                <div className="glass-card rounded-xl p-3 border min-w-0">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono tracking-wider mb-1">
                    {t('info_lang_label')}
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">
                    {t('info_lang_val')}
                  </span>
                </div>
                <div className="glass-card rounded-xl p-3 border min-w-0">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono tracking-wider mb-1">
                    {t('info_status_label')}
                  </span>
                  <span className="font-semibold text-emerald-500 block truncate">
                    {t('info_status_val')}
                  </span>
                </div>
                <div className="glass-card rounded-xl p-3 border min-w-0">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono tracking-wider mb-1">
                    {t('info_role_label')}
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">
                    {t('info_role_val')}
                  </span>
                </div>
              </div>
            </section>
            {/* END: AboutSection */}
          </React.Fragment>
        );

      case 'skills':
        return (
          <section
            key={section.id}
            className="py-12 border-t border-slate-200 dark:border-slate-800/80 scroll-mt-20"
            data-purpose="skills-section"
            id="skills"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
              <h2 className="font-serif text-3xl italic tracking-tight font-normal">
                {t('section_skills')}
              </h2>
              <span className="text-xs uppercase tracking-widest text-slate-400 font-mono">
                02 // Stack
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              {t('skills_desc')}
            </p>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 mb-6 overflow-x-auto pb-1 no-scrollbar text-xs">
              {(
                [
                  { id: 'all', key: 'filter_all' },
                  { id: 'frontend', key: 'filter_frontend' },
                  { id: 'styling', key: 'filter_styling' },
                  { id: 'tools', key: 'filter_tools' },
                ] as const
              ).map((tab) => {
                const active = skillFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    className={`skill-filter-btn px-3 py-1 rounded-full font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      active
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                        : 'bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                    onClick={() => setSkillFilter(tab.id)}
                    type="button"
                  >
                    {t(tab.key)}
                  </button>
                );
              })}
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3" id="skillsContainer">
              {visibleSkills.map((skill) => (
                <div
                  key={skill.id}
                  className={`skill-card glass-card rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 border ${skill.hoverBorder} transition-all group`}
                  data-category={skill.category}
                >
                  <div
                    className={`w-10 h-10 rounded-xl ${skill.accentBg} ${skill.accentText} flex items-center justify-center font-mono font-bold ${skill.symbolSizeClass} group-hover:scale-110 transition-transform`}
                  >
                    {skill.symbol}
                  </div>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
          </section>
        );

      case 'projects':
        return (
          <section
            key={section.id}
            className="py-12 border-t border-slate-200 dark:border-slate-800/80 scroll-mt-20"
            data-purpose="projects-section"
            id="projects"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
              <h2 className="font-serif text-3xl italic tracking-tight font-normal">
                {t('section_projects')}
              </h2>
              <span className="text-xs uppercase tracking-widest text-slate-400 font-mono">
                03 // Work
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              {t('projects_desc')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {publicProjects.map((project) => renderProjectCard(project))}
            </div>
          </section>
        );

      case 'experience':
        return (
          <section
            key={section.id}
            className="py-12 border-t border-slate-200 dark:border-slate-800/80 scroll-mt-20"
            data-purpose="experience-section"
            id="experience"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
              <h2 className="font-serif text-3xl italic tracking-tight font-normal">
                {t('section_experience')}
              </h2>
              <span className="text-xs uppercase tracking-widest text-slate-400 font-mono">
                04 // Career
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              {t('experience_desc')}
            </p>

            <div className="space-y-4">
              <div className="glass-card rounded-2xl p-5 border relative overflow-hidden">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                      {t('exp_role_1')}
                    </h3>
                    <p className="text-xs text-sky-500 font-medium">
                      {t('exp_company_1')}
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 shrink-0">
                    {t('exp_date_1')}
                  </span>
                </div>
                <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 mt-3 list-disc ps-4 leading-relaxed">
                  <li>{t('exp_bullet_1')}</li>
                  <li>{t('exp_bullet_2')}</li>
                  <li>{t('exp_bullet_3')}</li>
                </ul>
              </div>
            </div>
          </section>
        );

      case 'certificates':
        return (
          <section
            key={section.id}
            className="py-12 border-t border-slate-200 dark:border-slate-800/80 scroll-mt-20"
            data-purpose="certificates-section"
            id="certificates"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
              <h2 className="font-serif text-3xl italic tracking-tight font-normal">
                {t('section_certificates')}
              </h2>
              <span className="text-xs uppercase tracking-widest text-slate-400 font-mono">
                05 // Credentials
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              {t('certificates_desc')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="glass-card rounded-2xl p-4 border flex flex-col justify-between min-h-[9rem]">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center text-xs font-bold">
                    📜
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Verified</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {t('cert_1_name')}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Web Academy • 2023
                  </p>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-4 border flex flex-col justify-between min-h-[9rem]">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-bold">
                    🔍
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Verified</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {t('cert_2_name')}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Digital Institute • 2024
                  </p>
                </div>
              </div>
            </div>
          </section>
        );

      case 'contact':
        return (
          <section
            key={section.id}
            className="py-12 border-t border-slate-200 dark:border-slate-800/80 scroll-mt-20"
            data-purpose="contact-section"
            id="contact"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
              <h2 className="font-serif text-3xl italic tracking-tight font-normal">
                {t('section_contact')}
              </h2>
              <span className="text-xs uppercase tracking-widest text-slate-400 font-mono">
                06 // Connect
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              {t('contact_desc')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
              {/* Verified Direct Channels */}
              <div className="md:col-span-2 glass-card rounded-2xl p-4 border space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-slate-400 shrink-0">✉</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200 truncate">
                      {cms.email}
                    </span>
                  </div>
                  <button
                    className="px-2.5 py-1 text-[11px] rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-sky-500 hover:text-white transition-colors cursor-pointer shrink-0"
                    onClick={handleCopyEmail}
                    type="button"
                  >
                    {copiedEmail ? (language === 'fa' ? 'کپی شد!' : 'Copied!') : t('btn_copy_email')}
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-4">
                    <a
                      className="text-slate-600 dark:text-slate-400 hover:text-sky-500 font-medium flex items-center gap-1"
                      href="https://github.com/MamsiXD/"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <span>GitHub</span>
                      <span className="text-[10px]">(@MamsiXD)</span>
                    </a>
                    <a
                      className="text-slate-600 dark:text-slate-400 hover:text-sky-500 font-medium flex items-center gap-1"
                      href="https://www.linkedin.com/in/masiha-hami-89927142b"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <span>LinkedIn</span>
                    </a>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">@Themamsi</span>
                </div>
              </div>

              {/* Contact Message Form */}
              <form
                className="md:col-span-3 glass-card rounded-2xl p-5 border space-y-4"
                id="contactForm"
                onSubmit={handleContactSubmit}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
                      htmlFor="contactName"
                    >
                      {t('form_name')}
                    </label>
                    <input
                      className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 px-3 py-2 outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                      id="contactName"
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder={language === 'fa' ? 'نام و نام خانوادگی' : 'John Doe'}
                      required
                      type="text"
                      value={contactName}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
                      htmlFor="contactEmail"
                    >
                      {t('form_email')}
                    </label>
                    <input
                      className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 px-3 py-2 outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                      id="contactEmail"
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="you@domain.com"
                      required
                      type="email"
                      value={contactEmail}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
                    htmlFor="contactMessage"
                  >
                    {t('form_msg')}
                  </label>
                  <textarea
                    className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 px-3 py-2 outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                    id="contactMessage"
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder={
                      language === 'fa'
                        ? 'سلام مسیحا، در مورد پروژه صحبت کنیم...'
                        : "Hi Masiha, I'd like to talk about..."
                    }
                    required
                    rows={3}
                    value={contactMessage}
                  />
                </div>

                <button
                  className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold hover:opacity-95 active:scale-95 transition-all cursor-pointer"
                  type="submit"
                >
                  {t('form_submit')}
                </button>

                {formSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs text-center">
                    {t('form_sent_success')}
                  </div>
                )}
              </form>
            </div>
          </section>
        );

      default:
        return (
          <section
            key={section.id}
            className="py-12 border-t border-slate-200 dark:border-slate-800/80 scroll-mt-20"
            id={section.anchor.replace(/^#+/, '')}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
              <h2 className="font-serif text-3xl italic tracking-tight font-normal">
                {section.title}
              </h2>
              <span className="text-xs uppercase tracking-widest text-slate-400 font-mono">
                {section.anchor}
              </span>
            </div>
            <div className="glass-card rounded-2xl p-5 border">
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {language === 'fa'
                  ? section.customContentFa || section.customContentEn
                  : section.customContentEn}
              </p>
            </div>
          </section>
        );
    }
  };

  return (
    <div className="portfolio-shell font-sans">
      {/* BEGIN: MainHeader */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b transition-all duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <a className="flex items-center gap-2.5 group shrink-0" href="#hero">
            <div className="w-8 h-8 rounded-full bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center font-bold text-xs tracking-wider shadow-sm group-hover:scale-105 transition-transform">
              MH
            </div>
            <span className="font-serif text-xl tracking-tight font-medium">
              {t('nav_brand')}
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-5 text-xs font-medium text-slate-600 dark:text-slate-300">
            {navLinks.map((item) => (
              <a
                key={item.href}
                className="hover:text-sky-500 transition-colors whitespace-nowrap"
                href={item.href}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Quick Action Controls (Lang, Theme & Menu) */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              aria-label="Toggle language"
              className="px-2.5 py-1 text-xs font-semibold rounded-full border border-slate-300 dark:border-slate-700 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
              onClick={toggleLanguage}
              type="button"
            >
              <span>{language === 'en' ? 'FA' : 'EN'}</span>
            </button>

            <button
              aria-label="Toggle dark and light mode"
              className="w-8 h-8 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
              onClick={toggleTheme}
              type="button"
            >
              {theme === 'dark' ? (
                <SvgIcon className="w-4 h-4 text-amber-400" name="sun" />
              ) : (
                <SvgIcon className="w-4 h-4 text-slate-700" name="moon" />
              )}
            </button>

            <button
              aria-expanded={mobileMenuOpen}
              aria-label="Open menu"
              className="md:hidden w-8 h-8 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              type="button"
            >
              <SvgIcon className="w-5 h-5" name={mobileMenuOpen ? 'close' : 'menu'} />
            </button>
          </div>
        </div>

        {/* Mobile Slide Sheet Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl px-6 py-5 space-y-4">
            <div className="max-w-4xl mx-auto space-y-4">
              <nav className="flex flex-col space-y-3 font-medium text-sm">
                {navLinks.map((item) => (
                  <a
                    key={item.href}
                    className="text-slate-700 dark:text-slate-200 hover:text-sky-500 transition-colors"
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-2 flex-wrap text-xs text-slate-400">
                <span>{t('menu_availability')}</span>
                <a
                  className="underline text-sky-500"
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('menu_say_hi')}
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
      {/* END: MainHeader */}

      {/* BEGIN: MainContent */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-16 overflow-x-hidden">
        {cms.sections.map((section) => renderSection(section))}
      </main>
      {/* END: MainContent */}

      {/* BEGIN: MainFooter */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 py-8 text-center text-xs text-slate-400">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-2">
          <p className="font-serif italic text-sm text-slate-600 dark:text-slate-300">
            Masiha Hami
          </p>
          <p className="text-[11px]">
            Crafted with passion • Clean Semantic HTML &amp; Tailwind
          </p>
          <p className="text-[10px] font-mono text-slate-500">
            © {currentYear} Masiha Hami. All rights reserved.
          </p>
        </div>
      </footer>
      {/* END: MainFooter */}
    </div>
  );
}
