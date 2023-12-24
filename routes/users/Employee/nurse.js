const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nurse = express.Router();

const db = require('../../../utils/db');

process.env.SECRET_KEY = 'Arijit';

//  Manage examination schedules

nurse.get('/profile', (req, res) => {
    let nurse_id = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
    console.log(nurse_id)

    let user = `SELECT * FROM nurses JOIN employees ON nurses.nurse_id = employees.employee_id 
                WHERE nurse_id = "${nurse_id.nurse_id}"`;
    db.query(user, (err, result) => {
        if (err) console.log(err);
        res.send(result);
    });
});

//  Bill management
nurse.post('/create_bill', (req, res) => {
    const id = {
        patient_id  : req.body.patient_id,
        doctor_id   : req.body.doctor_id
    }

    let create_bill = `INSERT INTO total_bills (service_bill_id, medicine_bill_id, equipment_bill_id, total_bill_raw) 
                       VALUES (NULL, NULL, NULL, NULL)`

    db.query(create_bill, (err, result) => {
        if (err) console.log(err);
        res.send(result);

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
                                           NULL)`
                            
        db.query(create_medic_report, (err2, result2) => {
            if (err2) console.log(err2);
            console.log("OK");
        })
    });
})

// View drug and equipment information
nurse.get('/quantity_info', (req, res) => {
    try {
        let user_id = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);

        // Query to get the quantity of each type of drug
        const drugQuery = `
            SELECT d.drug_name, SUM(du.quantity_used) as quantity
            FROM drugs_used_per_id du
                JOIN drugs d ON du.drug_id = d.drug_id
                JOIN medicine_bills mb ON du.medicine_bill_id = mb.medicine_bill_id
                JOIN medical_reports mr ON mb.medicine_bill_id = mr.medicine_bill_id
            WHERE mr.patient_id = ?
            GROUP BY d.drug_id
        `;

        // Query to get the quantity of each type of equipment
        const equipmentQuery = `
            SELECT e.name as equipment_name, SUM(eu.quantity_used) as quantity
            FROM equipments_used_per_id eu
                JOIN equipments e ON eu.equipment_id = e.equipment_id
                JOIN equipment_bills eb ON eu.equipment_bill_id = eb.equipment_bill_id
                JOIN total_bills tb ON eb.equipment_bill_id = tb.equipment_bill_id
                JOIN medical_reports mr ON tb.service_bill_id = mr.bill_id
            WHERE mr.patient_id = ?
            GROUP BY e.equipment_id
        `;

        // Execute the drug query using the db
        db.query(drugQuery, [user_id], (drugError, drugResult) => {
            if (drugError) throw drugError;

            // Execute the equipment query using the db
            db.query(equipmentQuery, [user_id], (equipmentError, equipmentResult) => {
                if (equipmentError) throw equipmentError;

                const drugInfo = drugResult.map(row => ({ drug_name: row.drug_name, quantity: row.quantity }));
                const equipmentInfo = equipmentResult.map(row => ({ equipment_name: row.equipment_name, quantity: row.quantity }));

                res.json({
                    drug_info: drugInfo,
                    equipment_info: equipmentInfo,
                });
            });
        });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

module.exports = nurse;
