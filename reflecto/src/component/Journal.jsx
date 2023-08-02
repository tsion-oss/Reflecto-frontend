// Journal.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from './DatePicker';
import Nav from './Nav';
import Header from './Header';

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
      baseURL: 'http://localhost:3001/api',
    });
  };

  const fetchJournals = async () => {
    try {
      const response = await getAxiosInstance().get('/journal');
      setJournal(response.data.reverse()); // Reverse the order to show the latest entry first
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
      fetchJournals(); // Refresh the journal list after submitting a new entry
    } catch (error) {
      console.error('Error', error.message);
    }
  };

  const getZIndex = (index) => {
    const reversedIndex = journal.length - index - 1; // Reverse the order
    if (currentPageIndex === index) {
      return journal.length + 1; // Put the current page on top
    }
    return reversedIndex; // For other entries, stack them based on the reversed index
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

  // ... (existing code)

  const handleEditClick = (index, content) => {
    setEditingIndex(index);
    setEditedContent(content);
  };

  const handleCancelEdit = () => {
    setEditingIndex(-1);
    setEditedContent('');
  };

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


  
  return (
    <div className="mainJournal">
       <Nav />
      <Header />
      <style>{styles}</style>
      <h1 className='howareyou'>How are you?    {userr.username}</h1>
      <div className="journal">
        
        <div className="journalEntry">
          <form onSubmit={handleSubmit}>
            <label>Date:</label>
            <DatePicker value={selectedDate} onChange={handleDateChange}   />
            <select value={selectedFont} onChange={handleFontChange}>
              {fontOptions.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="notebook-input">
              <textarea
                type="text"
                name="content"
                value={entry.content}
                onChange={handleChange}
                rows={10}
                placeholder="Write your journal entry here..."
                style={{
                  fontFamily: selectedFont,
                  fontSize: '12px',
                  lineHeight: '1.5',
                  padding: '15px',
                  border: '1px solid #ccc',
                  background: 'white',
                  width: '340px',
                }}
              />
              <button type="submit">Submit</button>
            </div>
            
          </form>

          <div className='randomQuotes'>
            <h1>Random quotes</h1>
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
                  {editingIndex === index ? ( // If the entry is being edited, show the textarea
                    <form onSubmit={(e) => handleUpdateJournal(e, journ._id)}>
                      <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        rows={10}
                        style={{
                          fontFamily: selectedFont,
                          fontSize: '12px',
                          lineHeight: '1.5',
                          padding: '15px',
                          border: '1px solid #ccc',
                          background: 'white',
                          width: '340px',
                          marginTop: '-350px',
                          height: '400px',
                          border: 'none'
                        }}
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
                  <button onClick={() => deleteJournal(journ._id)}>I don't want to remember this</button>
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