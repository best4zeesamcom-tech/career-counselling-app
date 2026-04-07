import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import API_URL from '../config';

function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('processing');
  const [countdown, setCountdown] = useState(5);
  
  // REPLACE WITH YOUR ACTUAL WHATSAPP NUMBER
  const YOUR_WHATSAPP_NUMBER = '923XXXXXXXXX'; // CHANGE THIS (include country code without +)

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const isManual = params.get('manual') === 'true';
    const paymentMethod = params.get('payment_method');
    const amount = params.get('amount');
    const userEmail = params.get('email');
    
    if (isManual) {
      // Store payment info for manual verification
      localStorage.setItem('lastPaymentMethod', paymentMethod);
      localStorage.setItem('lastAmount', amount);
      localStorage.setItem('lastUserEmail', userEmail);
      setStatus('manual');
    } else {
      verifyAndUpgrade();
    }
  }, [location]);

  const verifyAndUpgrade = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login?redirect=payment-success');
      return;
    }

    try {
      const params = new URLSearchParams(location.search);
      const sessionId = params.get('session_id');
      const paymentMethod = params.get('payment_method') || 
                            localStorage.getItem('pendingPaymentMethod') || 
                            'manual';
      
      const response = await fetch(`${API_URL}/api/auth/upgrade`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId: sessionId,
          paymentMethod: paymentMethod,
          amount: 4500,
          plan: 'premium'
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        currentUser.isPremium = true;
        currentUser.premiumSince = new Date().toISOString();
        localStorage.setItem('user', JSON.stringify(currentUser));
        
        localStorage.removeItem('pendingPaymentMethod');
        localStorage.removeItem('pendingUpgrade');
        
        setStatus('success');
        
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              navigate('/profile?upgrade=success');
            }
            return prev - 1;
          });
        }, 1000);
        
      } else {
        const error = await response.json();
        console.error('Upgrade failed:', error);
        setStatus('error');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setStatus('error');
    }
  };

  const handleManualUpgrade = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/upgrade`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          paymentMethod: localStorage.getItem('lastPaymentMethod') || 'manual',
          amount: parseInt(localStorage.getItem('lastAmount')) || 4500,
          plan: 'premium'
        })
      });

      if (response.ok) {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        currentUser.isPremium = true;
        currentUser.premiumSince = new Date().toISOString();
        localStorage.setItem('user', JSON.stringify(currentUser));
        setStatus('success');
        setTimeout(() => navigate('/profile?upgrade=success'), 2000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  // Manual Payment State
  if (status === 'manual') {
    const paymentMethod = localStorage.getItem('lastPaymentMethod') || 
                          new URLSearchParams(location.search).get('payment_method') || 
                          'JazzCash';
    const amount = localStorage.getItem('lastAmount') || 
                   new URLSearchParams(location.search).get('amount') || 
                   '4500';
    const userEmail = localStorage.getItem('lastUserEmail') || 
                      new URLSearchParams(location.search).get('email') || 
                      'your email';
    
    const phoneNumber = paymentMethod === 'JazzCash' ? '03160522774' : '03160522774'; // REPLACE WITH YOUR NUMBERS
    
    const whatsappMessage = `Payment Confirmation%0A%0AEmail: ${userEmail}%0AAmount: Rs. ${amount}%0AMethod: ${paymentMethod}%0AStatus: Payment Sent%0A%0APlease upgrade my account to Premium. Thank you!`;
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg">
          <div className="bg-yellow-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">⏳</span>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Payment Initiated!
          </h1>
          
          <p className="text-gray-600 mb-4">
            Thank you for choosing CareerGuide Premium!
          </p>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-4 text-left">
            <p className="font-semibold text-gray-800 mb-2">📋 Payment Details:</p>
            <p className="text-sm text-gray-700">Amount: <strong>Rs. {amount}</strong></p>
            <p className="text-sm text-gray-700">Method: <strong>{paymentMethod}</strong></p>
            <p className="text-sm text-gray-700">Email: <strong>{userEmail}</strong></p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg mb-6">
            <p className="font-semibold text-gray-800 mb-2">📱 Send Payment To:</p>
            <p className="text-sm text-gray-700">{paymentMethod}: <strong>{phoneNumber}</strong></p>
            <p className="text-sm text-gray-700">Account: CareerGuide Premium</p>
            <p className="text-xs text-gray-500 mt-2">Reference: Use your email address</p>
          </div>
          
          <div className="space-y-3">
            <a
              href={`https://wa.me/${YOUR_WHATSAPP_NUMBER}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold text-center"
            >
              📱 Confirm Payment on WhatsApp
            </a>
            
            <button
              onClick={handleManualUpgrade}
              className="block w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-center"
            >
              I've Sent Payment (Verify)
            </button>
            
            <button
              onClick={() => navigate('/profile')}
              className="block w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition text-center"
            >
              Go to Profile
            </button>
          </div>
          
          <p className="text-xs text-gray-500 mt-6">
            ⏳ Your account will be upgraded within 1 hour after payment confirmation.
          </p>
        </div>
      </div>
    );
  }

  // Loading/Processing state
  if (status === 'processing') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Verifying Payment...
          </h2>
          <p className="text-gray-600">
            Please wait while we confirm your payment and upgrade your account.
          </p>
        </div>
      </div>
    );
  }

  // Success state
  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg">
          <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🎉 Payment Successful!
          </h1>
          
          <p className="text-gray-600 mb-2">
            Thank you for upgrading to Premium!
          </p>
          
          <p className="text-gray-500 mb-6">
            You now have access to all premium features.
          </p>
          
          <div className="text-left bg-gray-50 p-4 rounded-lg mb-6">
            <p className="font-semibold text-gray-800 mb-2">What's included:</p>
            <p className="text-sm text-gray-700 mb-1">✓ Complete career guidance</p>
            <p className="text-sm text-gray-700 mb-1">✓ Unlimited job listings</p>
            <p className="text-sm text-gray-700 mb-1">✓ Resume upload & review</p>
            <p className="text-sm text-gray-700">✓ Priority support</p>
          </div>
          
          <p className="text-sm text-gray-500 mb-4">
            Redirecting to your profile in {countdown} seconds...
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/profile')}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Go to Profile →
            </button>
            <button
              onClick={() => navigate('/careers')}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition"
            >
              Explore Careers
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg">
        <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Verification Failed
        </h1>
        
        <p className="text-gray-600 mb-6">
          We couldn't verify your payment. Don't worry - if you paid, please contact support.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={handleManualUpgrade}
            className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition font-semibold"
          >
            Try Manual Verification
          </button>
          
          <Link
            to="/premium"
            className="block w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-center font-semibold"
          >
            Back to Premium
          </Link>
          
          <a
            href={`https://wa.me/${YOUR_WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition text-center"
          >
            Contact Support on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;