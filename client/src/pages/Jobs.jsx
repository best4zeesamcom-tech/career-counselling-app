import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import API_URL from '../config';
function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [saving, setSaving] = useState({});
  const [saveMessage, setSaveMessage] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/jobs`);
      const data = await response.json();
      setJobs(data);
    } catch (err) {
      setError('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const saveJob = async (jobId) => {
    if (!token) {
      setSaveMessage('⚠️ Please login to save jobs');
      setTimeout(() => setSaveMessage(''), 3000);
      return;
    }

    setSaving({ ...saving, [jobId]: true });
    try {
      const response = await fetch(`${API_URL}/api/jobs/save/${jobId}`, {
        method: 'POST',
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        setSaveMessage('✅ Job saved successfully!');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        const data = await response.json();
        setSaveMessage(`❌ ${data.message || 'Failed to save job'}`);
        setTimeout(() => setSaveMessage(''), 3000);
      }
    } catch (error) {
      setSaveMessage('❌ Failed to save job');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setSaving({ ...saving, [jobId]: false });
    }
  };

  // Filter jobs
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = !searchTerm || 
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || job.type === filterType;
    const matchesLocation = !filterLocation || 
      job.location?.toLowerCase().includes(filterLocation.toLowerCase());
    return matchesSearch && matchesType && matchesLocation;
  });

  const jobTypes = [
    { value: '', label: 'All Types' },
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'internship', label: 'Internship' },
    { value: 'remote', label: 'Remote' }
  ];

  const locations = ['Karachi', 'Lahore', 'Islamabad', 'Remote'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-4">Job Board</h1>
          <p className="text-xl opacity-90">
            Find internships and job opportunities for Pakistani students
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Save Message */}
        {saveMessage && (
          <div className={`mb-4 p-3 rounded-lg ${saveMessage.includes('✅') ? 'bg-green-100 text-green-700' : saveMessage.includes('⚠️') ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
            {saveMessage}
          </div>
        )}

        {/* Login Warning */}
        {!token && (
          <div className="mb-4 p-3 rounded-lg bg-yellow-100 text-yellow-700">
            ⚠️ Please <Link to="/login" className="font-semibold underline">login</Link> to save jobs
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Search Jobs</label>
              <input
                type="text"
                placeholder="Search by title or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Job Type Filter */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Job Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {jobTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Location</label>
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Locations</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          {(searchTerm || filterType || filterLocation) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterType('');
                setFilterLocation('');
              }}
              className="mt-4 text-blue-600 hover:underline text-sm"
            >
              Clear All Filters
            </button>
          )}
        </div>

        {/* Loading State - Using LoadingSpinner */}
        {loading && <LoadingSpinner />}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-8">
            {error}
          </div>
        )}

        {/* Jobs List */}
        {!loading && !error && (
          <>
            <div className="mb-4 flex justify-between items-center">
              <p className="text-gray-600">Found {filteredJobs.length} job(s)</p>
              {token && (
                <Link to="/profile" className="text-blue-600 hover:underline text-sm">
                  View Saved Jobs →
                </Link>
              )}
            </div>
            
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <div key={job._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{job.title}</h3>
                      <p className="text-blue-600 font-semibold mb-2">{job.company}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">
                          📍 {job.location}
                        </span>
                        <span className={`text-sm px-3 py-1 rounded-full ${
                          job.type === 'remote' ? 'bg-green-100 text-green-600' :
                          job.type === 'internship' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          💼 {job.type?.toUpperCase() || 'FULL-TIME'}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{job.description}</p>
                      {job.salary && (
                        <p className="text-green-600 font-semibold mb-3">💰 {job.salary}</p>
                      )}
                      <div className="flex gap-3">
                        <a
                          href={job.applyLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                          Apply Now →
                        </a>
                        <button
                          onClick={() => saveJob(job._id)}
                          disabled={saving[job._id]}
                          className="inline-block border-2 border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition disabled:opacity-50"
                        >
                          {saving[job._id] ? 'Saving...' : '💾 Save Job'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No Jobs Message */}
            {filteredJobs.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-500 text-lg">No jobs found matching your criteria.</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterType('');
                    setFilterLocation('');
                  }}
                  className="mt-4 text-blue-600 hover:underline"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Jobs;
