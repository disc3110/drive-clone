const express = require('express');
const { body } = require('express-validator');
const upload = require('../config/upload');
const fileController = require('../controllers/fileController');
const { ensureAuthenticated } = require('../middlewares/auth');

const router = express.Router();

const uploadValidators = [
  body('name')
    .optional({ checkFalsy: true })
    .trim()
    .escape()
    .isLength({ max: 100 })
    .withMessage('Name must be at most 100 characters.'),
];

// show form
router.get('/upload', ensureAuthenticated, fileController.getUploadForm);

// handle upload
router.post(
  '/upload',
  ensureAuthenticated,
  upload.single('file'),
  uploadValidators,
  fileController.postUpload
);

module.exports = router;