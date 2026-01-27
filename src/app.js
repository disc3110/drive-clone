const path = require('path');
const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const passport = require('passport');
const PrismaSessionStore = require('@quixo3/prisma-session-store').PrismaSessionStore;
const flash = require('connect-flash');
const prisma = require('./config/prismaClient');
const configurePassport = require('./config/passport');

require('dotenv').config();

// routes
const indexRouter = require('./routers/indexRouter');
const authRouter = require('./routers/authRouter');
const fileRouter = require('./routers/fileRouter');
const folderRouter = require('./routers/folderRouter');
const shareRouter = require('./routers/shareRouter');

const app = express();

// view engine setup (we'll use EJS later)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// middleware
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// session setup 
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, // cleanup every 2 minutes
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

// flash messages
app.use(flash());

// make flash messages available in all views
app.use((req, res, next) => {
  res.locals.successMessages = req.flash('success');
  res.locals.errorMessages = req.flash('error');
  next();
});

// configure passport
configurePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// routes 

app.use('/', authRouter);
app.use('/files', fileRouter);
app.use('/', folderRouter);
app.use('/', shareRouter);
app.use('/', indexRouter); // order so auth/file/folder routes are available before the generic home


//  404 handler
app.use((req, res, next) => {
  res.status(404).send('Not found');
});

// error handler
// error handler
app.use((err, req, res, next) => {
  console.error(err);

  // Multer file size/type errors → send back to upload page
  if (err.name === 'MulterError' || err.message === 'Unsupported file type.') {
    const user = req.user || null;
    return res.status(400).render('upload', {
      title: 'Upload file',
      user,
      errors: [{ msg: err.message || 'Upload error.' }],
      folderId: req.body?.folderId || req.query?.folderId || null,
    });
  }

  res.status(500).send('Server error');
});

module.exports = app;