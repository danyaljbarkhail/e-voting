const asyncHandler = require('express-async-handler');
const Election = require('../models/Election');

// @desc    Get all elections (Admin)
const getElections = asyncHandler(async (req, res) => {
  const elections = await Election.find({}).lean();
  res.json(elections);
});

// @desc    Get all elections (Voter)
const getVoterElections = asyncHandler(async (req, res) => {
  try {
    const elections = await Election.find({}).lean();
    const currentTime = new Date();

    const formattedElections = elections.map((election) => {
      const endTime = new Date(election.endTime);
      const timeLeft = endTime > currentTime ? Math.max(0, endTime - currentTime) : 0;
      const status = endTime > currentTime ? 'ongoing' : 'completed';

      return {
        ...election,
        status,
        timeLeft: status === 'ongoing' ? msToTime(timeLeft) : 'Election ended',
      };
    });

    res.json(formattedElections);
  } catch (error) {
    res.status(500);
    throw new Error('Failed to fetch elections');
  }
});

// @desc    Cast a vote (Voter)
const castVote = asyncHandler(async (req, res) => {
  const { electionId } = req.params;
  const { candidateId } = req.body;

  const election = await Election.findById(electionId);

  if (!election) {
    res.status(404);
    throw new Error('Election not found');
  }

  if (election.votes.some(vote => vote.voter.toString() === req.user._id.toString())) {
    res.status(400);
    throw new Error('You have already voted in this election');
  }

  const candidate = election.candidates.id(candidateId);
  if (!candidate) {
    res.status(404);
    throw new Error('Candidate not found');
  }

  candidate.votes += 1;  // Increment the vote count for the candidate
  election.votes.push({ candidate: candidateId, voter: req.user._id });
  await election.save();

  res.status(200).json({ message: 'Vote cast successfully' });
});

// @desc    Create a new election (Admin)
const createElection = asyncHandler(async (req, res) => {
  const { title, description, endTime, candidates } = req.body;

  const election = new Election({
    title,
    description,
    endTime,
    candidates: candidates.map(name => ({ name })),  // Directly add candidates from request
    user: req.user._id,
  });

  const createdElection = await election.save();
  res.status(201).json(createdElection);
});

// @desc    Update an election (Admin)
const updateElection = asyncHandler(async (req, res) => {
  const { title, description, endTime, candidates } = req.body;

  const election = await Election.findById(req.params.id);

  if (election) {
    election.title = title || election.title;
    election.description = description || election.description;
    election.endTime = endTime || election.endTime;
    election.candidates = candidates.map(name => ({ name }));

    const updatedElection = await election.save();
    res.json(updatedElection);
  } else {
    res.status(404);
    throw new Error('Election not found');
  }
});

// @desc    Delete an election (Admin)
const deleteElection = asyncHandler(async (req, res) => {
  const election = await Election.findById(req.params.id);

  if (election) {
    await election.remove();
    res.json({ message: 'Election removed' });
  } else {
    res.status(404);
    throw new Error('Election not found');
  }
});

// @desc    Get all votes
const getVotes = asyncHandler(async (req, res) => {
  const elections = await Election.find({}).populate('votes.candidate', 'name').lean();

  const votes = elections.map(election => {
    return {
      electionTitle: election.title,
      votes: election.votes.map(vote => ({
        candidate: vote.candidate.name,
        voter: vote.voter
      }))
    };
  });

  res.json(votes);
});

// @desc    Get results for all elections
const getResults = asyncHandler(async (req, res) => {
  const results = await Election.find({}).lean();

  const formattedResults = results.map((election) => {
    const candidates = election.candidates.map((candidate) => ({
      ...candidate,
      votes: candidate.votes,
    }));

    const winner = candidates.reduce(
      (max, candidate) => (candidate.votes > max.votes ? candidate : max),
      { votes: 0 }
    );

    const totalVotes = candidates.reduce((acc, candidate) => acc + candidate.votes, 0);

    return {
      ...election,
      candidates,
      winner: winner.votes > 0 ? winner.name : 'No votes yet',
      totalVotes,
      status: new Date(election.endTime) > new Date() ? 'ongoing' : 'completed',
    };
  });

  if (formattedResults.length > 0) {
    res.json(formattedResults);
  } else {
    res.status(404);
    throw new Error('Results not found');
  }
});

// Utility function to convert milliseconds to a human-readable format (e.g., "2 days, 4 hours, 23 minutes")
const msToTime = (duration) => {
  const milliseconds = parseInt((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24),
    days = Math.floor(duration / (1000 * 60 * 60 * 24));

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

module.exports = {
  getElections,
  createElection,
  updateElection,
  deleteElection,
  getVoterElections,
  castVote,
  getResults,
  getVotes,  // Ensure getVotes is included in the exports
};
