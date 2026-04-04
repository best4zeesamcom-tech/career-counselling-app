import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Careers from './pages/Careers';
import CareerDetail from './pages/CareerDetail';
import Jobs from './pages/Jobs';
import CareerQuiz from './pages/CareerQuiz';
import QuizResults from './pages/QuizResults';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

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
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;