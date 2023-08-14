import React, { useEffect, useState } from "react";
import axios from 'axios';
import DatePicker from "./DatePicker";
import Nav from './Nav'
import Header from "./Header";
import { NavLink } from "react-router-dom";
import logout from '../images/logout.png'
import tog from '../images/toggle.png'

export default function Mood() {
  const [mood, setMood] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [note, setNote] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [quote, setQuote] = useState('');


  //set background theme based on saved theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('selectedTheme')
    if (savedTheme === 'none') {
      document.documentElement.style.setProperty('--background-image', 'none')
      document.documentElement.style.setProperty('--background-color', 'rgba(190, 206, 198, 0.2)')
    } else if (savedTheme) {
      document.documentElement.style.setProperty('--background-image', `url(${savedTheme})`)
      document.documentElement.style.setProperty('--background-color', '')
    }
  }, []);


  const getAxiosInstance = () => {
    return axios.create({
      baseURL: 'https://reflecto-production.up.railway.app/api',
    });
  };

  const getMoods = async () => {
    try {
      const response = await getAxiosInstance().get(`/mood/`);
      // Convert the mood strings back to emojis before setting the state
      const moodWithEmojis = response.data.map((mod) => {
        let emoji = '';
        switch (mod.mood) {
          case 'Happy':
            emoji = '😃';
            break;
          case 'Smiling':
            emoji = '😊';
            break;
          case 'Neutral':
            emoji = '😐';
            break;
          case 'Sad':
            emoji = '😔';
            break;
          case 'Crying':
            emoji = '😢';
            break;
          default:
            emoji = ''; 
            break;
        }
        return {
          ...mod,
          emoji,
        };
      });
      setMood(moodWithEmojis);
    } catch (error) {
      console.error('Error fetching moods', error.message);
    }
  };


    // Delete a mood entry
  const deleteMood = async (moodId) => {
   
    try {
      await getAxiosInstance().delete(`/mood/${moodId}`)
      setMood(mood.filter((moo) => moo._id !== moodId))
    } catch (error) {
      console.error('Error deleting mood', error.message)
    }
  };

  useEffect(() => {
    getMoods()
  }, [])


   // Handle clicking on a mood emoji
  const handleMoodClick = (emoji) => {
    let moodString = '';
    switch (emoji) {
      case '😃':
        moodString = 'Happy'
        break;
      case '😊':
        moodString = 'Smiling'
        break;
      case '😐':
        moodString = 'Neutral'
        break;
      case '😔':
        moodString = 'Sad'
        break;
      case '😢':
        moodString = 'Crying'
        break;
      default:
        moodString = ''
        break;
    }

    setSelectedMood(moodString)
    const quote = getRandomQuote(moodString)
    setQuote(quote);
  };

  const postMood = async () => {
    
    if (!selectedMood) {
      alert("Please select a mood before submitting.")
      return;
    }

   
    if (isMoodAlreadySelected()) {
      alert("You have already selected a mood for this day.");
      return;
    }

    try {
      const response = await getAxiosInstance().post('/mood', {
        mood: selectedMood,
        date: selectedDate.toISOString(),
        note: note,
      });
      console.log(selectedMood)
      console.log(response.data);

      setNote('');

      
      getMoods();
    } catch (error) {
      console.error('Error posting mood', error.message);
    }
  };

  // Function to check if a mood entry already exists for the selected date
  const isMoodAlreadySelected = () => {
    const selectedDateString = selectedDate.toISOString().split('T')[0];
    return mood.some((mod) => {
      const modDateString = new Date(mod.date).toISOString().split('T')[0];
      return selectedDateString === modDateString;
    });
  };


  const moodOptions = [
    '😃', // Happy
    '😊', // Smiling
    '😐', // Neutral
    '😔', // Sad
    '😢', // Crying
  ];

  const moodListContainerStyles = {
    display: 'flex',
    flexDirection: 'row',
    overflowX: 'auto',
  };

  const moodEntryStyles = {
    minWidth: '200px',
    flex: '0 0 auto',
    marginRight: '10px',
    border: '1px solid #ccc',
    padding: '10px',
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken')
     window.location.href = '/'
  }





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
    <div className="mainMood">

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
                    <p onClick={toUserSetting} >User Setting</p>
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
                      </ul>
                    </div>
               )}
        



       <div className="navNHeader">
        <Nav className='homeNav'/>
        <Header/>
      </div>
        <div className="mood">
            <div className="moodButtons">
              {moodOptions.map((emoji) => (
              <button
              key={emoji}
              className={`mood-button ${selectedMood === emoji ? 'selected' : ''} biggerEmojiButton`}
              onClick={() => handleMoodClick(emoji)}
            >
              {emoji}
            </button>
              ))}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); postMood(); }}>
              <DatePicker value={selectedDate} 
              onChange={setSelectedDate}
              className="date-picker" />
               <div className="mood-inputNbutton">           
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Write a note about your mood..."
                    className="mood-input"
                  />
                  <button type="submit">Submit</button>
               </div>  
            </form>
            <h2>{quote}</h2>
               <div className="mainMoodList">
                  <div style={moodListContainerStyles}
                        className="mood-list">
                    {mood.slice().reverse().map((mod) => (
                      <div key={mod._id} 
                          style={moodEntryStyles}
                          className="eachMood"
                      >
                        <p>{new Date(mod.date).toLocaleString('en-US', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: 'numeric',
                          minute: 'numeric',
                          hour12: true,
                        })}</p>
                        <p>{mod.emoji}</p>
                        <p>{mod.note}</p>
                        <button 
                        style={{ background:'none',         
                        border: 'none',
                        position: 'relative', 
                        left: '70px',
                        top: '30px',
                        cursor: 'pointer',
                        color: 'gray'}}
                        onClick={() => deleteMood(mod._id)}>Remove</button>
                      </div>
                    ))}
                  </div>
             </div>
        </div>
    </div>
  );
}
