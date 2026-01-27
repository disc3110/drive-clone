const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');
const prisma = require('../config/prismaClient');
const cloudinary = require('../config/cloudinary');

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
    // 1) upload to Cloudinary using the local file path
    const uploadResult = await cloudinary.uploader.upload(file.path, {
      folder: 'drive-clone', // optional prefix in your Cloudinary media library
      resource_type: 'auto', // auto-detect file type
    });

    // 2) delete local file to save disk space
    try {
      fs.unlinkSync(file.path);
    } catch (unlinkErr) {
      console.warn('Could not delete local file:', unlinkErr.message);
    }

    // 3) save to DB with URL + provider
    await prisma.file.create({
      data: {
        name: name || null,
        originalName: file.originalname,
        filename: file.filename,
        mimeType: file.mimetype,
        size: file.size,
        path: file.path, // remains for now, even though we deleted the file
        url: uploadResult.secure_url,
        provider: 'cloudinary',
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
    return res.status(500).render('upload', {
      title: 'Upload file',
      user: req.user || null,
      errors: [{ msg: 'Something went wrong while saving the file.' }],
      folderId,
    });
  }
};

// GET /files/:id 
const showFile = async (req, res) => {
  const fileId = req.params.id;

  try {
    const file = await prisma.file.findFirst({
      where: {
        id: fileId,
        ownerId: req.user.id, // make sure file belongs to logged-in user
      },
      include: {
        folder: true,
      },
    });

    if (!file) {
      return res.status(404).render('404', {
        title: 'File not found',
        user: req.user || null,
      });
    }

    res.render('files/show', {
      title: file.name || file.originalName,
      user: req.user || null,
      file,
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('404', {
      title: 'File not found',
      user: req.user || null,
    });
  }
};

// GET /files/:id/download
const downloadFile = async (req, res) => {
  const fileId = req.params.id;

  try {
    const file = await prisma.file.findFirst({
      where: {
        id: fileId,
        ownerId: req.user.id,
      },
    });

    if (!file) {
      return res.status(404).render('404', {
        title: 'File not found',
        user: req.user || null,
      });
    }

    // check the file still exists
    if (!fs.existsSync(file.path)) {
      return res.status(410).render('files/show', {
        title: file.name || file.originalName,
        user: req.user || null,
        file,
        errors: [{ msg: 'File is no longer available on the server.' }],
      });
    }

    // res.download will set correct headers and send the file
    return res.download(file.path, file.originalName);
  } catch (err) {
    console.error(err);
    res.status(500).render('404', {
      title: 'File not found',
      user: req.user || null,
    });
  }
};

module.exports = {
  getUploadForm,
  postUpload,
  showFile,
  downloadFile,
};