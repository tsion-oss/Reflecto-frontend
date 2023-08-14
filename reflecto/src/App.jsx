import React, { useState, useEffect } from 'react';
import './App.css';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import WebFont from 'webfontloader';
import Welcome from './component/Welcome';
import Home from './component/Home';
import Journal from './component/Journal';
import Mood from './component/Mood';
import Nav from './component/Nav';
import Signup from './component/Signup';
import UserSetting from './component/UserSetting';
import Login from './component/Welcome';

function App() {

    
  useEffect(() => {
    // Load the Google Font using webfontloader
    WebFont.load({
      google: {
        families: ['Leckerli One', 'Amita', 'IM Fell Great Primer SC', 'Jaldi', 'JetBrains Mono', 'Jua']
      }
    });
  }, []);

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('jwtToken'));
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    setIsLoggedIn(token !== null);
  }, []);

  return (
    <div className='app'>
      {/* Render Nav component only when logged in */}
      {isLoggedIn && <Nav />}
      <Routes>
        <Route path="/" element={isLoggedIn ? <Home /> : <Welcome setIsLoggedIn={setIsLoggedIn} />} />
        
        {isLoggedIn ? (
          <>
            <Route path="/home" element={<Home setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/journal" element={<Journal setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/mood" element={<Mood setIsLoggedIn={setIsLoggedIn} />} />
            <Route path='/usersetting' element={<UserSetting setIsLoggedIn={setIsLoggedIn} />} />
            
          </>
        ) : (
          <>
              <Route path="/signup" element={<Signup />} />
              <Route path='/login' element={<Login/>}/>
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;

