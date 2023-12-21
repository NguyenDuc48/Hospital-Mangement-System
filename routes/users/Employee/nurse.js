const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nurse = express.Router();

const db = require('../../../utils/db');

process.env.SECRET_KEY = 'Arijit';

//  Manage examination schedules

nurse.get('/profile', (req, res) => {
    let user_id = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
    
    let user = `SELECT * FROM users WHERE user_id = ${user_id}`;
    db.query(user, (err, result) => {
        if (err) console.log(err);
        res.send(result);
    });
});

//  Bill management
nurse.get('/bill', (req, res) => {
    
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