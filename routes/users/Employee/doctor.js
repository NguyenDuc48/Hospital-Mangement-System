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













doctor.route('/create_report/:wait_id')
    .post((req, res) => {
        const doctor_id = jwt.verify(req.headers['authorization'].replace('Bearer ', ''), process.env.SECRET_KEY) 
        const wait_id = req.params.wait_id;
        const all_info = {
            diagnostic : req.body.diagnostic, 
            conclusion : req.body.conclusion,
            note : req.body.note,
            services_list : req.body.services_list,
            drugs_list : req.body.drugs_list,
            equipments_list : req.body.equipments_list
        }

        //Create Total Bill
        let create_bill = `INSERT INTO total_bills (total_bill_id, service_bill_id, medicine_bill_id, equipment_bill_id, total_bill_raw) 
                           VALUES (NULL, NULL, NULL, NULL, NULL);`

        db.query(create_bill, (err, result) => {
            if (err) console.log(err)

            //Create Medical Report
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
                                        VALUES ((SELECT patient_id FROM wait_list WHERE wait_id = "${wait_id}"), 
                                                "${doctor_id.userId}", 
                                                "${all_info.diagnostic}", 
                                                "${all_info.conclusion}", 
                                                "${all_info.note}", 
                                                "${current_time}", 
                                                "${current_date}", 
                                                (SELECT total_bill_id 
                                                 FROM total_bills 
                                                 ORDER BY total_bill_id DESC LIMIT 1), 
                                                0)`
                            
            db.query(create_medical_report, (err2, result2) => {
                if (err2) console.log(err2);
                console.log("Created report successfully!")

                let add_services = `INSERT INTO service_bills(total_service_bill) 
                                    VALUES (0)`;

                db.query(add_services, (err_add_services, result_add_services) => {
                    if (err_add_services) {
                        console.log(err_add_services);
                        return res.status(500).json({ success: false, message: 'Internal Server Error' });
                    }

                    let update_total_bill_1 = `UPDATE total_bills
                                                SET service_bill_id = (SELECT service_bill_id 
                                                                        FROM service_bills 
                                                                        ORDER BY service_bill_id DESC LIMIT 1)
                                                WHERE total_bill_id = (SELECT mr.bill_id
                                                                        FROM medical_reports mr JOIN wait_list wl ON mr.patient_id = wl.patient_id
                                                                        WHERE mr.payment_status = "pending" AND wl.wait_id = "${wait_id}")`

                    db.query(update_total_bill_1, (err_update_total_bill_1, result_update_total_bill_1) => {
                        if (err_update_total_bill_1) {
                            console.log(err_update_total_bill_1);
                            return res.status(500).json({ success: false, message: 'Internal Server Error' });
                        }

                        all_info.services_list.forEach((service_id) => {
                            let append = `INSERT INTO services_used_per_id(service_bill_id, service_id)
                                        VALUES ((SELECT service_bill_id
                                                FROM total_bills
                                                WHERE total_bill_id = (SELECT mr.bill_id
                                                                        FROM medical_reports mr JOIN wait_list wl ON mr.patient_id = wl.patient_id
                                                                        WHERE mr.payment_status = "pending" AND wl.wait_id = "${wait_id}")),
                                                                        "${service_id}")`

                            db.query(append, (err_append_sui, result_append_sui) => {
                                if (err_append_sui) {
                                    console.log(err_append_sui);
                                    return res.status(500).json({ success: false, message: 'Internal Server Error' });
                                }
                                console.log('Services added successfully');
                            });
                        });
                    });
                });

                let add_drugs = `INSERT INTO medicine_bills(total_medicine_bill) 
                                VALUES (0)`;

                db.query(add_drugs, (err_add_drugs, result_add_drugs) => {
                    if (err_add_drugs) {
                        console.log(err_add_drugs);
                        return res.status(500).json({ success: false, message: 'Internal Server Error' });
                    }

                    let update_total_bill_2 = `UPDATE total_bills
                                                SET medicine_bill_id = (SELECT medicine_bill_id 
                                                                        FROM medicine_bills 
                                                                        ORDER BY medicine_bill_id DESC LIMIT 1)
                                                WHERE total_bill_id = (SELECT mr.bill_id
                                                                        FROM medical_reports mr JOIN wait_list wl ON mr.patient_id = wl.patient_id
                                                                        WHERE mr.payment_status = "pending" AND wl.wait_id = "${wait_id}")`

                    db.query(update_total_bill_2, (err_update_total_bill_2, result_update_total_bill_2) => {
                        if (err_update_total_bill_2) {
                            console.log(err_update_total_bill_2);
                            return res.status(500).json({ success: false, message: 'Internal Server Error' });
                        }

                        all_info.drugs_list.forEach((drug_info) => {
                            let append_dui = `INSERT INTO drugs_used_per_id(medicine_bill_id, drug_id, quantity_used)
                                            VALUES ((SELECT medicine_bill_id
                                                    FROM total_bills
                                                    WHERE total_bill_id = (SELECT mr.bill_id
                                                                            FROM medical_reports mr JOIN wait_list wl ON mr.patient_id = wl.patient_id
                                                                            WHERE mr.payment_status = "pending" AND wl.wait_id = "${wait_id}")),
                                                    "${drug_info[0]}",
                                                    "${drug_info[1]}")`

                            db.query(append_dui, (err_append_dui, result_append_dui) => {
                                if (err_append_dui) {
                                    console.log(err_append_dui);
                                    return res.status(500).json({ success: false, message: 'Internal Server Error' });
                                }
                                console.log('Drug took successfully');
                            });
                        });
                    });
                });

                let add_equipments = `INSERT INTO equipment_bills(total_equipment_bill) 
                                      VALUES (0)`;

                db.query(add_equipments, (err_add_equipments, result_add_equipments) => {
                    if (err_add_equipments) {
                        console.log(err_add_equipments);
                        return res.status(500).json({ success: false, message: 'Internal Server Error' });
                    }

                    let update_total_bill_3 = `UPDATE total_bills
                                                SET equipment_bill_id = (SELECT equipment_bill_id 
                                                                        FROM equipment_bills 
                                                                        ORDER BY equipment_bill_id DESC LIMIT 1)
                                                WHERE total_bill_id = (SELECT mr.bill_id
                                                                        FROM medical_reports mr JOIN wait_list wl ON mr.patient_id = wl.patient_id
                                                                        WHERE mr.payment_status = "pending" AND wl.wait_id = "${wait_id}")`

                    db.query(update_total_bill_3, (err_update_total_bill_3, result_update_total_bill_3) => {
                        if (err_update_total_bill_3) {
                            console.log(err_update_total_bill_3);
                            return res.status(500).json({ success: false, message: 'Internal Server Error' });
                        }

                        all_info.equipments_list.forEach((equipment_info) => {
                            let append_eui = `INSERT INTO equipments_used_per_id(equipment_bill_id, equipment_id, quantity_used, day_used)
                                              VALUES ((SELECT equipment_bill_id
                                                        FROM total_bills
                                                        WHERE total_bill_id = (SELECT mr.bill_id
                                                                                FROM medical_reports mr JOIN wait_list wl ON mr.patient_id = wl.patient_id
                                                                                WHERE mr.payment_status = "pending" AND wl.wait_id = "${wait_id}")),
                                                        "${equipment_info[0]}",
                                                        "${equipment_info[1]}",
                                                        "${equipment_info[2]}")`

                            db.query(append_eui, (err_eui, result_eui) => {
                                if (err_eui) {
                                    console.log(err_eui);
                                    return res.status(500).json({ success: false, message: 'Internal Server Error' });
                                }
                                console.log('Equipments took successfully');
                            });
                        });
                    });
                });
            })
        })
        res.send("Create report successfully")
    })
    .put((req, res) => {
        const wait_id = req.params.wait_id

        let calculate_services = `UPDATE service_bills JOIN total_bills
                                    SET total_service_bill = (SELECT SUM(services.service_fee)
                                                            FROM services_used_per_id
                                                                    INNER JOIN services ON services_used_per_id.service_id = services.service_id
                                                            WHERE service_bills.service_bill_id = services_used_per_id.service_bill_id
                                                            GROUP BY services_used_per_id.service_bill_id)
                                    WHERE total_bills.total_bill_id = (SELECT mr.bill_id
                                                                        FROM medical_reports mr JOIN wait_list wl ON mr.patient_id = wl.patient_id
                                                                        WHERE mr.payment_status = "pending" AND wl.wait_id = "${wait_id}")`

        db.query(calculate_services, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
        });
        
        let calculate_drugs = `UPDATE medicine_bills JOIN total_bills
                                SET total_medicine_bill = (SELECT SUM(drugs.price)
                                                            FROM drugs_used_per_id
                                                                INNER JOIN drugs ON drugs_used_per_id.drug_id = drugs.drug_id                                                         
                                                            WHERE medicine_bills.medicine_bill_id = drugs_used_per_id.medicine_bill_id
                                                            GROUP BY drugs_used_per_id.medicine_bill_id)
                                WHERE total_bills.total_bill_id = (SELECT mr.bill_id
                                                                    FROM medical_reports mr JOIN wait_list wl ON mr.patient_id = wl.patient_id
                                                                    WHERE mr.payment_status = "pending" AND wl.wait_id = "${wait_id}")`

        db.query(calculate_drugs, (err2, result2) => {
            if (err2) {
                console.log(err2);
                return res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
        })  

        let calculate_equipments = `UPDATE equipment_bills JOIN total_bills
                                    SET total_equipment_bill = (SELECT SUM(equipments.fee_per_day * equipments_used_per_id.quantity_used * equipments_used_per_id.day_used) AS total_fee
                                                                FROM equipments_used_per_id
                                                                    INNER JOIN equipments ON equipments_used_per_id.equipment_id = equipments.equipment_id
                                                                WHERE equipment_bills.equipment_bill_id = equipments_used_per_id.equipment_bill_id
                                                                GROUP BY equipments_used_per_id.equipment_bill_id)
                                    WHERE total_bills.total_bill_id = (SELECT mr.bill_id
                                                                        FROM medical_reports mr JOIN wait_list wl ON mr.patient_id = wl.patient_id
                                                                        WHERE mr.payment_status = "pending" AND wl.wait_id = "${wait_id}");`

        db.query(calculate_equipments, (err3, result3) => {
            if (err3) {
                console.log(err3);
                return res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
        })    

        let total_bill = `UPDATE total_bills
                        SET total_bill_raw = (SELECT (COALESCE(SUM(service_bills.total_service_bill), 0)
                                                    + COALESCE(SUM(medicine_bills.total_medicine_bill), 0)
                                                    + COALESCE(SUM(equipment_bills.total_equipment_bill), 0)) AS total_raw
                                                FROM total_bills
                                                    LEFT JOIN service_bills ON total_bills.service_bill_id = service_bills.service_bill_id
                                                    LEFT JOIN medicine_bills ON total_bills.medicine_bill_id = medicine_bills.medicine_bill_id
                                                    LEFT JOIN equipment_bills ON total_bills.equipment_bill_id = equipment_bills.equipment_bill_id)
                        WHERE total_bill_id = (SELECT mr.bill_id
                                                FROM medical_reports mr JOIN wait_list wl ON mr.patient_id = wl.patient_id
                                                WHERE mr.payment_status = "pending" AND wl.wait_id = "${wait_id}")`
        
        db.query(total_bill, (err4, result4) => {
            if (err4) console.log(err4)
        });

        let money_need_to_pay = `UPDATE medical_reports
                                SET money_need_to_pay = (SELECT (1 - (patient.health_insurance_percent / 100)) * total_bills.total_bill_raw
                                                        FROM patient
                                                        INNER JOIN total_bills ON medical_reports.bill_id = total_bills.total_bill_id
                                                        WHERE patient.patient_id = medical_reports.patient_id)`
                                        
        db.query(money_need_to_pay, (err5, result5) => {
            if (err5) console.log(err5)
            res.send("Updated successfully");
        })
    });

module.exports = doctor;
