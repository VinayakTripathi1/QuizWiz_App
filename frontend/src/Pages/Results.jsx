import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Results = () => {
  const { roomId } = useParams();
  const username = localStorage.getItem('username');
  const [leaderboard, setLeaderboard] = useState([]);
  const [myScore, setMyScore] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.post('http://localhost:8080/room/getresult', { roomId, username }, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        setLeaderboard(res.data.leaderboard);
        setMyScore(res.data.myScore);
      } catch (err) {
        console.error('Failed to fetch results:', err);
      }
    };
    fetchResults();
  }, [roomId, username]);

  return (
    <div className='bg-svg-bg flex justify-center items-center min-h-screen'>
    <div className="max-w-[40rem] mx-auto p-8 bg-[linear-gradient(180deg,#3e2a60_0%,#321061_100%)] rounded-lg shadow-[1px_1px_8px_4px_rgba(12,5,32,0.6)] text-center">
        {myScore === null ? (
    <div className="text-lg text-[#c1b2dd] font-bold">Loading your results...</div>
  ) : (
    <>
      <h2 className="font-roboto-condensed text-[1.5rem] font-bold mb-6 text-[#c1b2dd]">Leaderboard</h2>
      <ul className="list-none m-0 p-0 flex flex-col items-center gap-2">
        {leaderboard.map((user, idx) => (
          <li
            key={idx}
            className={`w-[90%] mx-auto flex justify-between items-center py-2 px-4 rounded-[16px] bg-[#6cb7f5] text-white font-roboto-condensed text-lg mb-2 ${
              user.username === username ? 'outline-none ring-4 ring-blue-300 ring-offset-2 shadow-lg' : ''
            }`}
          >
            <span>
              {idx + 1}. {user.username}
            </span>
            <span>{user.score}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6 text-lg font-bold text-[#c1b2dd]">
        Your Score: <span className="text-white">{myScore}</span>
      </div>
    </>
  )}
    </div>
    </div>
  );
};

export default Results;
