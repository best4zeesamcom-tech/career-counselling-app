const mongoose = require('mongoose');
require('dotenv').config();

async function diagnostic() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // 1. Check all users and their saved jobs
    const users = await User.find();
    console.log('=== USERS AND SAVED JOBS ===');
    for (const user of users) {
      console.log(`User: ${user.email}`);
      console.log(`Saved Jobs IDs: ${user.savedJobs}`);
      console.log(`Number of saved jobs: ${user.savedJobs.length}\n`);
    }

    // 2. Check all jobs in database
    const jobs = await JobListing.find();
    console.log('=== JOBS IN DATABASE ===');
    console.log(`Total jobs: ${jobs.length}`);
    jobs.forEach(job => {
      console.log(`- ${job._id}: ${job.title}`);
    });

    // 3. If a user has saved jobs, try to fetch them
    const userWithJobs = users.find(u => u.savedJobs.length > 0);
    if (userWithJobs) {
      console.log('\n=== TESTING FETCH FOR USER WITH SAVED JOBS ===');
      const fetchedJobs = await JobListing.find({
        '_id': { $in: userWithJobs.savedJobs }
      });
      console.log(`Found ${fetchedJobs.length} jobs matching saved IDs`);
      fetchedJobs.forEach(job => {
        console.log(`- ${job.title}`);
      });
    } else {
      console.log('\n⚠️ No user has saved jobs in the database!');
    }

    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Load models
const User = require('./models/User');
const JobListing = require('./models/JobListing');

diagnostic();