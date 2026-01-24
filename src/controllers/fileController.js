const { validationResult } = require('express-validator');
const prisma = require('../config/prismaClient');

const getUploadForm = (req, res) => {
  res.render('upload', {
    title: 'Upload file',
    user: req.user || null,
    errors: null,
  });
};

const postUpload = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).render('upload', {
      title: 'Upload file',
      user: req.user || null,
      errors: errors.array(),
    });
  }

  // Multer should have attached file
  if (!req.file) {
    return res.status(400).render('upload', {
      title: 'Upload file',
      user: req.user || null,
      errors: [{ msg: 'Please select a file to upload.' }],
    });
  }

  const { file } = req;
  const { name } = req.body;

  try {
    await prisma.file.create({
      data: {
        name: name || null,
        originalName: file.originalname,
        filename: file.filename,
        mimeType: file.mimetype,
        size: file.size,
        path: file.path,
        ownerId: req.user.id,
      },
    });

    res.redirect('/'); 
  } catch (err) {
    console.error(err);
    res.status(500).render('upload', {
      title: 'Upload file',
      user: req.user || null,
      errors: [{ msg: 'Something went wrong while saving the file.' }],
    });
  }
};

module.exports = {
  getUploadForm,
  postUpload,
};