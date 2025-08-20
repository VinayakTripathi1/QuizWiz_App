import  { useEffect, useState } from 'react';
import socket from '../utility_funcs/socket';

const Leaderboard = ({ roomId }) => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const handleLeaderboard = (data) => {
      const sorted = [...data.leaderboard].sort((a, b) => b.score - a.score);
      setPlayers(sorted);
    };

    socket.on('leaderboard-update', handleLeaderboard);
    socket.emit('get-leaderboard', { roomId });

    return () => {
      socket.off('leaderboard-update', handleLeaderboard);
    };
  }, [roomId]);

  return (
    <div>
      <h2 className="font-roboto-condensed text-[1.5rem] font-bold mb-6 text-[#c1b2dd]">Leaderboard</h2>
      <ul className="list-none m-0 p-0 flex flex-col items-center gap-2 overflow-x-auto">
        {players.map((player, idx) => (
          <li key={idx} className="w-[90%] mx-auto flex justify-between items-center py-2 px-4 rounded-[16px] bg-[#6cb7f5] text-white font-roboto-condensed text-lg mb-2">
            <span className='whitespace-nowrap'>{idx + 1}. {player.username}</span>
            <span>{player.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;