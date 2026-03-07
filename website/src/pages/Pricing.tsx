import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const plans = [
  {
    name: 'Pro',
    price: '$10',
    period: '/month',
    description: 'For professionals who need AI-powered features',
    features: [
      'All alignment & distribution tools',
      '100 AI credits per month',
      'Generate slides with AI',
      'Translate slides instantly',
      'AI-powered text rewriting',
      'Custom shortcuts',
      'Priority support'
    ],
    cta: 'Start Free Trial',
    popular: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For teams that need more control',
    features: [
      'Everything in Pro',
      '500 AI credits per user',
      'Unlimited users',
      'Admin dashboard',
      'Usage analytics',
      'SSO integration',
      'Dedicated support',
      'Custom integrations'
    ],
    cta: 'Contact Sales',
    popular: false
  }
];

const Pricing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-semibold text-gray-900 mb-4">
              Simple, transparent pricing
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Start with a 14-day free trial. No credit card required.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl border ${plan.popular ? 'border-purple-600 ring-2 ring-purple-100' : 'border-gray-200'} p-6 relative flex flex-col`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-purple-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-semibold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-6 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => navigate('/signup')}
                  className={`w-full ${plan.popular ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">What are AI Credits?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              AI credits are used for AI-powered features like generating slides, translating content,
              and rewriting text. Slide generation uses 2 credits, while other AI operations use 1 credit.
              Pro plans include 100 credits per month, and Enterprise plans include 500 credits per user.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-600"></div>
                </div>
                <p className="text-sm font-medium text-gray-900">Generate Slide</p>
                <p className="text-xs text-gray-500">2 credits</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-600"></div>
                </div>
                <p className="text-sm font-medium text-gray-900">Translate Page</p>
                <p className="text-xs text-gray-500">1 credit</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-600"></div>
                </div>
                <p className="text-sm font-medium text-gray-900">Lead Sentence</p>
                <p className="text-xs text-gray-500">1 credit</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-600"></div>
                </div>
                <p className="text-sm font-medium text-gray-900">Rewrite Text</p>
                <p className="text-xs text-gray-500">1 credit</p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-gray-500 text-sm">
              All plans include a 14-day free trial. No credit card required.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;