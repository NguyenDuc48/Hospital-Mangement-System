const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const employee = express.Router();

const db = require('../../../utils/db');

process.env.SECRET_KEY = 'Arijit';

// QUẢN LÍ THÊM / SỬA / XÓA NHÂN VIÊN

employee.get('/get_doctor', (req, res) => {
    const sql = "SELECT * FROM doctors JOIN employees ON doctors.doctor_id = employees.employee_id";

    db.query(sql, (err, result) => {
        if(err) console.log(err);
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
                                       "${doctorData.work_from}")`;

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
        doctor_id : req.body.doctor_id,
        expertise : req.body.expertise,
        department : req.body.department,
        salary : req.body.salary
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

    let update_salary = `UPDATE employees
                         SET salary = "${updatedData.salary}"
                         WHERE employee_id = "${updatedData.doctor_id}"`

    db.query(update_salary, (err2, result2) => {
        if (err2) {
            console.log(err2);
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

employee.get('/get_nurse', (req, res) => {
    const sql = `SELECT * FROM nurses JOIN employees ON nurses.nurse_id = employees.employee_id 
                 WHERE employees.status = "active"`;

    db.query(sql, (err, result) => {
        if(err) console.log(err);
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
        password    : req.body.password,
        shift       : req.body.shift
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
                                             "${nurseData.shift}")`
    
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
        nurse_id : req.body.nurse_id,
        department : req.body.department,
        shift : req.body.shift,
        salary : req.body.salary
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

    let update_salary = `UPDATE employees
                         SET salary = "${updatedData.salary}"
                         WHERE employee_id = "${updatedData.doctor_id}"`

    db.query(update_salary, (err2, result2) => {
        if (err2) {
            console.log(err2);
            res.status(500).json({ error: 'Error updating doctor information' });
        } else {
            res.json({ success: true, message: 'Doctor information updated successfully' });
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
    
// XEM BÁO CÁO DOANH THU VÀ HÓA ĐƠN THANH TOÁN
employee.get("/invoices", (req, res) => {
    let list = `SELECT p.patient_id, p.full_name, mr.doctor_id, tb.* 
                FROM patient p JOIN medical_reports mr ON p.patient_id = mr.patient_id
                               JOIN total_bills tb ON mr.bill_id = tb.total_bill_id;`;

    db.query(list, (err, result) => {
        if (err) console.log(err);
        res.send(result);
    })
})

employee.get("/invoices/search", (req, res) => {
    const input = req.body.input;

    let search_invoice = `SELECT p.patient_id, p.full_name, mr.doctor_id, tb.* 
                FROM patient p JOIN medical_reports mr ON p.patient_id = mr.patient_id
                               JOIN total_bills tb ON mr.bill_id = tb.total_bill_id
                WHERE p.full_name LIKE "${input}"
                   OR p.patient_id LIKE "${input}"
                   OR mr.doctor_id LIKE "${input}";`;

    db.query(search_invoice, (err, result) => {
        if (err) console.log(err);
        res.send(result);
    })
})

//QUẢN LÍ VẬT TƯ TRANG THIẾT BỊ Y TẾ

employee.get("/view_drugs", (req, res) => {
    let list = `SELECT drug_id, drug_name, price, origin
                FROM drugs`;

    db.query(list, (err, result) => {
        if (err) console.log(err);
        res.send(result);
    })
})

employee.get("/view_equipments", (req, res) => {
    let list = `SELECT equipment_id, name, quantity_left, fee_per_day
                FROM equipments`;

    db.query(list, (err, result) => {
        if (err) console.log(err);
        res.send(result);
    })
})

//Có nên viết api thêm thuốc và vật tư ở đây không ?


module.exports = employee;
