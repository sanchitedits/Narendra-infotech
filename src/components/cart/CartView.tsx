import React from 'react';
import { ChevronRight, Minus, Plus, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { ViewType, CartItem } from '../../types';

interface CartViewProps {
  setCurrentView: (view: ViewType) => void;
  cartItems: CartItem[];
  updateQuantity: (id: number, delta: number) => void;
  removeItem: (id: number) => void;
  viewProduct: (id: number) => void;
}

export const CartView = React.memo(function CartView({ setCurrentView, cartItems, updateQuantity, removeItem, viewProduct }: CartViewProps) {
  const subtotal = cartItems.reduce((acc, item) => {
    const priceNum = parseFloat(item.price.replace(/[^\d.-]/g, ''));
    return acc + (priceNum * item.quantity);
  }, 0);

  const shipping = subtotal > 15000 ? 0 : 500;
  const total = subtotal + shipping;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8 w-full">
        <button onClick={() => setCurrentView('home')} className="hover:text-gray-900">Home</button>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-900 font-medium">Shopping Cart</span>
      </nav>

      <div className="flex justify-between items-end mb-10">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tighter text-gray-900">Your Cart</h1>
        <span className="text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full text-sm">{cartItems.length} Items</span>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-24 border-y border-gray-200">
          <p className="text-gray-500 mb-6 text-lg">Your cart is currently empty.</p>
          <button 
            onClick={() => setCurrentView('category')}
            className="bg-blue-600 text-white font-medium rounded px-8 py-3 hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="hidden sm:grid grid-cols-5 text-sm font-bold text-gray-400 uppercase tracking-wider pb-4 border-b border-gray-200">
              <div className="col-span-3">Product</div>
              <div className="text-center">Quantity</div>
              <div className="text-right">Total</div>
            </div>

            {cartItems.map((item) => (
              <div key={item.id} className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-center pb-8 border-b border-gray-200">
                <div className="col-span-1 sm:col-span-3 flex gap-6">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white border border-gray-100 rounded-md p-4 flex-shrink-0 cursor-pointer hover:border-gray-300 transition-colors" onClick={() => viewProduct(item.id)}>
                    <img onError={(e) => { e.currentTarget.src = "https://placehold.co/600x600/f3f4f6/9ca3af?text=No+Image" }}  src={item.image || undefined} alt={item.name} className="w-full h-full object-contain mix-blend-multiply transform-gpu transition-transform duration-300 hover:scale-105 will-change-transform" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">{item.category}</p>
                    <h3 className="text-base font-semibold text-gray-900 mb-2 cursor-pointer hover:underline tracking-tight">{item.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">Color: Matte Black</p>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-gray-900 text-sm flex items-center gap-1 w-fit transition-colors bg-gray-50 px-3 py-1.5 rounded-full"
                    >
                      <X className="w-3 h-3" /> Remove
                    </button>
                  </div>
                </div>

                <div className="sm:col-span-1 flex justify-start sm:justify-center">
                  <div className="flex items-center bg-gray-50 rounded-full h-10 w-28 border border-transparent">
                    <button onClick={() => updateQuantity(item.id, -1)} className="flex-1 flex justify-center items-center h-full text-gray-500 hover:text-gray-900 transition-colors">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-semibold text-gray-900 text-sm w-8 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="flex-1 flex justify-center items-center h-full text-gray-500 hover:text-gray-900 transition-colors">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="sm:col-span-1 text-right flex justify-between sm:block">
                  <span className="sm:hidden text-gray-500">Total:</span>
                  <span className="font-bold text-gray-900 text-lg">
                    ₹{(parseFloat(item.price.replace(/[^\d.-]/g, '')) * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Special Instructions & Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#f0f2f5] border border-gray-100 rounded-md p-6 md:p-8 flex flex-col gap-6">
              <h3 className="text-xl font-semibold tracking-tight text-gray-900 border-b border-gray-200/50 pb-4">Order Summary</h3>
              
              <div className="flex flex-col gap-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping {shipping === 0 && <span className="text-gray-400 ml-1">(Over ₹15000)</span>}</span>
                  <span className="font-medium text-gray-900">{shipping === 0 ? 'Free' : `₹${shipping.toLocaleString('en-IN')}`}</span>
                </div>
              </div>

              <div className="border-t border-gray-200/50 pt-4 flex justify-between items-center">
                <span className="font-semibold text-gray-900 text-lg">Total</span>
                <span className="font-semibold tracking-tighter text-gray-900 text-2xl">₹{total.toLocaleString('en-IN')}</span>
              </div>

              <p className="text-xs text-gray-500">Taxes and additional shipping costs calculated at checkout.</p>

              <button 
                onClick={() => setCurrentView('checkout')}
                className="w-full bg-blue-600 text-white font-medium rounded h-12 hover:bg-blue-700 transition-all flex justify-center items-center gap-2 group active:scale-[0.98] shadow-md"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="pt-4 border-t border-gray-200/50 flex items-center justify-center gap-2 text-xs text-gray-500 font-medium">
                <ShieldCheck className="w-4 h-4 opacity-70" /> Secure checkout powered by N-Infotech
              </div>
            </div>

            <div className="mt-8 bg-white border border-gray-100 rounded-md p-6">
              <p className="text-sm font-semibold text-gray-900 mb-3 tracking-tight">Order Notes</p>
              <textarea 
                className="w-full bg-white border border-gray-200 rounded p-4 text-sm outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-shadow resize-none h-24 shadow-sm"
                placeholder="Special instructions for seller..."
              ></textarea>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
