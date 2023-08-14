import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import accIcon from '../images/accountIcon.png'
import themeIcon from '../images/themeIcon.png'
import themeOne from '../images/a.png'
import themeTwo from '../images/b.png'
import themeThree from '../images/books.png'
import themeFour from '../images/d.png'
import { NavLink } from 'react-router-dom';
import tog from '../images/toggle.png'
import logout from '../images/logout.png'

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
      await axios.put(`https://reflecto-production.up.railway.app/api/user/${userData.id}`, userData);
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
      await axios.delete(`https://reflecto-production.up.railway.app/api/user/${userData.id}`);
      handleLogout();
      console.log('User deleted');
    } catch (error) {
      console.error('Error deleting user', error.message);
    }
  };





  // for the menu toggle

  const [showOptions, setShowOptions] = useState(false)

  const toggle = () => {
     setShowOptions(!showOptions)
     setShowDropdown(false)
  }

  // for the setting drop down

  const [showDropdown, setShowDropdown] = useState(false)

  
  const toUserSetting = () => {
     window.location.href = '/usersetting'
  }
 
 const toggleDropdown = () => {
   setShowDropdown(!showDropdown)
   setShowOptions(false)
 }



  return (
    <div className='userSettingMain'>
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







       <div className='userSettingBody'>
              <h1 className='settingName'
                  style={{ fontFamily:'jaldi',
                          textShadow:'2px 4px 2px rgba(255, 255, 255)' }}>Account Settings</h1>
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
                  <div className='theme-images'>
                    {/* <label>Choose Theme:</label> */}
                    <div className="theme-buttons">
                      <button onClick={() => handleThemeChange('none')} ><p>No theme</p></button>
                      <button onClick={() => handleThemeChange(themeOne)}>
                        <img src={themeOne}  alt="Theme 1" />
                      </button>
                      <button onClick={() => handleThemeChange(themeTwo)}>
                        <img src={themeTwo} alt="Theme 2" />
                      </button>
                      <button onClick={() => handleThemeChange(themeThree)}>
                        <img src={themeThree} alt="Theme 3" />
                      </button>
                      <button onClick={() => handleThemeChange(themeFour)}>
                        <img src={themeFour} alt="Theme 3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
              </div>
              </div>
       </div>
    </div>
  );
};

export default UserSetting;
