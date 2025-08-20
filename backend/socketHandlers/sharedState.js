const activeRooms = new Map();     // roomId -> startTime
const startedGames = new Set();    // roomIds that have already started

module.exports = { activeRooms, startedGames };
