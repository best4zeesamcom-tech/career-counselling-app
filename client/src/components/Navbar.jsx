import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  // Safe way to get user data
  let user = {};
  try {
    const userData = localStorage.getItem('user');
    if (userData && userData !== 'undefined') {
      user = JSON.parse(userData);
    }
  } catch (error) {
    console.error('Error parsing user data:', error);
    user = {};
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          🎓 CareerGuide
        </Link>
        <div className="space-x-6">
          <Link to="/" className="hover:text-blue-200 transition">Home</Link>
          <Link to="/careers" className="hover:text-blue-200 transition">Careers</Link>
          <Link to="/quiz" className="hover:text-blue-200 transition bg-yellow-500 px-3 py-1 rounded-full">
            ✨ Quiz
          </Link>
          <Link to="/jobs" className="hover:text-blue-200 transition">Jobs</Link>
          {token ? (
            <>
              <Link to="/profile" className="hover:text-blue-200 transition">
                👤 {user?.name?.split(' ')[0] || 'Profile'}
              </Link>
              <button onClick={handleLogout} className="hover:text-blue-200 transition">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-200 transition">Login</Link>
              <Link to="/register" className="bg-green-500 px-3 py-1 rounded-full hover:bg-green-600 transition">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;