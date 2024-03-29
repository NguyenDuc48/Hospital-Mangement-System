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
    // console.log("em"employee_id)
    const updatedData = {
        new_password : req.body.new_pass,
        old_password : req.body.old_pass
    };
    console.log("update data: ",updatedData)
    const find = `SELECT password FROM credentials WHERE id = "${employee_id.userId}"`;

    // let updateQuery = `UPDATE employees
    //                    SET phone_number = "${updatedData.phone_number}",
    //                        email = "${updatedData.email}",
    //                    WHERE employee_id = "${employee_id.userId}"`;

    // db.query(updateQuery, (err, result) => {
    //     if (err) {
    //         console.log(err);
    //         res.status(500).json({ error: 'Error updating information' });
    //     } else {
    //         res.json({ success: true, message: 'Information updated successfully' });
    //     }
    // });
    db.query(find, (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: 'Internal Server Error' });
          return;
        }
        console.log("result:", result)
        if (result.length > 0) {
          const storedPassword = result[0].password;
        //   console.log("store pass:", storedPassword)
          
          bcrypt.compare(updatedData.old_password, storedPassword, (bcryptErr, bcryptResult) => {
            if (bcryptErr) {
              console.error(bcryptErr);
              res.status(500).json({ message: 'sai roi' });
              return;
            }
            if (bcryptResult){ 
            // if (password === result[0].password) {
            bcrypt.hash(updatedData.new_password, 10, (err, hash) => {
                let password_bcrypt = hash;
                let update_password =`UPDATE credentials
                SET password = "${password_bcrypt}"
                WHERE id = "${employee_id.userId}"`;
                db.query(update_password, (err2, result2) => {
                    if(err2) {
                        console.log(err2);
                        res.status(500).json({ error: 'Error creating employee' });
                    }
                    else {
                        res.json({ success: true, message: 'Password updated successfully' });

                    }


                });
            });

            }
            else {
                res.status(500).json({ message: 'Old password incorect!' });

            }
          });
        } else {
          res.status(500).json({ message: 'Not found!' });
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

nurse.get('/waiting_to_pay', (req,res) => {  
    let get_list = `SELECT DISTINCT wl.wait_id, p.full_name, mr.money_need_to_pay
                      FROM wait_list wl JOIN medical_reports mr ON wl.patient_id = mr.patient_id
                                        JOIN patient p ON p.patient_id = wl.patient_id 
                      WHERE wl.status = "paying"`

    db.query(get_list, (err, result) => {
        if (err) console.log(err);
        res.send(result)
    });
})

nurse.get('/show_bill_info/:wait_id', (req, res) => {
    const wait_id = req.params.wait_id

    let info = `SELECT p.full_name, mr.conclusion, mr.note, p.health_insurance_percent,tb.total_bill_raw, mr.money_need_to_pay
                FROM patient p JOIN wait_list wl ON wl.patient_id = p.patient_id
                    JOIN medical_reports mr ON mr.patient_id = wl.patient_id
                    JOIN total_bills tb ON tb.total_bill_id = mr.bill_id
                WHERE wl.wait_id = "${wait_id}" AND mr.payment_status = "pending"`

    db.query(info, (err, result) => {
        if (err) console.log(err);
        res.send(result)
    });
})

nurse.get('/show_list_in_bill/:wait_id', (req, res) => {
    const wait_id = req.params.wait_id

    let list = `SELECT s.service_name, s.service_fee AS price, NULL AS quantity_used, NULL AS day_used
                FROM services s 
                    JOIN services_used_per_id sui ON s.service_id = sui.service_id
                    JOIN total_bills tb ON tb.service_bill_id = sui.service_bill_id
                    JOIN medical_reports mr ON mr.bill_id = tb.total_bill_id
                    JOIN wait_list wl ON wl.patient_id = mr.patient_id
                WHERE wait_id = "${wait_id}" AND payment_status = "pending"

                UNION

                SELECT d.drug_name, d.price, dui.quantity_used, NULL AS day_used
                FROM drugs d 
                    JOIN drugs_used_per_id dui ON d.drug_id = dui.drug_id
                    JOIN total_bills tb ON tb.medicine_bill_id = dui.medicine_bill_id
                    JOIN medical_reports mr ON mr.bill_id = tb.total_bill_id
                    JOIN wait_list wl ON wl.patient_id = mr.patient_id
                WHERE wait_id = "${wait_id}" AND payment_status = "pending"
                        
                UNION
                        
                SELECT e.name, e.fee_per_day AS price, eui.quantity_used, eui.day_used
                FROM equipments e 
                    JOIN equipments_used_per_id eui ON e.equipment_id = eui.equipment_id
                    JOIN total_bills tb ON tb.equipment_bill_id = eui.equipment_bill_id
                    JOIN medical_reports mr ON mr.bill_id = tb.total_bill_id
                    JOIN wait_list wl ON wl.patient_id = mr.patient_id
                WHERE wait_id = "${wait_id}" AND payment_status = "pending";`
                            
    db.query(list, (err, result) => {
        if (err) console.log(err);
        res.send(result)
    });
})

nurse.route('/pay/:wait_id')
    .put((req, res) => {
        const wait_id = req.params.wait_id
        console.log(wait_id)
        
        let paid = `UPDATE wait_list wl JOIN medical_reports mr ON wl.patient_id = mr.patient_id
                    SET mr.payment_status = "done"
                    WHERE wl.wait_id = "${wait_id}"`

        db.query(paid, (err, result) => {
            if (err) console.log(err);
            res.send("Payment success")
        });
    })
    .delete((req, res) => {
        const wait_id = req.params.wait_id
        
        let paid = `DELETE FROM wait_list WHERE wait_id = "${wait_id}"`

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

nurse.get("/all_patient/search/:input", (req, res) => {
    const input = req.params.input;

    let search_patients = `SELECT * FROM patient
                           WHERE full_name LIKE "${input}%"
                              OR phone_number LIKE "${input}%"
                              OR patient_id LIKE "${input}%"
                              OR email LIKE "${input}%";`;

    db.query(search_patients, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.send(result);
    });
});

nurse.get('/waiting_list', (req,res) => {  
    let get_list = `SELECT DISTINCT wl.wait_id, p.full_name, d.department_name, wl.description
                    FROM wait_list wl JOIN patient p ON p.patient_id = wl.patient_id 
                                      JOIN departments d ON d.department_id = wl.department_id
                    WHERE wl.priority = "yes"

                    UNION

                    SELECT DISTINCT wl.wait_id, p.full_name, d.department_name, wl.description
                    FROM wait_list wl JOIN patient p ON p.patient_id = wl.patient_id 
                                      JOIN departments d ON d.department_id = wl.department_id
                    WHERE wl.priority = "no"`

    db.query(get_list, (err, result) => {
        if (err) console.log(err);
        res.send(result)
    });
})

nurse.get('/all_booked_patient', (req, res) => {
    let patients = `SELECT p.full_name, p.phone_number, b.* 
                    FROM booked b JOIN patient p ON b.patient_id = p.patient_id`
    
    db.query(patients, (err, result) => {
        if (err) console.log(err);
        res.send(result)
    });
})

nurse.get('/all_booked_patient/search/:input', (req, res) => {
    const input = req.params.input;

    let search_patients = `SELECT p.full_name, p.phone_number, b.* 
                           FROM booked b JOIN patient p ON b.patient_id = p.patient_id
                           WHERE p.full_name LIKE "${input}"
                              OR p.phone_number LIKE "${input}"
                              OR p.patient_id LIKE "${input}"`;

    db.query(search_patients, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.send(result);
    });
});

nurse.route('/add_waiting_patient')
    .post((req, res) => {
        let priority = 'no';
        const id = {
            patient_id: req.body.patient_id,
            department_id: req.body.department_id,
            description: req.body.description
        };

        let find = `SELECT * FROM booked WHERE patient_id = "${id.patient_id}"`;

        db.query(find, (err, result) => {
            if (err) console.log(err);

            const time = new Date();
            const current_date = time.toLocaleDateString('en-US');  // Format current date in local timezone
            const current_hours = time.getHours().toString().padStart(2, '0');
            const current_minutes = time.getMinutes().toString().padStart(2, '0');
            const current_time = `${current_hours}:${current_minutes}`;

            // Convert result[0].booked_date to a string in 'YYYY-MM-DD' format
            const booked_date_string = result[0] ? result[0].booked_date.toLocaleDateString('en-US') : '';

            // console.log(current_date, booked_date_string)
            if (result.length > 0 && booked_date_string === current_date) {
                // The booked_date matches the current date
                const booked_time = result[0].booked_time.padStart(5, '0');

                // Calculate the end time (1 hour later)
                const end_time = calculateEndTime(booked_time);
                // console.log(end_time, booked_time, current_time)
                console.log("Current Time:", current_time);
                console.log("Booked Time:", booked_time);
                console.log("End Time:", end_time);
                if (current_time >= booked_time && current_time <= end_time) {
                    priority = 'yes';
                }
            }

            let add_to_list = `INSERT INTO wait_list (patient_id, department_id, description, priority)
                               VALUES ("${id.patient_id}",
                                       "${id.department_id}", 
                                       "${id.description}",
                                       "${priority}")`;

            db.query(add_to_list, (err2, result2) => {
                if (err2) console.log(err2);
                res.send(result);
            });
        });
    })
    .delete((req, res) => {
        const patient_id = req.body.patient_id;

        let delete_schedule = `DELETE FROM booked WHERE patient_id = "${patient_id}"`;

        db.query(delete_schedule, (err, result) => {
            if (err) console.log(err);
            res.send("Deleted");
        });
    });

function calculateEndTime(startTime) {
    const [hours, minutes] = startTime.split(':').map(Number);
    const endTime = new Date();
    endTime.setHours(hours + 1);
    endTime.setMinutes(minutes);

    const end_hours = endTime.getHours().toString().padStart(2, '0');
    const end_minutes = endTime.getMinutes().toString().padStart(2, '0');

    return `${end_hours}:${end_minutes}`;
}

nurse.get('/all_equipment', (req, res) => {
    let equipments = `SELECT * FROM equipments  `
    
    db.query(equipments, (err, result) => {
        if (err) console.log(err);
        res.send(result)
    });
})

nurse.get('/all_equipment/search/:input', (req, res) => {
    const input = req.params.input;

    let search_equipments = `SELECT * FROM equipments
                             WHERE name LIKE "${input}%"`;

    db.query(search_equipments, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.send(result);
    });
});

nurse.get('/all_drug', (req, res) => {
    let drugs = `SELECT * FROM drugs  `
    
    db.query(drugs, (err, result) => {
        if (err) console.log(err);
        res.send(result)
    });
})

nurse.get('/all_drug/search/:input', (req, res) => {
    const input = req.params.input;

    let search_drugs = `SELECT * FROM drugs
                        WHERE drug_name LIKE "${input}%"
                           OR origin LIKE "${input}%"`;

    db.query(search_drugs, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.send(result);
    });
});

nurse.get('/all_department', (req, res) => {
    let departments = `SELECT * FROM departments  `
    
    db.query(departments, (err, result) => {
        if (err) console.log(err);
        res.send(result)
    });
})

nurse.get('/all_department/search/:input', (req, res) => {
    const input = req.params.input;

    let search_departments = `SELECT * FROM departments
                             WHERE department_name LIKE "${input}%"`;

    db.query(search_departments, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.send(result);
    });
});


module.exports = nurse;
