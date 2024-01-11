import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import PatientSidebar from './PatientSidebar';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Patient.css'
const PatientAppointment = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeOfDay, setTimeOfDay] = useState('');
  const [diseaseDescription, setDiseaseDescription] = useState('');
  const [timeOptions, setTimeOptions] = useState([]);

  const isDateDisabled = (date) => {
    const vietnamDate = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
    const yesterday = new Date(vietnamDate);
    yesterday.setDate(vietnamDate.getDate() - 1);
    return date <= yesterday;
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const newDate = new Date(selectedDate);
      newDate.setDate(selectedDate.getDate() + 1);

      const vietnamTimezoneOptions = { timeZone: 'Asia/Ho_Chi_Minh' };
      const vietnamISOString = newDate.toISOString();

      const response = await axios.post('/patient/booked', {
        date: vietnamISOString.split('T')[0],
        timeOfDay,
        diseaseDescription,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("testtt", vietnamISOString.split('T')[0])
      console.log('API Response:', response.data);
      window.alert('Record added successfully!');

      setSelectedDate(new Date());
      setTimeOfDay('');
      setDiseaseDescription('');
    } catch (error) {
      window.alert('Error submitting form. Please try again.');
      console.error('Error submitting form:', error);
    }
  };

  useEffect(() => {
    const fetchUpdatedTimeOptions = async () => {
      try {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + 1);

        const vietnamTimezoneOptions = { timeZone: 'Asia/Ho_Chi_Minh' };
        const vietnamISOString = newDate.toISOString();
        const vietnamDate = new Date(vietnamISOString);

        const response = await axios.get('/patient/time', {
          params: { date: vietnamDate.toISOString().split('T')[0] },
        });

        console.log("test",vietnamDate.toISOString().split('T')[0] )
        const bookedTimes = response.data.map((item) => item.booked_time);

        const listTime = [
          '8:00', '9:00', '10:00', '13:00', '14:00', '15:00', '16:00',
        ];

        const result = listTime.filter((item) => !bookedTimes.includes(item));
        setTimeOptions(result);
      } catch (error) {
        console.error('Error fetching updated time options:', error);
      }
    };

    if (selectedDate) {
      fetchUpdatedTimeOptions();
    }
  }, [selectedDate]);

  console.log("timeoption", timeOptions);

 
  return (
    <div>
      <Header />
      <div style={{ display: 'flex', overflowY: 'auto', width: '100%', flexWrap: 'wrap' }}>
        <div style={{ width: '25%', marginBottom: '20px' }}>
          <PatientSidebar />
        </div>
        <div style={{ height: '100vh', overflow: 'scroll', width: '70%' }}>
          <div style={{ padding: "30px" }}>
            <h2 style={{ color: '#333', marginBottom: '20px', borderRadius:"10px", fontWeight: "800", textAlign:"center" }}>Appointment Registration</h2>
            <form onSubmit={handleSubmit} style={{backgroundColor: "#e0dede", padding: "30px", textAlign: "center"}}>
              <div style={{ display: 'flex', marginBottom: '20px' }}>
                <div style={{ marginRight: '20px', width: '50%', margin: '0 auto' }}>
                  <label htmlFor="date" style={{ marginRight: '10px', color: '#555', fontWeight: "600"  }}>Date:</label>
                  <Calendar
                    onChange={handleDateChange}
                    value={selectedDate}
                    className="custom-calendar-style"
                    tileDisabled={({ date }) => isDateDisabled(date)}
                  />
                </div>
                <div style={{ width: '50%' }}>
                  <label htmlFor="timeOfDay" style={{ marginRight: '10px', color: '#555', fontWeight: "600" }}>Time of Day:</label>
                  <table style={{ margin: '0 auto' }}>
                    <tbody>
                      {timeOptions.map((timeOption, index) => (
                        <tr key={index}>
                          <td
                            style={{
                              cursor: 'pointer',
                              padding: '10px',
                              border: `1px solid ${timeOfDay === timeOption ? 'blue' : '#ddd'}`,
                              backgroundColor: timeOfDay === timeOption ? '#e6f7ff' : 'white',
                              borderRadius: '5px',
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
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label htmlFor="diseaseDescription" style={{ marginRight: '10px', color: '#555' , fontWeight: "600"  }}>Disease Description:</label>
                <textarea
                  id="diseaseDescription"
                  value={diseaseDescription}
                  onChange={(e) => setDiseaseDescription(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                />
              </div>
              <div>
                <button type="submit" style={{ padding: '10px', backgroundColor: '#f7c485', color: '#000', borderRadius: '5px', cursor: 'pointer' }}>Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};


export default PatientAppointment;
