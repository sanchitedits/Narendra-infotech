import React from 'react';
import { ViewType } from '../../types';
import { ChevronRight, Mail, MapPin, Phone } from 'lucide-react';

interface ContactViewProps {
  setCurrentView: (view: ViewType) => void;
}

export function ContactView({ setCurrentView }: ContactViewProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-12 w-full">
        <button onClick={() => setCurrentView('home')} className="hover:text-gray-900">Home</button>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-900 font-medium">Contact Us</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-gray-900 mb-6">
            Get in touch.
          </h1>
          <p className="text-lg text-gray-500 mb-12 leading-relaxed max-w-md">
            Whether you have a question about our products, shipping, or need technical support, our team is ready to answer all your questions.
          </p>

          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Email</h3>
                <p className="text-gray-500 text-sm">support@n-infotech.com</p>
                <p className="text-gray-500 text-sm">sales@n-infotech.com</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Phone</h3>
                <p className="text-gray-500 text-sm">+91 98765 43210</p>
                <p className="text-gray-500 text-sm">Mon-Fri, 9am to 6pm IST</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Headquarters</h3>
                <p className="text-gray-500 text-sm">Bamhni Banjar, Mandla</p>
                <p className="text-gray-500 text-sm">Madhya Pradesh, India</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-8 md:p-10 rounded-md">
          <h3 className="text-xl font-medium text-gray-900 mb-6">Send a Message</h3>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Name</label>
              <input type="text" className="w-full border border-gray-300 rounded px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Email</label>
              <input type="email" className="w-full border border-gray-300 rounded px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" placeholder="john@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Order Number (Optional)</label>
              <input type="text" className="w-full border border-gray-300 rounded px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" placeholder="#123456" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Message</label>
              <textarea className="w-full border border-gray-300 rounded px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 resize-none h-32" placeholder="How can we help you?"></textarea>
            </div>
            <button className="w-full bg-blue-600 text-white font-medium rounded px-8 py-3 hover:bg-blue-700 transition-colors">
              Submit Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
