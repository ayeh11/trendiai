import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style.css';

function About() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [dataList, setDataList] = useState([]); // Initial state set to an empty array

  // Function to handle form submission and post data to the backend
  const postData = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/add', {
        email: email,
        message: message,
      });
      setResponseMessage(response.data.message);
      fetchData(); // Fetch the updated data after adding a new entry
    } catch (error) {
      console.error('Error posting data:', error);
      setResponseMessage('Failed to submit data.');
    }
  };

  // Function to fetch stored data from the backend
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/data');
      console.log('Fetched data:', response.data); // Log the fetched data to verify it's an array
      setDataList(response.data || []); // Ensure the response is an array
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Auto-expand textarea as user types
  const autoExpandTextarea = (e) => {
    e.target.style.height = 'auto'; // Reset height to auto to allow shrinking
    e.target.style.height = `${e.target.scrollHeight}px`; // Set height based on scrollHeight
  };

  return (
    <div className="container">
      <div className="box-container">
        <h1 className="navy-text">About Us</h1>
        <p className="grey-text">
          This is the About page of the website. Here you can provide details about your website, team, or mission.
        </p>

        <h2 className="navy-text">Give us any feedback!</h2>
        {/* Form to take user input */}
        <form onSubmit={postData}>
          <div>
            <input
              type="text"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label className="h2 dark-grey-text" htmlFor="message">Leave a message for us</label>
            <textarea
              id="message"
              placeholder="Type here"
              value={message}
              onChange={(e) => setMessage(e.target.message)} 
              onInput={autoExpandTextarea} // Auto-expand textarea as user types
              rows="1" // Initial number of rows
              required
              style={{ width: '100%', overflow: 'hidden' }} // Ensure textarea takes full width and hides overflow
            />
          </div>

          <button type="submit">Submit</button>
        </form>

        {/* Display response message from the backend */}
        {responseMessage && (
          <p className={responseMessage.includes('Failed') ? 'error-text' : ''}>
            {responseMessage}
          </p>
        )}
      </div>
    </div>
  );
}

export default About;
