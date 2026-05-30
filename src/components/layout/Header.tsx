import React, { useState } from 'react';
import { Menu, Search, ShoppingCart, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ViewType } from '../../types';

interface HeaderProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  cartItemsCount: number;
  setIsCartOpen: (isOpen: boolean) => void;
  viewCategory?: (category: string | null) => void;
}

export const Header = React.memo(function Header({ currentView, setCurrentView, cartItemsCount, setIsCartOpen, viewCategory }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const navigateTo = (view: ViewType) => {
    if (view === 'category' && viewCategory) {
      viewCategory(null);
    } else {
      setCurrentView(view);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden flex">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-900/50" 
              onClick={() => setIsMobileMenuOpen(false)} 
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative flex-1 flex flex-col max-w-xs w-full bg-white overflow-y-auto h-full shadow-2xl"
            >
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="text-xl font-black tracking-tighter cursor-pointer" onClick={() => navigateTo('home')}>N-INFOTECH.</div>
                <button className="text-gray-500 hover:text-gray-900" onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex-1 px-4 py-6 space-y-4">
                <button onClick={() => navigateTo('home')} className="flex items-center justify-between w-full text-left text-lg font-medium text-gray-900 py-2 border-b border-gray-100">
                  Home
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
                <button onClick={() => navigateTo('category')} className="flex items-center justify-between w-full text-left text-lg font-medium text-gray-900 py-2 border-b border-gray-100">
                  Shop
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
                <button onClick={() => navigateTo('about')} className="flex items-center justify-between w-full text-left text-lg font-medium text-gray-900 py-2 border-b border-gray-100">
                  About
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
                <button onClick={() => navigateTo('contact')} className="flex items-center justify-between w-full text-left text-lg font-medium text-gray-900 py-2 border-b border-gray-100">
                  Contact
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
                <button onClick={() => navigateTo('faq')} className="flex items-center justify-between w-full text-left text-lg font-medium text-gray-900 py-2 border-b border-gray-100">
                  FAQ
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </nav>
              <div className="p-4 border-t border-gray-200">
                <button onClick={() => navigateTo('admin-dashboard')} className="w-full text-center bg-gray-100 text-gray-900 font-bold tracking-wide text-sm hover:bg-gray-200 transition-colors py-3 rounded-lg">
                  Admin Portal Demo
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button className="text-gray-900 hover:opacity-70 lg:hidden p-1 -ml-1 border border-transparent rounded bg-transparent" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu className="w-6 h-6" />
              </button>
              <div className="text-2xl font-black tracking-tighter cursor-pointer flex items-center text-gray-900 gap-2" onClick={() => setCurrentView('home')}>
                <div className="w-8 h-8 bg-blue-600 justify-center flex items-center rounded text-white text-lg">N</div>
                INFOTECH.
              </div>
              
              <nav className="hidden lg:flex ml-8 gap-8">
                <button onClick={() => setCurrentView('home')} className={`text-sm font-medium transition-colors ${currentView === 'home' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'} py-2`}>Home</button>
                <button onClick={() => viewCategory ? viewCategory(null) : setCurrentView('category')} className={`text-sm font-medium transition-colors ${currentView === 'category' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'} py-2`}>Shop</button>
                <button onClick={() => setCurrentView('about')} className={`text-sm font-medium transition-colors ${currentView === 'about' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'} py-2`}>About</button>
              </nav>
            </div>

            <div className="flex items-center gap-6">
              <div className="relative flex items-center group">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="w-0 opacity-0 group-hover:w-48 group-hover:opacity-100 group-hover:px-4 transition-all duration-300 bg-gray-100 border-none rounded-full h-10 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 absolute right-10"
                />
                <button className="text-gray-900 hover:bg-gray-100 p-2 rounded-full transition-colors relative z-10">
                  <Search className="w-5 h-5" />
                </button>
              </div>
              <button onClick={() => setIsCartOpen(true)} className="text-gray-900 relative p-2 rounded-full hover:bg-gray-100 transition-colors active:scale-95">
                <ShoppingCart className="w-5 h-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center pointer-events-none shadow-sm">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
});
