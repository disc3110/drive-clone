const express = require('express');
const { ensureAuthenticated } = require('../middlewares/auth');
const shareController = require('../controllers/shareController');

const router = express.Router();

// create share link 
router.post(
  '/folders/:id/share',
  ensureAuthenticated,
  shareController.createShareLink
);

// public share link
router.get(
  '/share/:id',
  shareController.viewSharedFolder
);

module.exports = router;