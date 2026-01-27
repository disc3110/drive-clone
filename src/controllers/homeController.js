// src/controllers/homeController.js
const prisma = require('../config/prismaClient');

const getHome = async (req, res) => {
  let folders = [];
  let rootFiles = [];

  if (req.user) {
    folders = await prisma.folder.findMany({
      where: { ownerId: req.user.id },
      orderBy: { createdAt: 'asc' },
    });

    rootFiles = await prisma.file.findMany({
      where: {
        ownerId: req.user.id,
        folderId: null, // files not in any folder
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  res.render('index', {
    title: 'Drive Clone',
    user: req.user || null,
    folders,
    rootFiles,
  });
};

module.exports = { getHome };