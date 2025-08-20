import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import UpgradePopup from '../ui/UpgradePopup';
import { useApp } from '../../context/AppContext';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const { showUpgradePopup, closeUpgradePopup, paymentInfo } = useApp();

  // Automatically handle sidebar state based on screen size
  useEffect(() => {
    const handleResize = () => {
      const newIsDesktop = window.innerWidth >= 1024; // Tailwind's lg breakpoint
      setIsDesktop(newIsDesktop);
      setSidebarOpen(newIsDesktop);
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} isDesktop={isDesktop} />
      
      {/* Main content area - adjust margin for mobile/desktop */}
      <div 
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-0' : 'ml-0'
        }`}
      >
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      {/* Upgrade Popup */}
      <UpgradePopup
        isOpen={showUpgradePopup}
        onClose={closeUpgradePopup}
        paymentInfo={paymentInfo}
      />
    </div>
  );
};

export default DashboardLayout;