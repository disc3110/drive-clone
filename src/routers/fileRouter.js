const express = require('express');
const { body, param } = require('express-validator');
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

const idValidator = [
  param('id')
    .trim()
    .isLength({ min: 10, max: 100 })
    .withMessage('Invalid file id.'),
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

// /files/:id  -> file details
router.get(
  '/:id',
  ensureAuthenticated,
  idValidator,
  fileController.showFile
);

// /files/:id/download -> file download
router.get(
  '/:id/download',
  ensureAuthenticated,
  idValidator,
  fileController.downloadFile
);

module.exports = router;