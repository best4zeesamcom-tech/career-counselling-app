import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CareerQuiz() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    education: '',
    interests: '',
    workStyle: ''
  });
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const educationOptions = [
    { value: 'matric', label: '📚 After Matric (Class 10 completed)', description: 'Looking for diploma or certification paths' },
    { value: 'fsc', label: '🎓 After FSC (Class 12 completed)', description: 'Ready for university or professional studies' },
    { value: 'university', label: '🏛️ After University (Graduated)', description: 'Looking for job or higher studies' }
  ];

  const interestOptions = [
    { value: 'science', label: '🔬 Science & Technology', careers: ['software-engineering', 'doctor', 'civil-engineering'] },
    { value: 'math', label: '📐 Mathematics & Business', careers: ['software-engineering', 'business-administration', 'data-scientist'] },
    { value: 'arts', label: '🎨 Arts & Creative', careers: ['graphic-design', 'content-writer', 'ui-ux-designer'] },
    { value: 'commerce', label: '💰 Commerce & Finance', careers: ['chartered-accountancy', 'business-administration', 'digital-marketing'] }
  ];

  const workStyleOptions = [
    { value: 'office', label: '🏢 Office-based', description: 'Work in a traditional office environment' },
    { value: 'remote', label: '🏠 Remote / Freelance', description: 'Work from home, flexible hours' },
    { value: 'field', label: '🌍 Field Work', description: 'Work on-site, travel, hands-on' },
    { value: 'creative', label: '🎨 Creative / Startup', description: 'Innovative, dynamic, creative environment' }
  ];

  const handleAnswer = (question, value) => {
    setAnswers({ ...answers, [question]: value });
  };

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      generateRecommendations();
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const generateRecommendations = async () => {
    setLoading(true);
    try {
      // Fetch all careers from API
      const response = await fetch(`${API_URL}/api/careers`);
      const allCareers = await response.json();
      
      // Filter careers based on user answers
      let filtered = allCareers.filter(career => {
        // Match education level
        const educationMatch = career.educationLevel === answers.education;
        
        // Match interests (simplified logic)
        let interestMatch = false;
        if (answers.interests === 'science' && 
            (career.title.includes('Engineer') || career.title.includes('Doctor') || career.title.includes('Developer'))) {
          interestMatch = true;
        } else if (answers.interests === 'math' && 
                   (career.title.includes('Engineer') || career.title.includes('Business') || career.title.includes('Data'))) {
          interestMatch = true;
        } else if (answers.interests === 'arts' && 
                   (career.title.includes('Design') || career.title.includes('Writer') || career.title.includes('UI'))) {
          interestMatch = true;
        } else if (answers.interests === 'commerce' && 
                   (career.title.includes('Business') || career.title.includes('Marketing') || career.title.includes('Account'))) {
          interestMatch = true;
        }
        
        return educationMatch && interestMatch;
      });
      
      // Limit to top 4 recommendations
      setRecommendations(filtered.slice(0, 4));
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveQuizResults = () => {
    // Save to localStorage (will connect to backend later)
    const quizData = {
      answers,
      recommendations,
      takenAt: new Date().toISOString()
    };
    localStorage.setItem('quizResults', JSON.stringify(quizData));
    
    // Navigate to results page
    navigate('/quiz-results', { state: { answers, recommendations } });
  };

  const renderQuestion = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              What is your current education level?
            </h2>
            <div className="grid gap-4">
              {educationOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer('education', option.value)}
                  className={`p-6 text-left rounded-xl border-2 transition-all ${
                    answers.education === option.value
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                  }`}
                >
                  <div className="text-2xl mb-2">{option.label}</div>
                  <p className="text-gray-600 text-sm">{option.description}</p>
                </button>
              ))}
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              What subjects interest you the most?
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {interestOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer('interests', option.value)}
                  className={`p-6 text-left rounded-xl border-2 transition-all ${
                    answers.interests === option.value
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                  }`}
                >
                  <div className="text-2xl font-semibold mb-2">{option.label}</div>
                </button>
              ))}
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              What's your preferred work style?
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {workStyleOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer('workStyle', option.value)}
                  className={`p-6 text-left rounded-xl border-2 transition-all ${
                    answers.workStyle === option.value
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                  }`}
                >
                  <div className="text-xl font-semibold mb-2">{option.label}</div>
                  <p className="text-gray-600 text-sm">{option.description}</p>
                </button>
              ))}
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Analyzing your answers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Question {step} of 3</span>
            <span className="text-sm text-gray-600">{Math.round(step / 3 * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {renderQuestion()}
          
          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button
                onClick={prevStep}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                ← Previous
              </button>
            )}
            <button
              onClick={nextStep}
              disabled={
                (step === 1 && !answers.education) ||
                (step === 2 && !answers.interests) ||
                (step === 3 && !answers.workStyle)
              }
              className={`px-6 py-2 rounded-lg transition ml-auto ${
                ((step === 1 && answers.education) ||
                 (step === 2 && answers.interests) ||
                 (step === 3 && answers.workStyle))
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {step === 3 ? 'Get Recommendations →' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CareerQuiz;