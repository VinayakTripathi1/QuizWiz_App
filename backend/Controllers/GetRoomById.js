const Game = require('../Models/Game');

const getRoomById = async (req, res) => {
  const { roomId } = req.params;
  try {
    const room = await Game.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    res.status(200).json({
      success: true,
      roomId: room.roomId,
      startTime: room.startTime,
      status: room.status,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getRoomById };
