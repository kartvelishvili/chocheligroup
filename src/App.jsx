
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import { DesignProvider } from '@/contexts/DesignContext';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/Layout';
import AdminLayout from '@/components/admin/AdminLayout'; // Import AdminLayout
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
import NewsManager from '@/components/admin/NewsManager'; // Reuse existing manager in dashboard or separate route
import CategoriesManager from '@/components/admin/CategoriesManager';
import MenuManager from '@/components/admin/MenuManager';
import CompaniesManager from '@/components/admin/CompaniesManager';
import SiteContentManager from '@/components/admin/SiteContentManager';
import DesignManager from '@/components/admin/DesignManager';

function App() {
  useEffect(() => {
    document.title = "Chocheli Investment Group";
  }, []);

  return (
    <Router>
      <DesignProvider>
      <LanguageProvider>
        <AdminAuthProvider>
          <ScrollToTop />
          <Routes>
            {/* Admin Routes with Layout */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            
            <Route path="/admin/*" element={
              <ProtectedAdminRoute>
                <AdminLayout>
                  <Routes>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="news" element={<NewsManager />} />
                    <Route path="categories" element={<CategoriesManager />} />
                    <Route path="menu" element={<MenuManager />} />
                    <Route path="companies" element={<CompaniesManager />} /> 
                    <Route path="site-content" element={<SiteContentManager />} />
                    <Route path="design" element={<DesignManager />} />
                    <Route path="settings" element={<AdminDashboard />} />
                  </Routes>
                </AdminLayout>
              </ProtectedAdminRoute>
            } />

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
        </AdminAuthProvider>
      </LanguageProvider>
      </DesignProvider>
    </Router>
  );
}

export default App;
