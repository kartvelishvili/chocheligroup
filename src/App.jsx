
import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import { DesignProvider } from '@/contexts/DesignContext';
import { PaneliAuthProvider, usePaneliAuth } from '@/contexts/PaneliAuthContext';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/Layout';
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedAdminRoute from '@/components/admin/ProtectedAdminRoute';
import ScrollToTop from '@/components/ScrollToTop';

// Pages
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import PortfolioPage from '@/pages/PortfolioPage';
import CompanyDetailPage from '@/pages/CompanyDetailPage'; 
import FounderPageKA from '@/pages/FounderPageKA';
import FounderPageEN from '@/pages/FounderPageEN';
import IndustriesPage from '@/pages/IndustriesPage';
import BrandDetailPage from '@/pages/BrandDetailPage';
import NewsPage from '@/pages/NewsPage';
import NewsDetailPage from '@/pages/NewsDetailPage';
import CareersPage from '@/pages/CareersPage';
import ContactPage from '@/pages/ContactPage';
import ProjectsPage from '@/pages/ProjectsPage';
import ProjectDetailPage from '@/pages/ProjectDetailPage';
import BrandCatalogPage from '@/pages/BrandCatalogPage';
import CustomPage from '@/pages/CustomPage';

// Admin Pages
import AdminLoginPage from '@/pages/admin/AdminLoginPage';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import NewsManager from '@/components/admin/NewsManager';
import CategoriesManager from '@/components/admin/CategoriesManager';
import MenuManager from '@/components/admin/MenuManager';
import CompaniesManager from '@/components/admin/CompaniesManager';
import SiteContentManager from '@/components/admin/SiteContentManager';

// Paneli Pages
import PaneliLogin from '@/pages/paneli/PaneliLogin';
import PaneliLayout from '@/pages/paneli/PaneliLayout';
import PaneliDashboard from '@/pages/paneli/PaneliDashboard';
const PaneliMenu = lazy(() => import('@/pages/paneli/PaneliMenu'));
const PaneliHero = lazy(() => import('@/pages/paneli/PaneliHero'));
const PaneliAboutSection = lazy(() => import('@/pages/paneli/PaneliAboutSection'));
const PaneliPrinciples = lazy(() => import('@/pages/paneli/PaneliPrinciples'));
const PaneliPortfolio = lazy(() => import('@/pages/paneli/PaneliPortfolio'));
const PaneliLeadership = lazy(() => import('@/pages/paneli/PaneliLeadership'));
const PaneliFooter = lazy(() => import('@/pages/paneli/PaneliFooter'));
const PaneliNews = lazy(() => import('@/pages/paneli/PaneliNews'));
const PaneliCategories = lazy(() => import('@/pages/paneli/PaneliCategories'));
const PaneliPageAbout = lazy(() => import('@/pages/paneli/PaneliPageAbout'));
const PaneliPagePortfolio = lazy(() => import('@/pages/paneli/PaneliPagePortfolio'));
const PaneliPageIndustries = lazy(() => import('@/pages/paneli/PaneliPageIndustries'));
const PaneliPageProjects = lazy(() => import('@/pages/paneli/PaneliPageProjects'));
const PaneliPageContact = lazy(() => import('@/pages/paneli/PaneliPageContact'));
const PaneliFounder = lazy(() => import('@/pages/paneli/PaneliFounder'));
const PaneliAdmins = lazy(() => import('@/pages/paneli/PaneliAdmins'));

const PaneliSuspense = ({ children }) => (
  <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" /></div>}>
    {children}
  </Suspense>
);

// Protected paneli route wrapper
const ProtectedPaneliRoute = ({ children }) => {
  const { isAuthenticated, loading } = usePaneliAuth();
  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!isAuthenticated) return <Navigate to="/paneli/login" replace />;
  return children || <Outlet />;
};

function App() {
  useEffect(() => {
    document.title = "Chocheli Investment Group";
  }, []);

  return (
    <Router>
      <DesignProvider>
      <LanguageProvider>
        <AdminAuthProvider>
          <PaneliAuthProvider>
          <ScrollToTop />
          <Routes>
            {/* Admin Routes — Outlet-based so sidebar/header never re-render */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin" element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            }>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="news" element={<NewsManager />} />
              <Route path="categories" element={<CategoriesManager />} />
              <Route path="menu" element={<MenuManager />} />
              <Route path="companies" element={<CompaniesManager />} />
              <Route path="site-content" element={<SiteContentManager />} />
            </Route>

            {/* Paneli Routes */}
            <Route path="/paneli/login" element={<PaneliLogin />} />
            <Route path="/paneli" element={<Navigate to="/paneli/dashboard" replace />} />
            <Route path="/paneli" element={<ProtectedPaneliRoute><PaneliLayout /></ProtectedPaneliRoute>}>
              <Route path="dashboard" element={<PaneliDashboard />} />
              <Route path="menu" element={<PaneliSuspense><PaneliMenu /></PaneliSuspense>} />
              <Route path="hero" element={<PaneliSuspense><PaneliHero /></PaneliSuspense>} />
              <Route path="about-section" element={<PaneliSuspense><PaneliAboutSection /></PaneliSuspense>} />
              <Route path="principles" element={<PaneliSuspense><PaneliPrinciples /></PaneliSuspense>} />
              <Route path="portfolio-section" element={<PaneliSuspense><PaneliPortfolio /></PaneliSuspense>} />
              <Route path="leadership" element={<PaneliSuspense><PaneliLeadership /></PaneliSuspense>} />
              <Route path="footer" element={<PaneliSuspense><PaneliFooter /></PaneliSuspense>} />
              <Route path="news" element={<PaneliSuspense><PaneliNews /></PaneliSuspense>} />
              <Route path="categories" element={<PaneliSuspense><PaneliCategories /></PaneliSuspense>} />
              <Route path="page-about" element={<PaneliSuspense><PaneliPageAbout /></PaneliSuspense>} />
              <Route path="page-portfolio" element={<PaneliSuspense><PaneliPagePortfolio /></PaneliSuspense>} />
              <Route path="page-industries" element={<PaneliSuspense><PaneliPageIndustries /></PaneliSuspense>} />
              <Route path="page-projects" element={<PaneliSuspense><PaneliPageProjects /></PaneliSuspense>} />
              <Route path="page-contact" element={<PaneliSuspense><PaneliPageContact /></PaneliSuspense>} />
              <Route path="founder" element={<PaneliSuspense><PaneliFounder /></PaneliSuspense>} />
              <Route path="admins" element={<PaneliSuspense><PaneliAdmins /></PaneliSuspense>} />
            </Route>

            {/* Public Routes */}
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/about" element={<Layout><AboutPage /></Layout>} />
            <Route path="/portfolio" element={<Layout><PortfolioPage /></Layout>} />
            
            <Route path="/company/:id" element={<CompanyDetailPage />} /> 
            <Route path="/founder" element={<FounderPageKA />} />
            <Route path="/founder-en" element={<FounderPageEN />} />
            <Route path="/industries" element={<IndustriesPage />} />
            <Route path="/brand/:id" element={<BrandDetailPage />} />
            <Route path="/brand-catalog" element={<BrandCatalogPage />} />
            
            <Route path="/news" element={<Layout><NewsPage /></Layout>} />
            <Route path="/news/:slug" element={<Layout><NewsDetailPage /></Layout>} />
            
            <Route path="/ka/news" element={<Navigate to="/news" replace />} />
            <Route path="/en/news" element={<Navigate to="/news" replace />} />

            <Route path="/projects" element={<Layout><ProjectsPage /></Layout>} />
            <Route path="/project/:id" element={<Layout><ProjectDetailPage /></Layout>} />
            <Route path="/careers" element={<Layout><CareersPage /></Layout>} />
            <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
            <Route path="/page/:slug" element={<Layout><CustomPage /></Layout>} />
          </Routes>
          <Toaster />
          </PaneliAuthProvider>
        </AdminAuthProvider>
      </LanguageProvider>
      </DesignProvider>
    </Router>
  );
}

export default App;
