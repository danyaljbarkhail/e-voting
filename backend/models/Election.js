const mongoose = require('mongoose');

// Define a candidate schema with a votes field
const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  votes: { type: Number, default: 0 },  // Initialize vote count to 0
});

const electionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  endTime: { type: Date, required: true },
  candidates: [candidateSchema],  // Embed candidates directly in the election schema
  votes: [{
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' },
    voter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Election = mongoose.model('Election', electionSchema);

module.exports = Election;
