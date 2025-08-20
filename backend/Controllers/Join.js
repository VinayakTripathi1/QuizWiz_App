const Game = require('../Models/Game');
const join=async (req,res)=>{
    const {roomId}=req.body; 
    const userId = req.user._id;

  try {
    const game = await Game.findOne({ roomId });

    if (!game) return res.status(404).json({ msg: 'Room not found' });
    if (game.status !== 'waiting')
      return res.status(400).json({ msg: 'Game already started' });

    const alreadyInGame = game.players.some((p) => p.userId.equals(userId));
    if (!alreadyInGame) {
      game.players.push({ userId });
      await game.save();
    }

    res.status(200).json({ msg: 'Joined successfully' });
  } catch (err) {
    console.error('Join room failed:', err);
    res.status(500).json({ msg: 'Internal server error' });
  }
};
module.exports = { join };