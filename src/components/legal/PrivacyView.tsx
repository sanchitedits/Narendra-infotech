import React from 'react';
import { ViewType } from '../../types';
import { ChevronRight } from 'lucide-react';

interface PrivacyViewProps {
  setCurrentView: (view: ViewType) => void;
}

export function PrivacyView({ setCurrentView }: PrivacyViewProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-12 w-full">
        <button onClick={() => setCurrentView('home')} className="hover:text-gray-900">Home</button>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-900 font-medium">Privacy Policy</span>
      </nav>

      <h1 className="text-4xl font-medium tracking-tight text-gray-900 mb-6">Privacy Policy</h1>
      <p className="text-gray-500 text-sm mb-12 pb-6 border-b border-gray-200">Last updated: May 30, 2026</p>

      <div className="prose prose-gray max-w-none text-gray-600 space-y-6">
        <h2 className="text-xl font-medium text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
        <p>
          We collect information that you provide directly to us when you make a purchase, create an account, sign up for our newsletter, or contact customer support. This may include your name, email address, phone number, shipping and billing addresses, and payment information.
        </p>

        <h2 className="text-xl font-medium text-gray-900 mt-8 mb-4">2. How We Use Your Information</h2>
        <p>
          We use the information we collect to process your transactions, communicate with you about your orders, improve our products and services, and send you marketing communications (if you have opted in). We do not sell your personal data to third parties.
        </p>

        <h2 className="text-xl font-medium text-gray-900 mt-8 mb-4">3. Data Security</h2>
        <p>
          We implement reasonable security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. All payment data is encrypted and handled by secure payment processors.
        </p>

        <h2 className="text-xl font-medium text-gray-900 mt-8 mb-4">4. Cookies and Tracking</h2>
        <p>
          We use cookies and similar tracking technologies to track activity on our website and hold certain information. This helps us analyze website traffic and improve your browsing experience. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
        </p>

        <h2 className="text-xl font-medium text-gray-900 mt-8 mb-4">5. Your Rights</h2>
        <p>
          You have the right to access, update, or delete your personal information at any time. If you wish to exercise these rights, please contact us using the information provided on our Contact page.
        </p>
      </div>
    </div>
  );
}
