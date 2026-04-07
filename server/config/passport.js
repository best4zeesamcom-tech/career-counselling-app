console.log("=" .repeat(50));
console.log("🔧 LOADING PASSPORT CONFIGURATION");
console.log("=" .repeat(50));

console.log("📋 Environment Variables Check:");
console.log("  GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID ? "✅ " + process.env.GOOGLE_CLIENT_ID.substring(0, 20) + "..." : "❌ MISSING");
console.log("  GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET ? "✅ SET" : "❌ MISSING");
console.log("  BACKEND_URL:", process.env.BACKEND_URL || "http://localhost:5000");
console.log("  FACEBOOK_APP_ID:", process.env.FACEBOOK_APP_ID ? "✅ SET" : "⚠️ Optional");

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Serialize user for session
passport.serializeUser((user, done) => {
  console.log("🔐 Serializing user:", user.id);
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    console.log("🔓 Deserializing user:", user?.email);
    done(null, user);
  } catch (error) {
    console.error("Deserialize error:", error);
    done(error, null);
  }
});

// Google Strategy - MUST HAVE CREDENTIALS
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  const callbackURL = `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`;
  
  console.log("\n📍 Google OAuth Configuration:");
  console.log("  Callback URL:", callbackURL);
  console.log("  Client ID:", process.env.GOOGLE_CLIENT_ID.substring(0, 20) + "...");
  
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: callbackURL,
    proxy: true
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      console.log("\n📧 Google OAuth Callback Received!");
      console.log("  Email:", profile.emails[0]?.value);
      console.log("  Name:", profile.displayName);
      
      let user = await User.findOne({ email: profile.emails[0].value });
      
      if (user) {
        console.log("  ✅ Existing user found");
        if (!user.googleId) {
          user.googleId = profile.id;
          await user.save();
          console.log("  🔗 Linked Google ID to existing user");
        }
        return done(null, user);
      }
      
      console.log("  📝 Creating new user");
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
      console.log("  ✅ New user created:", user.email);
      return done(null, user);
    } catch (error) {
      console.error("  ❌ Google Strategy Error:", error);
      return done(error, null);
    }
  }));
  
  console.log("✅ Google OAuth Strategy initialized SUCCESSFULLY\n");
} else {
  console.log("\n❌ Google Strategy SKIPPED - Missing credentials!");
  console.log("   Please add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to Secrets\n");
}

// Check registered strategies
console.log("📋 Registered Passport Strategies:", Object.keys(passport._strategies || {}));
console.log("=" .repeat(50));
console.log("✅ Passport configuration COMPLETE\n");

module.exports = passport;