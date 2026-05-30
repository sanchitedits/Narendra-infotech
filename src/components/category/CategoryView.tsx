import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronRight, ChevronLeft, ChevronDown, Heart, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../../DataContext';
import { ViewType, Product } from '../../types';

interface CategoryViewProps {
  setCurrentView: (view: ViewType) => void;
  addToCart: (product: Product) => void;
  viewProduct: (id: number) => void;
  selectedCategory: string | null;
  setSelectedCategory: (c: string | null) => void;
}

const FilterContent = ({ setIsFiltersOpen, categories, selectedCategory, setSelectedCategory }: { setIsFiltersOpen?: (v: boolean) => void, categories: any[], selectedCategory: string | null, setSelectedCategory: (c: string | null) => void }) => (
  <>
    <div className="flex justify-between items-center mb-6 md:hidden">
      <h2 className="text-xl font-bold text-gray-900">Filters</h2>
      <button onClick={() => setIsFiltersOpen?.(false)} className="p-2 text-gray-500 hover:text-gray-900 bg-gray-100 rounded-full">
        <X className="w-5 h-5" />
      </button>
    </div>

    <div className="mb-8">
      <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Categories</h3>
      <ul className="space-y-3">
        <li className="flex justify-between items-center text-sm">
          <button 
            onClick={() => { setSelectedCategory(null); setIsFiltersOpen?.(false); }} 
            className={`${selectedCategory === null ? 'text-gray-900 font-bold' : 'text-gray-500'} hover:text-gray-900 font-medium`}
          >
            All Products
          </button>
        </li>
        {categories.map((c, i) => (
          <li key={i} className="flex justify-between items-center text-sm">
            <button 
              onClick={() => { setSelectedCategory(c.name); setIsFiltersOpen?.(false); }} 
              className={`${selectedCategory === c.name ? 'text-gray-900 font-bold' : 'text-gray-500'} hover:text-gray-900 font-medium`}
            >
              {c.name}
            </button>
            <span className="text-gray-400 bg-gray-100 px-2 py-0.5 rounded text-xs font-medium">{c.count?.split(' ')[0] || '0'}</span>
          </li>
        ))}
      </ul>
    </div>
    
    <div className="mb-8">
      <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Price</h3>
      <div className="flex items-center gap-2">
        <input type="text" placeholder="Min" className="w-full border border-gray-200 rounded-lg bg-gray-50 px-3 py-2 text-sm outline-none focus:border-gray-900 transition-colors" />
        <span className="text-gray-400">-</span>
        <input type="text" placeholder="Max" className="w-full border border-gray-200 rounded-lg bg-gray-50 px-3 py-2 text-sm outline-none focus:border-gray-900 transition-colors" />
        <button className="bg-gray-900 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors hover:scale-[1.02] active:scale-[0.98]">Go</button>
      </div>
    </div>

    <div className="mb-8 md:mb-0">
      <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Availability</h3>
      <ul className="space-y-3">
        <li className="flex items-center gap-3 cursor-pointer group">
          <div className="w-5 h-5 border border-gray-200 rounded flex items-center justify-center group-hover:border-gray-900 transition-colors bg-white"></div>
          <label className="text-sm text-gray-600 cursor-pointer group-hover:text-gray-900 transition-colors">In Stock</label>
        </li>
      </ul>
    </div>
  </>
);

export const CategoryView = React.memo(function CategoryView({ setCurrentView, addToCart, viewProduct, selectedCategory, setSelectedCategory }: CategoryViewProps) {
  const { products, categories } = useData();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const displayedProducts = selectedCategory ? products.filter(p => p.category === selectedCategory) : products;

  useEffect(() => {
    if (isFiltersOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFiltersOpen]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 w-full">
        <button onClick={() => setCurrentView('home')} className="hover:text-gray-900">Home</button>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-900 font-medium">{selectedCategory || 'All Products'}</span>
      </nav>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 md:hidden">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">{selectedCategory || 'All Products'}</h1>
        <button 
          onClick={() => setIsFiltersOpen(true)}
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 font-medium text-sm hover:bg-gray-200 transition-colors"
        >
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Mobile Filters Drawer - Rendered iteratively via createPortal */}
        {typeof document !== 'undefined' && createPortal(
          <AnimatePresence>
            {isFiltersOpen && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 z-40 md:hidden"
                  onClick={() => setIsFiltersOpen(false)}
                />
                <motion.aside
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed inset-y-0 left-0 bg-white z-50 w-4/5 max-w-sm p-6 overflow-y-auto flex-shrink-0 md:hidden shadow-xl"
                >
                   <FilterContent setIsFiltersOpen={setIsFiltersOpen} categories={categories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
                </motion.aside>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}

        {/* Desktop Filters Aside */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <FilterContent categories={categories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
        </aside>

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 hidden md:flex">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">{selectedCategory || 'All Products'}</h1>
            <div className="flex items-center gap-4 text-sm w-full sm:w-auto">
              <span className="text-gray-500 whitespace-nowrap hidden sm:block">Showing 1-{displayedProducts.length} of {displayedProducts.length}</span>
              <div className="relative w-full sm:w-auto">
                <select className="appearance-none border border-gray-200 rounded-lg bg-gray-50 pl-4 pr-10 py-2.5 text-sm text-gray-900 outline-none w-full sm:w-auto focus:border-gray-900 focus:bg-white focus:ring-1 focus:ring-gray-900 font-medium cursor-pointer transition-colors active:scale-[0.98]">
                  <option>Sort by Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>New Arrivals</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between gap-4 text-sm w-full mb-6 md:hidden">
             <span className="text-gray-500 whitespace-nowrap">1-{displayedProducts.length} of {displayedProducts.length} items</span>
             <div className="relative w-1/2">
                <select className="appearance-none border border-gray-200 rounded-lg bg-gray-50 pl-4 pr-8 py-2.5 text-sm text-gray-900 outline-none w-full focus:border-gray-900 focus:bg-white focus:ring-1 focus:ring-gray-900 font-medium cursor-pointer transition-colors active:scale-[0.98]">
                  <option>Featured</option>
                  <option>Low to High</option>
                  <option>High to Low</option>
                  <option>New Items</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
            initial="hidden" animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.05 } }
            }}
          >
            {displayedProducts.map((product, idx) => (
              <motion.div 
                key={idx} 
                className="group cursor-pointer flex flex-col relative w-full" 
                onClick={() => viewProduct(product.id)}
                variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
              >
                <div className="w-full aspect-square bg-[#f0f2f5] rounded-md overflow-hidden relative mb-4 hover:shadow-[0_4px_20px_rgb(0,0,0,0.05)] transition-shadow duration-300">
                  <button className="absolute top-4 right-4 text-gray-400 hover:text-red-500 z-10 transition-colors">
                    <Heart className="w-5 h-5 fill-current border-none" />
                  </button>
                  <img 
                    src={product.image || undefined} 
                    alt={product.name}
                    className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transform transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-x-0 bottom-4 translate-y-[150%] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transform transition-all duration-300 ease-out flex justify-center px-4 z-20">
                    <button 
                      onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                      className="bg-black/90 backdrop-blur text-white font-medium rounded py-3 px-6 text-sm hover:bg-black active:scale-95 transition-all w-full shadow-lg"
                    >
                      Quick Add
                    </button>
                  </div>
                </div>
                <div className="flex flex-col px-1 pb-2">
                  <h3 className="text-sm font-semibold text-gray-900 leading-tight mb-1 truncate">{product.name}</h3>
                  <span className="text-sm font-medium text-gray-500">₹{Number(product.price).toLocaleString()}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="flex justify-center items-center gap-2 pb-12">
            <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-full text-gray-400 hover:text-gray-900 hover:border-gray-900 hover:bg-gray-50 transition-colors active:scale-95">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-900 text-white font-medium text-sm hover:scale-105 transition-transform shadow-md">1</button>
            <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-full text-gray-500 hover:text-gray-900 hover:border-gray-900 hover:bg-gray-50 transition-colors font-medium text-sm active:scale-95">2</button>
            <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-full text-gray-500 hover:text-gray-900 hover:border-gray-900 hover:bg-gray-50 transition-colors font-medium text-sm active:scale-95">3</button>
            <span className="text-gray-400 px-2">...</span>
            <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-full text-gray-500 hover:text-gray-900 hover:border-gray-900 hover:bg-gray-50 transition-colors font-medium text-sm active:scale-95">8</button>
            <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-full text-gray-400 hover:text-gray-900 hover:border-gray-900 hover:bg-gray-50 transition-colors active:scale-95">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
