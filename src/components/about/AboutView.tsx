import React from 'react';
import { ViewType } from '../../types';
import { ChevronRight } from 'lucide-react';

interface AboutViewProps {
  setCurrentView: (view: ViewType) => void;
}

export function AboutView({ setCurrentView }: AboutViewProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-12 w-full">
        <button onClick={() => setCurrentView('home')} className="hover:text-gray-900">Home</button>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-900 font-medium">About Us</span>
      </nav>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 mb-8">
          Crafting the <br /> modern workspace.
        </h1>
        
        <div className="w-full h-[400px] bg-[#f1f3f5] mb-12 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&q=80" 
            alt="Office" 
            className="w-full h-full object-cover mix-blend-multiply" 
          />
        </div>

        <div className="prose prose-lg prose-gray max-w-none text-gray-600 space-y-8">
          <p className="text-xl md:text-2xl text-gray-900 font-medium leading-relaxed">
            At N-Infotech, we believe that the tools you use shape the work you produce. 
            We founded this company to bridge the gap between aesthetics and uncompromising performance.
          </p>
          
          <p>
            Started in 2020 by a team of obsessive designers and engineers, we grew frustrated with the 
            state of workspace technology. Everything was either aggressively gamified with flashing lights, 
            or purely utilitarian and ugly. We wanted tools that looked beautiful on a clean desk, but 
            performed seamlessly when you needed to get deep work done.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Our Philosophy</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="font-bold text-gray-900 mb-2">Design Subtraction</h3>
              <p className="text-sm">We remove everything that isn't absolutely essential. No superfluous buttons, no aggressive branding. Just pure function.</p>
            </div>
            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="font-bold text-gray-900 mb-2">Built for Decades</h3>
              <p className="text-sm">In an era of planned obsolescence, we engineer our products with premium materials meant to last as long as possible.</p>
            </div>
          </div>

          <p>
            Every product we carry goes through a rigorous selection and testing process. If we wouldn't 
            personally use it on our own desks every single day, it doesn't make it to the store. It's that simple. 
            Welcome to the new standard.
          </p>
        </div>

        <div className="mt-16 pt-12 border-t border-gray-200">
          <button 
            onClick={() => setCurrentView('category')}
            className="bg-blue-600 text-white font-medium rounded px-8 py-3 hover:bg-blue-700 transition-colors"
          >
            Explore the Collection
          </button>
        </div>
      </div>
    </div>
  );
}
