const asyncHandler = require('express-async-handler');
const Vote = require('../models/Vote');
const Election = require('../models/Election');

// @desc    Cast a vote
// @route   POST /api/votes
// @access  Private
const castVote = asyncHandler(async (req, res) => {
  const { electionId, candidateId } = req.body;

  const election = await Election.findById(electionId);
  if (!election) {
    res.status(404);
    throw new Error('Election not found');
  }

  // Check if the user has already voted in this election
  const existingVote = await Vote.findOne({ user: req.user._id, election: electionId });
  if (existingVote) {
    res.status(400);
    throw new Error('User has already voted in this election');
  }

  const vote = new Vote({
    user: req.user._id,
    election: electionId,
    candidate: candidateId,
  });

  const createdVote = await vote.save();
  res.status(201).json(createdVote);
});

// @desc    Get all votes
// @route   GET /api/votes
// @access  Private/Admin
const getVotes = asyncHandler(async (req, res) => {
  const votes = await Vote.find({}).populate('candidate', 'name');
  
  if (votes) {
    res.json(votes);
  } else {
    res.status(404);
    throw new Error('Votes not found');
  }
});

// @desc    Get results for all elections
// @route   GET /api/votes/results
// @access  Private/Admin
const getResults = asyncHandler(async (req, res) => {
  const results = await Election.find({})
    .populate({
      path: 'candidates',
      model: 'Candidate', // Ensure Candidate model exists and is referenced properly
      select: 'name votes',
    });

  // Ensure the results include all elections, even those with zero votes
  const formattedResults = results.map(election => {
    const candidates = election.candidates.map(candidate => ({
      ...candidate._doc, // spread the document properties
      votes: candidate.votes || 0, // set votes to 0 if undefined
    }));

    return {
      ...election._doc, // spread the document properties
      candidates,
      totalVotes: candidates.reduce((acc, candidate) => acc + candidate.votes, 0), // calculate total votes
    };
  });

  if (formattedResults.length > 0) {
    res.json(formattedResults);
  } else {
    res.status(404);
    throw new Error('Results not found');
  }
});

// Ensure all controller functions are exported correctly
module.exports = {
  castVote,
  getVotes,
  getResults,
};
