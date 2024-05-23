 import passport from 'passport';
    import { Strategy as LocalStrategy } from 'passport-local';
    import bcrypt from 'bcryptjs';
    import User from './models/User';

    passport.use(new LocalStrategy(
      async (username, password, done) => {
        try {
          const user = await User.findOne({ where: { username } });
          if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
          }
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return done(null, false, { message: 'Incorrect password.' });
          }
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    ));

    passport.serializeUser((user: any, done) => {
      done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
      try {
        const user = await User.findByPk('id');
        done(null, user);
      } catch (err) {
        done(err);
      }
    });

    export default passport;
