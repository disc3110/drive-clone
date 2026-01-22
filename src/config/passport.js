const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const prisma = require('./prismaClient');

function configurePassport(passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: 'email' }, //  log in with email
      async (email, password, done) => {
        try {
          const user = await prisma.user.findUnique({ where: { email } });

          if (!user) {
            return done(null, false, { message: 'Invalid email or password' });
          }

          const match = await bcrypt.compare(password, user.password);

          if (!match) {
            return done(null, false, { message: 'Invalid email or password' });
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { id } });
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
}

module.exports = configurePassport;