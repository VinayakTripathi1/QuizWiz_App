const Game = require('../Models/Game');
const mongoose = require('mongoose');

const getWaitingRooms = async (req, res) => {
  try {
    const waitingGames = await Game.find({ status: 'waiting' })
      .select('roomId hostUserId createdAt') 
      .populate({
        path: 'hostUserId',
        select: 'username' 
      })
      .sort({ createdAt: -1 });

    const formattedRooms = waitingGames.map(game => ({
      roomId: game.roomId,
      hostUsername: game.hostUserId.username,
      createdAt: game.createdAt
    }));
    res.json(formattedRooms);
  } catch (err) {
    console.error('Error fetching waiting rooms:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getWaitingRooms
};

