import React, { useState, createContext, useContext } from 'react';
import { ViewType } from '../../types';
import { LayoutDashboard, Package, ShoppingCart, LogOut, Search, Bell, Menu, X } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

const ToastContext = createContext<{ showToast: (msg: string) => void }>({ showToast: () => {} });

export const useAdminToast = () => useContext(ToastContext);

export function AdminLayout({ children, currentView, setCurrentView }: AdminLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, view: 'admin-dashboard' },
    { name: 'Products', icon: Package, view: 'admin-products' },
    { name: 'Orders', icon: ShoppingCart, view: 'admin-orders' },
  ];

  return (
    <ToastContext.Provider value={{ showToast }}>
      <div className="min-h-screen bg-gray-50 w-full">
      {/* Mobile backdrop */}
      <div 
        className={`fixed inset-0 bg-gray-900/50 z-20 md:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Sidebar */}
      <aside 
        className={`bg-white border-r border-gray-200 flex flex-col fixed h-full z-30 transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'}
          ${isHovered ? 'md:w-64' : 'md:w-[72px]'}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="h-16 px-4 border-b border-gray-200 flex items-center justify-between overflow-hidden flex-shrink-0">
          <h1 className="text-xl font-black tracking-tighter cursor-pointer whitespace-nowrap flex items-center gap-3" onClick={() => setCurrentView('home')}>
            <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-md flex-shrink-0">
              <span className="font-bold text-lg">N</span>
            </div>
            <span className={`transition-opacity duration-300 ${isHovered || isMobileMenuOpen ? 'opacity-100' : 'opacity-0 md:hidden'}`}>
              INFOTECH.
            </span>
          </h1>
          {isMobileMenuOpen && (
            <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-gray-500 hover:text-gray-900">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        
        <nav className="flex-1 py-4 space-y-2 overflow-x-hidden overflow-y-auto px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.view;
            return (
              <button
                key={item.name}
                onClick={() => {
                  setCurrentView(item.view as ViewType);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors group relative ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }`}
                title={!isHovered && !isMobileMenuOpen ? item.name : undefined}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-900'}`} />
                <span className={`ml-4 whitespace-nowrap transition-all duration-300 ${isHovered || isMobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 hidden md:block'}`}>
                  {item.name}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-200 overflow-hidden">
          <button 
            onClick={() => setCurrentView('home')}
            className="w-full flex items-center px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors group"
            title={!isHovered && !isMobileMenuOpen ? 'Exit Admin' : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className={`ml-4 whitespace-nowrap transition-all duration-300 ${isHovered || isMobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 hidden md:block'}`}>
              Exit Admin
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex flex-col min-h-screen min-w-0 transition-all duration-300 ${isHovered ? 'md:ml-64' : 'md:ml-[72px]'}`}>
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-10">
          {isMobileSearchOpen ? (
            <div className="flex w-full items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Search anything..." 
                  className="w-full pl-11 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                />
              </div>
              <button 
                onClick={() => setIsMobileSearchOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4 flex-1">
                <button 
                  className="md:hidden p-2 -ml-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div className="relative w-full max-w-sm hidden sm:block">
                  <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="Search anything..." 
                    className="w-full pl-11 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                  />
                </div>
                <button 
                  onClick={() => setIsMobileSearchOpen(true)}
                  className="sm:hidden p-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
                >
                   <Search className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex items-center gap-3 sm:gap-5">
                <button className="relative p-2 text-gray-400 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-50">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <div className="w-9 h-9 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold text-xs cursor-pointer shadow-sm hover:bg-blue-700 transition-colors">
                  AD
                </div>
              </div>
            </>
          )}
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 sm:p-8 w-full max-w-7xl mx-auto min-w-0">
          {children}
          {toastMessage && (
            <div className="fixed bottom-4 right-4 z-50 bg-gray-900 text-white px-4 py-3 rounded-md shadow-lg font-medium text-sm transition-opacity duration-300">
              {toastMessage}
            </div>
          )}
        </div>
      </main>
      </div>
    </ToastContext.Provider>
  );
}
