import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import JSZip from 'jszip';
import { themeFiles } from './themeStore';
import { useData } from './DataContext';
import { ViewType, CartItem, Product } from './types';

import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomeView } from './components/home/HomeView';
import { CategoryView } from './components/category/CategoryView';
import { ProductView } from './components/product/ProductView';
import { CartView } from './components/cart/CartView';
import { AboutView } from './components/about/AboutView';
import { FAQView } from './components/support/FAQView';
import { ContactView } from './components/support/ContactView';
import { PrivacyView } from './components/legal/PrivacyView';
import { TermsView } from './components/legal/TermsView';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutView } from './components/checkout/CheckoutView';

import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminProducts } from './components/admin/AdminProducts';
import { AdminOrders } from './components/admin/AdminOrders';

export default function App() {
  const { products } = useData();
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('home'); 
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
     if (products.length > 0 && selectedProductId === null) {
         setSelectedProductId(products[0].id);
         // only set default cart item once
         if (cartItems.length === 0) {
             setCartItems([{ ...products[0], quantity: 1 }]);
         }
     }
  }, [products]);

  const viewProduct = useCallback((id: number) => {
    setSelectedProductId(id);
    setCurrentView('product');
  }, []);

  const updateQuantity = useCallback((id: number, delta: number) => {
    setCartItems(items => items.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  }, []);

  const removeItem = useCallback((id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  }, []);

  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    setCartItems(items => {
      const existing = items.find(item => item.id === product.id);
      if (existing) {
        return items.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...items, { ...product, quantity }];
    });
    setIsCartOpen(true);
  }, []);

  const cartItemsCount = React.useMemo(() => cartItems.reduce((acc, item) => acc + item.quantity, 0), [cartItems]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const zip = new JSZip();
      const themeFolder = zip.folder('electrostore-woocommerce-theme');
      if (!themeFolder) throw new Error("Could not create folder structure.");

      Object.entries(themeFiles).forEach(([filename, content]) => {
        themeFolder.file(filename, content);
      });

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'electrostore-woocommerce-theme.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to generate zip", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const currentProduct = products.find(p => p.id === selectedProductId) || products[0] || null;

  if (currentView.startsWith('admin-')) {
    return (
      <>
        {currentView === 'admin-dashboard' && <AdminDashboard currentView={currentView} setCurrentView={setCurrentView} />}
        {currentView === 'admin-products' && <AdminProducts currentView={currentView} setCurrentView={setCurrentView} />}
        {currentView === 'admin-orders' && <AdminOrders currentView={currentView} setCurrentView={setCurrentView} />}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col antialiased selection:bg-blue-200 selection:text-gray-900 tracking-normal">
      <Header 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        cartItemsCount={cartItemsCount} 
        setIsCartOpen={setIsCartOpen}
      />

      <main className="flex-grow bg-white rounded-b-[40px] shadow-sm overflow-hidden mb-safe">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="w-full"
            style={{ willChange: 'opacity, transform' }}
          >
            {currentView === 'home' && <HomeView setCurrentView={setCurrentView} addToCart={addToCart} viewProduct={viewProduct} />}
            {currentView === 'category' && <CategoryView setCurrentView={setCurrentView} addToCart={addToCart} viewProduct={viewProduct} />}
            {currentView === 'product' && <ProductView setCurrentView={setCurrentView} currentProduct={currentProduct} addToCart={addToCart} viewProduct={viewProduct} />}
            {currentView === 'cart' && <CartView setCurrentView={setCurrentView} cartItems={cartItems} updateQuantity={updateQuantity} removeItem={removeItem} viewProduct={viewProduct} />}
            {currentView === 'checkout' && <CheckoutView setCurrentView={setCurrentView} cartItems={cartItems} />}
            {currentView === 'about' && <AboutView setCurrentView={setCurrentView} />}
            {currentView === 'faq' && <FAQView setCurrentView={setCurrentView} />}
            {currentView === 'contact' && <ContactView setCurrentView={setCurrentView} />}
            {currentView === 'privacy' && <PrivacyView setCurrentView={setCurrentView} />}
            {currentView === 'terms' && <TermsView setCurrentView={setCurrentView} />}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer setCurrentView={setCurrentView} />
      
      <CartDrawer 
        isOpen={isCartOpen}
        setIsOpen={setIsCartOpen}
        cartItems={cartItems}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
        setCurrentView={setCurrentView}
        viewProduct={viewProduct}
      />

      {/* Bottom Banner indicating preview & export */}
      <div className="bg-gray-900 text-white px-4 py-3 flex flex-col sm:flex-row items-center justify-between text-sm mt-auto shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="mb-2 sm:mb-0">
          <span className="font-bold mr-2">Preview Mode:</span> 
          Minimalist Electronics Layout ({currentView === 'home' ? 'Homepage' : currentView === 'category' ? 'Category Page' : 'Product Page'})
        </div>
        <button 
          onClick={handleDownload}
          disabled={isGenerating}
          className="bg-white text-gray-900 px-4 py-1.5 rounded font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          {isGenerating ? 'Packaging...' : 'Export to WooCommerce'}
        </button>
      </div>
    </div>
  );
}
