import React, { useEffect, useState } from "react";
import axios from 'axios';
import DatePicker from "./DatePicker";
import Nav from './Nav'
import Header from "./Header";

export default function Mood() {
  const [mood, setMood] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [note, setNote] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [quote, setQuote] = useState('');

  const getAxiosInstance = () => {
    return axios.create({
      baseURL: 'http://localhost:3001/api',
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
            emoji = ''; // You can set a default value if needed
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

  const deleteMood = async (moodId) => {
    try {
      await getAxiosInstance().delete(`/mood/${moodId}`);
      setMood(mood.filter((moo) => moo._id !== moodId));
    } catch (error) {
      console.error('Error deleting mood', error.message);
    }
  };

  useEffect(() => {
    getMoods();
  }, []);

  const handleMoodClick = (emoji) => {
    let moodString = '';
    switch (emoji) {
      case '😃':
        moodString = 'Happy';
        break;
      case '😊':
        moodString = 'Smiling';
        break;
      case '😐':
        moodString = 'Neutral';
        break;
      case '😔':
        moodString = 'Sad';
        break;
      case '😢':
        moodString = 'Crying';
        break;
      default:
        moodString = ''; // You can set a default value if needed
        break;
    }

    setSelectedMood(moodString);
    const quote = getRandomQuote(moodString);
    setQuote(quote);
  };

  const postMood = async () => {
    // Check if a mood is selected
    if (!selectedMood) {
      alert("Please select a mood before submitting.");
      return;
    }

    // Check if a mood entry already exists for the selected date
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

      // Refresh the mood data after posting the new entry
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

  const getRandomQuote = (selectedMood) => {
    // ... Your getRandomQuote function here ...
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
    backgroundColor: 'lightblue'
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken')
     window.location.href = '/'
  }

  return (
    <div>
       <Nav/>
      <Header/>
      <div>
        {moodOptions.map((emoji) => (
          <button
            key={emoji}
            className={`mood-button ${selectedMood === emoji ? 'selected' : ''}`}
            onClick={() => handleMoodClick(emoji)} // Pass the selected emoji to the function
          >
            {emoji}
          </button>
        ))}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); postMood(); }}>
        <DatePicker value={selectedDate} onChange={setSelectedDate} />
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Write a note about your mood..."
        />
        <button type="submit">Submit</button>
      </form>
      <h2>{quote}</h2>
      <div style={moodListContainerStyles}>
        {mood.slice().reverse().map((mod) => (
          <div key={mod._id} style={moodEntryStyles}>
            <p>{new Date(mod.date).toLocaleString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
            })}</p>
            <p>{mod.emoji}</p> {/* Display mood as emoji */}
            <p>{mod.note}</p>
            <button onClick={() => deleteMood(mod._id)}>delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
