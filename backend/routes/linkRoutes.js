const express = require('express');
const router = express.Router();
const { createLink, getUserLinks, redirectLink } = require('../controllers/linkController');
const { protect } = require('../middleware/authMiddleware');

// Dashboard endpoints
router.post('/', protect, createLink);
router.get('/', protect, getUserLinks);

module.exports = router;
