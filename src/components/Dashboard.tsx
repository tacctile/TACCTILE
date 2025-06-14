import React, { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardGrid from './DashboardGrid';
import SettingsPanel from './SettingsPanel';

const Dashboard: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [showSettings, setShowSettings] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  React.useEffect(() => {
    if (activeView === 'settings') {
      setShowSettings(true);
      setActiveView('dashboard');
    }
  }, [activeView]);

  return (
    <div className="min-h-screen bg-spotify-black font-spotify overflow-x-hidden">
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        activeView={activeView}
        setActiveView={setActiveView}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      
      {/* FULLY RESPONSIVE MAIN CONTENT */}
      <main className={`
        transition-all duration-300 ease-in-out
        min-h-screen w-full overflow-x-hidden
        ${isCollapsed ? 'lg:pl-16' : 'lg:pl-64'}
        ${isMobileMenuOpen ? 'pl-0' : 'pl-0'}
      `}>
        <DashboardGrid view={activeView} sidebarCollapsed={isCollapsed} />
      </main>

      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;