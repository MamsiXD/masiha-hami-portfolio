import { Link, NavLink } from 'react-router-dom';
import { usePortfolio } from '../../context/PortfolioContext';
import SvgIcon from '../SvgIcon';
import { useAdminAuth } from './AdminAuthGuard';

const NAV_ITEMS = [
  { to: '/admin', end: true, icon: 'dashboard', label: 'Overview', pathKey: 'overview' },
  { to: '/admin/sections', end: false, icon: 'view_quilt', label: 'Sections', pathKey: 'sections' },
  { to: '/admin/skills', end: false, icon: 'terminal', label: 'Skills', pathKey: 'skills' },
  { to: '/admin/projects', end: false, icon: 'folder_code', label: 'Projects', pathKey: 'projects' },
  { to: '/admin/settings', end: false, icon: 'tune', label: 'Settings', pathKey: 'settings' },
];

export default function AdminLayout({ breadcrumb, children }) {
  const { theme, toggleTheme } = usePortfolio();
  const { logout } = useAdminAuth();

  return (
    <div className="admin-shell bg-surface-dark font-body-md text-on-surface flex flex-col min-h-screen w-full">
      {/* Fixed Top Admin Header */}
      <header className="fixed top-0 inset-x-0 z-50 bg-surface-dark/85 backdrop-blur-xl pt-safe shadow-[0_1px_8px_rgba(0,0,0,0.4)]">
        <div className="max-w-6xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-xs min-w-0">
            <Link
              aria-label="Public Portfolio"
              className="w-11 h-11 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors shrink-0"
              to="/"
            >
              <SvgIcon className="w-[20px] h-[20px]" name="arrow_outward" />
            </Link>
            <div className="flex items-center gap-1.5 font-label-code text-label-code truncate">
              <span className="text-text-muted-dark">admin</span>
              <span className="text-on-surface-variant">/</span>
              <span className="text-primary font-medium truncate">{breadcrumb}</span>
            </div>
          </div>

          <div className="flex items-center gap-space-xs shrink-0">
            <button
              aria-label="Toggle Theme"
              className="w-11 h-11 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
              onClick={toggleTheme}
              type="button"
            >
              <SvgIcon
                className="w-[20px] h-[20px]"
                name={theme === 'dark' ? 'dark_mode' : 'light_mode'}
              />
            </button>
            <button
              aria-label="Sign out and lock Admin CMS"
              className="w-11 h-11 flex items-center justify-center text-on-surface-variant hover:text-error transition-colors cursor-pointer"
              onClick={logout}
              title="Lock & Sign Out"
              type="button"
            >
              <SvgIcon className="w-[20px] h-[20px]" name="logout" />
            </button>
            <Link
              aria-label="Admin Profile & Settings"
              className="w-8 h-8 rounded-[0.75rem] bg-primary flex items-center justify-center hover:opacity-90 transition-opacity"
              to="/admin/settings"
            >
              <SvgIcon className="w-[18px] h-[18px] text-on-primary" name="person" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area with Responsive Desktop Sidebar */}
      <div className="w-full max-w-6xl mx-auto pt-16 pb-24 md:pb-12 flex flex-1 gap-6 md:px-6">
        <aside className="hidden md:flex flex-col w-56 shrink-0 pt-4">
          <nav className="sticky top-20 rounded-xl bg-surface-container-low p-2 flex flex-col gap-1 shadow-sm">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.pathKey}
                to={item.to}
                end={item.end}
                data-path={item.pathKey}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-label-code text-label-code transition-colors ${
                    isActive
                      ? 'bg-primary text-on-primary font-medium shadow-sm'
                      : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high'
                  }`
                }
              >
                <SvgIcon className="w-[18px] h-[18px]" name={item.icon} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="flex flex-col relative w-full min-w-0 bg-surface-dark flex-1">
          {children}
        </main>
      </div>

      {/* Fixed Bottom Tab Bar (Mobile) */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-50 pb-safe bg-surface-dark/90 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.45)]"
        data-active-classes="text-primary"
      >
        <div className="max-w-3xl mx-auto flex justify-around items-center h-16 px-space-xs">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.pathKey}
              to={item.to}
              end={item.end}
              data-path={item.pathKey}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center min-w-[52px] h-14 transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-on-surface-variant hover:text-primary'
                }`
              }
            >
              <SvgIcon className="w-[22px] h-[22px]" name={item.icon} />
              <span className="font-label-caps text-label-caps uppercase mt-0.5">
                {item.label}
              </span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
