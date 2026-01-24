const { validationResult } = require('express-validator');
const prisma = require('../config/prismaClient');

const getUploadForm = (req, res) => {
  const folderId = req.query.folderId || null;

  res.render('upload', {
    title: 'Upload file',
    user: req.user || null,
    errors: null,
    folderId,
  });
};

const postUpload = async (req, res) => {
  const errors = validationResult(req);

  const folderId = req.body.folderId || null;

  if (!errors.isEmpty()) {
    return res.status(400).render('upload', {
      title: 'Upload file',
      user: req.user || null,
      errors: errors.array(),
      folderId,
    });
  }

  if (!req.file) {
    return res.status(400).render('upload', {
      title: 'Upload file',
      user: req.user || null,
      errors: [{ msg: 'Please select a file to upload.' }],
      folderId,
    });
  }

  let folder = null;
  if (folderId) {
    folder = await prisma.folder.findFirst({
      where: { id: folderId, ownerId: req.user.id },
    });

    if (!folder) {
      return res.status(400).render('upload', {
        title: 'Upload file',
        user: req.user || null,
        errors: [{ msg: 'Invalid folder.' }],
        folderId: null,
      });
    }
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
        folderId: folder ? folder.id : null,
      },
    });

    if (folder) {
      return res.redirect(`/folders/${folder.id}`);
    }
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).render('upload', {
      title: 'Upload file',
      user: req.user || null,
      errors: [{ msg: 'Something went wrong while saving the file.' }],
      folderId,
    });
  }
};

module.exports = {
  getUploadForm,
  postUpload,
};