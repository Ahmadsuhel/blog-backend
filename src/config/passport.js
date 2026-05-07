const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../modules/users/user.model');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const avatar = profile.photos[0]?.value;

        let user = await User.findOne({ where: { googleId: profile.id } });
        if (user) return done(null, user);

        user = await User.findOne({ where: { email } });
        if (user) {
          user.googleId = profile.id;
          if (!user.avatar) user.avatar = avatar;
          await user.save();
          return done(null, user);
        }

        user = await User.create({
          name: profile.displayName,
          email,
          googleId: profile.id,
          avatar,
          isEmailVerified: true,
          role: 'reader',
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;   // ← this line is critical