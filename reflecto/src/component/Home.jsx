import React, { useState, useEffect } from "react";
import axios from 'axios';
import MoodGraph from "./MoodGraph";
import Nav from './Nav'
import Header from "./Header";



export default function Home() {
  const [locationInfo, setLocationInfo] = useState("");
  const apiKey = '52da1b624dc843c880c180718231705';



  useEffect(() => {
    // Call the geolocation function when the component mounts
    getLocation();
    
  }, []);

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

  async function getWeatherApi(latitude, longitude) {
    try {
      const response = await axios.get(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}`);
      console.log(response);
      // You can extract weather information and update the state here if needed
      const temperature = response.data.current.temp_c;
      const city = response.data.location.name;
      const region = response.data.location.region
      const img = `https:${response.data.current.condition.icon}`; // Add the base URL to the relative path

      setLocationInfo(`
        Today's Forecast<br/>
        ${temperature} °<br />
        ${city}<br />
        region: ${region}<br />
        <img src="${img}" alt="Weather Icon" />
      `);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setLocationInfo('Error fetching weather data. Please try again later.');
    }
  }

  function onLocationSuccess(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // Call the weather API function to fetch weather data
    getWeatherApi(latitude, longitude);
  }

  function onLocationError(error) {
    setLocationInfo(`Error getting geolocation: ${error.message}`);
  }


 
  

  return (
    <div className="home">
      <div>
          <Nav/>
          <Header/>
       </div>
       <div>
            <div className="graphnWeather">
                  <div>
                      <MoodGraph />
                  </div>
                  <div>
                        <div className="weatherBox">
                            <div dangerouslySetInnerHTML={{ __html: locationInfo }}></div>
                        </div>
                        <div className="counts">
                              <div>
                                  <h3>20</h3>
                                  <p>Happy</p>
                              </div>
                              <div>
                                  <h3>25</h3>
                                  <p>Smiling</p>
                              </div>
                              <div>
                                <h3>15</h3>
                                <p>neutral</p>
                            </div>
                            <div>
                                <h3>3</h3>
                                <p>sad</p>
                            </div>
                              
                              <div>
                                <h3>5</h3>
                                <p>crying</p>
                              </div>
                        </div>
                  </div>
              </div>  
        </div>
    </div>
  );
}
