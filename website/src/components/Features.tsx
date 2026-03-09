import { Sparkles, Languages, AlignHorizontalSpaceAround, ArrowRight } from 'lucide-react';

const features = [
  {
    title: 'Generate Slide',
    description: 'Generate any slide you want with AI. Simply describe what you need and let Conslide create professional, polished slides instantly.',
    icon: Sparkles,
    gradient: 'from-violet-500 to-purple-600',
    bgGradient: 'from-violet-50 to-purple-50',
    accentColor: 'purple'
  },
  {
    title: 'Translate Page',
    description: 'Translate your entire presentation to 10+ languages with a single click. Break language barriers and reach global audiences effortlessly.',
    icon: Languages,
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-50 to-cyan-50',
    accentColor: 'blue'
  },
  {
    title: 'Alignment',
    description: 'Multiple alignment options including align matrix, align left, align right, and more. All accessible through simple, intuitive keyboard commands.',
    icon: AlignHorizontalSpaceAround,
    gradient: 'from-emerald-500 to-teal-500',
    bgGradient: 'from-emerald-50 to-teal-50',
    accentColor: 'emerald'
  }
];

const Features = () => {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-5">
            Everything you need
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Powerful tools designed to make your PowerPoint workflow faster and more efficient.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group relative"
            >
              {/* Card */}
              <div className="relative h-full bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 overflow-hidden">
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  
                  {/* Number badge */}
                  <div className="absolute top-8 right-8 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-white transition-colors duration-300">
                    <span className="text-gray-400 font-semibold text-sm">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-gray-800">
                    {feature.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-500 leading-relaxed mb-6">
                    {feature.description}
                  </p>
                  
                  {/* Learn more link */}
                  <div className={`flex items-center gap-2 text-${feature.accentColor}-600 font-medium text-sm opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300`}>
                    <span>Learn more</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
                
                {/* Decorative corner */}
                <div className={`absolute -bottom-12 -right-12 w-32 h-32 bg-gradient-to-br ${feature.gradient} opacity-5 rounded-full blur-2xl group-hover:opacity-20 transition-opacity duration-300`} />
              </div>
            </div>
          ))}
        </div>
        
        {/* YouTube Video */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-gray-900">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Conslide Demo"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
        
        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 p-2 bg-white rounded-full shadow-md border border-gray-100">
            <span className="text-gray-600 pl-4">Ready to boost your productivity?</span>
            <a 
              href="/install" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-medium rounded-full hover:from-purple-700 hover:to-violet-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;