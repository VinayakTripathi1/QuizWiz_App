const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true
  },
  hostUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  players: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
      score: { type: Number, default: 0 },
      answers: [
        {
          questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
          answerIndex: Number, 
          isCorrect: Boolean
        }
      ]
    }
  ],
  questions: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Question' }
  ],
  status: {
    type: String,
    enum: ['waiting', 'active', 'finished'],
    default: 'waiting'
  },
  startTime: Date,
  endTime: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Game', gameSchema);
