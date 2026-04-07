import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';

function Pricing() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(userData);
    }
  }, []);

  const handleUpgrade = async (plan) => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    
    // For now, use manual payment (JazzCash/EasyPaisa)
    // You'll replace this with actual payment integration
    const paymentLink = getPaymentLink(plan);
    
    // Open payment link in new tab
    window.open(paymentLink, '_blank');
    
    // Store that user initiated upgrade
    localStorage.setItem('pendingUpgrade', plan);
    
    setLoading(false);
  };

  const getPaymentLink = (plan) => {
    // Replace with your actual payment link
    if (plan === 'premium') {
      return 'https://buy.stripe.com/your-stripe-link'; // Change this
    }
    return '#';
  };

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        '✅ Basic career guidance',
        '✅ View 5 job listings',
        '✅ Limited career paths',
        '✅ Email support'
      ],
      notIncluded: [
        '❌ Full career library',
        '❌ Unlimited job applications',
        '❌ Resume review service',
        '❌ Priority support'
      ],
      buttonText: 'Current Plan',
      buttonClass: 'bg-gray-400',
      popular: false
    },
    {
      name: 'Premium',
      price: '$30',
      period: 'one-time payment',
      features: [
        '✅ Complete career guidance',
        '✅ Unlimited job listings',
        '✅ All career paths (Matric/FSC/Uni)',
        '✅ Resume upload & review',
        '✅ Save unlimited jobs',
        '✅ Priority email support',
        '✅ Career counseling resources'
      ],
      notIncluded: [],
      buttonText: 'Upgrade to Premium',
      buttonClass: 'bg-blue-600 hover:bg-blue-700',
      popular: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Path to Success
          </h1>
          <p className="text-xl text-gray-600">
            Start free, upgrade when you're ready for premium features
          </p>
          <p className="text-sm text-gray-500 mt-2">
            One-time payment • Lifetime access • 100% risk-free
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-transform transform hover:scale-105 ${
                plan.popular ? 'ring-2 ring-blue-500 relative' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 rounded-bl-lg text-sm">
                  POPULAR
                </div>
              )}
              
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h2>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-600">/{plan.period}</span>
                </div>
                
                <button
                  onClick={() => handleUpgrade(plan.name.toLowerCase())}
                  disabled={loading || (user?.isPremium && plan.name === 'Premium')}
                  className={`w-full ${plan.buttonClass} text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed mb-6`}
                >
                  {user?.isPremium && plan.name === 'Premium' 
                    ? 'Already Premium ✓' 
                    : plan.buttonText}
                </button>
                
                <div className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center text-gray-700">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature.replace('✅', '')}
                    </div>
                  ))}
                  {plan.notIncluded.map((feature, i) => (
                    <div key={i} className="flex items-center text-gray-400">
                      <span className="text-gray-400 mr-2">✗</span>
                      {feature.replace('❌', '')}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h3>
          
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="font-semibold text-lg mb-2">What's included in Premium?</h4>
              <p className="text-gray-600">Full access to all career paths, unlimited job listings, resume upload, saved jobs, and priority support.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="font-semibold text-lg mb-2">Is it really one-time payment?</h4>
              <p className="text-gray-600">Yes! Pay once, get lifetime access. No monthly subscriptions.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="font-semibold text-lg mb-2">How do I pay?</h4>
              <p className="text-gray-600">We accept JazzCash, EasyPaisa, and credit cards. Payment link will be provided after clicking Upgrade.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="font-semibold text-lg mb-2">Can I get a refund?</h4>
              <p className="text-gray-600">We offer 7-day money-back guarantee if you're not satisfied.</p>
            </div>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            🔒 Secure payment • 7-day money-back guarantee • Lifetime access
          </p>
        </div>
      </div>
    </div>
  );
}

export default Pricing;