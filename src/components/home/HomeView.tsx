import React, { useState, useEffect } from 'react';
import { ChevronRight, Star, Truck, ShieldCheck, RefreshCw, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../../DataContext';
import { ViewType, Product } from '../../types';

interface HomeViewProps {
  setCurrentView: (view: ViewType) => void;
  addToCart: (product: Product) => void;
  viewProduct: (id: number) => void;
}

const slides = [
  {
    id: 1,
    title1: "Laptops up to",
    title2: "– 20% off",
    desc: "The biggest risk is a missed opportunity.",
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80",
    rotate: -12,
    scale: 1.1
  },
  {
    id: 2,
    title1: "Audio tailored",
    title2: "for your ears",
    desc: "Experience pristine sound quality with our new headphones.",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80",
    rotate: -5,
    scale: 1.05
  },
  {
    id: 3,
    title1: "Smartwatches",
    title2: "for an active life",
    desc: "Track everything, miss nothing.",
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80",
    rotate: 8,
    scale: 1
  }
];

export const HomeView = React.memo(function HomeView({ setCurrentView, addToCart, viewProduct }: HomeViewProps) {
  const { products, categories } = useData();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div className="bg-[#f0f2f5] overflow-hidden relative mx-4 sm:mx-6 lg:mx-8 mt-6 rounded-md">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative z-10 flex flex-col md:flex-row items-center min-h-[450px] md:min-h-[500px]"
          >
            <div className="max-w-xl md:w-1/2">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
                className="text-5xl md:text-6xl font-medium tracking-tight text-gray-900 mb-4 leading-tight"
              >
                {slides[currentSlide].title1}<br />
                <span className="text-gray-900">{slides[currentSlide].title2}</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.2 }}
                className="text-lg text-gray-600 mb-8 font-normal"
              >
                {slides[currentSlide].desc}
              </motion.p>
              <motion.button 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }}
                onClick={() => setCurrentView('category')} className="px-8 py-3 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors"
               >
                SHOP NOW
              </motion.button>
            </div>
            <div className="md:w-1/2 mt-10 md:mt-0 relative flex justify-center w-full min-h-[300px]">
              <motion.img 
                initial={{ opacity: 0, scale: 0.8, rotate: 0, filter: 'blur(10px)' }} 
                animate={{ opacity: 1, scale: slides[currentSlide].scale, rotate: slides[currentSlide].rotate, filter: 'blur(0px)' }} 
                transition={{ duration: 0.5, type: 'spring', stiffness: 120, damping: 20, delay: 0.1 }}
                src={slides[currentSlide].image} 
                alt="Product" 
                className="w-full max-w-md mix-blend-multiply drop-shadow-2xl object-cover rounded-xl" 
              />
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {slides.map((_, idx) => (
            <button 
              key={idx} 
              onClick={() => setCurrentSlide(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${currentSlide === idx ? 'bg-gray-900 w-6' : 'bg-gray-400 hover:bg-gray-600'}`}
            />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Shop by Category</h2>
          <a href="#" onClick={(e) => { e.preventDefault(); setCurrentView('category'); }} className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center">
            All Categories <ChevronRight className="w-4 h-4 ml-1" />
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <div key={index} onClick={() => setCurrentView('category')} className="bg-white rounded-3xl p-6 hover:bg-gray-50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer group flex flex-col justify-between h-40 border border-gray-100">
              <h3 className="font-medium text-gray-900 text-lg">{category.name}</h3>
              <span className="text-sm text-gray-400 font-medium">{category.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Featured products</h2>
          <a href="#" onClick={(e) => { e.preventDefault(); setCurrentView('category'); }} className="hidden sm:flex text-sm font-medium text-gray-500 hover:text-gray-900 items-center">
            View All <ChevronRight className="w-4 h-4 ml-1" />
          </a>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
        >
          {products.map((product) => (
            <motion.div 
              key={product.id} 
              className="group cursor-pointer flex flex-col relative w-full" 
              onClick={() => viewProduct(product.id)}
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
            >
              <div className="w-full aspect-square bg-[#f0f2f5] rounded-md overflow-hidden relative mb-4 hover:shadow-[0_4px_20px_rgb(0,0,0,0.05)] transition-shadow duration-300">
                <button className="absolute top-4 right-4 text-gray-400 hover:text-red-500 z-10 transition-colors">
                  <Heart className="w-5 h-5 fill-current border-none" />
                </button>
                <img 
                  src={product.image} 
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
      </div>

      <div className="bg-[#f0f2f5] overflow-hidden relative mx-4 sm:mx-6 lg:mx-8 my-8 rounded-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-gray-900 mb-2">Xiaomi Book Air</h2>
          <p className="text-sm text-gray-500 mb-8 uppercase tracking-widest">WITH 2K OLED DISPLAY</p>
          <img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80" alt="Xiaomi Book Air" className="max-h-80 mx-auto object-contain mix-blend-multiply" />
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left mb-16">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_4px_24px_-10px_rgba(0,0,0,0.05)] hover:scale-[1.02] transition-transform duration-300">
            <div className="w-12 h-12 bg-[#F5F5F7] rounded-full flex items-center justify-center mb-6 mx-auto sm:mx-0">
              <Truck className="w-6 h-6 text-gray-900" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3 text-lg">Free Global Shipping</h4>
            <p className="text-gray-500 text-sm leading-relaxed">On all orders over ₹15000. Tracked and insured delivery to your doorstep.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_4px_24px_-10px_rgba(0,0,0,0.05)] hover:scale-[1.02] transition-transform duration-300">
            <div className="w-12 h-12 bg-[#F5F5F7] rounded-full flex items-center justify-center mb-6 mx-auto sm:mx-0">
              <ShieldCheck className="w-6 h-6 text-gray-900" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3 text-lg">2-Year Warranty</h4>
            <p className="text-gray-500 text-sm leading-relaxed">All products come with a comprehensive manufacturer's warranty included.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_4px_24px_-10px_rgba(0,0,0,0.05)] hover:scale-[1.02] transition-transform duration-300">
            <div className="w-12 h-12 bg-[#F5F5F7] rounded-full flex items-center justify-center mb-6 mx-auto sm:mx-0">
              <RefreshCw className="w-6 h-6 text-gray-900" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3 text-lg">30-Day Returns</h4>
            <p className="text-gray-500 text-sm leading-relaxed">Not completely satisfied? Return it within 30 days for a full refund.</p>
          </div>
        </div>
      </div>
    </>
  );
});
