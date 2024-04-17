// config/passportConfig.js

import passportLocal from 'passport-local';
import bcrypt from 'bcryptjs'; // Import bcrypt for password hashing
import User from '../models/User.js';

const LocalStrategy = passportLocal.Strategy;

export default function(passport) {
  passport.use(new LocalStrategy({ email: 'email' }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return done(null, false, { message: 'Invalid email or password' });
      }

      // Compare hashed password with the provided password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return done(null, false, { message: 'Invalid email or password' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
}
