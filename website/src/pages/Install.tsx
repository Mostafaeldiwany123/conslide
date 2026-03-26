import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WindowsIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
  </svg>
);

const Install = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const productId = '9mzsnsnq2bg4';

  return (
    <div className="min-h-screen bg-white">
      <div className="absolute top-0 left-0 right-0 z-10 p-6">
        <button
          onClick={() => navigate('/')}
          type="button"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Go back
        </button>
      </div>

      <div className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-xl">
          {/* App Info */}
          <div className="text-center mb-8">
            <img
              src="/conslide_favicon.png"
              alt="Conslide"
              className="w-16 h-16 rounded-xl mx-auto mb-4"
            />
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">
              Download Conslide
            </h1>
            <p className="text-gray-500">
              PowerPoint add-in for Windows
            </p>
          </div>

          {/* Download Button */}
          <div className="flex justify-center mb-4">
            <Button
              asChild
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white h-12 px-8"
            >
              <a href={`ms-windows-store://pdp/?productid=${productId}`}>
                <WindowsIcon className="w-5 h-5 mr-2" />
                Get it from Microsoft Store
              </a>
            </Button>
          </div>

          {/* Requirements */}
          <div className="text-center text-sm text-gray-500 mb-8">
            <p>Windows 10 or later • PowerPoint 2016+</p>
          </div>

          {/* Demo Video */}
          <div className="mb-10">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-gray-200">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/UjfS2_U_bQM?si=kGB_Hu7bzLiLIg6g"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>

          {/* Installation Steps */}
          <div className="border-t border-gray-100 pt-8">
            <h2 className="text-sm font-medium text-gray-900 mb-6">Installation</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-gray-600">1</span>
                </div>
                <div>
                  <p className="text-sm text-gray-700">Install Conslide from the Microsoft Store</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-gray-600">2</span>
                </div>
                <div>
                  <p className="text-sm text-gray-700">Open PowerPoint and find Conslide in the ribbon</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-gray-600">3</span>
                </div>
                <div>
                  <p className="text-sm text-gray-700">Press Alt+Space to start using it</p>
                </div>
              </div>
            </div>
          </div>

          {/* User Status */}
          {user && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-600" />
                <span>Signed in as {user.email}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Install;