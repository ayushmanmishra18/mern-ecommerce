const express = require('express');
const router = express.Router();
const { createReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.post('/:id/reviews', protect, createReview);

module.exports = router;
