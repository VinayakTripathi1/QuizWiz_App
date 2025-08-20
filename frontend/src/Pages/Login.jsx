import React, { useState ,useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {ToastContainer} from 'react-toastify';
import {handleError,handleSuccess,handlePleaseLogin} from '../utils.js';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
const Login = () => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("unauthorized") === "true") {
      handlePleaseLogin("Please log in to continue");
    }
  }, [location]);

  const [loginInfo,setLoginInfo]=useState({
    email:'',
    password:''
  })

  const navigate=useNavigate();
  const  handleChange=(e)=>{
        const {name,value}=e.target;
        console.log(name,value);
        const copyLoginInfo={...loginInfo};
        copyLoginInfo[name]=value;
        setLoginInfo(copyLoginInfo);
  }
  
  const handleLogin=async (e)=>
  {
    e.preventDefault();
    const {email,password}=loginInfo;
    if(!email||!password)
    {
      return handleError('email and password are required');
    }
    try {
      const response = await axios.post("http://localhost:8080/auth/login", loginInfo,{
        validateStatus: function (status) {return true;}
      });
      const result = response.data;
      console.log(result);
      const {success,message,token,user,error}=result;
      if(success)
      {
        handleSuccess(message);
        localStorage.setItem('token',token);
        localStorage.setItem('username',user.username);
        setTimeout(()=>{navigate('/home')},1000);
      }
      else if(error)
      {
        const details=error?.details[0].message;
        handleError(details);
      }
      else if(!success)
      {
        handleError(message);
      }
    } catch (error) {
      handleError(error);
    }
  }
  return (
    <div className="flex justify-center items-center h-screen">
    <div className='flex flex-col space-y-5 bg-white shadow-md py-5 px-15 rounded-3xl'>
      <h1 className='text-5xl text-black' style={{ fontFamily: 'Poppins, sans-serif' }}>LOGIN</h1>
      <form onSubmit={handleLogin} className='mb-5 flex flex-col space-y-4'>
        <div className="my-4 flex flex-row space-x-2">
        <div className='flex flex-col justify-center items-start space-y-4'>
          <div className='flex justify-center items-center py-2'><label htmlFor='email'>Email</label></div>
          <div className='flex justify-center items-center py-2'><label htmlFor='password'>Password</label></div>
        </div>
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <img 
    src="/email-1572-svgrepo-com.svg" 
    alt="Email" 
    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
  />
          <input 
          className="pl-10 pr-4 py-2 bg-[#e6e6e6] rounded-full
    focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2
    focus:shadow-lg transition-all duration-300"
          onChange={handleChange} 
          type='text' 
          name='email' 
          autoFocus 
          placeholder="Enter your E-mail..." 
          value={loginInfo.email}/>
          </div>
           <div className="relative">
           <img 
    src="/reshot-icon-lock-3KZHTYWCQD.svg" 
    alt="Password" 
    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
  />
          <input 
          className="pl-10 pr-4 py-2 bg-[#e6e6e6]  rounded-full
    focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2
    focus:shadow-lg transition-all duration-300"
          onChange={handleChange} 
          type='password' 
          name='password' 
          autoFocus 
          placeholder="Enter your Password..."
          value={loginInfo.password}/>
        </div>
        </div>
        </div>
        <button type="submit" className="w-full bg-green-500 text-white hover:scale-105 hover:bg-black duration-500 rounded-full py-2">Login</button>
        <div><span className='pt-5 block text-gray-500 text-left text-sm ml-2'>Don't have an account? </span>
        <button onClick={() => navigate('/signup')} className="w-full px-2 py-2 bg-blue-500 hover:scale-105 hover:bg-black duration-500 text-white rounded-full">Signup</button>
        </div>
      </form>
    </div>
    <ToastContainer />
    </div>
  )
}

export default Login;
