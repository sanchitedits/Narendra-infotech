import React, { useState } from 'react';
import { ViewType } from '../../types';

interface FooterProps {
  setCurrentView: (view: ViewType) => void;
}

export const Footer = React.memo(function Footer({ setCurrentView }: FooterProps) {
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribed(true);
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  return (
    <footer className="bg-[#1C1C1C] text-gray-400 py-16 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between border-b border-gray-800 pb-12 mb-12 gap-8">
          <h3 className="text-2xl font-semibold text-white whitespace-nowrap">Sign up to Newsletter</h3>
          <form onSubmit={handleSubscribe} className="flex-1 w-full max-w-2xl relative">
            <input 
              type="email" 
              placeholder="Your Email Address:" 
              required
              className="bg-transparent border border-gray-700 rounded-md text-sm px-4 py-3 w-full outline-none focus:border-gray-500 transition-colors text-white"
              disabled={isSubscribed}
            />
            <button 
              type="submit"
              disabled={isSubscribed}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-800 rounded-md transition-colors text-white"
            >
              {isSubscribed ? '✓' : '✉'}
            </button>
          </form>
          <div className="flex gap-4">
            <span className="text-white font-medium">Follow us:</span>
            {/* Social Icons Placeholders */}
            <div className="flex gap-2">
              <div className="w-6 h-6 border border-gray-700 rounded flex items-center justify-center hover:text-white cursor-pointer">In</div>
              <div className="w-6 h-6 border border-gray-700 rounded flex items-center justify-center hover:text-white cursor-pointer">Tw</div>
              <div className="w-6 h-6 border border-gray-700 rounded flex items-center justify-center hover:text-white cursor-pointer">Fb</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="font-semibold text-white mb-6 text-sm tracking-widest">Privacy Policy</h4>
            <ul className="space-y-3">
              <li><button onClick={() => setCurrentView('category')} className="text-sm hover:text-white transition-colors">Returns & Exchanges</button></li>
              <li><button onClick={() => setCurrentView('category')} className="text-sm hover:text-white transition-colors">Payment Terms</button></li>
              <li><button onClick={() => setCurrentView('category')} className="text-sm hover:text-white transition-colors">Delivery Terms</button></li>
              <li><button onClick={() => setCurrentView('privacy')} className="text-sm hover:text-white transition-colors">Privacy Policy</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-6 text-sm tracking-widest">Get Involved</h4>
            <ul className="space-y-3">
              <li><button onClick={() => setCurrentView('about')} className="text-sm hover:text-white transition-colors">About Us</button></li>
              <li><button onClick={() => setCurrentView('about')} className="text-sm hover:text-white transition-colors">Our Vision</button></li>
              <li><button onClick={() => setCurrentView('category')} className="text-sm hover:text-white transition-colors">Orders & Shipping</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-6 text-sm tracking-widest">Quick Links</h4>
            <ul className="space-y-3">
              <li><button onClick={() => setCurrentView('category')} className="text-sm hover:text-white transition-colors">Smartphones</button></li>
              <li><button onClick={() => setCurrentView('category')} className="text-sm hover:text-white transition-colors">Headphones</button></li>
              <li><button onClick={() => setCurrentView('category')} className="text-sm hover:text-white transition-colors">Laptop & Tablet</button></li>
              <li><button onClick={() => setCurrentView('admin-dashboard')} className="text-sm text-blue-500 hover:text-blue-400 font-medium transition-colors">Admin Portal (Demo)</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-6 text-sm tracking-widest">Customer Care</h4>
            <ul className="space-y-3">
              <li><button onClick={() => setCurrentView('category')} className="text-sm hover:text-white transition-colors">My Account</button></li>
              <li><button onClick={() => setCurrentView('category')} className="text-sm hover:text-white transition-colors">Store Locator</button></li>
              <li><button onClick={() => setCurrentView('faq')} className="text-sm hover:text-white transition-colors">Customer Service</button></li>
              <li><button onClick={() => setCurrentView('contact')} className="text-sm hover:text-white transition-colors">Contact Us</button></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs">© 2026 Narendra Infotech. ALL RIGHTS RESERVED - BY CREATIVE TEAM.</p>
          <div className="flex gap-2">
            <div className="w-8 h-5 bg-white rounded-sm flex items-center justify-center text-[8px] font-bold text-black">VISA</div>
            <div className="w-8 h-5 bg-white rounded-sm flex items-center justify-center text-[8px] font-bold text-black">MC</div>
            <div className="w-8 h-5 bg-white rounded-sm flex items-center justify-center text-[8px] font-bold text-black">AMEX</div>
          </div>
        </div>
      </div>
    </footer>
  );
});
