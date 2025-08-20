const { nanoid } = require('nanoid');
const Game = require('../Models/Game');
const Question = require('../Models/Questions');

const create_room = async (req, res) => {
  try {
    const roomId = nanoid(10);

    const randomQuestions = await Question.aggregate([
      { $sample: { size: 5 } }
    ]);
    const questionIds = randomQuestions.map(q => q._id);

    // Set start time and end time
    const createdAt = new Date();
    const startTime = new Date(createdAt.getTime()+1*60*1000); // +1 minutes
    const endTime = new Date(startTime.getTime() +60*1000); 
    const newGame = new Game({
      roomId,
      hostUserId: req.user._id,
      players: [
        {
          userId: req.user._id,
          score: 0,
          answers: []
        }
      ],
      questions: questionIds,
      status: 'waiting',
      startTime,
      endTime,
      createdAt
    });

    await newGame.save();

    res.status(201).json({
      success: true,
      message: 'Game created',
      roomId: roomId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = { create_room };
