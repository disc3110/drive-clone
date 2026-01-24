const express = require('express');
const { ensureAuthenticated } = require('../middlewares/auth');
const folderController = require('../controllers/folderController');

const router = express.Router();

router.get('/folders', ensureAuthenticated, folderController.listFolders);

router.get('/folders/new', ensureAuthenticated, folderController.getNewFolder);
router.post(
  '/folders',
  ensureAuthenticated,
  folderController.folderValidators,
  folderController.postNewFolder
);

router.get('/folders/:id', ensureAuthenticated, folderController.showFolder);

router.post('/folders/:id/delete', ensureAuthenticated, folderController.deleteFolder);

module.exports = router;