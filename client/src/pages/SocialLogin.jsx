import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function SocialLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const userParam = params.get('user');
    const error = params.get('error');

    if (error) {
      navigate('/login?error=social_login_failed');
      return;
    }

    if (token && userParam) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', userParam);
      navigate('/');
    } else {
      navigate('/login');
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing login...</p>
      </div>
    </div>
  );
}

export default SocialLogin;