import React, { useEffect, useState } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import socket from '../utility_funcs/socket';
import Leaderboard from './LeaderBoard';
const GameRoom = () => {
  const { roomId } = useParams();
  const [question, setQuestion] = useState(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('new-question', (q) => {
      setQuestion(q);
      setTimeLeft(10);
      setSelectedAnswer(null);
    });

    socket.on('game-ended', () => {
      alert('Game has ended!');
      navigate(`/results/${roomId}`);
    });
      
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => {
      socket.off('new-question');
      socket.off('game-ended');
      socket.disconnect(); 
      clearInterval(interval);
      navigate(`/results/${roomId}`);
    };
  }, []);

  const submitAnswer = (index) => {
    setSelectedAnswer(index);
    console.log(`Answer submitted: ${index}`);
    socket.emit('submit-answer', { roomId, username: localStorage.getItem('username'), questionId: question.questionId, answerIndex: index });
    
  };

  if (!question) return <div>Loading question...</div>;

  return (
    <>
    <div className='bg-svg-bg min-h-screen p-10'>
    <div className='mb-8 ml-0 mr-0 text-center'>
      <img src='/quiz-logo.png' className='mx-auto w-12 h-12 drop-shadow-[0_0_4px_rgba(0,0,0,0.6)]' alt="Quiz logo" />
      <h1 className='font-roboto-condensed font-bold text-[40px] m-0 tracking-[0.6rem] uppercase bg-[linear-gradient(90deg,#e781fb_40%,#8e76fa_60%)] bg-clip-text text-transparent'>Quiz</h1>
    </div>
    <main>
      <div id='quiz' className='max-w-[50rem] mx-auto p-8 bg-[linear-gradient(180deg,#3e2a60_0%,#321061_100%)] rounded-lg shadow-[1px_1px_8px_4px_rgba(12,5,32,0.6)] text-center'>
        <div id='question'>
          <h2 className="font-roboto text-[1.5rem] font-normal my-2 mb-10 text-[#c1b2dd]">{question.text}</h2>
          <ul className='list-none m-0 p-0 flex flex-col items-center gap-2'>
            {question.options.map((opt, idx) => (
    <li key={idx} className='w-[90%] mx-auto'>
  
      <button
        type="button"
        onClick={() => submitAnswer(idx)}
        disabled={selectedAnswer !== null}
        className={`inline-block w-full font-roboto-condensed text-[0.9rem] px-8 py-4 border-0 rounded-[24px] bg-[#6cb7f5] transition-all duration-200 ease-in-out hover:bg-[#9d5af5] focus:bg-[#9d5af5] hover:text-white focus:text-white ${selectedAnswer !== null ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
      >
        {opt}
      </button>
    </li>
  ))}
          </ul>
          <p>Time left: {timeLeft}s</p>
        </div>
      </div>
      <div id='leaderboard' className='max-w-[50rem] mx-auto mt-8 p-8 bg-[linear-gradient(180deg,#3e2a60_0%,#321061_100%)] rounded-lg shadow-[1px_1px_8px_4px_rgba(12,5,32,0.6)] text-center'>
        <Leaderboard roomId={roomId} />
       </div>
    </main>
    </div>
    </>
  );
};
export default GameRoom;
