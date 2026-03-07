import { Download, MousePointer, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = [
  {
    icon: Download,
    step: 'Step 1',
    title: 'Download & Install',
    description: 'Get Conslide from our website. The installer handles everything — just download and run.',
    link: { text: 'Download now', to: '/install' }
  },
  {
    icon: MousePointer,
    step: 'Step 2',
    title: 'Open PowerPoint',
    description: 'Launch PowerPoint and you\'ll find Conslide ready to use. No configuration needed.'
  },
  {
    icon: Sparkles,
    step: 'Step 3',
    title: 'Start Creating',
    description: 'Press Alt + Space to open the command palette and type your command. That\'s it!'
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-4">
            How it works
          </h2>
          <p className="text-gray-500 text-lg">
            Three simple steps to faster slide design
          </p>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-px bg-gray-200" />

          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={index} className="relative flex gap-6 sm:gap-8">
                {/* Step number circle */}
                <div className="relative z-10 flex-shrink-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white border-2 border-purple-200 flex items-center justify-center">
                    <step.icon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pt-1 sm:pt-2">
                  <span className="text-xs font-medium text-purple-600 uppercase tracking-wide">
                    {step.step}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mt-1 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed">
                    {step.description}
                  </p>
                  {step.link && (
                    <Link 
                      to={step.link.to}
                      className="inline-flex items-center gap-1 mt-3 text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors"
                    >
                      {step.link.text}
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;