import React, { useEffect, useState } from "react";
import { Line, Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import axios from "axios";
import chartJs from 'chart.js/auto'

export default function MoodGraph() {
  const moods = ["Crying", "Sad", "Neutral", "Smiling", "Happy"];

  const [moodData, setMoodData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('http://localhost:3001/api/mood')
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          setMoodData(response.data);
          setLoading(false); // Set loading to false when data is fetched
        } else {
          console.error('Invalid API response:', response.data);
          setLoading(false); // Set loading to false in case of error
        }
      })
      .catch((error) => {
        console.error('Error fetching mood data:', error);
        setLoading(false); // Set loading to false in case of error
      });
  }, []);

  // If data is not yet loaded, show the loading message
  if (loading) {
    return <div>Loading...</div>;
  }

  // Group mood data by date
  const moodDataByDate = {};
  moodData.forEach((entry) => {
    const date = new Date(entry.date).toLocaleDateString("en-US");
    moodDataByDate[date] = entry.mood;
  });

  // Get the last 7 days from the moodDataByDate object
  const last7Days = Object.keys(moodDataByDate)
    .sort((a, b) => new Date(a) - new Date(b))
    .slice(-7);

  // Prepare data for the Line Chart
  const lineChartData = {
    labels: last7Days.map((dateString) => {
      const dateObj = new Date(dateString);
      return dateObj.toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      });
    }), // Dates in MM/DD/YYYY format on the x-axis
    datasets: [
      {
        label: "Mood",
        data: last7Days.map((date) => {
          const mood = moodDataByDate[date];
          const moodIndex = moods.indexOf(mood);
          return moodIndex !== -1 ? moodIndex : null; // Set null for dates without mood data
        }),
        borderColor: "#7B96D4", // Replace with desired border color
       // Replace with desired background color
        fill: true
      },
    ],
  };

  // Calculate mood counts for Doughnut chart
  const moodCounts = moods.map((mood) => moodData.filter((entry) => entry.mood === mood).length);

  // Prepare data for the Doughnut Chart
  const doughnutChartData = {
    labels: moods,
    datasets: [
      {
        label: "Mood Count",
        data: moodCounts,
       
        backgroundColor: [
          "rgba(246, 200, 82, 0.65)",
          "#6A7770",
          "#E8FDF2",
          "rgba(123, 150, 212, 0.67)",
          "rgba(153, 102, 255, 0.2)",
        ], 
        borderColor:'white',
      },
    ],
  };

  const lineChartOptions = {

    scales: {
      x: {
        ticks: {
          autoSkip: true,
          maxRotation: 45,

        },
       
      },
      y: {
        
        ticks: {
          stepSize: 1, // Display moods as integers on the y-axis
          callback: (value, index) => {
            return value !== null ? moods[value] : ""; // Show moods as y-axis labels, use empty string for null values
          },
          color: 'gray'
        },
        grid: {
          display: false
        },
        min: 0, // Set the y-axis minimum value to 0
        max: moods.length - 1, // Set the y-axis maximum value to the index of the last mood
      },
    },
    elements: {
      point: {
        radius: 0, // Set the radius of the data points to 0 to hide them
      },
    },
    plugins: {
      fill: {
        fill: {
          target: "origin",
          above: "blue", 
          below: "rgba(0, 0, 255, 0.5)", 
        }

      },
    },
  };
  const doughnutChartOptions = {
    elements: {
      arc: {
        borderWidth: 5, 
        shadowOffsetX: 2,
        shadowOffsetY: 5,
        shadowBlur: 15, 
        shadowColor: 'rgba(0, 0, 0, 0.7)', 
      },
    },
    plugins: {
      datalabels: {
        display: false, // Hide the numbers inside the segments
      },
      legend: {
        display: true, // Show the legend (labels for datasets)
        position: 'bottom', // You can adjust the position of the legend (top, bottom, left, right)
        labels: {
          font: {
            size: 14, // Adjust the font size of the legend labels
          },
        },
      },
    },
  };
  
  

  return (
    <div className="charts">
      <div className="line">
         <Line  data={lineChartData} options={lineChartOptions} />
      </div>
      <div className="doughnut">
           <Doughnut   data={doughnutChartData} plugins={[ChartDataLabels]} options={doughnutChartOptions} />
      </div>
    </div>
  );
}
