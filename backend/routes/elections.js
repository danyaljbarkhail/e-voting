// routes/elections.js

const express = require('express');
const router = express.Router();
const { 
  getElections, 
  createElection, 
  updateElection, 
  deleteElection,
  getVoterElections,
  castVote // Import the castVote function
} = require('../controllers/electionController');
const { protect, admin, voterOnly } = require('../middleware/authMiddleware');

// Voter-specific endpoint to fetch elections
router.get('/voter/elections', protect, voterOnly, getVoterElections);

// Voter-specific endpoint to cast a vote
router.post('/:electionId/vote', protect, voterOnly, castVote); // Ensure this route is defined

// Admin endpoints
router.get('/', protect, admin, getElections);
router.post('/', protect, admin, createElection);
router.put('/:id', protect, admin, updateElection);
router.delete('/:id', protect, admin, deleteElection);

module.exports = router;
