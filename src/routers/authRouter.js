const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController');

const router = express.Router();

// Register
router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);

// Login
router.get('/login', authController.getLogin);
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
  })
);

// Logout
router.post('/logout', authController.postLogout);

module.exports = router;