const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const doctor = express.Router();
const nurse = express.Router();

const db = require('../../../utils/db');

process.env.SECRET_KEY = 'Arijit';

doctor.get('/get_doctor', (req, res) => {
    const sql = "SELECT * FROM doctors JOIN employees ON doctors.doctor_id = employees.employee_id";

    db.query(sql, (err, result) => {
        if(err) console.log(err);
        console.log(result)
        res.json(result);
    });
});

doctor.post('/add_doctor', (req, res) => {
    const doctorData = {
        first_name  : req.body.first_name,
        middle_name : req.body.middle_name,
        last_name   : req.body.last_name,
        gender      : req.body.gender,
        address     : req.body.address,
        email       : req.body.email,
        phone_number: req.body.phone_number,
        dob         : req.body.dob,
        password    : req.body.password
    };

    let find = `SELECT * FROM doctors WHERE email = "${doctorData.email}"`;

    db.query(find, (err1, result1) => {
        if(err1) {
            console.log(err1);
            res.status(500).json({ error: 'Error checking for existing doctor' });
        }

        if(result1.length === 0) {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                doctorData.password = hash;

                let createEmployee = `INSERT INTO employees (
                    first_name,
                    middle_name,
                    last_name, 
                    gender,
                    address,
                    email, 
                    phone_number,
                    dob)
                    VALUES ("${doctorData.first_name}", 
                            "${doctorData.middle_name}", 
                            "${doctorData.last_name}", 
                            "${doctorData.gender}",
                            "${doctorData.address}",
                            "${doctorData.email}",
                            "${doctorData.phone_number}",
                            "${doctorData.dob}")`;

                db.query(createEmployee, (err2, result2) => {
                    if(err2) {
                        console.log(err2);
                        res.status(500).json({ error: 'Error creating employee' });
                    }

                    let employee_id = result2.insertId;

                    let createDoctor = `INSERT INTO doctors (
                        doctor_id,
                        expertise,
                        department)
                        VALUES ("${employee_id}",
                                "${req.body.expertise}",
                                "${req.body.department}")`;

                    let createCredentials = `INSERT INTO credentials (
                        username,
                        password,
                        id)
                        VALUES (CONCAT_WS(' ', "${doctorData.first_name}", "${doctorData.middle_name}", "${doctorData.last_name}"),
                                "${doctorData.password}",
                                "${employee_id}")`;

                    db.query(createDoctor, createCredentials, (err3, result3) => {
                        if(err3) {
                            console.log(err3);
                            res.status(500).json({ error: 'Error creating doctor' });
                        }

                        res.json({ success: true, message: 'Doctor created successfully' });
                    });
                });
            });
        } else {
            res.status(400).json({ error: 'Doctor already exists' });
        }
    });
});

doctor.put('/update_doctor', (req, res) => {
    const doctor_id = req.body.doctor_id;

    const updatedData = {
        expertise: req.body.expertise,
        department: req.body.department,
        email: req.body.email
    };

    let updateQuery = `UPDATE doctors
                       SET expertise = "${updatedData.expertise}",
                           department = "${updatedData.department}",
                           email = "${updatedData.email}"
                       WHERE doctor_id = "${doctor_id}"`;

    db.query(updateQuery, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: 'Error updating doctor information' });
        } else {
            res.json({ success: true, message: 'Doctor information updated successfully' });
        }
    });
});

doctor.delete('/delete_doctor', (req, res) => {
    const doctor_id = req.body.doctor_id;

    let deleteDoctor = `DELETE FROM doctors 
                         WHERE doctor_id = "${doctor_id}"`;

    let deleteEmployee = `DELETE FROM employees 
                          WHERE employee_id = "${doctor_id}"`;

    db.query(deleteDoctor, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: 'Error deleting doctor information' });
        } else {
            db.query(deleteEmployee, (err2, result2) => {
                if (err2) {
                    console.log(err2);
                    res.status(500).json({ error: 'Error deleting associated employee information' });
                } else {
                    res.json({ success: true, message: 'Doctor information deleted successfully' });
                }
            });
        }
    });
});

module.exports = doctor;