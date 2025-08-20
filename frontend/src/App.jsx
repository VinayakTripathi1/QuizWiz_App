import {createBrowserRouter,RouterProvider} from 'react-router-dom'
import React, { useEffect } from 'react';
import { checkAuthLoader } from './utility_funcs/auth';
import './App.css'
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Home from './Pages/Home';
import WaitingRoom from './Pages/WaitingRoom';
import OnJoin from './Pages/OnJoin';
import Game from './Pages/Game';
import Results from './Pages/Results';
import Testing from './Pages/Testing';
const router=createBrowserRouter([
  {path:'/',element:<Login/>},
  {path:'/login',element:<Login/>,loader: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    return null; 
  }},
  {path:'/onjoin',element:<OnJoin/>,loader:checkAuthLoader},
  {path:'/signup',element:<Signup/>},
  {path:'/home',element:<Home/>,loader:checkAuthLoader},
  {path:'/waiting_room/:roomId',element:<WaitingRoom/>,loader:checkAuthLoader},
  {path:'/game/:roomId',element:<Game/>,loader:checkAuthLoader},
  {path:'/results/:roomId',element:<Results/>,loader:checkAuthLoader},
  {path:'/testing',element:<Testing/>}
]);

function App() {
  useEffect(() => {
    const handleUnload = () => {
      localStorage.clear();
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);
  return (
    <div className="App min-h-screen w-full">
      <RouterProvider router={router}/>
    </div>
  )
}

export default App
