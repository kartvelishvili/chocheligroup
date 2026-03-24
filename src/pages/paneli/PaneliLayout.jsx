import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { usePaneliAuth } from '@/contexts/PaneliAuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LayoutDashboard, Menu as MenuIcon, Image, Info, Award, Building2,
  Users, Newspaper, FileText, Phone, MapPin, ChevronLeft, ChevronRight,
  LogOut, Shield, ExternalLink, X, FolderTree, Layers, User, UserCog
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navSections = [
  {
    title: 'მთავარი',
    items: [
      { to: '/paneli/dashboard', icon: LayoutDashboard, label: 'დეშბორდი' },
    ]
  },
  {
    title: 'მთავარი გვერდი',
    items: [
      { to: '/paneli/menu', icon: MenuIcon, label: 'მენიუ' },
      { to: '/paneli/hero', icon: Image, label: 'ჰერო სექცია' },
      { to: '/paneli/about-section', icon: Info, label: 'ჩვენ შესახებ' },
      { to: '/paneli/principles', icon: Award, label: 'პრინციპები' },
      { to: '/paneli/portfolio-section', icon: Building2, label: 'პორტფოლიო' },
      { to: '/paneli/leadership', icon: Users, label: 'ხელმძღვანელობა' },
      { to: '/paneli/footer', icon: Layers, label: 'ფუტერი' },
    ]
  },
  {
    title: 'სიახლეები',
    items: [
      { to: '/paneli/news', icon: Newspaper, label: 'სიახლეები' },
      { to: '/paneli/categories', icon: FolderTree, label: 'კატეგორიები' },
    ]
  },
  {
    title: 'შიდა გვერდები',
    items: [
      { to: '/paneli/page-about', icon: Info, label: 'ჩვენს შესახებ' },
      { to: '/paneli/page-portfolio', icon: Building2, label: 'ისტორია' },
      { to: '/paneli/page-industries', icon: MapPin, label: 'ინდუსტრიები' },
      { to: '/paneli/page-projects', icon: FileText, label: 'პროექტები' },
      { to: '/paneli/page-contact', icon: Phone, label: 'კონტაქტი' },
      { to: '/paneli/founder', icon: User, label: 'დამფუძნებელი' },
    ]
  },
  {
    title: 'სისტემა',
    items: [
      { to: '/paneli/admins', icon: UserCog, label: 'ადმინისტრატორები' },
    ]
  }
];

const PaneliLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = usePaneliAuth();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/paneli/login'); };

  const sidebarW = isMobile ? 'w-72' : collapsed ? 'w-[68px]' : 'w-64';

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm" />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 md:relative flex flex-col bg-[#0a1628] text-slate-300 transition-all duration-300 border-r border-white/5",
        sidebarW,
        mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      )}>
        {/* Logo */}
        <div className="h-14 flex items-center px-4 border-b border-white/5 justify-between shrink-0">
          {(!collapsed || isMobile) ? (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
                <Shield size={14} className="text-white" />
              </div>
              <div className="leading-none">
                <span className="text-sm font-bold text-white tracking-wide">CHOCHELI</span>
                <span className="text-[9px] text-slate-500 block mt-0.5">PANEL</span>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center mx-auto">
              <Shield size={14} className="text-white" />
            </div>
          )}
          {isMobile ? (
            <button onClick={() => setMobileOpen(false)} className="text-slate-500 hover:text-white">
              <X size={18} />
            </button>
          ) : (
            <button onClick={() => setCollapsed(!collapsed)} className="text-slate-500 hover:text-white transition-colors">
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4 scrollbar-thin">
          {navSections.map(section => (
            <div key={section.title}>
              {(!collapsed || isMobile) && (
                <p className="text-[9px] uppercase tracking-[0.15em] text-slate-600 font-semibold px-3 mb-1.5">{section.title}</p>
              )}
              {collapsed && !isMobile && <div className="h-px bg-white/5 mx-2 mb-1.5" />}
              <div className="space-y-0.5">
                {section.items.map(item => (
                  <NavLink key={item.to} to={item.to} onClick={isMobile ? () => setMobileOpen(false) : undefined}
                    className={({ isActive }) => cn(
                      "flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-150 group relative text-[13px]",
                      isActive
                        ? "bg-teal-500/15 text-teal-400 font-medium"
                        : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                    )}>
                    <item.icon size={16} className="shrink-0" />
                    {(!collapsed || isMobile) && <span className="truncate">{item.label}</span>}
                    {collapsed && !isMobile && (
                      <div className="absolute left-full ml-2 px-2.5 py-1 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl">
                        {item.label}
                      </div>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/5 shrink-0">
          <div className={cn("flex items-center gap-2.5", collapsed && !isMobile && "justify-center")}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {(user?.username || 'C')[0].toUpperCase()}
            </div>
            {(!collapsed || isMobile) && (
              <>
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs font-semibold truncate text-white">{user?.username || 'Panel'}</p>
                  <p className="text-[10px] text-slate-500">ადმინისტრატორი</p>
                </div>
                <button onClick={handleLogout} className="text-slate-500 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-white/5" title="გასვლა">
                  <LogOut size={15} />
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-12 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-slate-500 hover:text-slate-700" onClick={() => setMobileOpen(true)}>
              <MenuIcon size={20} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => window.open('/', '_blank')} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-teal-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-50">
              <ExternalLink size={13} />
              <span className="hidden sm:inline">საიტის ნახვა</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default PaneliLayout;
