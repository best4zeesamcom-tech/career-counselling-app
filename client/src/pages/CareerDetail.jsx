import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API_URL from '../config';
function CareerDetail() {
  const { id } = useParams();
  const [career, setCareer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCareer();
  }, [id]);

  const fetchCareer = async () => {
    try {
      const response = await fetch(`${API_URL}/api/jobs`);

      const data = await response.json();
      setCareer(data);
    } catch (err) {
      setError('Failed to load career details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !career) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error || 'Career not found'}</p>
          <Link to="/careers" className="text-blue-600 mt-4 inline-block">← Back to Careers</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-12">
          <Link to="/careers" className="text-white opacity-80 hover:opacity-100 mb-4 inline-block">
            ← Back to Careers
          </Link>
          <h1 className="text-4xl font-bold mb-4">{career.title}</h1>
          <p className="text-xl opacity-90">{career.description}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* Skills Section */}
            {career.skills && career.skills.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Required Skills</h2>
                <div className="flex flex-wrap gap-3">
                  {career.skills.map((skill, idx) => (
                    <span key={idx} className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Job Market Section */}
            {career.jobMarket && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Job Market Outlook</h2>
                <p className="text-gray-700 leading-relaxed">{career.jobMarket}</p>
              </div>
            )}

            {/* Universities Section */}
            {career.universities && career.universities.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Top Universities</h2>
                <ul className="space-y-2">
                  {career.universities.map((uni, idx) => (
                    <li key={idx} className="text-gray-700">• {uni}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Salary Card */}
            {career.averageSalary && (
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold mb-2">Average Salary</h3>
                <p className="text-3xl font-bold">{career.averageSalary}</p>
                <p className="text-sm opacity-90 mt-2">per month in Pakistan</p>
              </div>
            )}

            {/* Duration Card */}
            {career.duration && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Duration</h3>
                <p className="text-gray-700">{career.duration}</p>
              </div>
            )}

            {/* Call to Action */}
            <div className="bg-blue-50 rounded-xl shadow-md p-6 border border-blue-200">
              <h3 className="text-lg font-semibold mb-2 text-blue-800">Ready to start?</h3>
              <p className="text-gray-700 mb-4">Explore jobs in this field and upload your resume</p>
              <Link
                to="/jobs"
                className="block text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Find Jobs →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CareerDetail;