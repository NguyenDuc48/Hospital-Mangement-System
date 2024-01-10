import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import PatientSidebar from './PatientSidebar';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const PatientAppointment = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeOfDay, setTimeOfDay] = useState('');
  const [diseaseDescription, setDiseaseDescription] = useState('');
  const [timeOptions, setTimeOptions] = useState([]);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const token = localStorage.getItem('token');
      const newDate = new Date(selectedDate);
      newDate.setDate(selectedDate.getDate() + 1);
  
      // Chuyển đổi sang múi giờ Việt Nam (GMT+7)
      const vietnamTimezoneOptions = { timeZone: 'Asia/Ho_Chi_Minh' };
      const vietnamISOString = newDate.toISOString();
  
      // Make an API request to insert data into the "booked" table
      const response = await axios.post(
        '/patient/booked',
        {
          date: vietnamISOString.split('T')[0], // Convert date to YYYY-MM-DD format
          timeOfDay,
          diseaseDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("testtt", vietnamISOString.split('T')[0])
  
      // Handle the API response as needed
      console.log('API Response:', response.data);
      window.alert('Record added successfully!');
  
      // Reset form fields after successful submission
      setSelectedDate(new Date());
      setTimeOfDay('');
      setDiseaseDescription('');
    } catch (error) {
      window.alert('Error submitting form. Please try again.');
  
      // Handle API request error
      console.error('Error submitting form:', error);
    }
  };
  

  // Fetch updated time options when the date changes
  useEffect(() => {
    const fetchUpdatedTimeOptions = async () => {
      try {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + 1);
    
        // Chuyển đổi sang múi giờ Việt Nam (GMT+7)
        const vietnamTimezoneOptions = { timeZone: 'Asia/Ho_Chi_Minh' };
        const vietnamISOString = newDate.toISOString();
        const vietnamDate = new Date(vietnamISOString);
    
        const response = await axios.get('/patient/time', {
          params: { date: vietnamDate.toISOString().split('T')[0] },
        });
        console.log("test",vietnamDate.toISOString().split('T')[0] )
    
        const bookedTimes = response.data.map((item) => item.booked_time);
    
        const listTime = [
          '8:00',
          '9:00',
          '10:00',
          '13:00',
          '14:00',
          '15:00',
          '16:00',
        ];
    
        const result = listTime.filter((item) => !bookedTimes.includes(item));
        setTimeOptions(result);
      } catch (error) {
        console.error('Error fetching updated time options:', error);
      }
    };
    
    

    // If date is not empty, fetch updated time options
    if (selectedDate) {
      fetchUpdatedTimeOptions();
    }
  }, [selectedDate]);
  console.log("timeoption", timeOptions)
  // console.log("selectedDtare", selectedDate.toISOString().split('T')[0])


  return (
    <div>
      <Header />
      <div
        style={{
          display: 'flex',
          overflowY: 'auto',
          width: '100%',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ width: '25%', marginBottom: '20px' }}>
          <PatientSidebar />
        </div>
        <div
          style={{
            height: '100vh',
            overflow: 'scroll',
            width: '70%',
          }}
        >
          <div>
            <h2>Appointment Registration</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="date">Date:</label>
                <Calendar
                  onChange={setSelectedDate}
                  value={selectedDate}
                />
              </div>
              <div>
                <label htmlFor="timeOfDay">Time of Day:</label>
                <table>
                  <tbody>
                    {timeOptions.map((timeOption, index) => (
                      <tr key={index}>
                        <td
                          style={{
                            cursor: 'pointer', // You can adjust this based on availability logic
                            padding: '10px',
                            border: `1px solid ${timeOfDay === timeOption ? 'blue' : 'black'}`,
                            backgroundColor: timeOfDay === timeOption ? 'lightblue' : 'white',
                          }}
                          onClick={() => setTimeOfDay(timeOption)}
                        >
                          {timeOption}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div>
                <label htmlFor="diseaseDescription">Disease Description:</label>
                <textarea
                  id="diseaseDescription"
                  value={diseaseDescription}
                  onChange={(e) => setDiseaseDescription(e.target.value)}
                  required
                />
              </div>
              <div>
                <button type="submit">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientAppointment;
