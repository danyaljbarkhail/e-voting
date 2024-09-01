const express = require('express');
const router = express.Router();
const { castVote, getVotes, getResults } = require('../controllers/electionController'); // Correct controller import
const { protect } = require('../middleware/authMiddleware'); // Ensure middleware is correctly imported

// Cast a vote (protected route)
router.post('/', protect, castVote);

// Get all votes (protected route)
router.get('/', protect, getVotes);

// Get results (protected route for both admin and voter)
router.get('/results', protect, getResults);

module.exports = router;
