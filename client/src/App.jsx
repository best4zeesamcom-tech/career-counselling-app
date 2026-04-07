import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import Careers from './pages/Careers';
import CareerDetail from './pages/CareerDetail';
import Jobs from './pages/Jobs';
import CareerQuiz from './pages/CareerQuiz';
import QuizResults from './pages/QuizResults';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import SocialLogin from './pages/SocialLogin';
import Pricing from './pages/Pricing';  // ✅ Add this import
import PaymentSuccess from './pages/PaymentSuccess';  // ✅ Optional: for after payment

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/career/:id" element={<CareerDetail />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/quiz" element={<CareerQuiz />} />
          <Route path="/quiz-results" element={<QuizResults />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/social-login" element={<SocialLogin />} />
          <Route path="/pricing" element={<Pricing />} />  {/* ✅ Add pricing route */}
          <Route path="/payment-success" element={<PaymentSuccess />} />  {/* ✅ Optional */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;