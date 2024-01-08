const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nurse = express.Router();

const db = require('../../../utils/db');

process.env.SECRET_KEY = 'Arijit';

//  Manage examination schedules

nurse.get('/profile', (req, res) => {
    let nurse_id = jwt.verify(req.headers['authorization'].replace('Bearer ', ''), process.env.SECRET_KEY);

    let user = `SELECT * FROM nurses JOIN employees ON nurses.nurse_id = employees.employee_id 
                WHERE nurse_id = "${nurse_id.userId}"`;
    db.query(user, (err, result) => {
        if (err) console.log(err);
        res.send(result);
    });
});

nurse.put('/update_me', (req, res) => {
    // let employee_id = req.body.employee_id;
    let employee_id = jwt.verify(req.headers['authorization'].replace('Bearer ', ''), process.env.SECRET_KEY);
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

nurse.put('/update_health_insurance', (req, res) => {
    const insurance_info = {
        patient_id : req.body.patient_id,
        health_insurance_percent : req.body.health_insurance_percent
    }

    let update = `UPDATE patient
                  SET health_insurance_percent = "${insurance_info.health_insurance_percent}"
                  WHERE patient_id = "${insurance_info.patient_id}"`

    db.query(update, (err, result) => {
        if (err) console.log(err);
        console.log("OK")
    });
    console.log("OK x 2")
})

nurse.get("/invoices", (req, res) => {
    let list = `SELECT p.patient_id, p.full_name, mr.doctor_id, tb.* 
                FROM patient p JOIN medical_reports mr ON p.patient_id = mr.patient_id
                               JOIN total_bills tb ON mr.bill_id = tb.total_bill_id;`;

    db.query(list, (err, result) => {
        if (err) console.log(err);
        res.send(result);
    })
})

nurse.get('/waiting_list', (req,res) => {  
    let get_list = `SELECT DISTINCT wl.wait_id, p.full_name, wl.money_need_to_pay
                      FROM wait_list wl JOIN medical_reports mr ON wl.patient_id = mr.patient_id
                                        JOIN patient p ON p.patient_id = wl.patient_id 
                      WHERE wl.status = "paying"`

    db.query(get_list, (err, result) => {
        if (err) console.log(err);
        res.send(result)
    });
})

nurse.put('/pay', (req, res) => {
    const wait_id = req.body.wait_id
    
    let paid = `UPDATE wait_list
                SET status = "paid"
                WHERE wait_id = "${wait_id}"`

    db.query(paid, (err, result) => {
        if (err) console.log(err);
        res.send("Payment success")
    });
})

nurse.get('/all_patient', (req, res) => {
    let patients = `SELECT * FROM patient`
    
    db.query(patients, (err, result) => {
        if (err) console.log(err);
        res.send(result)
    });
})

nurse.get("/all_patient/search", (req, res) => {
    const input = req.body.input;

    let search_patient = `SELECT * FROM patient
                          WHERE full_name LIKE "${input}"
                             OR phone_number LIKE "${input}";`;

    db.query(search_patient, (err, result) => {
        if (err) console.log(err);
        res.send(result);
    })
})

nurse.route('/add_waiting_patient')
    .post((req, res) => {
        let priority = 'no'
        const id = {
            patient_id  : req.body.patient_id,
            department_id : req.body.department_id,
            description : req.body.description
        }
    
        let find = `SELECT * FROM booked WHERE patient_id = "${id.patient_id}"`

        db.query(find, (err, result) => {
            if (err) console.log(err)

            const time = new Date();
            const current_date = time.toLocaleDateString('en-US');  // Format current date in local timezone
            const current_time = `${time.getHours()}:${time.getMinutes()}`;

            // Convert result[0].booked_date to a string in 'YYYY-MM-DD' format
            const booked_date_string = result[0] ? result[0].booked_date.toLocaleDateString('en-US') : '';

            // console.log(current_date, booked_date_string)
            if (result.length > 0 && booked_date_string === current_date) {
                // The booked_date matches the current date
                const booked_time = result[0].booked_time;

                // Calculate the end time (30 minutes later)
                const end_time = calculateEndTime(booked_time);
                // console.log(end_time, booked_time, current_time)

                if (current_time >= booked_time && current_time <= end_time) {
                    priority = 'yes'
                }
            }

            let add_to_list = `INSERT INTO wait_list (patient_id, department_id, description, priority)
                               VALUES ("${id.patient_id}",
                                       "${id.department_id}", 
                                       "${id.description}",
                                       "${priority}")`;

            db.query(add_to_list, (err2, result2) => {
                if (err2) console.log(err2);
                res.send(result)
            }) 
        })
    })
    .delete((req, res) => {
        const patient_id = req.body.patient_id

        let delete_schedule = `DELETE FROM booked WHERE patient_id = "${patient_id}"`

        db.query(delete_schedule, (err, result) => {
            if (err) console.log(err);
            res.send("Deleted");
        })
    })

function calculateEndTime(startTime) {
    const [hours, minutes] = startTime.split(':').map(Number);
    const endTime = new Date();
    endTime.setHours(hours);
    endTime.setMinutes(minutes + 30);

    return `${endTime.getHours()}:${endTime.getMinutes()}`;
}

module.exports = nurse;
