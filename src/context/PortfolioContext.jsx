import { createContext, useContext, useEffect, useState } from 'react';
import { INITIAL_CMS_STATE, PORTFOLIO_DICTIONARY } from '../data/initialData';

const STORAGE_KEY_CMS = 'portfolio_cms_state_v1';
const STORAGE_KEY_THEME = 'portfolio_theme';
const STORAGE_KEY_LANG = 'portfolio_lang';

const PortfolioContext = createContext(null);

function safeGetItem(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore storage quota or security restrictions
  }
}

function safeRemoveItem(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore storage restrictions
  }
}

function loadInitialCMS() {
  try {
    const raw = safeGetItem(STORAGE_KEY_CMS);
    if (!raw) return INITIAL_CMS_STATE;
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_CMS_STATE,
      ...parsed,
      sections: parsed.sections?.length ? parsed.sections : INITIAL_CMS_STATE.sections,
      skills: parsed.skills?.length ? parsed.skills : INITIAL_CMS_STATE.skills,
      orbitalSkills: parsed.orbitalSkills?.length
        ? parsed.orbitalSkills
        : INITIAL_CMS_STATE.orbitalSkills,
      projects: parsed.projects?.length ? parsed.projects : INITIAL_CMS_STATE.projects,
      auditLogs: parsed.auditLogs?.length ? parsed.auditLogs : INITIAL_CMS_STATE.auditLogs,
      contactMessages: parsed.contactMessages ?? [],
    };
  } catch {
    return INITIAL_CMS_STATE;
  }
}

function makeShortHash() {
  return Math.random().toString(16).slice(2, 9);
}

export function PortfolioProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = safeGetItem(STORAGE_KEY_THEME);
    return saved === 'light' ? 'light' : 'dark';
  });

  const [language, setLanguageState] = useState(() => {
    const saved = safeGetItem(STORAGE_KEY_LANG);
    return saved === 'fa' ? 'fa' : 'en';
  });

  const [rtlSimulated, setRtlSimulated] = useState(false);
  const [cms, setCms] = useState(loadInitialCMS);

  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    safeSetItem(STORAGE_KEY_THEME, theme);
  }, [theme]);

  useEffect(() => {
    const html = document.documentElement;
    const effectiveRtl = language === 'fa' || rtlSimulated;
    html.setAttribute('dir', effectiveRtl ? 'rtl' : 'ltr');
    html.setAttribute('lang', language);
    safeSetItem(STORAGE_KEY_LANG, language);
  }, [language, rtlSimulated]);

  useEffect(() => {
    safeSetItem(STORAGE_KEY_CMS, JSON.stringify(cms));
  }, [cms]);

  const appendLog = (prev, entry) => {
    const newEntry = {
      ...entry,
      id: `log-${Date.now()}`,
      timeAgo: 'Just now',
    };
    return [newEntry, ...prev.auditLogs].slice(0, 12);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setLanguage = (lang) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'en' ? 'fa' : 'en'));
  };

  const t = (key) => {
    return PORTFOLIO_DICTIONARY[language][key] ?? PORTFOLIO_DICTIONARY.en[key] ?? key;
  };

  const toggleSectionVisibility = (id) => {
    setCms((prev) => {
      const target = prev.sections.find((s) => s.id === id);
      if (!target) return prev;
      const nextVisible = !target.visible;
      return {
        ...prev,
        sections: prev.sections.map((s) =>
          s.id === id ? { ...s, visible: nextVisible } : s
        ),
        auditLogs: appendLog(prev, {
          icon: 'view_quilt',
          iconColorClass: 'text-accent-teal',
          title: `Section ${target.title} → ${nextVisible ? 'Active' : 'Hidden'}`,
          detailPrefix: 'Layout node: ',
          detailHighlight: `${target.anchor} (${nextVisible ? 'visible' : 'hidden'})`,
          detailHighlightClass: 'text-accent-teal',
        }),
      };
    });
  };

  const reorderSections = (fromIndex, toIndex) => {
    setCms((prev) => {
      if (
        fromIndex === toIndex ||
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= prev.sections.length ||
        toIndex >= prev.sections.length
      ) {
        return prev;
      }
      const next = [...prev.sections];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return {
        ...prev,
        sections: next,
        auditLogs: appendLog(prev, {
          icon: 'swap_vert',
          iconColorClass: 'text-primary',
          title: `Reordered Section: ${moved.title}`,
          detailPrefix: 'Flow position: ',
          detailHighlight: `#${fromIndex + 1} → #${toIndex + 1}`,
          detailHighlightClass: 'text-on-surface',
        }),
      };
    });
  };

  const addCustomSection = (title, anchor, contentEn) => {
    const ts = Date.now();
    const cleanAnchor = anchor.startsWith('#') ? anchor : `#${anchor}`;
    const newSec = {
      id: `custom-${ts}`,
      title: title.trim() || 'Custom Showcase Block',
      anchor: cleanAnchor.replace(/\s+/g, '-').toLowerCase(),
      portfolioSectionId: `custom-${ts}`,
      visible: true,
      isCustom: true,
      customContentEn:
        contentEn?.trim() ||
        'Custom portfolio section managed directly from the Portfolio Control Panel.',
      customContentFa:
        'بخش سفارشی پورتفولیو که به صورت مستقیم از پنل مدیریت محتوا کنترل می‌شود.',
    };
    setCms((prev) => ({
      ...prev,
      sections: [...prev.sections, newSec],
      auditLogs: appendLog(prev, {
        icon: 'add_box',
        iconColorClass: 'text-accent-teal',
        title: `Added Custom Section: ${newSec.title}`,
        detailPrefix: 'Anchor node: ',
        detailHighlight: newSec.anchor,
        detailHighlightClass: 'text-accent-teal',
      }),
    }));
  };

  const removeSection = (id) => {
    setCms((prev) => ({
      ...prev,
      sections: prev.sections.filter((s) => s.id !== id),
    }));
  };

  const toggleSkillVisibility = (id) => {
    setCms((prev) => {
      const target = prev.skills.find((s) => s.id === id);
      if (!target) return prev;
      const nextVisible = !target.visible;
      return {
        ...prev,
        skills: prev.skills.map((s) =>
          s.id === id ? { ...s, visible: nextVisible } : s
        ),
        auditLogs: appendLog(prev, {
          icon: 'visibility',
          iconColorClass: 'text-primary',
          title: `Toggled Skill: ${target.name} → ${nextVisible ? 'Visible' : 'Hidden'}`,
          detailPrefix: 'State mutated: ',
          detailHighlight: nextVisible ? 'inactive → active' : 'active → inactive',
          detailHighlightClass: 'text-accent-teal',
        }),
      };
    });
  };

  const toggleOrbitalSkill = (id) => {
    setCms((prev) => {
      const target = prev.orbitalSkills.find((s) => s.id === id);
      if (!target) return prev;
      const nextActive = !target.active;
      return {
        ...prev,
        orbitalSkills: prev.orbitalSkills.map((s) =>
          s.id === id ? { ...s, active: nextActive } : s
        ),
        auditLogs: appendLog(prev, {
          icon: 'hub',
          iconColorClass: 'text-accent-teal',
          title: `Orbital Skill: ${target.label} → ${nextActive ? 'Pinned' : 'Removed'}`,
          detailPrefix: 'Hero ring state: ',
          detailHighlight: nextActive ? 'visible' : 'hidden',
          detailHighlightClass: 'text-accent-teal',
        }),
      };
    });
  };

  const toggleProjectFeatured = (id) => {
    setCms((prev) => {
      const target = prev.projects.find((p) => p.id === id);
      if (!target) return prev;
      const nextFeatured = !target.featured;
      return {
        ...prev,
        projects: prev.projects.map((p) =>
          p.id === id ? { ...p, featured: nextFeatured } : p
        ),
        auditLogs: appendLog(prev, {
          icon: 'star',
          iconColorClass: 'text-accent-teal',
          title: `${nextFeatured ? 'Featured' : 'Unfeatured'} Project: ${target.titleEn}`,
          detailPrefix: 'Commit SHA: ',
          detailHighlight: makeShortHash(),
          detailHighlightClass: 'text-on-surface',
          detailSuffix: ` • Showcase pin ${nextFeatured ? 'enabled' : 'disabled'}`,
        }),
      };
    });
  };

  const toggleProjectVisibility = (id) => {
    setCms((prev) => {
      const target = prev.projects.find((p) => p.id === id);
      if (!target) return prev;
      const nextVisible = !target.publiclyVisible;
      return {
        ...prev,
        projects: prev.projects.map((p) =>
          p.id === id
            ? {
                ...p,
                publiclyVisible: nextVisible,
                statusBadge: nextVisible
                  ? p.featured
                    ? 'PUBLIC'
                    : 'LIVE'
                  : 'DRAFT',
              }
            : p
        ),
        auditLogs: appendLog(prev, {
          icon: nextVisible ? 'publish' : 'visibility_off',
          iconColorClass: 'text-primary',
          title: `${nextVisible ? 'Published' : 'Moved to Draft'}: ${target.titleEn}`,
          detailPrefix: 'Status: ',
          detailHighlight: nextVisible ? 'live on portfolio' : 'draft',
          detailHighlightClass: 'text-accent-teal',
        }),
      };
    });
  };

  const saveProject = (updated) => {
    setCms((prev) => {
      const exists = prev.projects.some((p) => p.id === updated.id);
      const synced = {
        ...updated,
        statusBadge: updated.publiclyVisible
          ? updated.featured
            ? 'PUBLIC'
            : 'LIVE'
          : 'DRAFT',
      };
      const nextProjects = exists
        ? prev.projects.map((p) => (p.id === updated.id ? synced : p))
        : [...prev.projects, synced];
      return {
        ...prev,
        projects: nextProjects,
        auditLogs: appendLog(prev, {
          icon: 'edit_calendar',
          iconColorClass: 'text-accent-teal',
          title: `Updated Project: ${synced.titleEn}`,
          detailPrefix: 'Commit SHA: ',
          detailHighlight: makeShortHash(),
          detailHighlightClass: 'text-on-surface',
          detailSuffix: ' • Synchronized EN/FA metadata',
        }),
      };
    });
  };

  const createProject = () => {
    let idx = cms.projects.length + 1;
    let code = `prj_new_${String(idx).padStart(2, '0')}`;
    while (cms.projects.some((p) => p.id === code || p.codeId === code)) {
      idx += 1;
      code = `prj_new_${String(idx).padStart(2, '0')}`;
    }
    const maxOrder = cms.projects.reduce((max, p) => Math.max(max, p.sortOrder), 0);
    const newProject = {
      id: code,
      codeId: code,
      slug: `/work/project-${idx}`,
      titleEn: `New Project #${idx}`,
      titleFa: `پروژه جدید شماره ${idx}`,
      descriptionEn: 'Fresh portfolio entry configured via the Monochrome Craft CMS editor.',
      descriptionFa: 'پروژه جدید ثبت شده از طریق ویرایشگر پنل مدیریت محتوا.',
      editorDescEn: 'Fresh portfolio entry configured via the Monochrome Craft CMS editor.',
      editorDescFa: 'پروژه جدید ثبت شده از طریق ویرایشگر پنل مدیریت محتوا.',
      tags: ['React', 'JavaScript'],
      adminTags: ['React', 'JavaScript'],
      statusBadge: 'DRAFT',
      publiclyVisible: false,
      featured: false,
      categoryGroup: 'Web Applications',
      sortOrder: maxOrder + 10,
      liveDemoUrl: 'https://masihahami.dev',
      liveDemoLabel: 'Live Demo',
      repoUrl: 'https://github.com/MamsiXD/',
      repoLabel: 'GitHub',
      thumbnailUrl: INITIAL_CMS_STATE.projects[0].thumbnailUrl,
      thumbnailAlt: 'New project preview cover',
      coverFilename: `project_${idx}_cover.webp`,
      coverMeta: '210 KB • Optimized',
      visualVariant: 'custom',
      cardTagEn: 'Web App',
    };
    setCms((prev) => ({
      ...prev,
      projects: [...prev.projects, newProject],
      auditLogs: appendLog(prev, {
        icon: 'add_circle',
        iconColorClass: 'text-accent-teal',
        title: `Created Draft: ${newProject.titleEn}`,
        detailPrefix: 'Commit SHA: ',
        detailHighlight: makeShortHash(),
        detailHighlightClass: 'text-on-surface',
        detailSuffix: ` • ID ${newProject.codeId}`,
      }),
    }));
    return newProject;
  };

  const deleteProject = (id) => {
    setCms((prev) => {
      const target = prev.projects.find((p) => p.id === id);
      return {
        ...prev,
        projects: prev.projects.filter((p) => p.id !== id),
        auditLogs: target
          ? appendLog(prev, {
              icon: 'delete_outline',
              iconColorClass: 'text-error',
              title: `Removed Project: ${target.titleEn}`,
              detailPrefix: 'Archive ID: ',
              detailHighlight: target.codeId,
              detailHighlightClass: 'text-on-surface',
            })
          : prev.auditLogs,
      };
    });
  };

  const reorderProjects = (fromIndex, toIndex) => {
    setCms((prev) => {
      if (
        fromIndex === toIndex ||
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= prev.projects.length ||
        toIndex >= prev.projects.length
      ) {
        return prev;
      }
      const next = [...prev.projects];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return {
        ...prev,
        projects: next.map((project, idx) => ({
          ...project,
          sortOrder: (idx + 1) * 10,
        })),
      };
    });
  };

  const updateHeroStatus = (statusEn, statusFa) => {
    setCms((prev) => ({
      ...prev,
      heroStatusEn: statusEn.trim() || prev.heroStatusEn,
      heroStatusFa: statusFa?.trim() || prev.heroStatusFa,
      auditLogs: appendLog(prev, {
        icon: 'badge',
        iconColorClass: 'text-accent-teal',
        title: `Updated Hero Headline: ${statusEn.trim()}`,
        detailPrefix: 'Session synced: ',
        detailHighlight: 'live',
        detailHighlightClass: 'text-accent-teal',
      }),
    }));
  };

  const updateContactEmail = (email) => {
    const trimmed = email.trim();
    if (!trimmed) return;
    setCms((prev) => ({
      ...prev,
      email: trimmed,
      auditLogs:
        trimmed !== prev.email
          ? appendLog(prev, {
              icon: 'alternate_email',
              iconColorClass: 'text-accent-teal',
              title: `Updated Contact Email: ${trimmed}`,
              detailPrefix: 'Channel synced: ',
              detailHighlight: 'live',
              detailHighlightClass: 'text-accent-teal',
            })
          : prev.auditLogs,
    }));
  };

  const addContactMessage = (name, email, message) => {
    setCms((prev) => ({
      ...prev,
      contactMessages: [
        {
          id: `msg-${Date.now()}`,
          name,
          email,
          message,
          createdAt: new Date().toISOString(),
        },
        ...prev.contactMessages,
      ],
    }));
  };

  const resetCMSState = () => {
    setCms(INITIAL_CMS_STATE);
    safeRemoveItem(STORAGE_KEY_CMS);
  };

  return (
    <PortfolioContext.Provider
      value={{
        theme,
        toggleTheme,
        language,
        setLanguage,
        toggleLanguage,
        rtlSimulated,
        setRtlSimulated,
        t,
        cms,
        toggleSectionVisibility,
        reorderSections,
        addCustomSection,
        removeSection,
        toggleSkillVisibility,
        toggleOrbitalSkill,
        toggleProjectFeatured,
        toggleProjectVisibility,
        saveProject,
        createProject,
        deleteProject,
        reorderProjects,
        updateHeroStatus,
        updateContactEmail,
        addContactMessage,
        resetCMSState,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return ctx;
}
