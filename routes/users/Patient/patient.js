const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const patient = express.Router();

const db = require('../../../utils/db');

process.env.SECRET_KEY = 'Arijit';

patient.post('/add_patient', (req, res) => {

    const patientData = {
        patient_id  : req.body.patient_id,
        full_name   : req.body.full_name,
        dob         : req.body.dob,
        gender      : req.body.gender,
        phone_number: req.body.phone_number,
        address     : req.body.address,
        email       : req.body.email,
        password    : req.body.password
    }

    let find = `SELECT * FROM patient WHERE patient_id = "${patientData.patient_id}"`;

    db.query(find, (err1, result1) => {
        if(err1) console.log(err1);
        //console.log(result1[0]);

        if(result1[0] == undefined) {  
            let create = `INSERT INTO patient (
                    patient_id,
                    full_name,
                    dob,
                    gender,
                    phone_number,
                    address,
                    email)
                              VALUES ( "${patientData.patient_id}", 
                                       "${patientData.full_name}",
                                       "${patientData.dob}",
                                       "${patientData.gender}",
                                       "${patientData.phone_number}",
                                       "${patientData.address}",
                                       "${patientData.email}")`;
            db.query(create, (err2, result2) => {
                if(err2) console.log(err2);
                
            })

            let create_account = `INSERT INTO credentials (username, password, id) 
                                    VALUES ("${patientData.full_name}",
                                            "${patientData.password}",
                                            "${patientData.patient_id}")`;

            db.query(create_account, (err3, result3) => {
                if(err3) console.log(err3);
                res.send("Created Database ooooooooooooohhhhhh");
            })
        }else {
            res.send("user already exist...");
        }
    });
});

patient.post('/login', (req, res) => {
    let find = `SELECT password, patient_id FROM patient WHERE email = "${req.body.email}"`;
    
    db.query(find, (err, result) => {
        if(err) console.log(err);
        // console.log(result);

        if(result[0] != undefined) {
            if(bcrypt.compareSync(req.body.password, result[0].password)) {
                let token = jwt.sign(result[0].patient_id, process.env.SECRET_KEY);
                res.send(token);
            } else {
                res.status(400).json({ error: 'User does not exist' })
            }
        } else {
            res.send("Email not found");
        }
    });
});

patient.get('/profile', (req, res) => {
    let patient_id = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
    
    let patient = `SELECT * FROM patient WHERE patient_id = ${patient_id}`;
    db.query(patient, (err, result) => {
        if (err) console.log(err);
        res.send(result);
    });
});

patient.put('/update', (req, res) => {
    // let patient_id = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
    let patient_id = req.body.patient_id;
    const updatedData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        address: req.body.address,
        email: req.body.email,
        phone_no: req.body.phone_no,
        disease: req.body.disease
    };

    let updateQuery = `UPDATE patient
                       SET first_name = "${updatedData.first_name}",
                           last_name = "${updatedData.last_name}",
                           address = "${updatedData.address}",
                           email = "${updatedData.email}",
                           phone_no = "${updatedData.phone_no}",
                           disease = "${updatedData.disease}"
                       WHERE patient_id = "${patient_id}"`;

    db.query(updateQuery, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: 'Error updating patient information' });
        } else {
            res.json({ success: true, message: 'Patient information' });
        }
    });

      



});

patient.get('/details', (req, res) => {
    let patient_id = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);

    let patient =  `SELECT 
                        *                        
                    FROM patient
                    WHERE patient_id = ${patient_id}`;
    db.query(patient, (err, result) => {
        if (err) console.log(err);
        // console.log(patient_id, result);
        res.send(result);
    });
});

patient.get('/doctor', (req, res) => {
    let patient_id = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);

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

patient.get('/bill', (req, res) => {
    let patient_id = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);

    const bill = `SELECT * FROM bill WHERE patient_id = ${patient_id}`;

    db.query(bill, (err, result) => {
        res.send(result);
    })
})


module.exports = patient;
