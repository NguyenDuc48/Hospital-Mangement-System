const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const employee = express.Router();

const db = require('../../../utils/db');

process.env.SECRET_KEY = 'Arijit';

//-------------------------------------DOCTOR-----------------------------------

employee.get('/get_doctor', (req, res) => {
    const sql = "SELECT * FROM doctors JOIN employees ON doctors.doctor_id = employees.employee_id WHERE employees.status = 'active'";

    db.query(sql, (err, result) => {
        if(err) console.log(err);
        console.log(result)
        res.json(result);
    });
});

employee.post('/add_doctor', (req, res) => {
    const doctorData = {
        doctor_id   : req.body.doctor_id,
        full_name   : req.body.full_name,
        dob         : req.body.dob,
        gender      : req.body.gender,
        phone_number : req.body.phone_number,
        email       : req.body.email,
        address     : req.body.address,
        salary      : req.body.salary,
        work_from   : req.body.work_from,
        expertise   : req.body.expertise,
        department  : req.body.department,
        password    : req.body.password
    }

    let find = `SELECT * FROM doctors WHERE doctor_id = "${doctorData.doctor_id}"`;

    db.query(find, (err1, result1) => {
        if(err1) console.log(err1);
        // console.log(result1[0]);

        if(result1[0] == undefined) {
            let create = `INSERT INTO employees (employee_id, full_name, dob, gender, phone_number, email, address, salary, work_from)
                              VALUES ("${doctorData.doctor_id}", 
                                       "${doctorData.full_name}",
                                       "${doctorData.dob}", 
                                       "${doctorData.gender}", 
                                       "${doctorData.phone_number}",
                                       "${doctorData.email}",
                                       "${doctorData.address}",
                                       "${doctorData.salary}",
                                       "${doctorData.work_from}"
                                       )`;

            db.query(create, (err2, result2) => {
                if(err2) console.log(err2);
            });

            let create_account = `INSERT INTO credentials (username, password, id) 
                                      VALUES ("${doctorData.full_name}",
                                              "${doctorData.password}",
                                              "${doctorData.doctor_id}")`;

            db.query(create_account, (err3, result3) => {
                if (err3) console.log(err3);
            });

            let create_doctor = `INSERT INTO doctors (doctor_id, expertise, department)
                                     VALUES ("${doctorData.doctor_id}",
                                             "${doctorData.expertise}",
                                             "${doctorData.department}")`

            db.query(create_doctor, (err4, result4) => {
                if (err4) console.log(err4);
                res.send("Doctor created successfully");
            })
        } else {
            res.send("Doctor already exists...");
        }
    });
});

employee.put('/update_doctor', (req, res) => {
    const updatedData = {
        doctor_id: req.body.doctor_id,
        expertise: req.body.expertise,
        department: req.body.department
    };

    let updateQuery = `UPDATE doctors
                       SET expertise = "${updatedData.expertise}",
                           department = "${updatedData.department}"
                       WHERE doctor_id = "${updatedData.doctor_id}"`;

    db.query(updateQuery, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: 'Error updating doctor information' });
        } else {
            res.json({ success: true, message: 'Doctor information updated successfully' });
        }
    });
});

employee.route('/delete_doctor')
    .delete((req, res) => {
        const doctor_id = req.body.doctor_id;

        let delete_account = `DELETE FROM credentials WHERE id = "${doctor_id}"`;

        db.query(delete_account, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).json({ error: 'Error deleting account' });
            } else {
                console.log("OK");
                res.json({ success: true, message: 'Account deleted successfully' });
            }
        });
    })
    .put((req, res) => {
        const doctor_id = req.body.doctor_id;

        let update_status = `UPDATE employees
                             SET status = "retired"
                             WHERE employee_id = "${doctor_id}"`;

        db.query(update_status, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).json({ error: 'Error updating status' });
            } else {
                console.log("OK");
                res.json({ success: true, message: 'Status updated successfully' });
            }
        });
    });

//--------------------------------------NURSE-------------------------------------

employee.get('/get_nurse', (req, res) => {
    const sql = "SELECT * FROM nurses JOIN employees ON nurses.nurse_id = employees.employee_id";

    db.query(sql, (err, result) => {
        if(err) console.log(err);
        console.log(result)
        res.json(result);
    });
});
    
employee.post('/add_nurse', (req, res) => {
    const nurseData = {
        nurse_id   : req.body.nurse_id,
        full_name   : req.body.full_name,
        dob         : req.body.dob,
        gender      : req.body.gender,
        phone_number : req.body.phone_number,
        email       : req.body.email,
        address     : req.body.address,
        salary      : req.body.salary,
        work_from   : req.body.work_from,
        department  : req.body.department,
        password    : req.body.password
    }
    
    let find = `SELECT * FROM nurses WHERE nurse_id = "${nurseData.nurse_id}"`;
    
    db.query(find, (err1, result1) => {
        if(err1) console.log(err1);
        // console.log(result1[0]);
    
        if(result1[0] == undefined) {
            let create = `INSERT INTO employees (employee_id, full_name, dob, gender, phone_number, email, address, salary, work_from)
                              VALUES ("${nurseData.nurse_id}", 
                                       "${nurseData.full_name}",
                                       "${nurseData.dob}", 
                                       "${nurseData.gender}", 
                                       "${nurseData.phone_number}",
                                       "${nurseData.email}",
                                       "${nurseData.address}",
                                       "${nurseData.salary}",
                                       "${nurseData.work_from}")`;
    
            db.query(create, (err2, result2) => {
                if(err2) console.log(err2);
            });
    
            let create_account = `INSERT INTO credentials (username, password, id) 
                                      VALUES ("${nurseData.full_name}",
                                              "${nurseData.password}",
                                              "${nurseData.nurse_id}")`;
    
            db.query(create_account, (err3, result3) => {
                if (err3) console.log(err3);
            });
    
            let create_nurse = `INSERT INTO nurses (nurse_id, department, shift)
                                     VALUES ("${nurseData.nurse_id}",
                                             "${nurseData.department}",
                                             "Trống")`
    
            db.query(create_nurse, (err4, result4) => {
                if (err4) console.log(err4);
                res.send("nurse created successfully");
            })
        } else {
            res.send("nurse already exists...");
        }
    });
});
    
employee.put('/update_nurse', (req, res) => {
    const updatedData = {
        nurse_id: req.body.nurse_id,
        department: req.body.department,
        shift: req.body.shift
    };
    
    let updateQuery = `UPDATE nurses
                       SET department = "${updatedData.department}",
                           shift = "${updatedData.shift}"
                       WHERE nurse_id = "${updatedData.nurse_id}"`;
    
    db.query(updateQuery, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: 'Error updating nurse information' });
        } else {
            res.json({ success: true, message: 'Nurse information updated successfully' });
        }
    });
});
    
employee.route('/delete_nurse')
    .delete((req, res) => {
        const nurse_id = req.body.nurse_id;
    
        let delete_account = `DELETE FROM credentials WHERE id = "${nurse_id}"`;
    
        db.query(delete_account, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).json({ error: 'Error deleting account' });
            } else {
                console.log("OK");
                res.json({ success: true, message: 'Account deleted successfully' });
            }
        });
    })
    .put((req, res) => {
        const nurse_id = req.body.nurse_id;
    
        let update_status = `UPDATE employees
                             SET status = "retired"
                             WHERE employee_id = "${nurse_id}"`;
    
        db.query(update_status, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).json({ error: 'Error updating status' });
            } else {
                console.log("OK");
                res.json({ success: true, message: 'Status updated successfully' });
            }
        });
    });
    
module.exports = employee;
