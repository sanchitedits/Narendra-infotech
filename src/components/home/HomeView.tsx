import React, { useState, useEffect } from 'react';
import { ChevronRight, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../../DataContext';
import { ViewType, Product } from '../../types';

interface HomeViewProps {
  setCurrentView: (view: ViewType) => void;
  addToCart: (product: Product) => void;
  viewProduct: (id: number) => void;
  viewCategory?: (category: string | null) => void;
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

export const HomeView = React.memo(function HomeView({ setCurrentView, addToCart, viewProduct, viewCategory }: HomeViewProps) {
  const { products } = useData();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [wishlist, setWishlist] = useState<Record<number, boolean>>({});

  const toggleWishlist = (e: React.MouseEvent, productId: number) => {
    e.stopPropagation();
    setWishlist(prev => ({ ...prev, [productId]: !prev[productId] }));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* 1. Hero Banner */}
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
                onClick={() => viewCategory ? viewCategory(null) : setCurrentView('category')} className="px-8 py-3 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors"
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

      {/* 2. 3 Promo Boxes */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Game Joysticks", img: "https://images.unsplash.com/photo-1592840496694-26d035b5253c?w=400&q=80",  cat: "Video Games" },
            { title: "IPS Monitors", img: "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?w=400&q=80",  cat: "Computers" },
            { title: "Sport Watches", img: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&q=80", cat: "Accessories" }
          ].map((promo, idx) => (
            <div key={idx} onClick={() => viewCategory && viewCategory(promo.cat)} className="bg-[#f8f9fa] rounded-md p-6 flex flex-col sm:flex-row items-center justify-between cursor-pointer group hover:bg-gray-100 transition-colors">
              <div className="text-center sm:text-left mb-4 sm:mb-0">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{promo.title}</h3>
                <span className="text-xs font-semibold tracking-wider flex items-center justify-center sm:justify-start text-gray-500 group-hover:text-blue-600 transition-colors uppercase">
                  SHOP NOW <ChevronRight className="w-3 h-3 ml-1" />
                </span>
              </div>
              <img src={promo.img} alt={promo.title} className="w-24 h-24 object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300" />
            </div>
          ))}
        </div>
      </div>

      {/* 3. Featured Products Grid (8 items) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Featured products</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product) => (
            <div key={product.id} className="group cursor-pointer flex flex-col relative w-full border border-gray-100 rounded-lg p-4 hover:border-gray-200 transition-colors bg-white shadow-sm hover:shadow-md" onClick={() => viewProduct(product.id)}>
               <div className="w-full aspect-square bg-white rounded-md overflow-hidden relative mb-4">
                <button 
                  className={`absolute top-2 right-2 z-10 transition-colors ${wishlist[product.id] ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                  onClick={(e) => toggleWishlist(e, product.id)}
                >
                  <Heart className={`w-5 h-5 ${wishlist[product.id] ? 'fill-current' : ''}`} />
                </button>
                <img src={product.image || undefined} alt={product.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transform transition-transform duration-500 ease-out" loading="lazy" />
                <div className="absolute inset-x-0 bottom-4 translate-y-[150%] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transform transition-all duration-300 ease-out flex justify-center px-4 z-20">
                  <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="bg-black/90 backdrop-blur text-white font-medium rounded py-2 px-6 text-sm hover:bg-black active:scale-95 transition-all w-full shadow-lg">
                    Quick Add
                  </button>
                </div>
              </div>
              <div className="flex flex-col mt-auto">
                <h3 className="text-sm font-semibold text-gray-900 leading-tight mb-2 line-clamp-2">{product.name}</h3>
                <span className="text-base font-medium text-gray-900">₹{Number(product.price).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Full Width Promo Banner */}
      <div className="bg-[#f0f2f5] overflow-hidden relative mx-4 sm:mx-6 lg:mx-8 my-8 rounded-md flex items-center justify-center min-h-[400px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center w-full relative z-10 flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-gray-900 mb-2">Xiaomi Book Air</h2>
          <p className="text-sm text-gray-500 mb-8 uppercase tracking-widest">WITH 2K OLED DISPLAY</p>
          <div className="flex items-center mb-10 text-sm text-gray-500">
             <span>STARTING AT</span>
             <span className="text-3xl font-light text-gray-900 ml-3">$950</span>
          </div>
          <img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80" alt="Xiaomi Book Air" className="max-h-80 mx-auto object-contain mix-blend-multiply" />
        </div>
      </div>
      
      {/* 5. Bento Grid - Featured Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Featured products</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
           {/* Left column (2 items) */}
           <div className="flex flex-col gap-6">
             {products.slice(8, 10).map((product) => (
                <div key={product.id} className="group cursor-pointer flex flex-col relative w-full border border-gray-100 rounded-lg p-4 bg-white shadow-sm hover:shadow-md flex-1" onClick={() => viewProduct(product.id)}>
                   <div className="w-full h-40 bg-white rounded-md overflow-hidden relative mb-4">
                     <button 
                       className={`absolute top-0 right-0 z-10 ${wishlist[product.id] ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                       onClick={(e) => toggleWishlist(e, product.id)}
                     >
                       <Heart className={`w-4 h-4 ${wishlist[product.id] ? 'fill-current' : ''}`} />
                     </button>
                     <img src={product.image || undefined} alt={product.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                   </div>
                   <div className="flex flex-col mt-auto">
                     <h3 className="text-sm font-semibold text-gray-900 mb-1 truncate">{product.name}</h3>
                     <span className="text-sm font-medium text-gray-900">₹{Number(product.price).toLocaleString()}</span>
                   </div>
                </div>
             ))}
           </div>
           
           {/* Middle column (1 large item) */}
           {products.length > 0 ? (
             <div className="lg:col-span-2 group cursor-pointer relative border border-gray-100 rounded-lg p-8 bg-white shadow-sm hover:shadow-md flex flex-col items-center justify-center min-h-[400px]" onClick={() => viewProduct(products[(10 % products.length)].id)}>
                <span className="absolute top-6 left-6 bg-blue-600 text-white text-xs px-2 py-1 rounded">-15%</span>
                <button 
                  className={`absolute top-6 right-6 z-10 ${wishlist[products[(10 % products.length)].id] ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                  onClick={(e) => toggleWishlist(e, products[(10 % products.length)].id)}
                >
                  <Heart className={`w-5 h-5 ${wishlist[products[(10 % products.length)].id] ? 'fill-current' : ''}`} />
                </button>
                
                <div className="w-full h-64 mb-8 relative flex justify-center items-center">
                   <img src={products[(10 % products.length)].image || undefined} alt={products[(10 % products.length)].name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="text-center w-full">
                   <h3 className="text-xl font-semibold text-gray-900 mb-2">{products[(10 % products.length)].name}</h3>
                   <div className="flex items-center justify-center gap-3">
                     <span className="text-xl font-medium text-gray-900">₹{(Number(products[(10 % products.length)].price) * 0.85).toLocaleString()}</span>
                     <span className="text-sm text-gray-400 line-through">₹{Number(products[(10 % products.length)].price).toLocaleString()}</span>
                   </div>
                </div>
                
                <div className="absolute inset-x-0 bottom-8 translate-y-[100%] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transform transition-all duration-300 ease-out flex justify-center px-8 z-20">
                    <button onClick={(e) => { e.stopPropagation(); addToCart(products[(10 % products.length)]); }} className="bg-black/90 backdrop-blur text-white font-medium rounded py-3 px-8 text-sm hover:bg-black active:scale-95 transition-all w-full shadow-lg">
                      Quick Add to Cart
                    </button>
                </div>
             </div>
           ) : (
             <div className="lg:col-span-2 flex items-center justify-center bg-gray-50 border border-gray-100 rounded-lg min-h-[400px]">
               <span className="text-gray-400">Loading featured product...</span>
             </div>
           )}
           
           {/* Right column (2 items) */}
           <div className="flex flex-col gap-6">
             {products.slice(11, 13).map((product) => (
                <div key={product.id} className="group cursor-pointer flex flex-col relative w-full border border-gray-100 rounded-lg p-4 bg-white shadow-sm hover:shadow-md flex-1" onClick={() => viewProduct(product.id)}>
                   <div className="w-full h-40 bg-white rounded-md overflow-hidden relative mb-4">
                     <button 
                       className={`absolute top-0 right-0 z-10 ${wishlist[product.id] ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                       onClick={(e) => toggleWishlist(e, product.id)}
                     >
                       <Heart className={`w-4 h-4 ${wishlist[product.id] ? 'fill-current' : ''}`} />
                     </button>
                     <img src={product.image || undefined} alt={product.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                   </div>
                   <div className="flex flex-col mt-auto">
                     <h3 className="text-sm font-semibold text-gray-900 mb-1 truncate">{product.name}</h3>
                     <span className="text-sm font-medium text-gray-900">₹{Number(product.price).toLocaleString()}</span>
                   </div>
                </div>
             ))}
           </div>
        </div>
      </div>

      {/* 6. Two Promo Banners */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-[#f8f9fa] rounded-lg p-10 flex flex-col sm:flex-row items-center justify-between overflow-hidden cursor-pointer group hover:bg-gray-100 transition-colors">
              <div className="z-10 relative mb-6 sm:mb-0">
                <p className="text-xs text-gray-500 mb-2 tracking-wider">MF841HN/A 13"</p>
                <h3 className="text-3xl font-medium text-gray-900 mb-6">E-77 Camera</h3>
                <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider">WEEKEND SALE</p>
                <p className="text-5xl font-light text-gray-900">20%</p>
              </div>
              <img src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80" alt="Camera" className="w-48 h-48 mix-blend-multiply object-contain z-0 group-hover:scale-105 transition-transform duration-500" />
           </div>
           
           <div className="bg-[#f8f9fa] rounded-lg p-10 flex flex-col sm:flex-row items-center justify-between overflow-hidden cursor-pointer group hover:bg-gray-100 transition-colors">
              <div className="z-10 relative mb-6 sm:mb-0">
                <p className="text-xs text-gray-500 mb-2 tracking-wider">with Bluetooth 5.1</p>
                <h3 className="text-3xl font-medium text-gray-900 mb-6">HP Ultimate</h3>
                <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider">DISCOUNT -30%</p>
                <p className="text-5xl font-light text-gray-900">$349</p>
              </div>
              <img src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&q=80" alt="Headphones" className="w-48 h-48 mix-blend-multiply object-contain z-0 group-hover:scale-105 transition-transform duration-500" />
           </div>
        </div>
      </div>

      {/* 7. Top Categories List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-100 mt-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-10">Top categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
           
           {[
             { title: "Smartphones\nAnd Tablets", img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&q=80", links: ["Accessories", "Action Games", "Game Consoles", "Racing Games", "Station Consoles", "TV & Audio"] },
             { title: "Headphones\n", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80", links: ["Accessories", "Action Games", "Game Consoles", "Racing Games", "Station Consoles", "TV & Audio"] },
             { title: "Video games\n& Consoles", img: "https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=200&q=80", links: ["Accessories", "Action Games", "Game Consoles", "Racing Games", "Station Consoles", "TV & Audio"] },
             { title: "Home Entertainment\n", img: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=200&q=80", links: ["Accessories", "Action Games", "Game Consoles", "Racing Games", "Station Consoles", "TV & Audio"] }
           ].map((cat, idx) => (
              <div key={idx} className="flex flex-col">
                 <div className="flex items-center space-x-4 mb-6">
                   <div className="w-14 h-14 bg-[#f8f9fa] rounded-md flex items-center justify-center p-2 flex-shrink-0">
                     <img src={cat.img} alt={cat.title} className="w-full h-full object-cover mix-blend-multiply rounded" />
                   </div>
                   <h3 className="font-semibold text-base text-gray-900 whitespace-pre-wrap leading-tight">{cat.title}</h3>
                 </div>
                 <ul className="space-y-3 mb-6">
                   {cat.links.map((link, lidx) => (
                     <li key={lidx}>
                       <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors" onClick={(e) => { e.preventDefault(); viewCategory && viewCategory(null); }}>{link}</a>
                     </li>
                   ))}
                 </ul>
                 <a href="#" className="text-xs font-semibold uppercase tracking-wider text-gray-900 flex items-center hover:text-blue-600 transition-colors" onClick={(e) => { e.preventDefault(); viewCategory && viewCategory(null); }}>
                   VIEW ALL <ChevronRight className="w-3 h-3 ml-1" />
                 </a>
              </div>
           ))}
           
        </div>
      </div>

      {/* 8. Brands Logo Carousel/List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-[#f8f9fa] rounded-lg py-12 px-8 flex justify-center md:justify-between items-center gap-8 flex-wrap">
           {/* We use some simple SVG icons for brand logos placeholder */}
           <div className="text-xl font-bold font-mono text-gray-400 hover:text-gray-900 transition-colors cursor-pointer">/N</div>
           <div className="text-xl font-bold font-sans text-gray-400 flex items-center gap-2 hover:text-gray-900 transition-colors cursor-pointer"><span className="w-6 h-6 rounded-full bg-gray-400 text-white flex items-center justify-center text-xs">D</span> logodesign</div>
           <div className="text-xl font-bold font-serif text-gray-400 hover:text-gray-900 transition-colors cursor-pointer">nulla</div>
           <div className="text-xl font-bold font-sans text-gray-400 flex items-center gap-1 hover:text-gray-900 transition-colors cursor-pointer"><div className="flex space-x-1"><div className="w-2 h-4 bg-gray-400"></div><div className="w-2 h-4 bg-gray-400"></div></div></div>
           <div className="text-xl font-bold font-sans tracking-[0.2em] text-gray-400 hover:text-gray-900 transition-colors cursor-pointer">INFINTY</div>
           <div className="text-xl font-bold font-sans text-gray-400 flex items-center gap-2 hover:text-gray-900 transition-colors cursor-pointer"><div className="w-6 h-6 border-2 border-gray-400 flex items-center justify-center"><div className="w-2 h-2 bg-gray-400"></div></div> SQUARE</div>
        </div>
      </div>

      {/* 9. Latest Blog Posts */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-100">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-8">Latest blog posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { date: "14 NOVEMBER, 2023", cat: "ELECTRONICS", title: "New Trends In Digital Media", img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80" },
             { date: "14 NOVEMBER, 2023", cat: "ELECTRONICS", title: "The Best Games For Pc", img: "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?w=600&q=80" },
             { date: "14 NOVEMBER, 2023", cat: "ELECTRONICS", title: "Check Out Our New App!", img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80" }
           ].map((post, idx) => (
             <div key={idx} className="group cursor-pointer flex flex-col">
               <div className="w-full h-56 bg-gray-100 rounded-lg overflow-hidden mb-5">
                 <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
               </div>
               <div className="text-[10px] text-gray-400 mb-2 uppercase tracking-wider font-semibold">
                 {post.date} <span className="mx-2 font-light">|</span> {post.cat}
               </div>
               <h3 className="text-lg font-semibold text-gray-900 mb-3">{post.title}</h3>
               <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. In augue ligula, feugiat ut nulla...</p>
             </div>
           ))}
        </div>
      </div>
    </>
  );
});
