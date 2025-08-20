import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import Modal from './Modal';

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const handleCreateRoom = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:8080/room/create_room',
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        localStorage.setItem('roomId', res.data.roomId);
        localStorage.setItem('host', true);
        toast.success('Room created successfully!');
        setTimeout(() => {
          navigate(`/waiting_room/${res.data.roomId}`);
        }, 2000);
      } else {
        toast.error('Failed to create room.');
      }
    } 
    catch (err)
    {
      toast.error('Something went wrong.');
    } 
    finally 
    {
      setLoading(false);
    }
  };
  
  const handleJoinRoom = () => {
    navigate('/onjoin');
  };

  return (
    <div className={`relative flex flex-col items-center bg-cover bg-center min-h-screen w-full${loading ? 'pointer-events-none' : ''}`} style={{ backgroundImage: "url(/bg_quiz.avif)"}}>
      <h1 className="text-5xl font-bold mt-50 mb-8 font-welcome {
  font-family: 'Pacifico', cursive;
}">Welcome To QuizWiz!</h1>
      <button onClick={handleJoinRoom} className=" bg-linear-to-bl from-violet-700 to-fuchsia-700 px-4 h-16 py-2 rounded-full w-3xs text-white flex items-center justify-center mb-3  hover:border-fuchsia-950 hover:border-4
  transition-all duration-300 ease-in-out">Join Room</button><br />
      <button onClick={handleCreateRoom} className="bg-linear-to-bl from-violet-700 to-fuchsia-700 px-4 h-16 py-2 rounded-full w-3xs text-white mb-3 flex items-center justify-center hover:border-fuchsia-950 hover:border-4
  transition-all duration-300 ease-in-out">Create Room</button><br />
      <button className="bg-linear-45 from-purple-700 via-pink-500 to-purple-700  px-4 h-16 py-2 rounded-full w-3xs text-white flex items-center justify-center hover:border-fuchsia-950 hover:border-4
  transition-all duration-300 ease-in-out" onClick={() => {
        localStorage.clear();
        toast.success('Logged Out');
        setTimeout(() => navigate('/login'), 2000);
      }}>Logout</button>

      <Modal open={loading}>
        Creating Your Room!
      </Modal>
      
      <ToastContainer />
    </div>
  );
};

export default Home;