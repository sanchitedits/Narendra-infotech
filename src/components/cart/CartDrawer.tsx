import React from 'react';
import { X, Minus, Plus, ArrowRight } from 'lucide-react';
import { CartItem, ViewType } from '../../types';

interface CartDrawerProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  cartItems: CartItem[];
  updateQuantity: (id: number, delta: number) => void;
  removeItem: (id: number) => void;
  setCurrentView: (view: ViewType) => void;
  viewProduct: (id: number) => void;
}

export const CartDrawer = React.memo(function CartDrawer({ isOpen, setIsOpen, cartItems, updateQuantity, removeItem, setCurrentView, viewProduct }: CartDrawerProps) {
  const subtotal = cartItems.reduce((acc, item) => {
    const priceNum = parseFloat(item.price.replace(/[^\d.-]/g, ''));
    return acc + (priceNum * item.quantity);
  }, 0);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-gray-900/50 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setIsOpen(false)} 
      />
      
      {/* Drawer */}
      <div className={`fixed inset-y-0 right-0 w-full md:w-[400px] bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Your Cart ({cartItems.length})</h2>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-900 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-12 flex flex-col items-center justify-center h-full">
              <p className="text-gray-500 mb-6 text-lg">Your cart is empty.</p>
              <button 
                onClick={() => { setIsOpen(false); setCurrentView('category'); }}
                className="bg-blue-600 text-white font-medium rounded px-8 py-3 hover:bg-blue-700 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {cartItems.map(item => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-20 h-20 bg-white border border-gray-100 rounded p-2 flex-shrink-0 cursor-pointer hover:border-gray-300 transition-colors" onClick={() => { setIsOpen(false); viewProduct(item.id); }}>
                    <img onError={(e) => { e.currentTarget.src = "https://placehold.co/600x600/f3f4f6/9ca3af?text=No+Image" }}  src={item.image || undefined} alt={item.name} className="w-full h-full object-contain mix-blend-multiply transform-gpu transition-transform hover:scale-105 duration-300 will-change-transform" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-sm font-semibold text-gray-900 pr-2 line-clamp-1 cursor-pointer hover:underline" onClick={() => { setIsOpen(false); viewProduct(item.id); }}>{item.name}</h3>
                        <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-gray-900 flex-shrink-0 bg-gray-50 rounded-full p-1 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Color: Matte Black</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center bg-gray-50 rounded-full h-8">
                        <button onClick={() => updateQuantity(item.id, -1)} className="px-3 text-gray-500 hover:text-gray-900 transition-colors">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-semibold text-gray-900 text-xs w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="px-3 text-gray-500 hover:text-gray-900 transition-colors">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="font-semibold text-gray-900 text-sm tracking-tight">
                        ₹{(parseFloat(item.price.replace(/[^\d.-]/g, '')) * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600 font-medium">Subtotal</span>
              <span className="font-bold text-gray-900 text-lg">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <p className="text-xs text-gray-500 mb-4">Shipping and taxes calculated at checkout.</p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => { setIsOpen(false); setCurrentView('checkout'); }}
                className="w-full bg-blue-600 rounded text-white font-medium h-12 hover:bg-blue-700 transition-all active:scale-[0.98] flex justify-center items-center gap-2 group"
              >
                Checkout <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => { setIsOpen(false); setCurrentView('cart'); }}
                className="w-full bg-white rounded border border-gray-200 text-gray-900 font-medium h-12 hover:bg-gray-50 transition-all active:scale-[0.98]"
              >
                View Full Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
});
