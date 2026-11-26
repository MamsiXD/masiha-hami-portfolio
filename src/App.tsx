import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AdminAuthGuard from './components/admin/AdminAuthGuard';
import { PortfolioProvider } from './context/PortfolioContext';
import PortfolioPage from './pages/PortfolioPage';

const AdminOverviewPage = lazy(() => import('./pages/admin/AdminOverviewPage'));
const AdminProjectsPage = lazy(() => import('./pages/admin/AdminProjectsPage'));
const AdminSectionsPage = lazy(() => import('./pages/admin/AdminSectionsPage'));
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage'));
const AdminSkillsPage = lazy(() => import('./pages/admin/AdminSkillsPage'));

function AdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthGuard>
      <Suspense
        fallback={
          <div className="admin-shell bg-surface-dark text-text-muted-dark font-label-code text-label-code min-h-screen flex items-center justify-center">
            Loading Control Panel...
          </div>
        }
      >
        {children}
      </Suspense>
    </AdminAuthGuard>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PortfolioPage />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminOverviewPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/overview"
            element={
              <AdminRoute>
                <AdminOverviewPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/sections"
            element={
              <AdminRoute>
                <AdminSectionsPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/skills"
            element={
              <AdminRoute>
                <AdminSkillsPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/projects"
            element={
              <AdminRoute>
                <AdminProjectsPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <AdminRoute>
                <AdminSettingsPage />
              </AdminRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </PortfolioProvider>
  );
}
