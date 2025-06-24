const express = require('express');
const { registerForEvent } = require('../controllers/registrationController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', auth, registerForEvent); // POST /api/register

const { checkInAttendee } = require('../controllers/registrationController');
router.post('/checkin', auth, checkInAttendee); // POST /api/register/checkin


module.exports = router;
