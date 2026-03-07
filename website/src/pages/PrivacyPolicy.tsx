import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

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

          <h1 className="text-4xl font-semibold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-500 mb-8">Last updated: January 2025</p>

          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Introduction</h2>
              <p className="text-gray-600 leading-relaxed">
                Conslide ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our PowerPoint add-in service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Account Information</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                When you create an account, we collect your name, email address, and authentication credentials. This information is necessary to provide our services and communicate with you.
              </p>
              
              <h3 className="text-lg font-medium text-gray-900 mb-2">Usage Data</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                We collect information about how you use Conslide, including commands executed, features used, and session duration. This helps us improve our service and provide better support.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mb-2">Presentation Content</h3>
              <p className="text-gray-600 leading-relaxed">
                <strong>Important:</strong> Conslide processes your presentation content locally on your device. We do not upload, store, or have access to the content of your PowerPoint presentations. Your slides, text, images, and other presentation data remain entirely on your computer.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>To provide and maintain our service</li>
                <li>To process your account and authentication</li>
                <li>To send you important updates and support communications</li>
                <li>To analyze usage patterns and improve our service</li>
                <li>To detect and prevent fraud or abuse</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>
              <p className="text-gray-600 leading-relaxed">
                We implement industry-standard security measures to protect your information. All data transmitted between your device and our servers is encrypted using TLS 1.3. Your presentation content never leaves your device, ensuring maximum privacy and security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Services</h2>
              <p className="text-gray-600 leading-relaxed">
                We use third-party services for authentication (Google, Microsoft), payment processing (Stripe), and analytics. These services have their own privacy policies, and we encourage you to review them.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                You have the right to access, correct, or delete your personal information. You can also export your data or close your account at any time through your profile settings.
              </p>
              <p className="text-gray-600 leading-relaxed">
                For users in the European Economic Area (EEA), you have additional rights under GDPR, including the right to data portability and the right to lodge a complaint with a supervisory authority.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Retention</h2>
              <p className="text-gray-600 leading-relaxed">
                We retain your account information for as long as your account is active. Usage data is retained for 12 months for analytics purposes, after which it is permanently deleted.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Children's Privacy</h2>
              <p className="text-gray-600 leading-relaxed">
                Conslide is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to This Policy</h2>
              <p className="text-gray-600 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-600 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at{' '}
                <a href="mailto:privacy@conslide.com" className="text-purple-600 hover:text-purple-700">
                  privacy@conslide.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;