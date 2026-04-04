const mongoose = require('mongoose');
const JobListing = require('../models/JobListing');
require('dotenv').config();

const jobs = [
    {
        title: "Junior Web Developer",
        company: "Tech Solutions Pakistan",
        location: "Karachi",
        type: "full-time",
        description: "Looking for fresh graduates with HTML, CSS, JavaScript knowledge. Must have good communication skills.",
        requirements: ["HTML/CSS", "JavaScript", "React basics", "Good communication"],
        applyLink: "https://www.linkedin.com/jobs/",
        salary: "Rs. 40,000 - 60,000/month"
    },
    {
        title: "Software Engineer",
        company: "Systems Limited",
        location: "Lahore",
        type: "full-time",
        description: "Entry-level software engineer position for CS/IT graduates. Training provided.",
        requirements: ["Programming fundamentals", "Problem solving", "Teamwork"],
        applyLink: "https://www.systems.com.pk/careers",
        salary: "Rs. 50,000 - 80,000/month"
    },
    {
        title: "Content Writer",
        company: "Digital Marketing Agency",
        location: "Remote",
        type: "remote",
        description: "Create engaging content for blogs, social media, and websites. Good English required.",
        requirements: ["Excellent English writing", "Creativity", "SEO basics"],
        applyLink: "https://www.upwork.com/jobs/",
        salary: "Rs. 30,000 - 50,000/month"
    },
    {
        title: "Web Development Intern",
        company: "Devsinc",
        location: "Lahore",
        type: "internship",
        description: "3-month paid internship for final year students. Learn MERN stack development.",
        requirements: ["Basic HTML/CSS/JS", "Eager to learn", "University student"],
        applyLink: "https://devsinc.com/careers",
        salary: "Rs. 15,000 - 25,000/month"
    },
    {
        title: "Graphic Design Intern",
        company: "Creative Studio",
        location: "Karachi",
        type: "internship",
        description: "Learn from experienced designers. Opportunity for full-time position after internship.",
        requirements: ["Adobe Photoshop", "Illustrator basics", "Creativity"],
        applyLink: "https://www.facebook.com/jobs",
        salary: "Rs. 10,000 - 15,000/month"
    },
    {
        title: "Digital Marketing Intern",
        company: "Marketers Inc",
        location: "Islamabad",
        type: "internship",
        description: "Learn SEO, social media marketing, and content strategy.",
        requirements: ["Social media savvy", "Good writing skills", "Basic marketing knowledge"],
        applyLink: "https://www.rozee.pk/jobs",
        salary: "Rs. 12,000 - 18,000/month"
    },
    {
        title: "Freelance Writer",
        company: "Content House",
        location: "Remote",
        type: "part-time",
        description: "Write articles for international clients. Flexible hours.",
        requirements: ["Excellent English", "Research skills", "Punctuality"],
        applyLink: "https://www.fiverr.com",
        salary: "Rs. 20,000 - 40,000/month"
    },
    {
        title: "Frontend Developer (Remote)",
        company: "US Based Startup",
        location: "Remote",
        type: "remote",
        description: "Work remotely for US company. Build React applications.",
        requirements: ["React", "JavaScript", "English communication", "Git"],
        applyLink: "https://www.upwork.com/jobs/",
        salary: "Rs. 80,000 - 150,000/month"
    },
    {
        title: "Data Entry Operator",
        company: "Business Solutions",
        location: "Lahore",
        type: "part-time",
        description: "Data entry work. Flexible timings. Students welcome.",
        requirements: ["MS Office", "Typing speed 40+ WPM", "Attention to detail"],
        applyLink: "https://www.rozee.pk/jobs",
        salary: "Rs. 15,000 - 20,000/month"
    },
    {
        title: "Tutor (Mathematics)",
        company: "Home Tuition Center",
        location: "Karachi",
        type: "part-time",
        description: "Teach mathematics to O/A Level students. Evening hours.",
        requirements: ["Strong math skills", "Teaching ability", "Patience"],
        applyLink: "https://www.facebook.com/groups/tutors",
        salary: "Rs. 15,000 - 25,000/month"
    }
];

async function seedJobs() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');
        
        // Delete existing jobs
        const deleted = await JobListing.deleteMany();
        console.log(`🗑️  Deleted ${deleted.deletedCount} existing jobs`);
        
        // Insert new jobs
        const inserted = await JobListing.insertMany(jobs);
        console.log(`✅ Successfully seeded ${inserted.length} jobs!`);
        console.log(`\n📊 Job Summary:`);
        console.log(`   - Full-time: ${jobs.filter(j => j.type === 'full-time').length}`);
        console.log(`   - Part-time: ${jobs.filter(j => j.type === 'part-time').length}`);
        console.log(`   - Internship: ${jobs.filter(j => j.type === 'internship').length}`);
        console.log(`   - Remote: ${jobs.filter(j => j.type === 'remote').length}`);
        
        process.exit();
    } catch (error) {
        console.error('❌ Error seeding jobs:', error);
        process.exit(1);
    }
}

seedJobs();