const prisma = require('../config/prismaClient');

const getHome = async (req, res) => {
  let folders = [];

  if (req.user) {
    folders = await prisma.folder.findMany({
      where: { ownerId: req.user.id },
      orderBy: { createdAt: 'asc' },
    });
  }

  res.render('index', {
    title: 'Drive Clone',
    user: req.user || null,
    folders,
  });
};

module.exports = { getHome };