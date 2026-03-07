import { Sparkles, Languages, AlignHorizontalSpaceAround } from 'lucide-react';

const features = [
  {
    title: 'Generate Slide',
    description: 'Generate any slide you want with AI. Simply describe what you need and let Conslide create professional, polished slides instantly.',
    icon: Sparkles,
    image: '/features/generate-slide.png'
  },
  {
    title: 'Translate Page',
    description: 'Translate your entire presentation to 10+ languages with a single click. Break language barriers and reach global audiences effortlessly.',
    icon: Languages,
    image: '/features/translate-page.png'
  },
  {
    title: 'Alignment',
    description: 'Multiple alignment options including align matrix, align left, align right, and more. All accessible through simple, intuitive keyboard commands.',
    icon: AlignHorizontalSpaceAround,
    image: '/features/alignment.png'
  }
];

const Features = () => {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-purple-600 font-medium text-sm tracking-wide uppercase mb-3 block">
            Features
          </span>
          <h2 className="text-4xl font-semibold text-gray-900 mb-4">
            Everything you need
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Powerful tools designed to make your PowerPoint workflow faster and more efficient.
          </p>
        </div>

        <div className="space-y-32">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Text Content */}
              <div className="lg:max-w-md">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-purple-600">
                    0{index + 1}
                  </span>
                </div>
                
                <h3 className="text-3xl font-semibold text-gray-900 mb-4 leading-tight">
                  {feature.title}
                </h3>
                
                <p className="text-gray-500 text-lg leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Image */}
              <div className="flex-1">
                <div className="relative">
                  {/* Image container */}
                  <div className="relative aspect-video overflow-hidden">
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;