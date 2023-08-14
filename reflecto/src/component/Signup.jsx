import React, { useState,} from "react";
import axios from 'axios'
import { Link } from 'react-router-dom'
import signup from '../images/signup.jpg'
import login from '../images/login.png'

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");


  //Function to handle the signup form submission
  const handleSignup = async (e) => {
    e.preventDefault();
   
    const response = await axios.post('https://reflecto-production.up.railway.app/register', {username: username, password: password})

    const token = response.data.token
   
    localStorage.setItem('jwtToken', token)
    console.log(token)
    
    console.log("Username:", username);
    console.log("Password:", password);
  };

  return (
    <div className="login">
     <div className="left-login">
      <img src={login} />
     </div>
     <div className="right-login">
          <form onSubmit={handleSignup}>
           
              <h1>Sign Up</h1>
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
            <button type="submit">Sign Up</button>
            <p><Link to='/'>Log In</Link></p>
            
          </form>
    </div>
    </div>
  );
}
