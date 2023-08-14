// Journal.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from './DatePicker';
import Nav from './Nav';
import Header from './Header';
import logout from '../images/logout.png'
import { NavLink } from 'react-router-dom';
import tog from '../images/toggle.png'

const styles = `
  .horizontalScrollContainer {
    display: flex;
    overflow-x: auto;
  }

  /* Optional: Adjust the spacing and appearance of each journal entry */
  .journalStack {
    display: flex;
    gap: 16px; /* Adjust the spacing between journal entries if desired */
  }

  .eachJournal {
    flex-shrink: 0;
    min-width: 300px; /* Set a minimum width for each journal entry if desired */
  }
`;

const Journal = () => {
  const fontOptions = [
    { label: 'Arial', value: 'Arial, sans-serif' },
    { label: 'Verdana', value: 'Verdana, sans-serif' },
    { label: 'Georgia', value: 'Georgia, serif' },
    { label: 'Times New Roman', value: 'Times New Roman, serif' },
    { label: 'Helvetica', value: 'Helvetica, sans-serif' },
    { label: 'Courier New', value: 'Courier New, monospace' },
    { label: 'Tahoma', value: 'Tahoma, sans-serif' },
    { label: 'Palatino', value: 'Palatino, serif' },
    { label: 'Garamond', value: 'Garamond, serif' },
    { label: 'Comic Sans MS', value: 'Comic Sans MS, cursive' },
    { label: 'Impact', value: 'Impact, sans-serif' },
    { label: 'Lucida Console', value: 'Lucida Console, monospace' },
    { label: 'Trebuchet MS', value: 'Trebuchet MS, sans-serif' },
    { label: 'Courier', value: 'Courier, monospace' },
    { label: 'Book Antiqua', value: 'Book Antiqua, serif' },
    { label: 'Arial Black', value: 'Arial Black, sans-serif' },
    { label: 'Century Gothic', value: 'Century Gothic, sans-serif' },
    { label: 'Franklin Gothic Medium', value: 'Franklin Gothic Medium, sans-serif' },
    { label: 'Copperplate', value: 'Copperplate, sans-serif' },
    { label: 'Baskerville', value: 'Baskerville, serif' },
    { label: 'Verdana Pro', value: 'Verdana Pro, sans-serif' },
    { label: 'Rockwell', value: 'Rockwell, serif' },
    { label: 'Futura', value: 'Futura, sans-serif' },
    { label: 'Myriad Pro', value: 'Myriad Pro, sans-serif' },
    { label: 'Didot', value: 'Didot, serif' },
  ];


  const inspirationalQuotes = [
    "The only way out is through. - Robert Frost",
    "Every moment is a fresh beginning. - T.S. Eliot",
    "It's okay not to be okay. It's okay to ask for help. - Unknown",
    "You are stronger than you think. - Unknown",
    "The future depends on what you do today. - Mahatma Gandhi",
    "Don't be pushed around by the fears in your mind. Be led by the dreams in your heart. - Roy T. Bennett",
    "Do not anticipate trouble, or worry about what may never happen. Keep in the sunlight. - Benjamin Franklin",
    "The greatest glory in living lies not in never falling, but in rising every time we fall. - Nelson Mandela",
    "The only person you should try to be better than is the person you were yesterday. - Unknown",
    "Believe you can and you're halfway there. - Theodore Roosevelt",
    "You may not control all the events that happen to you, but you can decide not to be reduced by them. - Maya Angelou",
    // "The most beautiful people we have known are those who have known defeat, known suffering, known struggle, known loss, and have found their way out of the depths. These persons have an appreciation, a sensitivity, and an understanding of life that fills them with compassion, gentleness, and a deep loving concern. Beautiful people do not just happen. - Elisabeth Kübler-Ross",
    "You don't have to be perfect to be amazing. - Unknown",
    "The present moment is filled with joy and happiness. If you are attentive, you will see it. - Thích Nhất Hạnh",
    "Just when the caterpillar thought the world was over, it became a butterfly. - Anonymous"
  ];
  
  
  const [selectedFont, setSelectedFont] = useState(fontOptions);
  const [journal, setJournal] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [entry, setEntry] = useState({
    date: '',
    content: '',
  });


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
  


  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const getAxiosInstance = () => {
    return axios.create({
      baseURL: 'https://reflecto-production.up.railway.app/api',
    });
  };

  const fetchJournals = async () => {
    try {
      const response = await getAxiosInstance().get('/journal');
      setJournal(response.data.reverse()); 
    } catch (error) {
      console.error('Error fetching journals', error.message);
    }
  };

  useEffect(() => {
    fetchJournals();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEntry({ ...entry, [name]: value });
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleFontChange = (e) => {
    setSelectedFont(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedDate = selectedDate.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });

      const entryToSubmit = { ...entry, date: formattedDate };
      const response = await getAxiosInstance().post('/journal', entryToSubmit);
      console.log(response.data);

      setEntry({ date: '', content: '' });
      setSelectedDate(new Date());
      fetchJournals(); 
    } catch (error) {
      console.error('Error', error.message);
    }
  };

  //Calculate z-index for journal entry stacking
  const getZIndex = (index) => {
    const reversedIndex = journal.length - index - 1; 
    if (currentPageIndex === index) {
      return journal.length + 1; 
    }
    return reversedIndex;
  };


  const handleNextPage = () => {
    setCurrentPageIndex((prevIndex) => Math.min(prevIndex + 1, journal.length - 1));
  };

  const handlePreviousPage = () => {
    setCurrentPageIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const [userr, setUserr] = useState('');
 

  useEffect(() => {
    const user = localStorage.getItem('jwtToken');
    setUserr(JSON.parse(user));
  }, []);
  
  useEffect(() => {
      console.log(userr.username)
  }, [userr]);
  
//  delete function


const deleteJournal = async (journalId) => {
  console.log(journalId)
  try{
 await getAxiosInstance().delete(`/journal/${journalId}`)
  setJournal(journal.filter((jo) => jo._id !== journalId))
  }catch(error) {
  console.log('Error deleting journal', error.message)
  }
}

useEffect(() =>  {
 
}, [])

const [editingIndex, setEditingIndex] = useState(-1);
  const [editedContent, setEditedContent] = useState('');


//handle clicking edit for a journal entry 
  const handleEditClick = (index, content) => {
    setEditingIndex(index);
    setEditedContent(content);
  };


//handle canceling edit mode for a journal entry
  const handleCancelEdit = () => {
    setEditingIndex(-1);
    setEditedContent('');
  };

  
  //handle updating a jouranl entry
  const handleUpdateJournal = async (e, journalId) => {
    e.preventDefault();
    try {
      await getAxiosInstance().put(`/journal/${journalId}`, {
        content: editedContent, 
      });
      setEditingIndex(-1); 
      setEditedContent(''); 
      fetchJournals(); 
    } catch (error) {
      console.error('Error updating journal entry', error.message);
    }
  };

  const [randomQuote, setRandomQuote] = useState('')

  const generateRandomQuote = () => {
     const randomIndex = Math.floor(Math.random() * inspirationalQuotes.length)
     setRandomQuote(inspirationalQuotes[randomIndex])
  }

 useEffect(() => {
  generateRandomQuote()
 }, [])






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
    <div className="mainJournal">
     
          <div className="home-toggle">
                  <div className="toggleSecond">
                    <button onClick={toggle}><img src={tog}/></button>
                    <NavLink style={{ textDecoration: 'none' }} to='/home'><h2>Reflecto</h2></NavLink>
                  </div>
                  <div className="account-info" 
                      onClick={toggleDropdown}>
                        <img src={logout} />
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

        < div className="navNHeader">
                <Nav className='homeNav'/>
                <Header/>
          </div>
          <style>{styles}</style>
          <h1 className='howareyou'>How are you?    {userr.username}</h1>
      <div className="journal">
       
         <div className="journalEntry">
              <form onSubmit={handleSubmit}>
                       <div className='date-select'>
                            <label>Date:</label>
                            <DatePicker value={selectedDate} onChange={handleDateChange}   />
                            <select value={selectedFont} onChange={handleFontChange}>
                              {fontOptions.map((option) => (
                                <option key={option.label} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                        </div>
                        <div className="notebook-input">
                          <textarea
                            type="text"
                            name="content"
                            value={entry.content}
                            onChange={handleChange}
                            rows={10}
                            placeholder="Write your journal entry here..."
                            // style={{
                            //   fontFamily: selectedFont,
                            //   fontSize: '12px',
                            //   lineHeight: '1.5',
                            //   padding: '15px',
                            //   border: '1px solid #ccc',
                            //   background: 'white',
                            //   width: '340px',
                            // }}
                          />
                          <button type="submit">Submit</button>
                        </div>
            
               </form>

              <div className='randomQuotes'>
                    <h3 className="quote">{randomQuote}</h3>

              </div>
        </div>
      <div className="journalListMain">
        <div className="journalList">
          <div className="horizontalScrollContainer">
            <div className="journalStack">
              {journal.map((journ, index) => (
                <div
                  key={journ._id}
                  className={`eachJournal ${currentPageIndex === index ? 'open' : ''}`}
                  style={{
                    zIndex: getZIndex(index),
                  }}
                >
                  <p style={{ textAlign: 'right', marginTop: '-10px' }}>{journ.date}</p>
                  <br />
                  {editingIndex === index ? ( 
                    <form onSubmit={(e) => handleUpdateJournal(e, journ._id)}>
                      <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        rows={10}
                        className='textarea-edit'
                        // style={{
                        //   fontFamily: selectedFont,
                        //   fontSize: '12px',
                        //   lineHeight: '1.5',
                        //   padding: '15px',
                        //   border: '1px solid #ccc',
                        //   background: 'white',
                        //   width: '340px',
                        //   marginTop: '-350px',
                        //   height: '400px',
                        //   border: 'none'
                        // }}
                      />
                      <div>
                        <button type="submit">Save</button>
                        <button type="button" onClick={handleCancelEdit}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div>
                      <p onClick={() => handleEditClick(index, journ.content)}>{journ.content}</p>
                      <p className="index">{journal.length - index - 1 + 1}</p>
                    </div>
                  )}
                  <button
                   style={{ background:  'rgba(120, 134, 127, 0.5)',
                  cursor: 'pointer' }}
                   onClick={() => deleteJournal(journ._id)}>Erase from history</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
    </div>
  );
};

export default Journal;