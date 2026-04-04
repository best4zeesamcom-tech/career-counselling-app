import { useLocation, Link } from 'react-router-dom';

function QuizResults() {
  const location = useLocation();
  const { answers, recommendations } = location.state || { answers: {}, recommendations: [] };

  const educationLabels = {
    matric: 'After Matric',
    fsc: 'After FSC',
    university: 'After University'
  };

  const interestLabels = {
    science: 'Science & Technology',
    math: 'Mathematics & Business',
    arts: 'Arts & Creative',
    commerce: 'Commerce & Finance'
  };

  const workStyleLabels = {
    office: 'Office-based',
    remote: 'Remote / Freelance',
    field: 'Field Work',
    creative: 'Creative / Startup'
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Your Career Recommendations 🎯
          </h1>
          <p className="text-xl text-gray-600">
            Based on your interests and preferences
          </p>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Your Profile</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-semibold">Education Level</p>
              <p className="text-lg font-bold text-gray-800">{educationLabels[answers.education]}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-semibold">Interest Area</p>
              <p className="text-lg font-bold text-gray-800">{interestLabels[answers.interests]}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600 font-semibold">Work Style</p>
              <p className="text-lg font-bold text-gray-800">{workStyleLabels[answers.workStyle]}</p>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Recommended Career Paths for You
        </h2>
        
        {recommendations.length > 0 ? (
          <div className="grid gap-6">
            {recommendations.map((career) => (
              <Link
                key={career._id}
                to={`/career/${career._id}`}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 block"
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{career.title}</h3>
                <p className="text-gray-600 mb-4">{career.description}</p>
                
                <div className="flex flex-wrap gap-4 text-sm">
                  {career.skills && career.skills.length > 0 && (
                    <div className="flex items-center">
                      <span className="font-semibold text-gray-700 mr-2">Skills needed:</span>
                      <div className="flex gap-2">
                        {career.skills.slice(0, 3).map((skill, idx) => (
                          <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {career.averageSalary && (
                    <div className="flex items-center">
                      <span className="font-semibold text-gray-700 mr-2">Salary:</span>
                      <span className="text-green-600">{career.averageSalary}</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 text-blue-600 font-semibold">
                  Learn more →
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">
              No recommendations found for your profile.
            </p>
            <Link
              to="/careers"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Browse All Careers →
            </Link>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between mt-8">
          <Link
            to="/careers"
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Browse All Careers
          </Link>
          <Link
            to="/quiz"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Take Quiz Again
          </Link>
        </div>
      </div>
    </div>
  );
}

export default QuizResults;