import React from 'react';
import { ViewType } from '../../types';
import { ChevronRight } from 'lucide-react';

interface TermsViewProps {
  setCurrentView: (view: ViewType) => void;
}

export function TermsView({ setCurrentView }: TermsViewProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-12 w-full">
        <button onClick={() => setCurrentView('home')} className="hover:text-gray-900">Home</button>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-900 font-medium">Terms of Service</span>
      </nav>

      <h1 className="text-4xl font-medium tracking-tight text-gray-900 mb-6">Terms of Service</h1>
      <p className="text-gray-500 text-sm mb-12 pb-6 border-b border-gray-200">Last updated: May 30, 2026</p>

      <div className="prose prose-gray max-w-none text-gray-600 space-y-6">
        <p>
          Please read these Terms of Service completely using N-Infotech which is owned and operated by N-Infotech Inc. This Agreement documents the legally binding terms and conditions attached to the use of the Site.
        </p>

        <h2 className="text-xl font-medium text-gray-900 mt-8 mb-4">1. Intellectual Property</h2>
        <p>
          The Site and all of its original content are the sole property of N-Infotech and are, as such, fully protected by the appropriate international copyright and other intellectual property rights laws.
        </p>

        <h2 className="text-xl font-medium text-gray-900 mt-8 mb-4">2. Termination</h2>
        <p>
          N-Infotech reserves the right to terminate your access to the Site without any advance notice.
        </p>

        <h2 className="text-xl font-medium text-gray-900 mt-8 mb-4">3. Links to Other Websites</h2>
        <p>
          Our Site does contain a number of links to other websites and online resources that are not owned or controlled by N-Infotech. We have no control over, and therefore cannot assume responsibility for, the content or general practices of any of these third party sites and/or services.
        </p>

        <h2 className="text-xl font-medium text-gray-900 mt-8 mb-4">4. Governing Law</h2>
        <p>
          This Agreement is governed in accordance with the laws of the United States.
        </p>

        <h2 className="text-xl font-medium text-gray-900 mt-8 mb-4">5. Changes to This Agreement</h2>
        <p>
          N-Infotech reserves the right to modify these Terms of Service at any time. We do so by posting and drawing attention to the updated terms on the Site. Your decision to continue to visit and make use of the Site after such changes have been made constitutes your formal acceptance of the new Terms of Service.
        </p>
      </div>
    </div>
  );
}
