import { ArrowLeft, Mail, MessageCircle, Phone, Twitter, Linkedin, Youtube, FileText, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Support = () => {
  const navigate = useNavigate();

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get help via email',
      value: 'support@conslide.com',
      action: 'mailto:support@conslide.com',
      actionText: 'Send Email'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Available Mon-Fri, 9AM-6PM EST',
      value: '+1 (555) 123-4567',
      action: 'tel:+15551234567',
      actionText: 'Call Now'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our support team',
      value: 'Available 24/7',
      action: '#',
      actionText: 'Start Chat'
    }
  ];

  const socialLinks = [
    {
      icon: Twitter,
      name: 'Twitter',
      handle: '@conslide',
      url: 'https://twitter.com/conslide'
    },
    {
      icon: Linkedin,
      name: 'LinkedIn',
      handle: 'Conslide',
      url: 'https://linkedin.com/company/conslide'
    },
    {
      icon: Youtube,
      name: 'YouTube',
      handle: 'Conslide Tutorials',
      url: 'https://youtube.com/@conslide'
    }
  ];

  const resources = [
    {
      icon: FileText,
      title: 'Documentation',
      description: 'Detailed guides and API references',
      url: '#'
    },
    {
      icon: HelpCircle,
      title: 'FAQ',
      description: 'Answers to common questions',
      url: '/#faq'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Go back
          </button>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-semibold text-gray-900 mb-4">How can we help?</h1>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              We're here to help you get the most out of Conslide. Choose your preferred way to reach us.
            </p>
          </div>

          {/* Contact Methods */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {contactMethods.map((method, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto mb-4">
                  <method.icon className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">{method.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{method.description}</p>
                <p className="text-purple-600 font-medium mb-4">{method.value}</p>
                <a href={method.action}>
                  <Button variant="outline" className="w-full border-purple-200 text-purple-700 hover:bg-purple-50">
                    {method.actionText}
                  </Button>
                </a>
              </div>
            ))}
          </div>

          {/* Social Links */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">Connect With Us</h2>
            <div className="flex flex-wrap justify-center gap-6">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <social.icon className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{social.name}</p>
                    <p className="text-xs text-gray-500">{social.handle}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {resources.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center flex-shrink-0">
                  <resource.icon className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">{resource.title}</h3>
                  <p className="text-sm text-gray-500">{resource.description}</p>
                </div>
              </a>
            ))}
          </div>

          {/* Office Hours */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Support Hours</h2>
            <p className="text-gray-600 mb-4">
              Our support team is available Monday through Friday, 9:00 AM - 6:00 PM EST.
            </p>
            <p className="text-sm text-gray-500">
              For urgent issues outside business hours, please email us and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Support;