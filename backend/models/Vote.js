const mongoose = require('mongoose');

const voteSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    election: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Election',
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Candidate',
    },
  },
  {
    timestamps: true,
  }
);

const Vote = mongoose.model('Vote', voteSchema);

module.exports = Vote;
