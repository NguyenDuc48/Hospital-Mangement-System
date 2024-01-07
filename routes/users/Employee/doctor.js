const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const doctor = express.Router();

const db = require('../../../utils/db');

process.env.SECRET_KEY = 'Arijit';

doctor.get('/waiting_list', (req,res) => {
    let doctor_id = jwt.verify(req.headers['authorization'].replace('Bearer ', ''), process.env.SECRET_KEY)
    
    const get_priority = `SELECT DISTINCT wl.wait_id, p.full_name, wl.priority
                          FROM wait_list wl JOIN medical_reports mr ON wl.patient_id = mr.patient_id
                                            JOIN patient p ON p.patient_id = wl.patient_id 
                          WHERE mr.doctor_id = "${doctor_id.userId}" AND wl.priority = "yes" AND wl.status = "waiting" AND wl.status = "in progress"`

    db.query(get_priority, (err, result) => {
        if (err) console.log(err);

        const get_non_priority = `SELECT DISTINCT wl.wait_id, p.full_name, wl.priority
                                  FROM wait_list wl JOIN medical_reports mr ON wl.patient_id = mr.patient_id
                                                    JOIN patient p ON p.patient_id = wl.patient_id 
                                  WHERE mr.doctor_id = "${doctor_id.userId}" AND wl.priority = "no" AND wl.status = "waiting" AND wl.status = "in progress"`

        db.query(get_non_priority, (err1, result1) => {
            if (err1) console.log(err1);
            res.send([result, result1]);
        })
    });
})

// Personal profile management
doctor.get('/profile', (req, res) => {
    let doctor_id = jwt.verify(req.headers['authorization'].replace('Bearer ', ''), process.env.SECRET_KEY)
    
    let user = `SELECT * FROM doctors JOIN employees ON doctors.doctor_id = employees.employee_id 
                WHERE doctor_id = "${doctor_id.userId}"`;
    db.query(user, (err, result) => {
        if (err) console.log(err);
        res.send(result);
    });
});

doctor.put('/update_me', (req, res) => {
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

doctor.put('/call_patient', (req, res) => {
    let wait_id = jwt.verify(req.headers['authorization'].replace('Bearer ', ''), process.env.SECRET_KEY)
    let call = `UPDATE wait_list
                SET status = "in progress"
                WHERE wait_id = "${wait_id.wait_id}"`

    db.query(call, (err, result) => {
        if (err) console.log(err);
        res.send("Updated successfully");
    });
})

doctor.put('/completed_examination_patient', (req, res) => {
    let wait_id = jwt.verify(req.headers['authorization'].replace('Bearer ', ''), process.env.SECRET_KEY)
    let call = `UPDATE wait_list
                SET status = "paying"
                WHERE wait_id = "${wait_id.wait_id}"`

    db.query(call, (err, result) => {
        if (err) console.log(err);
        res.send("Updated successfully");
    });
})

//  Update reports for patients
doctor.put('/update_report', (req, res) => {
    const report = {
        diagnostic  : req.body.diagnostic,
        conclusion  : req.body.conclusion,
        note        : req.body.note,
        report_id   : req.body.report_id
    }

    let update = `UPDATE medical_reports
                  SET diagnostic = "${report.diagnostic}",
                      conclusion = "${report.conclusion}",
                      note = "${report.note}"
                  WHERE report_id = "${report.report_id}"`

    db.query(update, (err, result) => {
        if (err) console.log(err);
        res.send("Updated successfully");
    });
})

doctor.post('/create_bill', (req, res) => {
    let create_bill = `INSERT INTO total_bills (service_bill_id, medicine_bill_id, equipment_bill_id, total_bill_raw) 
                       VALUES (NULL, NULL, NULL, NULL)`;

    db.query(create_bill, (err, result) => {
        if (err) console.log(err);
        res.send("Created successfully");
    });
})

doctor.post('/add_services', (req, res) => {
    let total_bill_id = req.body.total_bill_id
    let add_services = `INSERT INTO service_bills(total_service_bill) 
                        VALUES (0)`;

    db.query(add_services, (err, result) => {
        if (err) console.log(err);

        put_total_bill = `UPDATE total_bills
                          SET services_bill_id = service_bills.service_bill_id
                          WHERE total_bill_id = "${total_bill_id}"`

        db.query(create_bill, (err2, result2) => {
            if (err2) console.log(err2);
            res.send("Created successfully");
        });
    });
})

module.exports = doctor;
