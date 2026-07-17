const express = require('express');
const router = express.Router();
const analyzeController = require('../controllers/analyze.controller');

router.post('/analyze', analyzeController.analyzeChannel.bind(analyzeController));

module.exports = router;
