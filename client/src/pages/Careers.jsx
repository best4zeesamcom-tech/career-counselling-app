import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

function Careers() {
  const [selectedLevel, setSelectedLevel] = useState('matric');
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch careers when selected level changes
  useEffect(() => {
    fetchCareers();
  }, [selectedLevel]);

  const fetchCareers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/careers/level/${selectedLevel}`);
      const data = await response.json();
      setCareers(data);
    } catch (err) {
      setError('Failed to fetch career paths');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const educationLevels = [
    { id: 'matric', label: '📚 After Matric', color: 'bg-green-500', description: 'Class 10 completed' },
    { id: 'fsc', label: '🎓 After FSC', color: 'bg-blue-500', description: 'Class 12 completed' },
    { id: 'university', label: '🏛️ After University', color: 'bg-purple-500', description: 'Graduation completed' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-4">Career Counselling</h1>
          <p className="text-xl opacity-90">
            Choose your education level to explore career paths in Pakistan
          </p>
        </div>
      </div>

      {/* Education Level Selector */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          {educationLevels.map((level) => (
            <button
              key={level.id}
              onClick={() => setSelectedLevel(level.id)}
              className={`p-6 rounded-xl transition-all transform hover:scale-105 ${
                selectedLevel === level.id
                  ? `${level.color} text-white shadow-lg ring-4 ring-offset-2 ring-blue-400`
                  : 'bg-white text-gray-700 shadow-md hover:shadow-lg'
              }`}
            >
              <div className="text-3xl mb-2">{level.label.split(' ')[0]}</div>
              <h3 className="text-xl font-bold mb-1">{level.label}</h3>
              <p className={`text-sm ${selectedLevel === level.id ? 'text-white opacity-90' : 'text-gray-500'}`}>
                {level.description}
              </p>
            </button>
          ))}
        </div>

        {/* Loading State - Using LoadingSpinner */}
        {loading && <LoadingSpinner />}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-8">
            {error}
          </div>
        )}

        {/* Career Cards */}
        {!loading && !error && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Career Paths for {selectedLevel === 'matric' ? 'After Matric' : selectedLevel === 'fsc' ? 'After FSC' : 'After University'}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {careers.map((career) => (
                <Link
                  key={career._id}
                  to={`/career/${career._id}`}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 overflow-hidden"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{career.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{career.description}</p>
                    
                    {/* Skills Tags */}
                    {career.skills && career.skills.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Key Skills:</p>
                        <div className="flex flex-wrap gap-2">
                          {career.skills.slice(0, 3).map((skill, idx) => (
                            <span key={idx} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Salary Info */}
                    {career.averageSalary && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-green-600 font-semibold">💰 {career.averageSalary}</span>
                        <span className="text-blue-600">Learn More →</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* No Careers Message */}
            {careers.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-500 text-lg">No career paths available yet.</p>
                <p className="text-gray-400 mt-2">Check back soon for updates!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Careers;