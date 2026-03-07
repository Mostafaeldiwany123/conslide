import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const plans = [
  {
    name: 'Pro',
    price: '$10',
    period: '/month',
    description: 'For professionals who live in PowerPoint',
    features: [
      'Unlimited commands',
      'All alignment & distribution tools',
      'Advanced shape creation',
      'Custom shortcuts',
      'Priority support',
      'Team sharing'
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
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Start with a 14-day free trial. No credit card required.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl border ${plan.popular ? 'border-purple-600' : 'border-gray-200'} p-8 relative`}
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
              <ul className="space-y-3 mb-8">
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
      </div>
    </section>
  );
};

export default Pricing;