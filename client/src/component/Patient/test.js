import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import PatientSidebar from './PatientSidebar';
import { MDBContainer, MDBCol, MDBBtn, MDBInput } from 'mdbreact';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const PatientAppointment = () => {
  const [date, setDate] = useState(new Date());
  const [timeOfDay, setTimeOfDay] = useState('');
  const [diseaseDescription, setDiseaseDescription] = useState('');
  const [timeOptions, setTimeOptions] = useState([]);

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;

    return `${year}-${formattedMonth}-${formattedDay}`;
  };

  const currentDate = getCurrentDate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const formattedDate = date.toISOString().split('T')[0];

      const response = await axios.post('/patient/booked', {
        date: formattedDate,
        timeOfDay,
        diseaseDescription,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('API Response:', response.data);
      window.alert('Record added successfully!');

      setDate('');
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
        const response = await axios.get('/patient/time', {
          params: { date },
        });
  
        const bookedTimes = response.data.map(item => item.booked_time);
        const listTime = ["8:00", "9:00", "10:00", "13:00", "14:00", "15:00", "16:00"];
  
        // Include all time options in the state, not just available ones
        const allTimeOptions = listTime.map(time => ({
          time,
          available: !bookedTimes.includes(time),
        }));
  
        // Update the state with all time options
        setTimeOptions(allTimeOptions);
      } catch (error) {
        console.error('Error fetching updated time options:', error);
      }
    };
  
    if (date) {
      fetchUpdatedTimeOptions();
    }
  }, [date]);
  


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
          <MDBCol md="8">
            <div>
              <h2>Appointment Registration</h2>
              <form onSubmit={handleSubmit}>
                <div className="grey-text">
                  <label>Date:</label>
                  <br />
                  <Calendar
                    onChange={(newDate) => setDate(newDate)}
                    value={date}
                    minDate={new Date()}
                  />
                  <br />
                  <label>Available Time Slots:</label>
                  <table>
                    <tbody>
                                          {timeOptions.map((timeOption, index) => (
                        <tr key={index}>
                          <td
                            style={{
                              cursor: timeOption.available ? 'pointer' : 'not-allowed',
                              padding: '10px',
                              border: `1px solid ${timeOfDay === timeOption.time ? 'blue' : 'black'}`,
                              backgroundColor: timeOfDay === timeOption.time ? 'lightblue' : 'white',
                            }}
                            onClick={() => timeOption.available && setTimeOfDay(timeOption.time)}
                          >
                            {timeOption.time}
                          </td>
                        </tr>
                      ))}

                    </tbody>
                  </table>
                  <br />
                  <label htmlFor="diseaseDescription">Disease Description:</label>
                  <textarea
                    id="diseaseDescription"
                    className="form-control"
                    value={diseaseDescription}
                    onChange={(e) => setDiseaseDescription(e.target.value)}
                    required
                  />
                </div>
                <div className="text-center">
                  <MDBBtn color="primary" type="submit">
                    Submit
                  </MDBBtn>
                </div>
              </form>
            </div>
          </MDBCol>
        </div>
      </div>
    </div>
  );
};

export default PatientAppointment;

