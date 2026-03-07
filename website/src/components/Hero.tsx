import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-gray-900 leading-tight mb-6">
          Design slides faster with
          <span className="text-purple-600"> intelligent shortcuts</span>
        </h1>

        <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Conslide is a PowerPoint add-in that automates your layout workflow.
          Align, distribute, resize, and create shapes with simple keyboard commands.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {user ? (
            <Button
              size="lg"
              onClick={() => navigate('/install')}
              className="bg-purple-600 hover:bg-purple-700 text-white text-base px-8"
            >
              <Download className="w-5 h-5 mr-2" />
              Install Version 1.0
            </Button>
          ) : (
            <>
              <Button
                size="lg"
                onClick={() => navigate('/install')}
                className="bg-purple-600 hover:bg-purple-700 text-white text-base px-8"
              >
                <Download className="w-5 h-5 mr-2" />
                Install Version 1.0
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/login')}
                className="text-base px-8 border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-400"
              >
                Sign In
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="mt-16 max-w-5xl mx-auto">
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-gray-200 shadow-lg bg-gray-100">
          {!isPlaying ? (
            <button
              onClick={() => setIsPlaying(true)}
              className="relative w-full h-full group cursor-pointer"
            >
              <img
                src="/hero-thumbnail.png"
                alt="Conslide Demo"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-purple-600 ml-1" />
                </div>
              </div>
            </button>
          ) : (
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
              title="Conslide Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;