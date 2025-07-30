const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/userModel.js");
const jwt = require("jsonwebtoken");

console.log('Auth credentials loaded: ', {
  OAUTH_CLIENT_ID: process.env.OAUTH_CLIENT_ID ? "Present" : "Absent",
  OAUTH_CLIENT_SECRET: process.env.OAUTH_CLIENT_SECRET ? "Present" : "Absent",
  JWT_KEY: process.env.JWT_KEY ? "Present" : "Absent",
})
// LOGIN strategy
passport.use(
  "google-login",
  new GoogleStrategy(
    {
      clientID: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      callbackURL: "/api/auth/google/login/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await User.findOne({ googleId: profile.id });
        if (!user) {
          return done(null, false); // user doesn't exist
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// REGISTER strategy
passport.use(
  "google-register",
  new GoogleStrategy(
    {
      clientID: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      callbackURL: "/api/auth/google/register/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
          return done(null, false); // already registered
        }

        const newUser = await User.create({
          googleId: profile.id,
          firstName: profile.displayName.split(" ")[0],
          username: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value,
          password: "google", // or leave empty if not needed
        });

        return done(null, newUser);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});