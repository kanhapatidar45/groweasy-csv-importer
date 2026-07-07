const express = require('express');
const multer = require('multer');
const { previewCSV, processWithAI } = require('../controllers/uploadController');

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/preview', upload.single('file'), previewCSV);
router.post('/process', processWithAI);

module.exports = router;