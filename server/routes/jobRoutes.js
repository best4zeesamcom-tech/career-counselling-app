const express = require('express');
const router = express.Router();
const JobListing = require('../models/JobListing');
const jobController = require('../controllers/jobController');
const auth = require('../middleware/auth');

// ========== PROTECTED ROUTES FIRST (Specific paths) ==========
router.get('/saved', auth, jobController.getSavedJobs);
router.post('/save/:id', auth, jobController.saveJob);
router.delete('/unsave/:id', auth, jobController.unsaveJob);
router.post('/upload-resume', auth, jobController.uploadResume);
router.delete('/resume', auth, jobController.deleteResume);
router.get('/resume', auth, jobController.getResume);

// ========== PUBLIC ROUTES LAST (General paths) ==========
router.get('/', jobController.getAllJobs);
router.get('/:id', jobController.getJobById);

module.exports = router;