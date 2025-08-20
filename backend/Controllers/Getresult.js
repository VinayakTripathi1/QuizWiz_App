const Game = require('../Models/Game');
const User = require('../Models/User');

const getresult = async (req, res) => {
  const { roomId, username } = req.body;
  try {
    const game = await Game.findOne({ roomId }).populate('players.userId');
    if (!game) return res.status(404).json({ error: 'Game not found' });

    const leaderboard = game.players.map(p => ({
      username: p.userId.username,
      score: p.score
    })).sort((a, b) => b.score - a.score);

    const myScore = leaderboard.find(u => u.username === username)?.score ?? null;

    res.json({ leaderboard, myScore });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getresult };