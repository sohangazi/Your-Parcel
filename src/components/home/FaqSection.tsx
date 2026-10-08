import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Phone } from 'lucide-react';

export const FaqSection: React.FC<{ onContactClick: () => void }> = ({ onContactClick }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Which items are allowed or restricted?',
      a: 'Textiles, apparel, documents, dry processed foods, biscuits, and dry spices are fully permitted. Hazardous chemicals, loose lithium batteries, cash, and wet perishable items are strictly prohibited by aviation rules.',
    },
    {
      q: 'Do you offer free doorstep pickup?',
      a: 'Yes. We provide complimentary doorstep pickup across Dhaka, Chittagong, and Sylhet. Our agent arrives with accurate digital weight scales and tamper-evident security cartons.',
    },
    {
      q: 'How long does international delivery take?',
      a: 'Average air express transit times: Malaysia & Singapore (3–5 business days), UAE & Saudi Arabia (3–5 business days), UK & Europe (3–5 business days), USA & Canada (4–6 business days).',
    },
    {
      q: 'How can I pay for my shipment?',
      a: 'We accept bKash, Nagad, Visa / Mastercard, bank transfer, and cash upon doorstep pickup.',
    },
  ];

  return (
    <section className="py-16 bg-[#0A051A] border-b border-purple-900/30 text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#150D2E] border border-purple-800 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Common Questions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-[#120B27] border border-purple-900/40 rounded-xl overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-white hover:text-[#FF6B00] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? 'rotate-180 text-[#FF6B00]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-300 border-t border-purple-900/30 pt-3 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center text-xs text-slate-400">
          Have another question?{' '}
          <button
            onClick={onContactClick}
            className="text-[#FF6B00] font-bold hover:underline"
          >
            Contact our 24/7 support team
          </button>
        </div>
      </div>
    </section>
  );
};
