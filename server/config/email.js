const nodemailer = require('nodemailer');

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send welcome email
const sendWelcomeEmail = async (email, name) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome to CareerGuide! 🎓',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #2563EB, #1E40AF); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Welcome to CareerGuide!</h1>
        </div>
        <div style="padding: 20px; background: #f9fafb;">
          <h2>Hello ${name}! 👋</h2>
          <p>Thank you for joining CareerGuide - Pakistan's premier career counselling platform!</p>
          <p>With CareerGuide, you can:</p>
          <ul>
            <li>✓ Explore 50+ career paths</li>
            <li>✓ Take personalized career quizzes</li>
            <li>✓ Find internships and jobs</li>
            <li>✓ Save jobs for later</li>
            <li>✓ Upload your resume</li>
          </ul>
          <a href="https://career-counselling-app-kappa.vercel.app/careers" 
             style="display: inline-block; background: #2563EB; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">
            Start Exploring →
          </a>
          <p style="margin-top: 20px; color: #6B7280; font-size: 12px;">
            If you have any questions, reply to this email. We're here to help!
          </p>
        </div>
        <div style="text-align: center; padding: 20px; background: #1F2937; color: white; font-size: 12px;">
          <p>© 2024 CareerGuide - Helping Pakistani Students Find Their Path</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken, name) => {
  const resetUrl = `https://career-counselling-app-kappa.vercel.app/reset-password?token=${resetToken}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Reset Your Password - CareerGuide',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #2563EB, #1E40AF); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Reset Your Password</h1>
        </div>
        <div style="padding: 20px; background: #f9fafb;">
          <h2>Hello ${name}!</h2>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <a href="${resetUrl}" 
             style="display: inline-block; background: #2563EB; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 10px 0;">
            Reset Password
          </a>
          <p>Or copy this link: <a href="${resetUrl}">${resetUrl}</a></p>
          <p style="color: #EF4444; font-size: 14px;">⚠️ This link will expire in 1 hour.</p>
          <p style="margin-top: 20px; color: #6B7280; font-size: 12px;">
            If you didn't request this, please ignore this email.
          </p>
        </div>
        <div style="text-align: center; padding: 20px; background: #1F2937; color: white; font-size: 12px;">
          <p>© 2024 CareerGuide - Helping Pakistani Students Find Their Path</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}`);
  } catch (error) {
    console.error('Error sending password reset email:', error);
  }
};

// Send job alert email
const sendJobAlertEmail = async (email, name, jobs) => {
  const jobsList = jobs.map(job => `
    <div style="border: 1px solid #E5E7EB; padding: 10px; margin-bottom: 10px; border-radius: 5px;">
      <h3 style="margin: 0 0 5px 0; color: #2563EB;">${job.title}</h3>
      <p style="margin: 0; color: #6B7280;">${job.company} - ${job.location}</p>
      <p style="margin: 5px 0 0 0; font-size: 14px;">${job.description?.substring(0, 100)}...</p>
      <a href="https://career-counselling-app-kappa.vercel.app/jobs" style="color: #2563EB; font-size: 14px;">View Job →</a>
    </div>
  `).join('');

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'New Jobs Matching Your Interests! 🔔',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #2563EB, #1E40AF); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">New Job Alerts! 💼</h1>
        </div>
        <div style="padding: 20px; background: #f9fafb;">
          <h2>Hello ${name}!</h2>
          <p>Check out these new jobs that match your interests:</p>
          ${jobsList}
          <a href="https://career-counselling-app-kappa.vercel.app/jobs" 
             style="display: inline-block; background: #2563EB; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">
            View All Jobs →
          </a>
        </div>
        <div style="text-align: center; padding: 20px; background: #1F2937; color: white; font-size: 12px;">
          <p>You're receiving this because you subscribed to job alerts.</p>
          <p>© 2024 CareerGuide - Helping Pakistani Students Find Their Path</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Job alert sent to ${email}`);
  } catch (error) {
    console.error('Error sending job alert:', error);
  }
};

// Send premium expiry reminder
const sendPremiumExpiryReminder = async (email, name, daysLeft) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Your Premium Membership Expires in ${daysLeft} Days!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #F59E0B, #D97706); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Premium Expiring Soon! ⚠️</h1>
        </div>
        <div style="padding: 20px; background: #f9fafb;">
          <h2>Hello ${name}!</h2>
          <p>Your Premium membership will expire in <strong>${daysLeft} days</strong>.</p>
          <p>Renew now to continue enjoying:</p>
          <ul>
            <li>✓ Unlimited career paths</li>
            <li>✓ All job listings</li>
            <li>✓ Resume upload & download</li>
            <li>✓ Priority support</li>
          </ul>
          <a href="https://career-counselling-app-kappa.vercel.app/premium" 
             style="display: inline-block; background: #F59E0B; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">
            Renew Premium →
          </a>
        </div>
        <div style="text-align: center; padding: 20px; background: #1F2937; color: white; font-size: 12px;">
          <p>© 2024 CareerGuide - Helping Pakistani Students Find Their Path</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Premium expiry reminder sent to ${email}`);
  } catch (error) {
    console.error('Error sending premium reminder:', error);
  }
};

module.exports = {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendJobAlertEmail,
  sendPremiumExpiryReminder
};