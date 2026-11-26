export type Language = 'en' | 'fa';
export type ThemeMode = 'dark' | 'light';

export type SkillCategory = 'frontend' | 'styling' | 'tools';

export interface PortfolioSkill {
  id: string;
  name: string;
  symbol: string;
  category: SkillCategory;
  accentBg: string;
  accentText: string;
  hoverBorder: string;
  symbolSizeClass: string;
  visible: boolean;
}

export interface OrbitalSkillPill {
  id: string;
  label: string;
  active: boolean;
}

export interface LayoutSection {
  id: string;
  title: string;
  anchor: string;
  portfolioSectionId: 'hero' | 'about' | 'skills' | 'projects' | 'experience' | 'certificates' | 'contact' | string;
  visible: boolean;
  isCustom?: boolean;
  customContentEn?: string;
  customContentFa?: string;
}

export type ProjectCategoryGroup =
  | 'Web Applications'
  | 'Micro-Frontends'
  | 'Creative Canvas / 3D'
  | 'Infrastructure & Tooling';

export interface ProjectItem {
  id: string;
  codeId: string;
  slug: string;
  titleEn: string;
  titleFa: string;
  descriptionEn: string;
  descriptionFa: string;
  editorDescEn: string;
  editorDescFa: string;
  tags: string[];
  adminTags: string[];
  statusBadge: 'PUBLIC' | 'LIVE' | 'DRAFT';
  publiclyVisible: boolean;
  featured: boolean;
  categoryGroup: ProjectCategoryGroup;
  sortOrder: number;
  liveDemoUrl: string;
  liveDemoLabel: string;
  repoUrl: string;
  repoLabel: string;
  thumbnailUrl: string;
  thumbnailAlt: string;
  coverFilename: string;
  coverMeta: string;
  visualVariant: 'browser' | 'ecommerce' | 'compact' | 'custom';
  cardTagEn?: string;
}

export interface AuditLogEntry {
  id: string;
  icon: string;
  iconColorClass: string;
  title: string;
  timeAgo: string;
  detailPrefix: string;
  detailHighlight: string;
  detailHighlightClass: string;
  detailSuffix?: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface PortfolioCMSState {
  heroStatusEn: string;
  heroStatusFa: string;
  email: string;
  sections: LayoutSection[];
  skills: PortfolioSkill[];
  orbitalSkills: OrbitalSkillPill[];
  projects: ProjectItem[];
  auditLogs: AuditLogEntry[];
  contactMessages: ContactSubmission[];
}
