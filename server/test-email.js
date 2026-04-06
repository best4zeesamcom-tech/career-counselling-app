const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmail() {
  console.log('Testing email configuration...');
  console.log('Email user:', process.env.EMAIL_USER);
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    await transporter.verify();
    console.log('✅ Email configuration is CORRECT!');
    
    // Send test email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'CareerGuide - Test Email',
      text: 'If you receive this, your email is working perfectly!'
    });
    
    console.log('✅ Test email sent! Check your inbox.');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('❌ Email error:', error.message);
  }
}

testEmail();