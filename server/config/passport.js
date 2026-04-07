console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google Strategy
if (process.env.GOOGLE_CLIENT_ID) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`, // FIXED
    proxy: true
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ email: profile.emails[0].value });
      
      if (user) {
        if (!user.googleId) {
          user.googleId = profile.id;
          await user.save();
        }
        return done(null, user);
      }
      
      const salt = await bcrypt.genSalt(10);
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);
      
      user = new User({
        name: profile.displayName,
        email: profile.emails[0].value,
        password: hashedPassword,
        googleId: profile.id,
        isVerified: true
      });
      
      await user.save();
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));
}

// Facebook Strategy
if (process.env.FACEBOOK_APP_ID) {
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: '/api/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'emails'],
    proxy: true
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) {
        return done(new Error('No email found from Facebook'), null);
      }
      
      let user = await User.findOne({ email });
      
      if (user) {
        if (!user.facebookId) {
          user.facebookId = profile.id;
          await user.save();
        }
        return done(null, user);
      }
      
      const salt = await bcrypt.genSalt(10);
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);
      
      user = new User({
        name: profile.displayName,
        email: email,
        password: hashedPassword,
        facebookId: profile.id,
        isVerified: true
      });
      
      await user.save();
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));
}

module.exports = passport;