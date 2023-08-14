import React, { useState} from "react";
import axios from 'axios'
import { Link } from 'react-router-dom'
import login from '../images/login.png'
import { useNavigate } from 'react-router-dom'

export default function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); 

  // Function to handle the login form submission
  const handleLogin =  async (e) => {
    e.preventDefault()
    console.log(username)
   try{
    const response = await axios.post('https://reflecto-production.up.railway.app/api/login', {username: username, password: password})
     
    console.log(response.data)
    const userInfo = {
      token: response.data.token,
      id: response.data.user._id,
      username: username
    }
    const token = response.data.token
     console.log(userInfo)
   
     localStorage.setItem('jwtToken', JSON.stringify(userInfo));
      setIsLoggedIn(true)
      navigate('/home'); // Use the navigate function to navigate to "/home"
    } catch (error) {
      // Handle error
      console.error(error);
    }
  
  };




  

  return (
    <div className="login">
      <div className="left-login">
        <img src={login}/>
     </div>
      <div className="right-login">
        <h1>Reflecto</h1>
            <form onSubmit={handleLogin}>
                <p>Welcome to Reflecto</p>
                  <div className="input-wrapper">
                    <label>Username or Email</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="input-wrapper">
                    <label>Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <button type="submit">Log In</button>
                  <p><Link to='/signup'>Sign Up</Link></p>
            </form>
      </div>
    </div>
  );
}
