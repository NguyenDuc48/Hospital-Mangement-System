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
    const doctor_id = jwt.verify(req.headers['authorization'].replace('Bearer ', ''), process.env.SECRET_KEY)
    let wait_id = req.body.wait_id
    let call = `UPDATE wait_list
                SET status = "in progress",
                    doctor_id = "${doctor_id.userId}"
                WHERE wait_id = "${wait_id}"`

    db.query(call, (err, result) => {
        if (err) console.log(err);
        res.send("Updated successfully");
    });
})

doctor.post('/create_report/:patient_id', (req, res) => {
    const doctor_id = jwt.verify(req.headers['authorization'].replace('Bearer ', ''), process.env.SECRET_KEY) 
    const patient_id = req.params.patient_id
    const report = {
        diagnostic : req.body.diagnostic,
        conclusion : req.body.conclusion,
    }

    let note = ''
    if (req.body.note) {
        note = req.body.note
    }
    let create_bill = `INSERT INTO total_bills (service_bill_id, medicine_bill_id, equipment_bill_id, total_bill_raw) 
                       VALUES (NULL, NULL, NULL, NULL)`;

    db.query(create_bill, (err, result) => {
        if (err) console.log(err);

        const time = new Date();
        const current_time = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`
        const current_date = `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`

        let create_medical_report = `INSERT INTO medical_reports 
                                       (patient_id, 
                                        doctor_id, 
                                        diagnostic, 
                                        conclusion, 
                                        note, 
                                        booking_time, 
                                        appointment_date, 
                                        bill_id, 
                                        money_need_to_pay)  
                                     VALUES ("${patient_id}", 
                                             "${doctor_id.userId}", 
                                             "${report.diagnostic}", 
                                             "${report.conclusion}", 
                                             "${note}", 
                                             "${current_time}", 
                                             "${current_date}", 
                                             (SELECT total_bill_id 
                                              FROM total_bills 
                                              ORDER BY total_bill_id DESC LIMIT 1), 
                                             0)`
                        
        db.query(create_medical_report, (err3, result3) => {
            if (err3) console.log(err3);
            res.send("Created report successfully")
        })
    });
})

doctor.get('/get_services', (req, res) => {
    let services = `SELECT service_name FROM services`

    db.query(services, (err, result) => {
        if (err) console.log(err);
        res.send(result)
    })
})

doctor.get('/get_drugs', (req, res) => {
    let drugs = `SELECT drug_name FROM drugs WHERE quantity_left > 0`

    db.query(drugs, (err, result) => {
        if (err) console.log(err);
        res.send(result)
    })
})

doctor.get('/get_equipments', (req, res) => {
    let equipments = `SELECT name FROM equipments WHERE quantity_left > 0`

    db.query(equipments, (err, result) => {
        if (err) console.log(err);
        res.send(result)
    })
})

doctor.route('/take_services/:total_bill_id')
    .post((req, res) => {
        const total_bill_id = req.params.total_bill_id;
        let services_list = [];

        if (Array.isArray(req.body)) {
            req.body.forEach((item) => {
                if (item.services_id) {
                    services_list.push(item.services_id);
                }
            });
        }

        let add_services = `INSERT INTO service_bills(total_service_bill) 
                            VALUES (0)`;

        db.query(add_services, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ success: false, message: 'Internal Server Error' });
            }

            let put_total_bill = `UPDATE total_bills
                                  SET service_bill_id = (SELECT service_bill_id 
                                                         FROM service_bills 
                                                         ORDER BY service_bill_id DESC LIMIT 1)
                                  WHERE total_bill_id = "${total_bill_id}"`

            db.query(put_total_bill, (err2, result2) => {
                if (err2) {
                    console.log(err2);
                    return res.status(500).json({ success: false, message: 'Internal Server Error' });
                }

                let responseSent = false;

                services_list.forEach((service_id, index, array) => {
                    let append = `INSERT INTO services_used_per_id(service_bill_id, service_id)
                                  VALUES ((SELECT service_bill_id
                                          FROM total_bills
                                          WHERE total_bill_id = "${total_bill_id}"),
                                          "${service_id}")`

                    db.query(append, (err3, result3) => {
                        if (err3) {
                            console.log(err3);
                            responseSent = true;
                            return res.status(500).json({ success: false, message: 'Internal Server Error' });
                        }

                        // Check if this is the last iteration before sending the response
                        if (index === array.length - 1 && !responseSent) {
                            res.json({ success: true, message: 'Services added successfully' });
                        }
                    });
                });
            });
        });
    })
    .put((req, res) => {
        const total_bill_id = req.params.total_bill_id

        let calculate = `UPDATE service_bills JOIN total_bills
                         SET total_service_bill = (SELECT SUM(services.service_fee)
                                                   FROM services_used_per_id
                                                        INNER JOIN services ON services_used_per_id.service_id = services.service_id
                                                   WHERE service_bills.service_bill_id = services_used_per_id.service_bill_id
                                                   GROUP BY services_used_per_id.service_bill_id)
                         WHERE total_bills.total_bill_id = "${total_bill_id}"`

        db.query(calculate, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
            res.json({ success: true, message: 'Calculate bill completed' });
        });
    });

doctor.route('/take_drugs/:total_bill_id')
    .post((req, res) => {
        const total_bill_id = req.params.total_bill_id;
        let drugs_list = [];

        if (Array.isArray(req.body)) {
            req.body.forEach((item) => {
                if (item.drug_id && item.quantity_used) {
                    drugs_list.push({
                        drug_id : item.drug_id,
                        quantity_used : item.quantity_used
                    });
                }
            });
        }

        let add_drugs = `INSERT INTO medicine_bills(total_medicine_bill) 
                         VALUES (0)`;

        db.query(add_drugs, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ success: false, message: 'Internal Server Error' });
            }

            let put_total_bill = `UPDATE total_bills
                                  SET medicine_bill_id = (SELECT medicine_bill_id 
                                                          FROM medicine_bills 
                                                          ORDER BY medicine_bill_id DESC LIMIT 1)
                                  WHERE total_bill_id = "${total_bill_id}"`

            db.query(put_total_bill, (err2, result2) => {
                if (err2) {
                    console.log(err2);
                    return res.status(500).json({ success: false, message: 'Internal Server Error' });
                }

                let responseSent = false;

                drugs_list.forEach((drug_info, index, array) => {
                    let append = `INSERT INTO drugs_used_per_id(medicine_bill_id, drug_id, quantity_used)
                                  VALUES ((SELECT medicine_bill_id
                                           FROM total_bills
                                           WHERE total_bill_id = "${total_bill_id}"),
                                          "${drug_info.drug_id}",
                                          "${drug_info.quantity_used}")`

                    db.query(append, (err3, result3) => {
                        if (err3) {
                            console.log(err3);
                            responseSent = true;
                            return res.status(500).json({ success: false, message: 'Internal Server Error' });
                        }

                        // Check if this is the last iteration before sending the response
                        if (index === array.length - 1 && !responseSent) {
                            res.json({ success: true, message: 'Drug took successfully' });
                        }
                    });
                });
            });
        }); 
    })
    .put((req, res) => {
        const total_bill_id = req.params.total_bill_id

        let calculate = `UPDATE medicine_bills JOIN total_bill_id
                         SET total_medicine_bill = (SELECT SUM(drugs.price)
                                                    FROM drugs_used_per_id
                                                        INNER JOIN drugs ON drugs_used_per_id.drug_id = drugs.drug_id
                                                    WHERE medicine_bills.medicine_bill_id = drugs_used_per_id.medicine_bill_id
                                                    GROUP BY drugs_used_per_id.medicine_bill_id)
                         WHERE total_bills.total_bill_id = "${total_bill_id}"`

        db.query(calculate, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
            res.json({ success: true, message: 'Calculate bill completed' });
        })                                           
    });

doctor.route('/take_equipments/:total_bill_id')
    .post((req, res) => {
        const total_bill_id = req.params.total_bill_id;
        let equipments_list = [];

        if (Array.isArray(req.body)) {
            req.body.forEach((item) => {
                if (item.equipment_id && item.quantity_used && item.day_used) {
                    equipments_list.push({
                        equipment_id : item.equipment_id,
                        quantity_used : item.quantity_used,
                        day_used : item.day_used
                    });
                }
            });
        }

        let add_equipments = `INSERT INTO equipment_bills(total_equipment_bill) 
                              VALUES (0)`;

        db.query(add_equipments, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ success: false, message: 'Internal Server Error' });
            }

            let put_total_bill = `UPDATE total_bills
                                  SET equipment_bill_id = (SELECT equipment_bill_id 
                                                          FROM equipment_bills 
                                                          ORDER BY equipment_bill_id DESC LIMIT 1)
                                  WHERE total_bill_id = "${total_bill_id}"`

            db.query(put_total_bill, (err2, result2) => {
                if (err2) {
                    console.log(err2);
                    return res.status(500).json({ success: false, message: 'Internal Server Error' });
                }

                let responseSent = false;

                equipments_list.forEach((equipment_info, index, array) => {
                    let append = `INSERT INTO equipments_used_per_id(equipment_bill_id, equipment_id, quantity_used, day_used)
                                  VALUES ((SELECT equipment_bill_id
                                           FROM total_bills
                                           WHERE total_bill_id = "${total_bill_id}"),
                                          "${equipment_info.equipment_id}",
                                          "${equipment_info.quantity_used}",
                                          "${equipment_info.day_used}")`

                    db.query(append, (err3, result3) => {
                        if (err3) {
                            console.log(err3);
                            responseSent = true;
                            return res.status(500).json({ success: false, message: 'Internal Server Error' });
                        }

                        // Check if this is the last iteration before sending the response
                        if (index === array.length - 1 && !responseSent) {
                            res.json({ success: true, message: 'Equipments took successfully' });
                        }
                    });
                });
            });
        }); 
    })
    .put((req, res) => {
        const total_bill_id = req.params.total_bill_id

        let calculate = `UPDATE equipment_bills JOIN total_bills
                         SET total_equipment_bill = (SELECT SUM(equipments.fee_per_day * equipments_used_per_id.quantity_used * equipments_used_per_id.day_used) AS total_fee
                                                     FROM equipments_used_per_id
                                                        INNER JOIN equipments ON equipments_used_per_id.equipment_id = equipments.equipment_id
                         WHERE equipment_bills.equipment_bill_id = equipments_used_per_id.equipment_bill_id
                         GROUP BY equipments_used_per_id.equipment_bill_id
                         WHERE total_bills.total_bill_id = "${total_bill_id}");`

        db.query(calculate, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
            res.json({ success: true, message: 'Calculate bill completed' });
        })                                           
    });

doctor.put('/calculate_bill/:total_bill_id', (req, res) => {
    const total_bill_id = req.params.total_bill_id

    let total_bill = `UPDATE total_bills
                      SET total_bill_raw = (SELECT (COALESCE(SUM(service_bills.total_service_bill), 0)
                                                  + COALESCE(SUM(medicine_bills.total_medicine_bill), 0)
                                                  + COALESCE(SUM(equipment_bills.total_equipment_bill), 0)) AS total_raw
                                            FROM total_bills
                                                LEFT JOIN service_bills ON total_bills.service_bill_id = service_bills.service_bill_id
                                                LEFT JOIN medicine_bills ON total_bills.medicine_bill_id = medicine_bills.medicine_bill_id
                                                LEFT JOIN equipment_bills ON total_bills.equipment_bill_id = equipment_bills.equipment_bill_id)
                      WHERE total_bill_id = "${total_bill_id}"`
    
    db.query(total_bill, (err, result) => {
        if (err) console.log(err);
        res.send("Updated successfully");
    });
})

doctor.put('/completed_patient/:wait_id', (req, res) => {
    let wait_id = req.params.wait_id
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

module.exports = doctor;
