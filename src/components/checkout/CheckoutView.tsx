import React, { useState } from 'react';
import { ChevronRight, ShieldCheck, Lock, Loader2 } from 'lucide-react';
import { ViewType, CartItem } from '../../types';

interface CheckoutViewProps {
  setCurrentView: (view: ViewType) => void;
  cartItems: CartItem[];
}

export const CheckoutView = React.memo(function CheckoutView({ setCurrentView, cartItems }: CheckoutViewProps) {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8">You need to add items to your cart before proceeding to checkout.</p>
        <button 
          onClick={() => setCurrentView('category')}
          className="bg-blue-600 rounded text-white font-medium px-8 py-3 hover:bg-blue-700 transition-all inline-flex items-center gap-2 group active:scale-[0.98] shadow-md"
        >
          Browse Products <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    );
  }

  const subtotal = cartItems.reduce((acc, item) => {
    const priceNum = parseFloat(item.price.replace(/[^\d.-]/g, ''));
    return acc + (priceNum * item.quantity);
  }, 0);

  const shipping = subtotal > 15000 ? 0 : 500;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    setIsProcessing(true);
    setCheckoutMessage(null);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems,
          total: total,
          customer: {
            name: `${formData.firstName} ${formData.lastName}`.trim(),
            email: formData.email,
            phone: formData.phone
          }
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setCheckoutMessage({
          type: 'success',
          text: `Order initialized! (Session: ${data.payment_session_id}). Redirecting to Cashfree Gateway...`
        });
        
        // If it was real, you would redirect the user to Cashfree checkout UI here
        // window.location.href = `https://payments.cashfree.com/order/#${data.payment_session_id}`;
      } else {
        setCheckoutMessage({
          type: 'error',
          text: data.error || 'Failed to initialize checkout.'
        });
      }
    } catch (error) {
      setCheckoutMessage({
        type: 'error',
        text: 'Network error communicating with server.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8 w-full">
        <button onClick={() => setCurrentView('cart')} className="hover:text-gray-900">Cart</button>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-900 font-medium">Checkout</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 flex-col-reverse lg:flex-row">
        {/* Checkout Form */}
        <div className="lg:col-span-7 flex flex-col gap-10 order-2 lg:order-1">
          <div>
            <h2 className="text-2xl font-semibold tracking-tighter text-gray-900 mb-6">Contact Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-gray-200 rounded p-3 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all shadow-sm"
                  placeholder="john@example.com"
                />
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <input type="checkbox" id="offers" className="rounded-sm border-gray-300 text-blue-600 focus:ring-blue-600 w-4 h-4" />
                <label htmlFor="offers">Email me with news and offers</label>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold tracking-tighter text-gray-900 mb-6">Shipping Address</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">First name</label>
                <input 
                  type="text" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-gray-200 rounded p-3 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all shadow-sm"
                />
              </div>
              <div className="sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Last name</label>
                <input 
                  type="text" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-gray-200 rounded p-3 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all shadow-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input 
                  type="text" 
                  className="w-full bg-white border border-gray-200 rounded p-3 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all shadow-sm"
                  placeholder="Apartment, suite, etc. (optional)"
                />
              </div>
              <div className="sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input 
                  type="text" 
                  className="w-full bg-white border border-gray-200 rounded p-3 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all shadow-sm"
                />
              </div>
              <div className="sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Postal code</label>
                <input 
                  type="text" 
                  className="w-full bg-white border border-gray-200 rounded p-3 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all shadow-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-gray-200 rounded p-3 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all shadow-sm"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold tracking-tighter text-gray-900 mb-6">Payment</h2>
            <div className="border border-gray-200 rounded-2xl bg-gray-50/50 p-8 flex flex-col items-center justify-center text-center gap-3 relative overflow-hidden">
              <Lock className="w-8 h-8 text-gray-400" />
              <p className="text-gray-900 font-medium">Payment Gateway Ready</p>
              <p className="text-sm text-gray-500 max-w-sm">
                This store is connected to Cashfree. Upon clicking pay, you will securely complete your transaction.
              </p>
            </div>
          </div>

          {checkoutMessage && (
            <div className={`p-4 rounded-lg text-sm font-medium ${checkoutMessage.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
              {checkoutMessage.text}
            </div>
          )}

          <button 
            type="button"
            onClick={handleCheckout}
            disabled={isProcessing}
            className="w-full bg-blue-600 rounded text-white font-medium h-12 hover:bg-blue-700 transition-all mt-4 active:scale-[0.98] shadow-md disabled:bg-blue-400 flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
            ) : (
              'Pay now'
            )}
          </button>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-5 relative order-1 lg:order-2">
          <div className="bg-[#f0f2f5] rounded-md border border-gray-100 p-6 md:p-8 sticky top-8">
            <h3 className="text-xl font-semibold tracking-tighter text-gray-900 mb-6">Order Summary</h3>
            
            <div className="flex flex-col gap-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="w-16 h-16 bg-white border border-gray-200 rounded p-1 flex-shrink-0 relative">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply p-1" />
                    <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-gray-500">{item.category}</p>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      ₹{(parseFloat(item.price.replace(/[^\d.-]/g, '')) * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200/50 pt-6 flex flex-col gap-3 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-medium text-gray-900">{shipping === 0 ? 'Free' : `₹${shipping.toLocaleString('en-IN')}`}</span>
              </div>
            </div>

            <div className="border-t border-gray-200/50 mt-6 pt-6 flex justify-between items-center">
              <span className="font-semibold text-gray-900 text-lg">Total</span>
              <span className="font-semibold tracking-tighter text-gray-900 text-3xl">₹{total.toLocaleString('en-IN')}</span>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200/50 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-500 font-medium justify-center">
                <ShieldCheck className="w-5 h-5 text-gray-400 opacity-70" />
                <span>Secure Checkout powered by N-Infotech</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
