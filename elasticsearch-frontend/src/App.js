import React from 'react';
import { Route, Link, Routes } from 'react-router-dom';
import Home from "./Pages/Home";
import Login from './Pages/Login'
import NavBar from './Components/Navbar';
import SignUp from './Pages/SignUp';
import Dashboard from './Pages/Dashboard';

export default function App(){
  return (
    <div className='flex flex-col min-h-screen'>
      <NavBar/>
      
      <Routes>
        <Route exact path="/" element={<Home/>} />
        <Route exact path="/login" element={<Login/>} />
        <Route exact path="/signup" element={<SignUp/>} />
        <Route exact path="/dashboard" element={<Dashboard/>} />
      </Routes>
    </div>
  );
};
