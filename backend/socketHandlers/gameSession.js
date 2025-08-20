const Game = require('../Models/Game');
const User = require('../Models/User');
const { activeRooms, startedGames } = require('./sharedState');

const activeGameSessions = new Map(); // roomId -> {timer, currentQuestionIndex}

const startGameSession = async (roomId, io) => {
  const game = await Game.findOne({ roomId }).populate('questions').populate('players.userId');
  if (!game) return;

  game.status = 'active';
  await game.save();

  const questions = game.questions;
  let index = 0;

  const timer = setInterval(async () => {
    if (index < questions.length) {
      const question = questions[index];
      io.to(roomId).emit('new-question', {
        questionId: question._id,
        text: question.text,
        options: question.options
      });

      const updatedGame = await Game.findOne({ roomId }).populate('players.userId');

      io.to(roomId).emit('leaderboard-update', {
      leaderboard: updatedGame.players.map(p => ({
        username: p.userId.username,
        score: p.score
        }))
      })
      index++;
      activeGameSessions.get(roomId).currentQuestionIndex = index;
    } 
    else {
      clearInterval(timer);
      activeGameSessions.delete(roomId);

      game.status = 'finished';
      game.endTime = new Date();
      await game.save();

      activeRooms.delete(roomId);
      startedGames.delete(roomId);

      io.to(roomId).emit('game-ended');
    }
  }, 10000);

  activeGameSessions.set(roomId, {
    currentQuestionIndex: 0,
    timer
  });
  };

const handleAnswerSubmit = async ({ roomId, username, questionId, answerIndex }, io) => {
  const user = await User.findOne({ username });
  if (!user) return;

  const game = await Game.findOne({ roomId }).populate('questions').populate('players.userId');
  if (!game) return;
  
  const question = game.questions.find(q => q._id.toString() === questionId);
  if (!question) return;
  const player = game.players.find(p =>
    p.userId && p.userId._id.toString() === user._id.toString());
  if (!player) return;
  
  const isCorrect = question.correctAnswerIndex === answerIndex;
  
  player.answers.push({ questionId, answerIndex, isCorrect });
  if (isCorrect) player.score += 1;
  await game.save();

  io.to(roomId).emit('leaderboard-update', {
  leaderboard: game.players.map(p => ({
    username: p.userId.username,
    score: p.score
  }))
 });
};

module.exports = { startGameSession, handleAnswerSubmit };
