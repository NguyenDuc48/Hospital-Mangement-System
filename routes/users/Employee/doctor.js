const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const doctor = express.Router();

const db = require('../../../utils/db');

process.env.SECRET_KEY = 'Arijit';

doctor.get('/waiting_list', (req,res) => {
    let doctor_id = jwt.verify(req.headers['authorization'].replace('Bearer ', ''), process.env.SECRET_KEY)
    
    const get_priority = `SELECT wl.wait_id, p.full_name
                          FROM wait_list wl JOIN medical_reports mr ON wl.patient_id = mr.patient_id
                                            JOIN patient p ON p.patient_id = wl.patient_id 
                          WHERE mr.doctor_id = "${doctor_id.userId}" AND wl.priority = "yes"`

    db.query(get_priority, (err, result) => {
        if (err) console.log(err);

        const get_non_priority = `SELECT wl.wait_id, p.full_name
                                  FROM wait_list wl JOIN medical_reports mr ON wl.patient_id = mr.patient_id
                                                    JOIN patient p ON p.patient_id = wl.patient_id 
                                  WHERE mr.doctor_id = "${doctor_id.userId}" AND wl.priority = "no"`

        db.query(get_non_priority, (err1, result1) => {
            if (err1) console.log(err1);
            res.send([result, result1]);
        })
    });
})

doctor.get('/profile', (req, res) => {
    let doctor_id = jwt.verify(req.headers['authorization'].replace('Bearer ', ''), process.env.SECRET_KEY)
    
    let user = `SELECT * FROM doctors JOIN employees ON doctors.doctor_id = employees.employee_id 
                WHERE doctor_id = "${doctor_id.userId}"`;
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

doctor.put('/update_me', (req, res) => {
    // let employee_id = req.body.employee_id;
    let employee_id = jwt.verify(req.headers['authorization'].replace('Bearer ', ''), process.env.SECRET_KEY)
    const updatedData = {
        full_name : req.body.full_name,
        dob : req.body.dob,
        gender : req.body.gender,
        phone_number : req.body.phone_number,
        email : req.body.email,
        address : req.body.address
    };

    let updateQuery = `UPDATE employees
                       SET full_name = "${updatedData.full_name}",
                           dob = "${updatedData.dob}",
                           gender = "${updatedData.gender}",
                           phone_number = "${updatedData.phone_number}",
                           email = "${updatedData.email}",
                           address = "${updatedData.address}"
                       WHERE employee_id = "${employee_id.userId}"`;

    db.query(updateQuery, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: 'Error updating information' });
        } else {
            res.json({ success: true, message: 'Information updated successfully' });
        }
    });
});

module.exports = doctor;
