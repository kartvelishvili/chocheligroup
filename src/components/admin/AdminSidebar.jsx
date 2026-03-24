
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Newspaper, 
  FolderTree, 
  Menu as MenuIcon, 
  LogOut, 
  Building2,
  ChevronLeft,
  ChevronRight,
  User,
  Globe,
  Shield
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
      title: 'გვერდების მართვა',
      items: [
        { to: '/admin/site-content', icon: Globe, label: 'საიტის კონტენტი' },
        { to: '/admin/companies', icon: Building2, label: 'კომპანიები' },
      ]
    },
    {
      title: 'სიახლეები',
      items: [
        { to: '/admin/news', icon: Newspaper, label: 'სიახლეები' },
        { to: '/admin/categories', icon: FolderTree, label: 'კატეგორიები' },
      ]
    },
    {
      title: 'ნავიგაცია',
      items: [
        { to: '/admin/menu', icon: MenuIcon, label: 'მენიუ' },
      ]
    }
  ];

  const sidebarClass = cn(
    "bg-white text-slate-700 flex flex-col h-full transition-all duration-300 border-r border-slate-200 shadow-sm",
    isMobile ? "w-72" : isCollapsed ? "w-[72px]" : "w-64"
  );

  return (
    <div className={sidebarClass}>
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-slate-100 justify-between shrink-0">
        {!isCollapsed || isMobile ? (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Shield size={16} className="text-white" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-wide text-slate-800">CHOCHELI</span>
              <span className="text-[10px] text-slate-400 block -mt-0.5 font-medium">ადმინ პანელი</span>
            </div>
          </div>
        ) : (
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mx-auto shadow-lg shadow-blue-600/20">
            <Shield size={16} className="text-white" />
          </div>
        )}
        {!isMobile && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleCollapse}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 h-8 w-8 rounded-lg"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {navSections.map((section) => (
          <div key={section.title}>
            {(!isCollapsed || isMobile) && (
              <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400 font-semibold px-3 mb-2">
                {section.title}
              </p>
            )}
            {isCollapsed && !isMobile && <div className="h-px bg-slate-100 mx-2 mb-2" />}
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={isMobile ? closeMobile : undefined}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                    isActive 
                      ? "bg-blue-50 text-blue-700 font-semibold" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                  )}
                >
                  {({ isActive }) => (
                    <>
                      <div className={cn(
                        "p-1.5 rounded-lg transition-colors",
                        isActive ? "bg-blue-100" : "bg-transparent group-hover:bg-slate-100"
                      )}>
                        <item.icon size={16} className="shrink-0" />
                      </div>
                      {(!isCollapsed || isMobile) && (
                        <span className="whitespace-nowrap overflow-hidden text-sm">
                          {item.label}
                        </span>
                      )}
                      {isCollapsed && !isMobile && (
                        <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl">
                          {item.label}
                        </div>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User Footer */}
      <div className="p-3 border-t border-slate-100 shrink-0">
        <div className={cn("flex items-center gap-3", isCollapsed && !isMobile ? "justify-center" : "")}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white shrink-0 shadow-md">
            <User size={15} />
          </div>
          {(!isCollapsed || isMobile) && (
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold truncate text-slate-700">
                {adminUser?.username || 'Administrator'}
              </p>
              <p className="text-[11px] text-slate-400 truncate">ადმინისტრატორი</p>
            </div>
          )}
          {(!isCollapsed || isMobile) && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-500 hover:bg-red-50 h-8 w-8 rounded-lg"
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
