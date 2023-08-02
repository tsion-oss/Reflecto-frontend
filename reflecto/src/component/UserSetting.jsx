import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import accIcon from '../images/accountIcon.png'
import themeIcon from '../images/themeIcon.png'
import themeOne from '../images/a.png'
import themeTwo from '../images/b.png'
import themeThree from '../images/c.jpg'

const UserSetting = ({ setIsLoggedIn }) => {
  const [userData, setUserData] = useState({});
  const [selectedTheme, setSelectedTheme] = useState('');
  const [showUserSettings, setShowUserSettings] = useState(true);
//   const [showThemeSettings, setShowThemeSettings] = useState(false);


  

  useEffect(() => {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme === 'none') {
      setSelectedTheme(savedTheme);
      document.documentElement.style.setProperty('--background-image', 'none');
      document.documentElement.style.setProperty('--background-color', 'rgba(190, 206, 198, 0.2)');
    } else if (savedTheme) {
      setSelectedTheme(savedTheme);
      document.documentElement.style.setProperty('--background-image', `url(${savedTheme})`);
      document.documentElement.style.setProperty('--background-color', '');
    }
  }, []);
  

  const handleThemeChange = (themeUrl) => {
    if (themeUrl === 'none') {
    setSelectedTheme(themeUrl);
    document.documentElement.style.setProperty('--background-image', 'none');
    document.documentElement.style.setProperty('--background-color', 'rgba(190, 206, 198, 0.2)'); 
    } else {
        setSelectedTheme(themeUrl)
        document.documentElement.style.setProperty('--background-image', `url(${themeUrl})`);
        document.documentElement.style.setProperty('--background-color', '');

    }
    
  
    localStorage.setItem('selectedTheme', themeUrl);
  };



  useEffect(() => {
   
    const userInfo = JSON.parse(localStorage.getItem('jwtToken'));
    if (userInfo) {
      setUserData(userInfo);
    }
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({ ...prevUserData, [name]: value }));
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3001/api/user/${userData.id}`, userData);
      console.log('User settings updated successfully');
    } catch (error) {
      console.error('Error updating user settings', error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    setIsLoggedIn(false)
    navigate('/')
  };

  const navigate = useNavigate();

  const deleteUser = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/user/${userData.id}`);
      handleLogout();
      console.log('User deleted');
    } catch (error) {
      console.error('Error deleting user', error.message);
    }
  };

  return (
    <div className='userSettingMain'>
      <Header />

      <h1>{userData.username} Account Settings</h1>
      <div className='userSecondMain'>
      <div className='userSettingBox'>
        
      <div className='navButtonsContainer'>
      <div className='navButtons'>
        <div style={{ display: 'flex' }}>
            <img src={accIcon} />
           <p onClick={() => setShowUserSettings(true)}>Account</p>
        </div>
        <div style={{ display: 'flex' }}>
            <img src={themeIcon}/>
           <p onClick={() => setShowUserSettings(false)}>Theme</p>
        </div>
      </div>
    </div>
        <div className='settingContent'>
        {showUserSettings && (
          <form onSubmit={handleUpdateUser}>
            <div>
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={userData.username || ''}
                onChange={handleChange}
                placeholder="Username"
              />
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={userData.password || ''}
                onChange={handleChange}
                placeholder="Password"
              />
            </div>
            <div>
              <button type="submit">Save Changes</button>
              <button onClick={deleteUser}>Delete Account</button>
            </div>
          </form>
        )}

        {!showUserSettings && (
          <div>
            <label>Choose Theme:</label>
            <div className="theme-buttons">
              <button onClick={() => handleThemeChange('none')} >no theme</button>
              <button onClick={() => handleThemeChange(themeOne)}>
                <img src={themeOne}  alt="Theme 1" />
              </button>
              <button onClick={() => handleThemeChange(themeTwo)}>
                <img src={themeTwo} alt="Theme 2" />
              </button>
              <button onClick={() => handleThemeChange(themeThree)}>
                <img src={themeThree} alt="Theme 3" />
              </button>
            </div>
          </div>
        )}
      </div>
      </div>
      </div>
    </div>
  );
};

export default UserSetting;