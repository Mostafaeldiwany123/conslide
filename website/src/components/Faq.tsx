import { Plus, Minus } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    question: 'What version of PowerPoint do I need?',
    answer: 'Conslide works with PowerPoint 2016 and newer on Windows. We\'re actively working on Mac support and expect to release it soon.'
  },
  {
    question: 'Is Conslide free to use?',
    answer: 'Yes! Conslide offers a free tier with essential features. We also have a Pro plan for power users who need advanced functionality like custom shortcuts and team sharing.'
  },
  {
    question: 'Can I create custom shortcuts?',
    answer: 'Absolutely! Pro users can create their own custom commands and shortcuts to match their exact workflow. You can map any action to any key combination.'
  },
  {
    question: 'Does Conslide work offline?',
    answer: 'Yes, after installation Conslide works completely offline. No internet connection required. Your presentations stay on your computer.'
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes. Conslide runs locally on your machine and doesn\'t send any of your presentation data to external servers. Your files remain private and secure.'
  },
  {
    question: 'How do I get started?',
    answer: 'Simply download the installer, run it, and open PowerPoint. Conslide will appear in your ribbon automatically. Press Alt+Space to open the command palette and start using it right away.'
  }
];

const FaqItem = ({ faq, isOpen, onClick }: { faq: typeof faqs[0]; isOpen: boolean; onClick: () => void }) => {
  return (
    <div className="border-b border-gray-100">
      <button
        type="button"
        onClick={onClick}
        className="w-full py-5 flex items-center justify-between text-left group"
      >
        <span className="text-base font-medium text-gray-900 group-hover:text-purple-600 transition-colors pr-4">
          {faq.question}
        </span>
        <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-purple-50 flex items-center justify-center flex-shrink-0 transition-colors">
          {isOpen ? (
            <Minus className="w-4 h-4 text-purple-600" />
          ) : (
            <Plus className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
          )}
        </div>
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-48 pb-5' : 'max-h-0'
        }`}
      >
        <p className="text-gray-500 leading-relaxed">{faq.answer}</p>
      </div>
    </div>
  );
};

const Faq = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-3">
            Frequently asked questions
          </h2>
          <p className="text-gray-500">
            Everything you need to know about Conslide
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="px-6 sm:px-8">
            {faqs.map((faq, index) => (
              <FaqItem
                key={index}
                faq={faq}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;