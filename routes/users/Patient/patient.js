const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const patient = express.Router();

const db = require('../../../utils/db');

process.env.SECRET_KEY = 'Arijit';

patient.post('/add_patient', (req, res) => {
    const phone_number = req.body.phone_number;

    // Check if the username (phone_number) already exists in credentials
    let find = `SELECT username FROM credentials WHERE username = "${req.body.phone_number}"`;
    console.log(find)
    db.query(find, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, error: 'Internal Server Error' });
        }

        if (result.length === 0) {
            // The username (phone_number) doesn't exist, proceed with creating the patient and credentials
            let pat_id = '';

            // Get the last patient_id from the database
            let find_idx = 'SELECT * FROM patient ORDER BY patient_id DESC LIMIT 1';
            db.query(find_idx, (err1, result1) => {
                if (err1) {
                    console.error(err1);
                    return res.status(500).json({ success: false, error: 'Internal Server Error' });
                }

                if (result1.length > 0) {
                    let last_id = result1[0].patient_id.substring(2);
                    let idx = parseInt(last_id, 10);
                    pat_id = 'BN' + String(idx + 1).padStart(3, '0');
                } else {
                    pat_id = 'BN001';
                }

                const patientData = {
                    patient_id: pat_id,
                    full_name: req.body.full_name,
                    dob: req.body.dob,
                    gender: req.body.gender,
                    phone_number: req.body.phone_number,
                    address: req.body.address,
                    email: req.body.email,
                    password: req.body.password,
                };

                bcrypt.hash(req.body.password, 10, (err2, hash) => {
                    if (err2) {
                        console.error(err2);
                        return res.status(500).json({ success: false, error: 'Internal Server Error' });
                    }

                    patientData.password = hash;
                    let create_account = `INSERT INTO credentials (username, password, id) 
                    VALUES ("${patientData.phone_number}",
                            "${patientData.password}",
                            "${patientData.patient_id}")`;


                    db.query(create_account, (err3, result3) => {
                        if (err3) {
                            console.error(err3);
                            return res.status(500).json({ success: false, error: 'Internal Server Error' });
                        }

                        let create = `INSERT INTO patient (
                            patient_id,
                            full_name,
                            dob,
                            gender,
                            phone_number,
                            address,
                            email,
                            health_insurance_percent
                        ) VALUES (
                            "${patientData.patient_id}",
                            "${patientData.full_name}",
                            "${patientData.dob}",
                            "${patientData.gender}",
                            "${patientData.phone_number}",
                            "${patientData.address}",
                            "${patientData.email}",
                            0
                        )`;

                        db.query(create, (err4, result4) => {
                            if (err4) {
                                console.error(err4);
                                return res.status(500).json({ success: false, error: 'Internal Server Error' });
                            }

                            return res.status(200).json({ success: true, message: 'Patient added successfully' });
                        });
                    });
                });
            });
        } else {
            // The username (phone_number) already exists, send an appropriate response
            return res.status(400).json({ success: false, error: 'Username already exists' });
        }
    });
});

patient.get('/profile', (req, res) => {
    let patient_id = jwt.verify(req.headers['authorization'].replace('Bearer ', ''), process.env.SECRET_KEY);
    
    let patient = `SELECT * FROM patient WHERE patient_id = "${patient_id.userId}"`;
    db.query(patient, (err, result) => {
        if (err) console.log(err);
        res.send(result);
    });
});

patient.put('/update_profile', (req, res) => {
    let patient_id = jwt.verify(req.headers['authorization'].replace('Bearer ', ''), process.env.SECRET_KEY);
    const updatedData = {
        full_name       : req.body.full_name,
        dob             : req.body.dob,
        gender          : req.body.gender,
        phone_number    : req.body.phone_number,
        address         : req.body.address,
        email           : req.body.email
    };

    let updateQuery = `UPDATE patient
                       SET full_name    = "${updatedData.full_name}",
                           dob          = "${updatedData.dob}",
                           gender       = "${updatedData.gender}",
                           phone_number = "${updatedData.phone_number}",
                           address      = "${updatedData.address}",
                           email        = "${updatedData.email}"
                       WHERE patient_id = "${patient_id.userId}"`;

    db.query(updateQuery, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: 'Error updating patient information' });
        } else {
            res.json({ success: true, message: 'Patient information updated successfully' });
        }
    });

    // let updateQuery_1 = `UPDATE credentials
    //                     SET username = "${updatedData.phone_number}"
    //                     WHERE id = "${patient_id.userId}"`;

    // db.query(updateQuery_1, (err, result) => {
    //     if (err) {
    //         console.log(err);
    //         res.status(500).json({ error: 'Error updating patient information' });
    //     } else {
    //         res.json({ success: true, message: 'Patient information updated successfully' });
    //     }
    // });
});

patient.get('/history', (req, res) => {
    let patient_id = jwt.verify(req.headers['authorization'].replace('Bearer ', ''), process.env.SECRET_KEY);

    let get_medic_reports = `SELECT * FROM medical_reports WHERE patient_id = "${patient_id.userId}"`

    db.query(get_medic_reports, (err, result) => {
        if (err) console.log(err);
        res.send(result);
    });
})

patient.get('/doctor', (req, res) => {
    let patient_id = jwt.verify(req.headers['authorization'].replace('Bearer ', ''), process.env.SECRET_KEY);

    let patient =  `SELECT 
                        d.first_name as doctor_firstname,
                        d.last_name doctor_lastname,
                        d.specialisation 
                    FROM assign_doctor ad
                    JOIN patient p
                        ON p.patient_id = ad.patient_id
                    JOIN doctors d
                        ON ad.doctor_id = d.doctor_id
                    WHERE p.patient_id = ${patient_id}`;
    db.query(patient, (err, result) => {
        if (err) console.log(err);
        // console.log(patient_id, result);
        res.send(result);
    });
})

// patient.post('/make_appointment', (req, res) => {
//     let patient_id = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);

//     let add_appointment = `INSERT INTO `
// })

// patient.get('/bill', (req, res) => {
//     let patient_id = jwt.verify(req.headers['authorization'].replace('Bearer ', ''), process.env.SECRET_KEY);

//     const bill = `SELECT * FROM bill WHERE patient_id = ${patient_id.userId}`;

//     db.query(bill, (err, result) => {
//         res.send(result);
//     })
// })



patient.get('/time', (req, res) => {
    // let patient_id = jwt.verify(req.headers['authorization'].replace('Bearer ', ''), process.env.SECRET_KEY);
    const date = req.query.date;
    // console.log("date:", date)
    let patient =  `SELECT booked_time
    FROM booked
    WHERE booked_date = "${date}"
    GROUP BY booked_time
    HAVING COUNT(*) >= 4`;
    db.query(patient, (err, result) => {
        if (err) console.log(err);
        console.log("result:", result);
        res.send(result);
    });
})


patient.post('/booked', (req, res) => {
    try {
      let data_token = jwt.verify(req.headers['authorization'].replace('Bearer ', ''), process.env.SECRET_KEY);
        // console.log("id benh nhan:", data_token.userId)
      const { date, timeOfDay, diseaseDescription } = req.body;
 
      // SQL query to insert data into the "booked" table
    //   const insertQuery = `INSERT INTO `booked` (`patient_id`, `booked_date`, `booked_time`, `description`) VALUES (`${}`, '2024-01-15', '11:00', 'a')`;
      let create_booked = `INSERT INTO booked (patient_id, booked_date,booked_time, description) VALUES ("${data_token.userId}", "${date}", "${timeOfDay}", "${diseaseDescription}")`;
      // Execute the query with the received data
      db.query(create_booked, (err3, result3) => {
        if(err3) console.log(err3);
        else
        res.send("Created booked!");
    })
    } catch (error) {
      console.error('Error handling request:', error);
      res.status(500).json({ success: false, message: 'Error handling request.' });
    }
  });



module.exports = patient;
