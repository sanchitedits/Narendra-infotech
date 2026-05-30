import React, { useState } from 'react';
import { ChevronRight, Star, Minus, Plus, Truck, ShieldCheck, ChevronDown, ChevronUp, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../../DataContext';
import { ViewType, Product } from '../../types';

interface ProductViewProps {
  setCurrentView: (view: ViewType) => void;
  currentProduct: Product | null;
  addToCart: (product: Product, quantity: number) => void;
  viewProduct: (id: number) => void;
}

export const ProductView = React.memo(function ProductView({ setCurrentView, currentProduct, addToCart, viewProduct }: ProductViewProps) {
  const { products } = useData();
  const [qty, setQty] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'Specifications': true,
  });

  React.useEffect(() => {
    if (currentProduct) {
        setActiveImageIndex(0);
        setQty(1);
    }
  }, [currentProduct?.id]);

  if (!currentProduct) {
      return <div className="max-w-7xl mx-auto py-20 text-center">Loading product...</div>;
  }

  const images = [
    currentProduct.image,
    currentProduct.image,
    currentProduct.image,
    currentProduct.image, // In a real app these would be unique product images
  ];

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const handleNext = () => setActiveImageIndex((prev) => (prev + 1) % images.length);
  const handlePrev = () => setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8 w-full">
        <button onClick={() => setCurrentView('home')} className="hover:text-gray-900">Home</button>
        <ChevronRight className="w-3 h-3" />
        <button onClick={() => setCurrentView('category')} className="hover:text-gray-900">{currentProduct.category}</button>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-900 font-medium">{currentProduct.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        <div className="flex flex-col gap-4">
          <div className="w-full aspect-square bg-white border border-gray-100 rounded-md flex items-center justify-center overflow-hidden p-8 relative group">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={activeImageIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  src={images[activeImageIndex]} 
                  alt={`${currentProduct.name} ${activeImageIndex}`}
                  className="w-full h-full object-contain mix-blend-multiply transform-gpu duration-700 ease-in-out cursor-grab active:cursor-grabbing hover:scale-105 will-change-transform"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe = swipePower(offset.x, velocity.x);
                    if (swipe < -swipeConfidenceThreshold) {
                      handleNext();
                    } else if (swipe > swipeConfidenceThreshold) {
                      handlePrev();
                    }
                  }}
                />
              </AnimatePresence>
              
              <button 
                className="hidden sm:flex absolute left-4 w-10 h-10 rounded-full bg-white border border-gray-200 items-center justify-center shadow-sm hover:bg-gray-50 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handlePrev}
              >
                 <ChevronRight className="w-5 h-5 text-gray-900 rotate-180" />
              </button>
              <button 
                className="hidden sm:flex absolute right-4 w-10 h-10 rounded-full bg-white border border-gray-200 items-center justify-center shadow-sm hover:bg-gray-50 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleNext}
              >
                 <ChevronRight className="w-5 h-5 text-gray-900" />
              </button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {images.map((img, i) => (
              <div 
                key={i} 
                onClick={() => setActiveImageIndex(i)}
                className={`aspect-square p-2 rounded-md bg-white border-2 transition-colors ${i === activeImageIndex ? 'border-blue-600' : 'border-gray-100 hover:border-gray-300 opacity-70 hover:opacity-100'} cursor-pointer`}
              >
                  <img 
                  src={img} 
                  alt={`${currentProduct.name} ${i}`}
                  className="w-full h-full object-contain mix-blend-multiply"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col pt-2 lg:pt-6">
          <div className="mb-6 border-b border-gray-100 pb-6">
            <p className="text-sm font-semibold text-gray-500 tracking-tight mb-2">{currentProduct.category}</p>
            <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tighter mb-4">{currentProduct.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-2xl font-semibold text-gray-900 tracking-tight">₹{Number(currentProduct.price).toLocaleString()}</span>
              <div className="flex flex-col">
                <div className="flex items-center gap-0.5 text-gray-800">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < currentProduct.rating ? 'fill-gray-900 text-gray-900' : 'text-gray-200'}`} />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-500 leading-relaxed text-sm md:text-base">
              {currentProduct.description || 'Engineered for deep focus. These premium over-ear headphones deliver industry-leading noise cancellation, crystal-clear audio, and a minimalist design that looks as good as it sounds. Includes a minimal protective case.'}
            </p>
          </div>

          {currentProduct.variants && currentProduct.variants.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Variant:</h4>
              <div className="flex flex-wrap gap-3">
                {currentProduct.variants.map((variant, idx) => (
                  <button key={idx} className="px-4 py-2 border border-gray-200 rounded text-sm text-gray-700 hover:border-gray-900 transition-colors bg-white">
                    {variant}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4 mb-8">
            <div className="flex items-center bg-white rounded border border-gray-200 h-12 w-full sm:w-32">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="flex-1 flex justify-center items-center h-full text-gray-500 hover:text-gray-900 transition-colors">
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-medium text-gray-900 w-12 text-center">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="flex-1 flex justify-center items-center h-full text-gray-500 hover:text-gray-900 transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => addToCart(currentProduct, qty)} 
                className="w-full bg-white border border-gray-200 rounded text-gray-900 font-medium h-12 hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-[0.98] shadow-sm flex justify-center items-center gap-2"
              >
                Add to Cart
              </button>
              <button 
                onClick={() => { addToCart(currentProduct, qty); setCurrentView('checkout'); }} 
                className="w-full bg-blue-600 rounded text-white font-medium h-12 hover:bg-blue-700 transition-all active:scale-[0.98] shadow-sm flex justify-center items-center gap-2"
              >
                Buy it now
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 py-6 border-y border-gray-200 mb-8">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Truck className="w-4 h-4 text-gray-900" /> Free Next-Day Delivery
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <ShieldCheck className="w-4 h-4 text-gray-900" /> 2-Year International Warranty
            </div>
          </div>

          <div className="flex flex-col">
            {['Specifications', "What's in the Box", 'Shipping & Returns'].map((tab, i) => (
              <div key={i} className="border-b border-gray-200 py-4 group">
                <div 
                  className="flex justify-between items-center text-sm font-bold text-gray-900 cursor-pointer"
                  onClick={() => toggleSection(tab)}
                >
                  {tab}
                  {openSections[tab] ? (
                    <ChevronUp className="w-4 h-4 text-gray-900 transition-colors" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-900 transition-colors" />
                  )}
                </div>
                
                {openSections[tab] && (
                  <div className="mt-4 text-sm text-gray-600">
                    {tab === 'Specifications' && currentProduct.specifications && (
                      <div className="space-y-3">
                        {Object.entries(currentProduct.specifications).map(([key, value]) => (
                          <div key={key} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                            <span className="font-semibold text-gray-900 sm:w-1/3">{key}</span>
                            <span className="sm:w-2/3">{value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {tab === "What's in the Box" && currentProduct.inTheBox && (
                      <ul className="list-disc pl-5 space-y-2">
                        {currentProduct.inTheBox.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    )}
                    
                    {tab === 'Shipping & Returns' && (
                      <div>
                         We process your order within 24 hours. The standard shipping takes 2-5 days depending on your location. 
                         You can return this item within 30 days of receipt if you are not fully satisfied.
                      </div>
                    )}
                    
                    {((tab === 'Specifications' && !currentProduct.specifications) || 
                       (tab === "What's in the Box" && !currentProduct.inTheBox)) && (
                      <div className="text-gray-500 italic">Information not available for this product.</div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-24 pt-16 border-t border-gray-100">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900 mb-10">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.filter(p => p.id !== currentProduct.id).map((product) => (
            <div key={product.id} className="group cursor-pointer flex flex-col relative w-full" onClick={() => viewProduct(product.id)}>
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
