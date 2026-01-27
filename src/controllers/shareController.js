const prisma = require('../config/prismaClient');

const createShareLink = async (req, res) => {
  const folderId = req.params.id;
  const { duration } = req.body; // in days

  const days = parseInt(duration, 10);
  if (![1, 7, 30].includes(days)) { // allowed durations
    return res.status(400).send('Invalid duration');
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + days);

  const folder = await prisma.folder.findFirst({
    where: { id: folderId, ownerId: req.user.id },
  });

  if (!folder) {
    return res.status(404).send('Folder not found');
  }

  const share = await prisma.sharedFolder.create({
    data: {
      folderId: folder.id,
      expiresAt,
    },
  });

  res.redirect(`/folders/${folder.id}?share=${share.id}`);
};

const viewSharedFolder = async (req, res) => {
  const shareId = req.params.id;

  const share = await prisma.sharedFolder.findUnique({
    where: { id: shareId },
    include: {
      folder: {
        include: { files: true },
      },
    },
  });

  if (!share) {
    return res.status(404).render('share/expired');
  }

  if (new Date() > share.expiresAt) {
    return res.status(410).render('share/expired');
  }

  res.render('share/show', {
    title: `Shared folder: ${share.folder.name}`,
    folder: share.folder,
    expiresAt: share.expiresAt,
  });
};

module.exports = {
  createShareLink,
  viewSharedFolder,
};