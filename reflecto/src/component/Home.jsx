import React, { useState, useEffect } from "react";
import axios from 'axios';
import MoodGraph from "./MoodGraph";
import Nav from './Nav'
import Header from "./Header";
import { NavLink } from "react-router-dom";
import logout from '../images/logout.png'
import tog from '../images/toggle.png'

export default function Home() {


  useEffect(() => {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme === 'none') {
      document.documentElement.style.setProperty('--background-image', 'none');
      document.documentElement.style.setProperty('--background-color', 'rgba(190, 206, 198, 0.2)');
    } else if (savedTheme) {
      document.documentElement.style.setProperty('--background-image', `url(${savedTheme})`);
      document.documentElement.style.setProperty('--background-color', '');
    }
  }, []);

   // State variables for location information and mood counts
  const [locationInfo, setLocationInfo] = useState("");
  const [moodCounts, setMoodCounts] = useState({
    Happy: 0,
    Smiling: 0,
    Neutral: 0,
    Sad: 0,
    Crying: 0,
  });
  const apiKey = '52da1b624dc843c880c180718231705';

  useEffect(() => {
    // the geolocation function when the component mounts
    getLocation();
    getMoodCounts();
  }, []);

  //function to get user's current geolocation
  function getLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        onLocationSuccess,
        onLocationError,
        { enableHighAccuracy: true }
      );
    } else {
      setLocationInfo('Geolocation is not available in this browser.');
    }
  }

  //function to fetch weather data
  async function getWeatherApi(latitude, longitude) {
    try {
      const response = await axios.get(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}`);
      console.log(response);
      
      const temperature = response.data.current.temp_c;
      const city = response.data.location.name;
      const region = response.data.location.region
      const img = `https:${response.data.current.condition.icon}`; 

      setLocationInfo(`<div class='weatherMain'>
        <p>Today's Forecast</p><br/>
        <img class='weather-icon' src="${img}" alt="Weather Icon" />
        <h1>${temperature}°</h1> <br />
        <h2> ${city}</h2><br />
        </div>
      `);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setLocationInfo('Error fetching weather data. Please try again later.');
    }
  }

  function onLocationSuccess(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    getWeatherApi(latitude, longitude);
  }

  function onLocationError(error) {
    setLocationInfo(`Error getting geolocation: ${error.message}`);
  }



   // Function to fetch and update mood counts
  async function getMoodCounts() {
    try {
      const response = await axios.get('http://localhost:3001/api/mood');
      const moodRecords = response.data;
      const moodCounts = {
        Happy: 0,
        Smiling: 0,
        Neutral: 0,
        Sad: 0,
        Crying: 0,
      };

      moodRecords.forEach((record) => {
        const mood = record.mood;
        if (moodCounts.hasOwnProperty(mood)) {
          moodCounts[mood] += 1;
        }
      });

    
      setMoodCounts(moodCounts);
    } catch (error) {
      console.error('Error fetching mood records:', error);
    }
  }

  // for the menu toggle

  const [showOptions, setShowOptions] = useState(false)


  const toggle = () => {
     setShowOptions(!showOptions)
     setShowDropdown(false)
  }

  // for the setting drop down

  const [showDropdown, setShowDropdown] = useState(false)

  const handleLogout = () => {
         localStorage.removeItem('jwtToken')
          window.location.href = '/'
       }
  
  const toUserSetting = () => {
     window.location.href = '/usersetting'
  }
 
 const toggleDropdown = () => {
   setShowDropdown(!showDropdown)
   setShowOptions(false)
 }

  return (
    <div className="home">
        <div className="home-toggle">
             <div className="toggleSecond">
                <button onClick={toggle}><img src={tog}/></button>
                <NavLink style={{ textDecoration: 'none' }} to='/home'><h2>Reflecto</h2></NavLink>
              </div>

              <div className="account-info" 
                   onClick={toggleDropdown}>
                    <img  src={logout} />
               </div>
                  
             
        </div>
               {showDropdown &&
               <div className="dropdown" id="dropdown">
                    <p onClick={handleLogout}>Logout</p>
                  
                </div>}
        
               {showOptions && ( 
                  <div className='options'>
                      <ul>
                        <li>
                          <NavLink to='/home' activeClassName="active">My Reflection</NavLink>
                        </li>
                        <li>
                          <NavLink to='/mood' activeClassName="active">My Moods</NavLink>
                        </li>
                        <li>
                          <NavLink to='/journal' activeClassName="active">My Journals</NavLink>
                        </li>
                        <li>
                        <NavLink className='navUserSetting' to='/usersetting'>User setting</NavLink>
                        </li>
                      </ul>
                    </div>
               )}
        
       
   
      <div className="navNHeader">
        <Nav className='homeNav'/>
        <Header/>
      </div>
      <div className="homeSecond">
        <div className="graphnWeather">
          <div>
            <MoodGraph />
          </div>
          <div className="weatherNCount">
            <div className="weatherBox">
              <div dangerouslySetInnerHTML={{ __html: locationInfo }}></div>
            </div>
          
                  <div className="counts">
                    {Object.entries(moodCounts).map(([mood, count]) => (
                      <div key={mood} className="countBoxContainer">
                        <div className="countBox">
                            <h1>{count}</h1>
                            <p>{mood}</p>
                        </div>
                      </div>
                    ))}
                  </div>
        
          </div>
        </div>  
      </div>
    </div>
  );
}
