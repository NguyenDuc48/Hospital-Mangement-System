const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const doctor = express.Router();

const db = require('../../../utils/db');

process.env.SECRET_KEY = 'Arijit';

doctor.get('/waiting_list', (req,res) => {
    let doctor_id = jwt.verify(req.headers['authorization'].replace('Bearer ', ''), process.env.SECRET_KEY)
    
    const find_department = `SELECT department FROM doctors WHERE doctor_id = "${doctor_id.userId}"`

    db.query(find_department, (err0, result0) => {
        if (err0) console.log(err0)
        console.log(result0)
        const department = result0[0].department

        const get_in_progress = `SELECT p.full_name, wl.priority, wl.doctor_id
                             FROM wait_list wl JOIN patient p ON p.patient_id = wl.patient_id 
                             WHERE wl.doctor_id = "${doctor_id.userId}"`

        db.query(get_in_progress, (err, result) => {
            if (err) console.log(err);

            const get_priority = `SELECT DISTINCT p.full_name, wl.priority, wl.doctor_id
                                FROM wait_list wl JOIN patient p ON p.patient_id = wl.patient_id 
                                WHERE wl.priority = "yes" AND wl.status = "waiting" AND department_id = "${department}"`

            db.query(get_priority, (err1, result1) => {
                if (err1) console.log(err1);

                const get_non_priority = `SELECT DISTINCT p.full_name, wl.priority, wl.doctor_id
                                        FROM wait_list wl JOIN patient p ON p.patient_id = wl.patient_id 
                                        WHERE wl.priority = "no" AND wl.status = "waiting" AND department_id = "${department}"`

                db.query(get_non_priority, (err2, result2) => {
                    if (err2) console.log(err2)
                    res.send([result, result1, result2]);
                })
            })
        });
    })
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
    let wait_id = req.body.wait_id
    let call = `UPDATE wait_list
                SET status = "in progress"
                WHERE wait_id = "${wait_id.wait_id}"`

    db.query(call, (err, result) => {
        if (err) console.log(err);
        res.send("Updated successfully");
    });
})

doctor.put('/completed_examination_patient', (req, res) => {
    let wait_id = req.body.wait_id
    let call = `UPDATE wait_list
                SET status = "paying"
                WHERE wait_id = "${wait_id}"`

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

doctor.post('/create', (req, res) => {
    let create_bill = `INSERT INTO total_bills (service_bill_id, medicine_bill_id, equipment_bill_id, total_bill_raw) 
                       VALUES (NULL, NULL, NULL, NULL)`;

    db.query(create_bill, (err2, result2) => {
        if (err2) console.log(err2);
        res.send(result2);

        const time = new Date();
        const current_time = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`
        const current_date = `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`

        let create_medic_report = `INSERT INTO medical_reports 
                                       (report_id, 
                                        patient_id, 
                                        doctor_id, 
                                        diagnostic, 
                                        conclusion, 
                                        note, 
                                        booking_time, 
                                        appointment_date, 
                                        bill_id, 
                                        money_need_to_pay)  
                                   VALUES (NULL, 
                                           "${id.patient_id}", 
                                           "${id.doctor_id}", 
                                           NULL, 
                                           NULL, 
                                           NULL, 
                                           "${current_time}", 
                                           "${current_date}", 
                                           (SELECT total_bill_id 
                                            FROM total_bills 
                                            ORDER BY total_bill_id DESC LIMIT 1), 
                                           0)`
                        
        db.query(create_medic_report, (err3, result3) => {
            if (err3) console.log(err3);
        })
    });

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
