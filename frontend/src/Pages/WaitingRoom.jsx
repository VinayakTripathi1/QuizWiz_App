import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import socket from '../utility_funcs/socket.js';

const WaitingRoom = () => {
  const { roomId } = useParams();
  const [remainingTime, setRemainingTime] = useState(null);
  const [joinMessages, setJoinMessages] = useState([]); 
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem('username') || 'Anonymous';

    if (!socket.connected) socket.connect();
    socket.emit('join-room', { roomId, username });

    socket.on('user-joined', ({ username }) => {
      setJoinMessages(prev => [...prev, `${username} joined the game`]);
    });

    socket.on('sync-timer', ({ startTime, currentTime }) => {
      const start = new Date(startTime);
      const now = new Date(currentTime);
      const secondsLeft = Math.floor((start - now) / 1000);
      setRemainingTime(secondsLeft > 0 ? secondsLeft : 0);
      if (secondsLeft <= 0) {
        navigate(`/game/${roomId}`);
      }
    });

    return () => {
      socket.off('user-joined');
      socket.off('sync-timer');
    };
  }, [roomId, navigate]);

  const formatTime = (sec) => {
    const min = Math.floor(sec / 60);
    const rem = sec % 60;
    return `${min.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  return (
    <div className='bg-svg-bg min-h-screen flex justify-center items-center p-10'>
      <div className='max-w-[50rem] mx-auto p-8 bg-[linear-gradient(180deg,#3e2a60_0%,#321061_100%)] rounded-lg shadow-[1px_1px_8px_4px_rgba(12,5,32,0.6)] text-center'>
        <h1 className="text-3xl font-mozilla-headline mb-4 bg-[#e781fb] bg-clip-text text-transparent">Waiting Room</h1>
        {joinMessages.length > 0 && (
          <div className="mb-2 flex flex-col items-center">
            {joinMessages.map((msg, idx) => (
              <div key={idx} className="bg-green-600 bg-clip-text text-transparent">{msg}</div>
            ))}
          </div>
        )}
        {remainingTime !== null ? (
          <h2 className="text-xl bg-white rounded-full p-1 text-black">Game starts in: {formatTime(remainingTime)}</h2>
        ) : (
          <p>Loading timer...</p>
        )}
      </div>
    </div>
  );
};

export default WaitingRoom;
