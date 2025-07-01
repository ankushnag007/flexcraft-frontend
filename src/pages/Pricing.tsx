import { useState } from 'react';
import { Check, Zap, ChevronRight } from 'lucide-react';

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  const plans = [
    {
      name: 'Starter',
      monthlyPrice: 29,
      annualPrice: 24,
      description: 'Perfect for individuals and small teams',
      cta: 'Get Started',
      features: [
        '5 projects',
        '10GB storage',
        'Basic analytics',
        'Email support',
        'Up to 5 users'
      ],
      popular: false
    },
    {
      name: 'Professional',
      monthlyPrice: 99,
      annualPrice: 79,
      description: 'For growing teams with advanced needs',
      cta: 'Popular Choice',
      features: [
        'Unlimited projects',
        '100GB storage',
        'Advanced analytics',
        'Priority support',
        'Up to 20 users',
        'API access'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      monthlyPrice: 299,
      annualPrice: 249,
      description: 'For organizations with complex requirements',
      cta: 'Contact Sales',
      features: [
        'Unlimited everything',
        '1TB+ storage',
        'Dedicated analytics',
        '24/7 support',
        'Unlimited users',
        'Custom integrations',
        'Personal onboarding'
      ],
      popular: false
    }
  ];

  const savings = (monthly: number, annual: number) => {
    // return Math.round(((monthly * 12 - annual * 12) / (monthly * 12)) * 100;
  };

  return (
    <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Simple, transparent pricing</h1>
          <p className="mt-4 text-xl text-gray-600">
            Choose the perfect plan for your business needs
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="mt-12 flex justify-center">
          <div className="inline-flex items-center bg-white rounded-lg p-1 shadow-sm border border-gray-200">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-3 rounded-md text-sm font-medium ${billingCycle === 'monthly' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-3 rounded-md text-sm font-medium ${billingCycle === 'annual' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              Annual Billing
              <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                {/* Save {savings(plans[1].monthlyPrice, plans[1].annualPrice)}% */}
              </span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              onMouseEnter={() => setHoveredPlan(plan.name)}
              onMouseLeave={() => setHoveredPlan(null)}
              className={`relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all ${plan.popular ? 'border-blue-500 ring-2 ring-blue-200' : ''} ${hoveredPlan === plan.name ? 'transform scale-[1.02] shadow-lg' : ''}`}
            >
              {plan.popular && (
                <div className="absolute top-0 -translate-y-1/2 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-4 py-1 rounded-full">
                  Most popular
                </div>
              )}
              <h2 className="text-xl font-bold text-gray-900">{plan.name}</h2>
              <p className="mt-2 text-gray-600">{plan.description}</p>
              <div className="mt-6 flex items-baseline">
                <span className="text-4xl font-bold text-gray-900">
                  ${billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice}
                </span>
                <span className="ml-1 text-lg font-medium text-gray-500">
                  /{billingCycle === 'annual' ? 'year' : 'month'}
                </span>
              </div>
              {billingCycle === 'annual' && (
                <p className="mt-2 text-sm text-gray-500">
                  <span className="font-semibold">Save ${(plan.monthlyPrice * 12 - plan.annualPrice * 12)}</span> annually
                </p>
              )}
              <button
                className={`mt-8 w-full flex items-center justify-center px-6 py-3 border rounded-md text-sm font-medium ${plan.popular ? 'bg-blue-600 text-white border-transparent hover:bg-blue-700' : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'}`}
              >
                {plan.cta}
                {!plan.cta.includes('Contact') && (
                  <ChevronRight className="ml-2 h-4 w-4" />
                )}
              </button>
              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Feature Comparison */}
        <div className="mt-24">
          <h2 className="text-2xl font-bold text-gray-900 text-center">Plan comparison</h2>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-500 border-b border-gray-200">Features</th>
                  {plans.map((plan) => (
                    <th key={plan.name} className="py-4 px-6 text-center text-sm font-medium text-gray-500 border-b border-gray-200">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  'Number of projects',
                  'Storage space',
                  'User seats',
                  'Support level',
                  'API access',
                  'Custom integrations'
                ].map((feature) => (
                  <tr key={feature}>
                    <td className="py-4 px-6 text-sm text-gray-700">{feature}</td>
                    {plans.map((plan) => (
                      <td key={`${plan.name}-${feature}`} className="py-4 px-6 text-center">
                        {plan.features.includes(feature) ? (
                          <Check className="h-5 w-5 text-green-500 inline-block" />
                        ) : feature.includes('projects') && plan.name === 'Professional' ? (
                          'Unlimited'
                        ) : feature.includes('projects') && plan.name === 'Enterprise' ? (
                          'Unlimited'
                        ) : feature.includes('storage') && plan.name === 'Professional' ? (
                          '100GB'
                        ) : feature.includes('storage') && plan.name === 'Enterprise' ? (
                          '1TB+'
                        ) : feature.includes('users') && plan.name === 'Professional' ? (
                          'Up to 20'
                        ) : feature.includes('users') && plan.name === 'Enterprise' ? (
                          'Unlimited'
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-24">
          <h2 className="text-2xl font-bold text-gray-900 text-center">Frequently asked questions</h2>
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
            {[
              {
                question: "Can I change plans later?",
                answer: "Yes, you can upgrade or downgrade your plan at any time."
              },
              {
                question: "Is there a free trial?",
                answer: "We offer a 14-day free trial for all plans with no credit card required."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, PayPal, and bank transfers for annual plans."
              },
              {
                question: "How is billing handled?",
                answer: billingCycle === 'monthly' 
                  ? "Monthly plans are billed each month on the date you signed up." 
                  : "Annual plans are billed once per year with a discount applied."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                <p className="mt-2 text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;