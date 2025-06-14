import React from 'react';
import { 
  LayoutDashboard, 
  Bell, 
  Rss, 
  Cast, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  User,
  Menu
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  activeView: string;
  setActiveView: (view: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'alerts', label: 'Alerts', icon: Bell },
  { id: 'api-feeds', label: 'API Feeds', icon: Rss },
  { id: 'ai-tools', label: 'Stacc Cast', icon: Cast },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const Sidebar: React.FC<SidebarProps> = ({ 
  isCollapsed, 
  setIsCollapsed, 
  activeView, 
  setActiveView,
  isMobileMenuOpen,
  setIsMobileMenuOpen
}) => {
  const { logout, user } = useAuth();

  const handleItemClick = (itemId: string) => {
    setActiveView(itemId);
    // Close mobile menu on item click
    if (window.innerWidth < 1024) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* MOBILE MENU TOGGLE BUTTON */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-spotify-dark-gray border border-spotify-light-gray/20 text-spotify-white hover:bg-spotify-medium-gray transition-all"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* RESPONSIVE SIDEBAR */}
      <div className={`
        fixed left-0 top-0 h-full bg-spotify-black border-r border-spotify-light-gray/20 
        transition-all duration-300 ease-in-out z-40 flex flex-col
        ${isCollapsed ? 'w-16' : 'w-64'}
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* RESPONSIVE HEADER */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-spotify-light-gray/20 flex-shrink-0">
          {!isCollapsed && (
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-spotify-green rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-spotify-black font-bold text-xs sm:text-sm font-spotify">T</span>
              </div>
              <span className="text-spotify-white font-bold text-sm sm:text-lg font-spotify truncate">TACCTILE</span>
            </div>
          )}
          
          {/* Desktop collapse button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 sm:p-2 rounded-lg bg-spotify-medium-gray hover:bg-spotify-light-gray text-spotify-text-gray hover:text-spotify-white transition-all flex-shrink-0"
          >
            {isCollapsed ? <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" /> : <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />}
          </button>

          {/* Mobile close button */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden p-1.5 sm:p-2 rounded-lg bg-spotify-medium-gray hover:bg-spotify-light-gray text-spotify-text-gray hover:text-spotify-white transition-all flex-shrink-0"
          >
            <X className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* RESPONSIVE USER PROFILE */}
        <div className="p-3 sm:p-4 border-b border-spotify-light-gray/20 flex-shrink-0">
          {!isCollapsed ? (
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-spotify-green rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-spotify-black" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-spotify-white font-medium text-xs sm:text-sm font-spotify truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-spotify-text-gray text-xs font-spotify truncate">
                  {user?.email || 'user@tacctile.com'}
                </p>
              </div>
              <div className="relative flex-shrink-0">
                <Bell className="w-3 h-3 sm:w-4 sm:h-4 text-spotify-text-gray hover:text-spotify-white transition-colors cursor-pointer" />
                <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-spotify-green rounded-full animate-pulse"></div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-spotify-green rounded-full flex items-center justify-center">
                <User className="w-3 h-3 sm:w-4 sm:h-4 text-spotify-black" />
              </div>
              <div className="relative">
                <Bell className="w-3 h-3 sm:w-4 sm:h-4 text-spotify-text-gray hover:text-spotify-white transition-colors cursor-pointer" />
                <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-spotify-green rounded-full animate-pulse"></div>
              </div>
            </div>
          )}
        </div>

        {/* RESPONSIVE NAVIGATION */}
        <nav className="p-3 sm:p-4 space-y-1 sm:space-y-2 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`
                  w-full flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg 
                  transition-all group font-spotify text-sm sm:text-base
                  ${isCollapsed
                    ? // Collapsed state styling
                      isActive 
                        ? 'text-spotify-green' 
                        : 'text-spotify-text-gray hover:text-spotify-white hover:bg-spotify-medium-gray'
                    : // Expanded state styling  
                      isActive 
                        ? 'bg-spotify-green/20 text-spotify-green border border-spotify-green/30' 
                        : 'text-spotify-text-gray hover:text-spotify-white hover:bg-spotify-medium-gray'
                  }
                `}
              >
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 transition-colors ${
                  isCollapsed
                    ? // Collapsed: just highlight icon when active
                      isActive ? 'text-spotify-green' : 'group-hover:text-spotify-white'
                    : // Expanded: keep current styling
                      isActive ? 'text-spotify-green' : 'group-hover:text-spotify-white'
                }`} />
                {!isCollapsed && <span className="font-medium truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* RESPONSIVE LOGOUT */}
        <div className="p-3 sm:p-4 border-t border-spotify-light-gray/20 flex-shrink-0">
          <button
            onClick={logout}
            className="w-full flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg text-spotify-text-gray hover:text-red-400 hover:bg-red-500/10 transition-all group font-spotify text-sm sm:text-base"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5 group-hover:text-red-400 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium truncate">Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;