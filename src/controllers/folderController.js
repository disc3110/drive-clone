const { body, validationResult } = require('express-validator');
const prisma = require('../config/prismaClient');

const folderValidators = [
  body('name')
    .trim()
    .notEmpty().withMessage('Folder name is required.')
    .isLength({ max: 50 }).withMessage('Folder name must be at most 50 characters.')
    .escape(),
];

const listFolders = async (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }

  const folders = await prisma.folder.findMany({
    where: { ownerId: req.user.id },
    orderBy: { createdAt: 'asc' },
  });

  res.render('folders/index', {
    title: 'Your folders',
    user: req.user,
    folders,
  });
};

const getNewFolder = (req, res) => {
  res.render('folders/new', {
    title: 'New folder',
    user: req.user,
    errors: [],
    oldInput: { name: '' },
  });
};

const postNewFolder = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).render('folders/new', {
      title: 'New folder',
      user: req.user,
      errors: errors.array(),
      oldInput: { name: req.body.name || '' },
    });
  }

  const name = req.body.name;

  await prisma.folder.create({
    data: {
      name,
      ownerId: req.user.id,
    },
  });

  res.redirect('/folders');
};

const showFolder = async (req, res) => {
  const folderId = req.params.id;

  const folder = await prisma.folder.findFirst({
    where: { id: folderId, ownerId: req.user.id },
    include: { files: true },
  });

  if (!folder) {
    return res.status(404).render('404', {
      title: 'Not found',
      user: req.user,
    });
  }

  res.render('folders/show', {
    title: folder.name,
    user: req.user,
    folder,
  });
};

const deleteFolder = async (req, res) => {
  const folderId = req.params.id;

  // only delete if it belongs to the logged-in user
  await prisma.folder.deleteMany({
    where: { id: folderId, ownerId: req.user.id },
  });

  res.redirect('/folders');
};

module.exports = {
  folderValidators,
  listFolders,
  getNewFolder,
  postNewFolder,
  showFolder,
  deleteFolder,
};