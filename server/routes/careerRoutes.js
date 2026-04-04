const express = require('express');
const router = express.Router();
const CareerPath = require('../models/CareerPath');

// GET all careers
router.get('/', async (req, res) => {
    try {
        const careers = await CareerPath.find();
        res.json(careers);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// GET careers by education level
router.get('/level/:level', async (req, res) => {
    try {
        const { level } = req.params;
        const careers = await CareerPath.find({ educationLevel: level });
        res.json(careers);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// GET single career by ID
router.get('/:id', async (req, res) => {
    try {
        const career = await CareerPath.findById(req.params.id);
        if (!career) {
            return res.status(404).json({ message: 'Career not found' });
        }
        res.json(career);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;