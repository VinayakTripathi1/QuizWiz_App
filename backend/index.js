const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const RoomRouter = require('./Routes/RoomRouter');
const http = require('http').createServer(app);
const { Server } = require('socket.io');
const Game = require('./Models/Game');
const User = require('./Models/User');
const { startGameSession, handleAnswerSubmit } = require('./socketHandlers/gameSession');
const { activeRooms, startedGames } = require('./socketHandlers/sharedState');
require('dotenv').config();
require('./Models/db');

const PORT = process.env.PORT || 8080;

const io = new Server(http, {
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
  socket.on('join-room', async ({ roomId, username }) => {
  socket.join(roomId);
  io.to(roomId).emit('user-joined', { username });

  const game = await Game.findOne({ roomId });
  const user = await User.findOne({ username });
  if (game) {
    if (!game.players.some(p => p.userId.toString() === user._id.toString())) {
  game.players.push({ userId: user._id });
  await game.save();
}
  }

  if (!activeRooms.has(roomId) && game?.startTime) {
    activeRooms.set(roomId, new Date(game.startTime));
  }
});

  socket.on('submit-answer', async (data) => {
    await handleAnswerSubmit(data,io);
  });

  socket.on('get-leaderboard', async ({ roomId }) => {
    const game = await Game.findOne({ roomId }).populate('players.userId');
    if (game) {
      const leaderboard = game.players.map(p => ({
        username: p.userId.username,
        score: p.score
      }));
      socket.emit('leaderboard-update', { leaderboard });
    }
  });
});

setInterval(() => {
  const now = new Date();

  for (const [roomId, startTime] of activeRooms.entries()) {
    io.to(roomId).emit('sync-timer', {
      startTime,
      currentTime: now
    });

    if (now >= startTime && !startedGames.has(roomId)) {
      startedGames.add(roomId);
      startGameSession(roomId, io);
    }
  }
}, 1000);

app.use(bodyParser.json());
app.use(cors());
app.use('/auth', AuthRouter);
app.use('/room', RoomRouter);

http.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
