import React, { useState } from 'react';

const hardcodedQuestion = {
  questionId: 'q1',
  text: 'What is the capital of France?',
  options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
};

const hardcodedPlayers = [
  { username: 'Alice', score: 120 },
  { username: 'Bob', score: 100 },
  { username: 'Charlie', score: 80 },
];

const Testing = () => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const timeLeft = 10; // Timer is paused at 10

  const submitAnswer = (index) => {
    setSelectedAnswer(index);
    // No backend logic, just local state
  };

  return (
    <div className="flex min-h-screen items-center">
        <div className='w-[400px] ml-140 flex flex-col items-start'>
          <h2 className='text-2xl mb-5'>{hardcodedQuestion.text}</h2>
          <div className="w-full flex justify-start">
            <ul className="w-full flex flex-col items-start">
              {hardcodedQuestion.options.map((opt, idx) => (
                <li key={idx} className="w-full flex items-center mb-2">
                  <button
                    type="button"
                    onClick={() => submitAnswer(idx)}
                    disabled={selectedAnswer !== null}
                    className={`w-4 h-4 rounded-full border-2 mr-2 transition-colors duration-200
                      ${selectedAnswer === idx ? 'bg-blue-500 border-blue-700' : 'bg-white border-gray-400'}
                      ${selectedAnswer !== null ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                  />
                  <button
                    type="button"
                    onClick={() => submitAnswer(idx)}
                    disabled={selectedAnswer !== null}
                    className={`w-full text-sm px-2 py-1 rounded border text-left
                      ${selectedAnswer === idx ? 'border-blue-500 bg-blue-100 font-semibold' : 'border-gray-300 bg-white'}
                      transition-colors duration-200
                      ${selectedAnswer !== null ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                    style={{ minWidth: '80px' }}
                  >
                    {opt}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <p>Time left: {timeLeft}s</p>
        </div>
        <div className="flex-1 h-full flex justify-center items-center">
          <div className="p-4 bg-white rounded shadow max-w-md mx-auto mb-4">
            <h2 className="text-xl font-bold mb-2">Leaderboard</h2>
            <ul>
              {hardcodedPlayers.map((player, idx) => (
                <li key={idx} className="flex justify-between space-x-50 py-1 border-b">
                  <span>{idx + 1}. {player.username}</span>
                  <span>{player.score}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
  );
};

export default Testing;