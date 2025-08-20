import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils.js';
import axios from 'axios';

const Signup = () => {
  const [signupInfo, setSignupInfo] = useState({
    name: '',
    email: '',
    password: '',
    username: '',
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    const copySignupInfo = { ...signupInfo };
    copySignupInfo[name] = value;
    setSignupInfo(copySignupInfo);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password, username } = signupInfo;
    if (!name || !email || !password || !username) {
      return handleError('name, email, username and password are required');
    }
    try {
      const response = await axios.post("http://localhost:8080/auth/signup", signupInfo, {
        validateStatus: function (status) { return true; }
      });
      const result = response.data;
      const { success, message, error } = result;
      if (success) {
        handleSuccess(message);
        setTimeout(() => { navigate('/login') }, 1000);
      } 
      else if (!success) {
        handleError(message);
      }
      else if (error) {
        const details = error?.details[0].message;
        handleError(details);
      } 
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col space-y-5 shadow-md py-5 px-10 rounded-3xl bg-white w-full max-w-md">
        <h1 className="text-5xl text-black font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>SIGNUP</h1>
        <form onSubmit={handleSignup} className="mb-5 flex flex-col space-y-4">
          <div className="my-4 flex flex-row space-x-2">
            <div className="flex flex-col justify-center items-start space-y-4">
              <div className="flex justify-center items-center py-2"><label htmlFor="username">UserName</label></div>
              <div className="flex justify-center items-center py-2"><label htmlFor="name">Name</label></div>
              <div className="flex justify-center items-center py-2"><label htmlFor="email">Email</label></div>
              <div className="flex justify-center items-center py-2"><label htmlFor="password">Password</label></div>
            </div>
            <div className="flex flex-1 flex-col items-stretch justify-center space-y-4">
              <input
                className="text-sm w-full pl-4 pr-4 py-2 bg-[#e6e6e6] rounded-full focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2 focus:shadow-lg transition-all duration-300"
                onChange={handleChange}
                type="text"
                name="username"
                autoFocus
                placeholder="Enter your desired username"
                value={signupInfo.username}
              />
              <input
                className="text-sm pl-4 pr-4 py-2 bg-[#e6e6e6] rounded-full focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2 focus:shadow-lg transition-all duration-300"
                onChange={handleChange}
                type="text"
                name="name"
                placeholder="Enter your Name"
                value={signupInfo.name}
              />
              <input
                className="text-sm pl-4 pr-4 py-2 bg-[#e6e6e6] rounded-full focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2 focus:shadow-lg transition-all duration-300"
                onChange={handleChange}
                type="text"
                name="email"
                placeholder="Enter your E-mail"
                value={signupInfo.email}
              />
              <input
                className="text-sm pl-4 pr-4 py-2 bg-[#e6e6e6] rounded-full focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2 focus:shadow-lg transition-all duration-300"
                onChange={handleChange}
                type="password"
                name="password"
                placeholder="Enter your Password"
                value={signupInfo.password}
              />
            </div>
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white hover:scale-105 hover:bg-black duration-500 rounded-full py-2">Signup</button>
          <div>
            <span className="pt-5 block text-gray-500 text-left text-sm ml-2">Already have an account?</span>
            <button onClick={() => navigate('/login')} className="w-full px-2 py-2 bg-green-500 hover:scale-105 hover:bg-black duration-500 text-white rounded-full">
              Login
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Signup;
