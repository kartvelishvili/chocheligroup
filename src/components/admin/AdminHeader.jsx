
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { 
  LogOut, 
  Menu,
  ExternalLink,
  LayoutDashboard,
  Newspaper,
  FolderTree,
  Building2,
  Globe,
  Settings
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const pageTitles = {
  '/admin/dashboard': { title: 'დეშბორდი', icon: LayoutDashboard },
  '/admin/news': { title: 'სიახლეები', icon: Newspaper },
  '/admin/categories': { title: 'კატეგორიები', icon: FolderTree },
  '/admin/companies': { title: 'კომპანიები', icon: Building2 },
  '/admin/menu': { title: 'მენიუ', icon: Menu },
  '/admin/site-content': { title: 'საიტის კონტენტი', icon: Globe },
  '/admin/settings': { title: 'პარამეტრები', icon: Settings },
};

const AdminHeader = ({ toggleMobileSidebar }) => {
  const { logout, adminUser } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const currentPage = pageTitles[location.pathname] || { title: 'მართვის პანელი', icon: LayoutDashboard };
  const PageIcon = currentPage.icon;

  return (
    <header className="bg-white border-b border-slate-200 h-14 px-4 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden text-slate-600 h-9 w-9"
          onClick={toggleMobileSidebar}
        >
          <Menu size={18} />
        </Button>

        {/* Current page breadcrumb */}
        <div className="flex items-center gap-2 text-slate-700">
          <PageIcon size={18} className="text-blue-600" />
          <span className="font-semibold text-sm">{currentPage.title}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => window.open('/', '_blank')}
          className="hidden sm:flex items-center gap-2 text-slate-500 hover:text-blue-600 h-8 text-xs"
        >
          <ExternalLink size={14} />
          საიტის ნახვა
        </Button>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 pl-2 pr-3 rounded-xl border border-slate-200 hover:bg-slate-50 h-9">
               <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                 {(adminUser?.username || 'A')[0].toUpperCase()}
               </div>
               <span className="text-sm font-medium text-slate-700 hidden sm:inline">
                 {adminUser?.username || 'Admin'}
               </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-xs text-slate-500">ანგარიში</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              პარამეტრები
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              გასვლა
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AdminHeader;
