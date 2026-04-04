const JobListing = require('../models/JobListing');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|doc|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      return cb(null, true);
    }
    cb(new Error('Only PDF and Word documents are allowed'));
  }
});

// GET all jobs
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await JobListing.find().sort({ postedAt: -1 });
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET single job
exports.getJobById = async (req, res) => {
  try {
    const job = await JobListing.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ===== SAVED JOBS FUNCTIONS =====

// Get saved jobs - WORKING VERSION
exports.getSavedJobs = async (req, res) => {
  try {
    console.log('=== getSavedJobs called ===');
    
    // Get user ID from token
    const userId = req.user.userId;
    console.log('User ID:', userId);
    
    // Find user
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('User email:', user.email);
    console.log('Saved jobs IDs:', user.savedJobs);
    
    // If no saved jobs, return empty array
    if (!user.savedJobs || user.savedJobs.length === 0) {
      console.log('No saved jobs');
      return res.json([]);
    }
    
    // Get all jobs that match the saved IDs
    const jobs = await JobListing.find({
      '_id': { $in: user.savedJobs }
    });
    
    console.log(`Found ${jobs.length} jobs`);
    res.json(jobs);
    
  } catch (error) {
    console.error('Error in getSavedJobs:', error);
    res.status(500).json({ error: error.message });
  }
};

// Save a job
exports.saveJob = async (req, res) => {
  try {
    console.log('=== saveJob called ===');
    console.log('Job ID:', req.params.id);
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const job = await JobListing.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    if (user.savedJobs.includes(req.params.id)) {
      return res.status(400).json({ message: 'Job already saved' });
    }
    
    user.savedJobs.push(req.params.id);
    await user.save();
    
    console.log('Job saved:', job.title);
    res.json({ message: 'Job saved successfully' });
    
  } catch (error) {
    console.error('Error in saveJob:', error);
    res.status(500).json({ message: error.message });
  }
};

// Unsave a job
exports.unsaveJob = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.savedJobs = user.savedJobs.filter(id => id.toString() !== req.params.id);
    await user.save();
    
    res.json({ message: 'Job removed from saved' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Upload resume
exports.uploadResume = async (req, res) => {
  upload.single('resume')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    await User.findByIdAndUpdate(req.user.userId, {
      resume: {
        filename: req.file.filename,
        path: req.file.path,
        originalName: req.file.originalname,
        fileSize: req.file.size,
        uploadedAt: new Date()
      }
    });
    
    res.json({ message: 'Resume uploaded successfully' });
  });
};

// Delete resume
exports.deleteResume = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user.resume) {
      return res.status(404).json({ message: 'No resume found' });
    }
    
    if (fs.existsSync(user.resume.path)) {
      fs.unlinkSync(user.resume.path);
    }
    
    user.resume = undefined;
    await user.save();
    
    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get resume info
exports.getResume = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user.resume) {
      return res.status(404).json({ message: 'No resume found' });
    }
    
    res.json({
      filename: user.resume.filename,
      originalName: user.resume.originalName,
      path: `/uploads/${user.resume.filename}`,
      uploadedAt: user.resume.uploadedAt
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};