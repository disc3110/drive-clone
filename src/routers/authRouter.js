const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController');
const { body } = require("express-validator");


const router = express.Router();

const signupValidators = [
  body("name")
    .trim()
    .isLength({ max: 50 }).withMessage("Name is too long")
    .escape(),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Enter a valid email")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[0-9]/).withMessage("Password must contain at least one number"),

  body("confirmPassword")
    .notEmpty().withMessage("Please confirm your password")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];

// Register
router.get('/register', authController.getRegister);
router.post('/register', signupValidators, authController.postRegister);

// Login
router.get('/login', authController.getLogin);
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
    successFlash: 'Logged in successfully.',
  })
);

// Logout
router.post('/logout', authController.postLogout);

module.exports = router;