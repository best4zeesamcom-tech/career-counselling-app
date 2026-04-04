import { Link } from 'react-router-dom';
import { useState } from 'react';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';

function Home() {
  const [message, setMessage] = useState('');

  const testBackend = async () => {
    try {
      const res = await fetch(`${API_URL}/`);
      const data = await res.json();
      setMessage(data.message);
    } catch (error) {
      setMessage('Error connecting to backend');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in">
            Your Career Journey Starts Here 🚀
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Get personalized career guidance for Pakistani students after Matric, FSC, and University
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/careers"
              className="bg-white text-blue-600 px-6 md:px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg"
            >
              Explore Careers →
            </Link>
            <Link
              to="/quiz"
              className="bg-yellow-500 text-white px-6 md:px-8 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition shadow-lg"
            >
              ✨ Take Career Quiz
            </Link>
            <button 
              onClick={testBackend}
              className="bg-transparent border-2 border-white text-white px-6 md:px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
            >
              Test Connection
            </button>
          </div>
          {message && (
            <p className="mt-4 text-green-200 font-medium">
              ✅ Backend says: {message}
            </p>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">After Matric</h3>
            <p className="text-gray-600">Explore diplomas, IT certifications, and technical paths</p>
            <Link to="/careers" className="text-blue-600 mt-4 inline-block hover:underline">
              View Paths →
            </Link>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1">
            <div className="text-5xl mb-4">🎓</div>
            <h3 className="text-xl font-semibold mb-2">After FSC</h3>
            <p className="text-gray-600">Medical, engineering, business, and computer science paths</p>
            <Link to="/careers" className="text-blue-600 mt-4 inline-block hover:underline">
              View Paths →
            </Link>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1">
            <div className="text-5xl mb-4">💼</div>
            <h3 className="text-xl font-semibold mb-2">Job Board</h3>
            <p className="text-gray-600">Find internships and job opportunities in Pakistan</p>
            <Link to="/jobs" className="text-blue-600 mt-4 inline-block hover:underline">
              Find Jobs →
            </Link>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <Testimonials />

      {/* FAQ Section */}
      <FAQ />

      {/* Final CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of Pakistani students who found their path with CareerGuide
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/careers"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg"
            >
              Explore Careers →
            </Link>
            <Link
              to="/quiz"
              className="bg-yellow-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition shadow-lg"
            >
              Take Career Quiz ✨
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2024 CareerGuide - Helping Pakistani Students Find Their Path</p>
          <p className="text-gray-400 text-sm mt-2">Made with ❤️ for Pakistani students</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;