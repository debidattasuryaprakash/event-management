const express = require('express');
const { generateCertificate } = require('../controllers/certificateController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/generate/:eventId', auth, generateCertificate); // GET /api/certificates/generate/:eventId

module.exports = router;
