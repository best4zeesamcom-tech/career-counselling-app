import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Premium() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [premiumStatus, setPremiumStatus] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const API_URL = 'https://career-counselling-app--best4zeesamcom.replit.app';

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // REPLACE WITH YOUR ACTUAL PHONE NUMBER
  const YOUR_JAZZCASH_NUMBER = '03160522774'; // CHANGE THIS
  const YOUR_EASYPAISA_NUMBER = '03160522774'; // CHANGE THIS

  useEffect(() => {
    if (token) {
      fetchPremiumStatus();
      fetchPaymentHistory();
    }
  }, [token]);

  const fetchPremiumStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/api/payment/status`, {
        headers: { 'x-auth-token': token }
      });
      const data = await response.json();
      setPremiumStatus(data);
    } catch (error) {
      console.error('Error fetching premium status:', error);
    }
  };

  const fetchPaymentHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/api/payment/history`, {
        headers: { 'x-auth-token': token }
      });
      const data = await response.json();
      setPaymentHistory(data);
    } catch (error) {
      console.error('Error fetching payment history:', error);
    }
  };

  const handleUpgrade = async (plan, amount, method) => {
    if (!token) {
      alert('Please login first');
      navigate('/login');
      return;
    }

    setLoading(true);
    
    // Store payment info for manual verification
    localStorage.setItem('pendingPaymentMethod', method);
    localStorage.setItem('pendingUpgrade', plan);
    localStorage.setItem('pendingAmount', amount);
    localStorage.setItem('pendingUserEmail', user.email);
    
    // Get the correct phone number based on payment method
    const phoneNumber = method === 'JazzCash' ? YOUR_JAZZCASH_NUMBER : YOUR_EASYPAISA_NUMBER;
    
    // Create payment message
    const paymentMessage = `*CAREERGUIDE PREMIUM UPGRADE*%0A%0A💰 Amount: Rs. ${amount}%0A📱 Method: ${method}%0A📧 Email: ${user.email}%0A🎯 Plan: Premium Lifetime%0A%0A📲 Send payment to:%0A${method}: ${phoneNumber}%0AAccount: CareerGuide%0A%0AAfter payment, click OK to verify.`;
    
    // Show payment instructions
    const confirmed = confirm(
      `💳 PAYMENT INSTRUCTIONS\n\n` +
      `Amount: Rs. ${amount}\n` +
      `Method: ${method}\n` +
      `Send to: ${phoneNumber}\n` +
      `Reference: ${user.email}\n\n` +
      `After sending payment, click OK to confirm.`
    );
    
    if (confirmed) {
      // Redirect to payment success page with manual mode
      navigate(`/payment-success?payment_method=${method}&amount=${amount}&plan=${plan}&manual=true&email=${user.email}`);
    }
    
    setLoading(false);
  };

  const plans = [
    {
      id: 'basic',
      name: 'Free',
      price: 0,
      features: [
        '✓ View basic career paths',
        '✓ Limited job listings (5)',
        '✓ Basic quiz results',
        '✗ No resume upload',
        '✗ No saved jobs',
        '✗ No priority support'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 4500,
      priceLabel: 'Rs. 4,500',
      popular: true,
      features: [
        '✓ Unlimited career paths',
        '✓ All job listings',
        '✓ Full quiz results',
        '✓ Resume upload & download',
        '✓ Save unlimited jobs',
        '✓ Priority support',
        '✓ Certificate of completion'
      ]
    }
  ];

  const isPremiumActive = premiumStatus?.isPremium || user?.isPremium;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600">
            Get the best career guidance for your future
          </p>
        </div>

        {/* Premium Status Banner */}
        {isPremiumActive && (
          <div className="max-w-2xl mx-auto mb-8 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-center">
            🎉 You are a Premium Member! 
            {premiumStatus?.remainingDays > 0 && ` (${premiumStatus.remainingDays} days remaining)`}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-xl shadow-lg overflow-hidden ${
                plan.popular ? 'ring-2 ring-yellow-400 transform scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="bg-yellow-400 text-center py-2 text-sm font-semibold">
                  MOST POPULAR
                </div>
              )}
              
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h2>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-blue-600">
                    {plan.priceLabel || `Rs. ${plan.price}`}
                  </span>
                  {plan.price > 0 && <span className="text-gray-500">/one-time</span>}
                </div>
                
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="text-gray-600">
                      {feature}
                    </li>
                  ))}
                </ul>
                
                {plan.price > 0 ? (
                  isPremiumActive ? (
                    <button
                      disabled
                      className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold cursor-default"
                    >
                      Already Premium ✓
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <button
                        onClick={() => handleUpgrade(plan.id, plan.price, 'JazzCash')}
                        disabled={loading}
                        className="w-full bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition disabled:opacity-50"
                      >
                        {loading ? 'Processing...' : '💳 Pay with JazzCash'}
                      </button>
                      <button
                        onClick={() => handleUpgrade(plan.id, plan.price, 'EasyPaisa')}
                        disabled={loading}
                        className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition disabled:opacity-50"
                      >
                        {loading ? 'Processing...' : '📱 Pay with EasyPaisa'}
                      </button>
                    </div>
                  )
                ) : (
                  <button
                    onClick={() => navigate('/')}
                    className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                  >
                    Current Plan
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Payment Instructions */}
        <div className="max-w-4xl mx-auto mt-12 bg-blue-50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-center mb-4">📱 Payment Instructions</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white p-4 rounded-lg">
              <p className="font-semibold text-yellow-600">JazzCash:</p>
              <p>Send Rs. 4,500 to: <strong>{YOUR_JAZZCASH_NUMBER}</strong></p>
              <p className="text-xs text-gray-500 mt-1">Reference: Your email address</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="font-semibold text-green-600">EasyPaisa:</p>
              <p>Send Rs. 4,500 to: <strong>{YOUR_EASYPAISA_NUMBER}</strong></p>
              <p className="text-xs text-gray-500 mt-1">Reference: Your email address</p>
            </div>
          </div>
          <p className="text-center text-xs text-gray-600 mt-4">
            ⏳ Account upgraded within 1 hour after payment confirmation
          </p>
        </div>

        {!token && (
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Please <a href="/login" className="text-blue-600 hover:underline">login</a> to upgrade to premium
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Premium;