
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Newspaper, 
  FolderTree, 
  Menu as MenuIcon, 
  Settings, 
  LogOut, 
  Building2,
  ChevronLeft,
  ChevronRight,
  User,
  Globe,
  Shield,
  Palette
} from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminSidebar = ({ isCollapsed, toggleCollapse, isMobile, closeMobile }) => {
  const { logout, adminUser } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navSections = [
    {
      title: 'მთავარი',
      items: [
        { to: '/admin/dashboard', icon: LayoutDashboard, label: 'დეშბორდი' },
      ]
    },
    {
      title: 'კონტენტი',
      items: [
        { to: '/admin/news', icon: Newspaper, label: 'სიახლეები' },
        { to: '/admin/categories', icon: FolderTree, label: 'კატეგორიები' },
        { to: '/admin/site-content', icon: Globe, label: 'საიტის კონტენტი' },
      ]
    },
    {
      title: 'მონაცემები',
      items: [
        { to: '/admin/companies', icon: Building2, label: 'კომპანიები' },
        { to: '/admin/menu', icon: MenuIcon, label: 'მენიუ' },
      ]
    },
    {
      title: 'სისტემა',
      items: [
        { to: '/admin/design', icon: Palette, label: 'დიზაინი' },
        { to: '/admin/settings', icon: Settings, label: 'პარამეტრები' },
      ]
    }
  ];

  const sidebarClass = cn(
    "bg-slate-900 text-slate-100 flex flex-col h-full transition-all duration-300 border-r border-slate-800",
    isMobile ? "w-72" : isCollapsed ? "w-20" : "w-72"
  );

  return (
    <div className={sidebarClass}>
      {/* Logo Section */}
      <div className="h-16 flex items-center px-5 border-b border-slate-800 justify-between shrink-0">
        {!isCollapsed || isMobile ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield size={16} className="text-white" />
            </div>
            <div>
              <span className="font-bold text-base tracking-wide text-white">CHOCHELI</span>
              <span className="text-[10px] text-slate-500 block -mt-0.5">ADMIN PANEL</span>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto">
            <Shield size={16} className="text-white" />
          </div>
        )}
        {!isMobile && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleCollapse}
            className="text-slate-400 hover:text-white hover:bg-slate-800 h-8 w-8"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {navSections.map((section) => (
          <div key={section.title}>
            {(!isCollapsed || isMobile) && (
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold px-3 mb-2">
                {section.title}
              </p>
            )}
            {isCollapsed && !isMobile && <div className="h-px bg-slate-800 mx-2 mb-2" />}
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={isMobile ? closeMobile : undefined}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                    isActive 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30" 
                      : "text-slate-400 hover:bg-slate-800/70 hover:text-slate-200"
                  )}
                >
                  <item.icon size={18} className="shrink-0" />
                  {(!isCollapsed || isMobile) && (
                    <span className="font-medium whitespace-nowrap overflow-hidden text-sm">
                      {item.label}
                    </span>
                  )}
                  {isCollapsed && !isMobile && (
                    <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl border border-slate-700">
                      {item.label}
                    </div>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User Profile / Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/50 shrink-0">
        <div className={cn("flex items-center gap-3", isCollapsed && !isMobile ? "justify-center" : "")}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-900/30">
            <User size={16} />
          </div>
          {(!isCollapsed || isMobile) && (
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold truncate text-white">
                {adminUser?.username || 'Administrator'}
              </p>
              <p className="text-[11px] text-slate-500 truncate">ადმინისტრატორი</p>
            </div>
          )}
          {(!isCollapsed || isMobile) && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLogout}
              className="text-slate-500 hover:text-red-400 hover:bg-red-900/20 h-8 w-8 rounded-lg"
              title="გასვლა"
            >
              <LogOut size={16} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
