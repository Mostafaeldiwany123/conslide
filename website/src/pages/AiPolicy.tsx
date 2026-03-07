import { ArrowLeft, Shield, Lock, Eye, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const AiPolicy = () => {
  const navigate = useNavigate();

  const principles = [
    {
      icon: Shield,
      title: 'Privacy by Design',
      description: 'All AI processing happens locally on your device. Your presentation content never leaves your computer.'
    },
    {
      icon: Lock,
      title: 'No Data Storage',
      description: 'We do not store, log, or retain any of your presentation data. Your content is processed and immediately discarded.'
    },
    {
      icon: Eye,
      title: 'No Training on Your Data',
      description: 'Your presentations are never used to train our AI models. Your intellectual property remains yours alone.'
    },
    {
      icon: Trash2,
      title: 'Zero Retention',
      description: 'After processing your command, all presentation data is immediately deleted from memory. Nothing is saved.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Go back
          </button>

          <h1 className="text-4xl font-semibold text-gray-900 mb-4">AI Policy</h1>
          <p className="text-gray-500 mb-8">Last updated: January 2025</p>

          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 mb-10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Your Data Stays Private</h2>
                <p className="text-gray-600 leading-relaxed">
                  Conslide uses AI to help you design slides faster. But unlike other AI tools, we designed our system with privacy as the top priority. Your presentation content is <strong>never uploaded, stored, or shared</strong> with anyone — including us.
                </p>
              </div>
            </div>
          </div>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Our AI Privacy Principles</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {principles.map((principle, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6">
                  <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center mb-4">
                    <principle.icon className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{principle.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{principle.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How Our AI Works</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 leading-relaxed mb-4">
                Conslide uses AI to understand your commands and execute layout operations. Here's exactly what happens when you use Conslide:
              </p>
              <ol className="list-decimal list-inside text-gray-600 space-y-3">
                <li>You press Alt+Space and type a command (e.g., "align left")</li>
                <li>The command is processed locally on your device</li>
                <li>Conslide identifies the objects you've selected</li>
                <li>The layout operation is applied directly in PowerPoint</li>
                <li>No data is sent to external servers</li>
              </ol>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">What We DO NOT Collect</h2>
            <div className="bg-red-50 border border-red-100 rounded-xl p-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-0.5">✗</span>
                  <span className="text-gray-700">Your presentation content (slides, text, images)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-0.5">✗</span>
                  <span className="text-gray-700">File names or document metadata</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-0.5">✗</span>
                  <span className="text-gray-700">Your voice or audio data</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-0.5">✗</span>
                  <span className="text-gray-700">Screen recordings or screenshots</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-0.5">✗</span>
                  <span className="text-gray-700">Any content from your presentations</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">What We DO Collect</h2>
            <div className="bg-green-50 border border-green-100 rounded-xl p-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span className="text-gray-700">Command usage statistics (e.g., "align left used 5 times")</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span className="text-gray-700">Error reports to improve reliability</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span className="text-gray-700">Account information (name, email)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span className="text-gray-700">Feature usage patterns (anonymized)</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Enterprise & Compliance</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Conslide is designed to meet enterprise security requirements. Our architecture ensures:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>No data leaves your organization's network</li>
              <li>Full compliance with GDPR, CCPA, and SOC 2 requirements</li>
              <li>No third-party data sharing</li>
              <li>Complete audit trail of all operations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Questions?</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have questions about our AI practices or data handling, please contact our security team at{' '}
              <a href="mailto:security@conslide.com" className="text-purple-600 hover:text-purple-700">
                security@conslide.com
              </a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AiPolicy;