
const express = require('express');
const router = express.Router();
const { getFiles, uploadFile, deleteFile, getFile } = require('../controllers/fileController');
const { authenticateToken } = require('../middleware/auth');

// All file routes require authentication
router.use(authenticateToken);

router.get('/', getFiles);
router.post('/upload', uploadFile);
router.get('/:id', getFile);
router.delete('/:id', deleteFile);

module.exports = router;
