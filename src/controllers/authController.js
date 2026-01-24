const bcrypt = require('bcryptjs');
const prisma = require('../config/prismaClient');
const { validationResult } = require("express-validator");

const getRegister = (req, res) => {
  res.render('register', { title: 'Sign up', errors: null, user: req.user || null });
};

const postRegister = async (req, res) => {
  const errors = validationResult(req);
  const { name, email, password, confirmPassword } = req.body;

  if (!errors.isEmpty()) {
    return res.status(400).render('register', {
      title: 'Sign up',
      user: null,
      errors: errors.array(),
    });
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).render('register', {
        title: 'Sign up',
        user: null,
        errors: 'Email is already registered.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
      },
    });

    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.status(500).render('register', {
      title: 'Sign up',
      user: null,
      errors: 'Something went wrong. Please try again.',
    });
  }
};

const getLogin = (req, res) => {
  res.render('login', { title: 'Log in', user: req.user || null });
};

const postLogout = (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect('/login');
  });
};

module.exports = {
  getRegister,
  postRegister,
  getLogin,
  postLogout,
};