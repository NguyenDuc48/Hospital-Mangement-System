const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const patient = express.Router();

const db = require('../../../utils/db');

process.env.SECRET_KEY = 'Arijit';

patient.post('/add_patient', (req, res) => {
    var idx = 0;
    var pat_id = ""
    let find_idx = 'SELECT * FROM patient ORDER BY patient_id DESC LIMIT 1';
    db.query(find_idx, (err, result) => {
        last_id = result[0].patient_id.substring(2); //BN006 -> 006
        idx = parseInt(last_id, 10) //006 -> 6
        pat_id = "BN" + String(idx+1).padStart(3,'0') //idx + 1 = 7 ; padStart(3,'0') -> 007 ; "BN" + "007" = "BN007"
    });

    let find = `SELECT patient_id FROM patient WHERE patient_id = "${pat_id}"`;

    db.query(find, (err1, result1) => {
        const patientData = {
            patient_id  : pat_id,
            full_name   : req.body.full_name,
            dob         : req.body.dob,
            gender      : req.body.gender,
            phone_number: req.body.phone_number,
            address     : req.body.address,
            email       : req.body.email,
            password    : req.body.password
    }
        if(err1) console.log(err1);
        if (result1[0] == undefined) { 
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                patientData.password = hash; 
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
                
                db.query(create, (err2, result2) => {
                    if(err2) console.log(err2);
                })

                let create_account = `INSERT INTO credentials (username, password, id) 
                                        VALUES ("${patientData.phone_number}",
                                                "${patientData.password}",
                                                "${patientData.patient_id}")`;

                db.query(create_account, (err3, result3) => {
                    if(err3) console.log(err3);
                    res.send("Created Database ooooooooooooohhhhhh");
                })
            });
        } else {
            res.send("patient already exist...");
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


module.exports = patient;
