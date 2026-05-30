import React, { useState } from 'react';
import { ViewType } from '../../types';
import { ChevronRight, Plus, Minus } from 'lucide-react';

interface FAQViewProps {
  setCurrentView: (view: ViewType) => void;
}

const faqs = [
  { question: "What is your return policy?", answer: "We offer a 30-day money-back guarantee on all our products. If you are not completely satisfied with your purchase, you can return it within 30 days for a full refund." },
  { question: "Do you ship internationally?", answer: "Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by location." },
  { question: "How long does shipping take?", answer: "Domestic orders typically arrive within 3-5 business days. Expedited shipping options are available at checkout." },
  { question: "What does the warranty cover?", answer: "Our 2-year warranty covers any manufacturing defects. It does not cover accidental damage, wear and tear, or modifications to the product." },
];

export function FAQView({ setCurrentView }: FAQViewProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-12 w-full">
        <button onClick={() => setCurrentView('home')} className="hover:text-gray-900">Home</button>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-900 font-medium">FAQ</span>
      </nav>

      <h1 className="text-4xl font-medium tracking-tight text-gray-900 mb-10">Frequently Asked <br/>Questions.</h1>

      <div className="flex flex-col border-t border-gray-200">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-200 py-6">
            <button 
              className="w-full flex justify-between items-center text-left focus:outline-none group"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-gray-600 transition-colors">{faq.question}</h3>
              {openIndex === index ? 
                <Minus className="w-5 h-5 text-gray-900" /> : 
                <Plus className="w-5 h-5 text-gray-400 group-hover:text-gray-900 transition-colors" />
              }
            </button>
            {openIndex === index && (
              <p className="mt-4 text-gray-600 leading-relaxed">
                {faq.answer}
              </p>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-16 bg-[#f0f2f5] rounded-md p-8 text-center border border-gray-100">
        <h3 className="text-xl font-medium text-gray-900 mb-2">Still have questions?</h3>
        <p className="text-gray-500 mb-6">We're here to help. Reach out to our support team.</p>
        <button onClick={() => setCurrentView('contact')} className="bg-blue-600 text-white font-medium rounded px-8 py-3 hover:bg-blue-700 transition-colors">
          Contact Support
        </button>
      </div>
    </div>
  );
}
