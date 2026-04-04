import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
    city: '',
    phone: '',
    education: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchUserData();
    fetchSavedJobs();
  }, [navigate]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/me', {
        headers: { 'x-auth-token': token }
      });
      
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        return;
      }
      
      const data = await response.json();
      setUser(data);
      setEditForm({
        name: data.name || '',
        bio: data.bio || '',
        city: data.city || '',
        phone: data.phone || '',
        education: data.education || ''
      });
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching saved jobs...');
      
      const response = await fetch('http://localhost:5000/api/jobs/saved', {
        headers: { 'x-auth-token': token }
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Saved jobs received:', data);
        console.log('Number of saved jobs:', data.length);
        setSavedJobs(data);
      } else {
        console.log('Response not OK:', response.status);
      }
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
    }
  };

  const refreshSavedJobs = async () => {
    setRefreshing(true);
    await fetchSavedJobs();
    setRefreshing(false);
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      setMessage('Please upload PDF or Word document only');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage('File size should be less than 5MB');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/jobs/upload-resume', {
        method: 'POST',
        headers: { 'x-auth-token': token },
        body: formData
      });
      
      const data = await response.json();
      if (response.ok) {
        setMessage('✅ Resume uploaded successfully!');
        fetchUserData();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('❌ ' + data.message);
      }
    } catch (error) {
      setMessage('❌ Error uploading resume');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteResume = async () => {
    if (!confirm('Are you sure you want to delete your resume?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/jobs/resume', {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });
      
      if (response.ok) {
        setMessage('✅ Resume deleted successfully');
        fetchUserData();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('❌ Error deleting resume');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/update', {
        method: 'PUT',
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });
      
      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setMessage('✅ Profile updated successfully');
        setIsEditing(false);
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('❌ Failed to update profile');
      }
    } catch (error) {
      setMessage('❌ Error updating profile');
    } finally {
      setUploading(false);
    }
  };

  const removeSavedJob = async (jobId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/jobs/unsave/${jobId}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });
      
      if (response.ok) {
        setSavedJobs(savedJobs.filter(job => job._id !== jobId));
        setMessage('✅ Job removed from saved');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('❌ Failed to remove job');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const educationLabels = {
    matric: 'After Matric',
    fsc: 'After FSC',
    university: 'University Graduate',
    other: 'Other'
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Profile</h1>
              <p className="text-blue-100">Manage your account and preferences</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div className={`mb-4 p-3 rounded-lg ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - User Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Information Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  👤 Account Information
                </h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    ✏️ Edit Profile
                  </button>
                )}
              </div>
              
              {isEditing ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Bio</label>
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">City</label>
                      <input
                        type="text"
                        value={editForm.city}
                        onChange={(e) => setEditForm({...editForm, city: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Karachi, Lahore, etc."
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Phone</label>
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="03XXXXXXXXX"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Education Level</label>
                    <select
                      value={editForm.education}
                      onChange={(e) => setEditForm({...editForm, education: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="matric">After Matric</option>
                      <option value="fsc">After FSC</option>
                      <option value="university">University Graduate</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={uploading}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      {uploading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="text-gray-500 text-sm">Name</label>
                    <p className="text-gray-800 font-semibold">{user?.name || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="text-gray-500 text-sm">Email</label>
                    <p className="text-gray-800 font-semibold">{user?.email || 'Not set'}</p>
                  </div>
                  {user?.bio && (
                    <div>
                      <label className="text-gray-500 text-sm">Bio</label>
                      <p className="text-gray-800">{user.bio}</p>
                    </div>
                  )}
                  <div className="grid md:grid-cols-2 gap-3">
                    {user?.city && (
                      <div>
                        <label className="text-gray-500 text-sm">City</label>
                        <p className="text-gray-800">{user.city}</p>
                      </div>
                    )}
                    {user?.phone && (
                      <div>
                        <label className="text-gray-500 text-sm">Phone</label>
                        <p className="text-gray-800">{user.phone}</p>
                      </div>
                    )}
                  </div>
                  {user?.education && (
                    <div>
                      <label className="text-gray-500 text-sm">Education</label>
                      <p className="text-gray-800">{educationLabels[user.education] || user.education}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-gray-500 text-sm">Account Status</label>
                    <p className="text-green-600 font-semibold">
                      {user?.isPremium ? '✨ Premium Member' : 'Free Member'}
                    </p>
                  </div>
                  <div>
                    <label className="text-gray-500 text-sm">Member Since</label>
                    <p className="text-gray-800">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Saved Jobs Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  💾 Saved Jobs ({savedJobs.length})
                </h2>
                <button
                  onClick={refreshSavedJobs}
                  disabled={refreshing}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition disabled:opacity-50"
                >
                  {refreshing ? 'Refreshing...' : '🔄 Refresh'}
                </button>
              </div>
              
              {savedJobs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No saved jobs yet</p>
                  <Link to="/jobs" className="text-blue-600 hover:underline mt-2 inline-block">
                    Browse Jobs →
                  </Link>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {savedJobs.map((job) => (
                    <div key={job._id} className="border-b pb-4 last:border-b-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-gray-800">{job.title}</h3>
                          <p className="text-blue-600 text-sm">{job.company}</p>
                          <p className="text-gray-500 text-sm">{job.location}</p>
                        </div>
                        <button
                          onClick={() => removeSavedJob(job._id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Resume Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                📄 Resume / CV
              </h2>
              
              {user?.resume?.filename ? (
                <div className="bg-green-50 p-4 rounded-lg mb-4">
                  <p className="text-green-700 font-semibold">✅ Resume Uploaded</p>
                  <p className="text-sm text-gray-600 mt-1">{user.resume.originalName || user.resume.filename}</p>
                  {user.resume.fileSize && (
                    <p className="text-xs text-gray-500 mt-1">
                      Size: {(user.resume.fileSize / 1024 / 1024).toFixed(2)} MB
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Uploaded on: {user.resume.uploadedAt ? new Date(user.resume.uploadedAt).toLocaleDateString() : 'N/A'}
                  </p>
                  <div className="flex gap-3 mt-3">
                    <a
                      href={`http://localhost:5000/${user.resume.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View Resume →
                    </a>
                    <button
                      onClick={handleDeleteResume}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 mb-4">No resume uploaded yet</p>
              )}
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="resume"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  className="hidden"
                />
                <label htmlFor="resume" className="cursor-pointer inline-block">
                  <div className="text-4xl mb-2">📁</div>
                  <p className="text-blue-600 font-semibold hover:underline">
                    Click to upload resume
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    PDF, DOC, DOCX (Max 5MB)
                  </p>
                </label>
              </div>
              {uploading && (
                <div className="mt-4 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 inline-block"></div>
                  <p className="text-sm text-gray-600 mt-2">Uploading...</p>
                </div>
              )}
            </div>

            {/* Premium Upgrade Card */}
            {!user?.isPremium && (
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl shadow-md p-6 text-center">
                <h3 className="text-xl font-bold text-white mb-2">Upgrade to Premium!</h3>
                <p className="text-white mb-4">Get unlimited access to all career paths and job listings</p>
                <button className="bg-white text-orange-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
                  Upgrade Now - Rs. 4,500
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;