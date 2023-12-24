const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const doctor = express.Router();

const db = require('../../../utils/db');

process.env.SECRET_KEY = 'Arijit';

// Personal profile management
//  View the patient's medical history

//  Update reports for patients

//  View patient appointments
doctor.get('/patient', (req,res) => {
    let doctor_id = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
    
    const get_wait_list = `SELECT p.full_name
                FROM patient p JOIN medical_reports mr ON p.patient_id = mr.patient_id
                WHERE mr.doctor_id = "${doctor_id.doctor_id}"`

    db.query(get_wait_list, (err, result) => {
        if (err) console.log(err);
        console.log("OK");
    });
})

doctor.get('/profile', (req, res) => {
    let doctor_id = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
    
    let user = `SELECT * FROM doctors JOIN employees ON doctors.doctor_id = employees.employee_id 
                WHERE doctor_id = "${doctor_id.doctor_id}"`;
    db.query(user, (err, result) => {
        if (err) console.log(err);
        res.send(result);
    });
});

doctor.post('/delete', (req, res) => {
    const find = `SELECT * FROM doctors WHERE doctor_id = ${req.body.doctor_id}`;
    let del =  `DELETE FROM doctors WHERE doctor_id = ${req.body.doctor_id}`

    db.query(find, (err1, result1) => {
        if(err1) console.log(err1);

        if(result1[0] != undefined) {
            db.query(del, (err2, result2) => {
                res.send('DELETED');
            })
        }
    })
});

doctor.put('/update_doctor', (req, res) => {
    // let employee_id = req.body.employee_id;
    const updatedData = {
        expertise: req.body.expertise,
        department: req.body.department
    };

    let updateQuery = `UPDATE doctor
                       SET expertise = "${updatedData.expertise}",
                           department = "${updatedData.department}",
                           email = "${updatedData.email}",
                       WHERE doctor_id = "${doctor_id}"`;

    db.query(updateQuery, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: 'Error updating employee information' });
        } else {
            res.json({ success: true, message: 'Employee information updated successfully' });
        }
    });
});

doctor.post('/update_sal', (req, res) => {
    const find = `SELECT * FROM doctors WHERE doctor_id = ${req.body.doctor_id}`;
    const upd = `UPDATE doctors 
                    SET salary =" ${req.body.salary}"
                    WHERE doctor_id = ${req.body.doctor_id}`;

    db.query(find, (err1, result1) => {
        if(err1) console.log(err1);

        if(result1[0] != undefined) {
            db.query(upd, (err2, result2) => {
                res.send('UPDATED');
            })
        }
    })
})

module.exports = doctor;
