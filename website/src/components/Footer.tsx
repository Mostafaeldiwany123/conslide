import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Youtube, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img 
                src="/conslide_favicon.png" 
                alt="Conslide" 
                className="w-8 h-8 rounded-lg"
              />
              <span className="text-lg font-semibold text-gray-900">Conslide</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              Design slides faster with intelligent keyboard shortcuts.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://twitter.com/conslide" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="https://linkedin.com/company/conslide" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href="https://youtube.com/@conslide" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a 
                href="mailto:support@conslide.com"
                className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Product</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/#features" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/#how-it-works" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  How it works
                </Link>
              </li>
              <li>
                <Link to="/#faq" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Support</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/support" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <a href="mailto:support@conslide.com" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/ai-policy" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  AI Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {currentYear} Conslide. All rights reserved.
            </p>
            <p className="text-sm text-gray-400">
              Made with ❤️ for PowerPoint users everywhere
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;