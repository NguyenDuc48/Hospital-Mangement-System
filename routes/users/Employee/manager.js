const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const employee = express.Router();
const db = require('../../../utils/db');
process.env.SECRET_KEY = 'Arijit';

//-------------------------------------DOCTOR-----------------------------------

employee.get('/get_doctor', (req, res) => {
    const sql = `SELECT 
                    doc.doctor_id, 
                    emp.full_name, 
                    DATE_FORMAT(emp.dob,'%d/%m/%Y') AS dob, 
                    emp.gender, doc.expertise, 
                    dep.department_name as department, 
                    emp.phone_number, 
                    emp.email, 
                    emp.address, 
                    emp.salary, 
                    DATE_FORMAT(emp.work_from,'%d/%m/%Y') AS work_from 
                FROM 
                    doctors doc 
                JOIN employees emp ON 
                    doc.doctor_id = emp.employee_id 
                JOIN departments dep ON 
                    doc.department = dep.department_id 
                WHERE emp.status = "active"`;

    db.query(sql, (err, result) => {
        if (err) console.log(err);
        // console.log(result)
        res.json(result);
    });
});

employee.post('/add_doctor', (req, res) => {
    var idx = 0;
    var doc_id = ""
    let find_idx = 'SELECT * FROM doctors ORDER BY doctor_id DESC LIMIT 1';
    db.query(find_idx, (err, result) => {
        last_id = result[0].doctor_id.substring(2); //BS006 -> 006
        idx = parseInt(last_id, 10) //006 -> 6
        doc_id = "BS" + String(idx + 1).padStart(3, '0') //idx + 1 = 7 ; padStart(3,'0') -> 007 ; "BS" + "007" = "BN007"
    });

    let find = `SELECT * FROM doctors WHERE doctor_id = "${doc_id}"`;

    db.query(find, (err1, result1) => {
        const doctorData = {
            doctor_id: doc_id,
            full_name: req.body.full_name,
            dob: req.body.dob,
            gender: req.body.gender,
            phone_number: req.body.phone_number,
            email: req.body.email,
            address: req.body.address,
            salary: req.body.salary,
            work_from: req.body.work_from,
            expertise: req.body.expertise,
            department: req.body.department,
            password: req.body.password
        }

        if (err1) console.log(err1);
        if (result1[0] == undefined) {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                doctorData.password = hash;

                let create_account = `INSERT INTO credentials (username, password, id) 
                                        VALUES ("${doctorData.doctor_id.toLowerCase()}",
                                                "${doctorData.password}",
                                                "${doctorData.doctor_id}")`;

                db.query(create_account, (err3, result3) => {
                    if (err3) console.log(err3);
                });


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
                    if (err2) console.log(err2);
                });


                let create_doctor = `INSERT INTO doctors (doctor_id, expertise, department)
                                        VALUES ("${doctorData.doctor_id}",
                                                "${doctorData.expertise}",
                                                "${doctorData.department}")`
                console.log(create_doctor.toString())
                db.query(create_doctor, (err4, result4) => {
                    if (err4) console.log(err4);
                    res.send("Doctor created successfully");
                })
            });
        } else {
            res.send("Doctor already exists...");
        }
    });
});

employee.put('/update_doctor', (req, res) => {
    const updatedData = {
        doctor_id: req.body.doctor_id,
        expertise: req.body.expertise,
        department: req.body.department,
        salary: req.body.salary
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
            // Now that the first query is complete, proceed with the second query
            let updateSalaryQuery = `UPDATE employees
                                     SET salary = "${updatedData.salary}"
                                     WHERE employee_id = "${updatedData.doctor_id}"`;

            db.query(updateSalaryQuery, (err2, result2) => {
                if (err2) {
                    console.log(err2);
                    res.status(500).json({ error: 'Error updating doctor salary' });
                } else {
                    // Both queries are successful, send the final response
                    res.json({ success: true, message: 'Doctor information updated successfully' });
                }
            });
        }
    });
});

employee.route('/delete_doctor')
    .delete((req, res) => {
        const doctor_id = req.body.doctor_id;

        let delete_account = `UPDATE credentials SET password = "randompass" WHERE id = "${doctor_id}"`;

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
    const sql = `SELECT 
                    nur.nurse_id, 
                    emp.full_name, 
                    DATE_FORMAT(emp.dob,'%d/%m/%Y') AS dob, 
                    emp.gender, 
                    dep.department_name as department, 
                    emp.phone_number, 
                    emp.email, emp.address, 
                    nur.shift,
                    emp.salary, 
                    DATE_FORMAT(emp.work_from,'%d/%m/%Y') AS work_from 
                FROM 
                    nurses nur 
                JOIN employees emp ON 
                    nur.nurse_id = emp.employee_id 
                JOIN departments dep ON 
                    nur.department = dep.department_id 
                WHERE emp.status = 'active';`;

    db.query(sql, (err, result) => {
        if (err) console.log(err);
        res.json(result);
    });
});

employee.post('/add_nurse', (req, res) => {
    var idx = 0;
    var nur_id = ""
    let find_idx = 'SELECT * FROM nurses ORDER BY nurse_id DESC LIMIT 1';
    db.query(find_idx, (err, result) => {
        last_id = result[0].nurse_id.substring(2); //YT006 -> 006
        idx = parseInt(last_id, 10) //006 -> 6
        nur_id = "YT" + String(idx + 1).padStart(3, '0') //idx + 1 = 7 ; padStart(3,'0') -> 007 ; "YT" + "007" = "YT007"
    });


    let find = `SELECT * FROM nurses WHERE nurse_id = "${nur_id}"`;

    db.query(find, (err1, result1) => {
        const nurseData = {
            nurse_id: nur_id,
            full_name: req.body.full_name,
            dob: req.body.dob,
            gender: req.body.gender,
            phone_number: req.body.phone_number,
            email: req.body.email,
            address: req.body.address,
            salary: req.body.salary,
            work_from: req.body.work_from,
            department: req.body.department,
            password: req.body.password,
            shift: req.body.shift
        }
        if (err1) console.log(err1);
        if (result1[0] == undefined) {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                nurseData.password = hash;


                let create_account = `INSERT INTO credentials (username, password, id) 
                VALUES ("${nurseData.nurse_id.toLowerCase()}",
                        "${nurseData.password}",
                        "${nurseData.nurse_id}")`;

                db.query(create_account, (err3, result3) => {
                    if (err3) console.log(err3);
                });


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
                    if (err2) console.log(err2);
                });



                let create_nurse = `INSERT INTO nurses (nurse_id, department, shift)
                                        VALUES ("${nurseData.nurse_id}",
                                                "${nurseData.department}",
                                                "${nurseData.shift}")`

                db.query(create_nurse, (err4, result4) => {
                    if (err4) console.log(err4);
                    res.send("nurse created successfully");
                })
            });
        } else {
            res.send("nurse already exists...");
        }
    });
});


employee.put('/update_nurse', (req, res) => {
    const updatedData = {
        nurse_id: req.body.nurse_id,
        department: req.body.department,
        shift: req.body.shift,
        salary: req.body.salary
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
            // Now that the first query is complete, proceed with the second query
            let updateSalaryQuery = `UPDATE employees
                                     SET salary = "${updatedData.salary}"
                                     WHERE employee_id = "${updatedData.nurse_id}"`;

            db.query(updateSalaryQuery, (err2, result2) => {
                if (err2) {
                    console.log(err2);
                    res.status(500).json({ error: 'Error updating nurse salary' });
                } else {
                    // Both queries are successful, send the final response
                    res.json({ success: true, message: 'Nurse information updated successfully' });
                }
            });
        }
    });
});

employee.route('/delete_nurse')
    .delete((req, res) => {
        const nurse_id = req.body.nurse_id;

        let delete_account = `UPDATE credentials SET password = "randompassword" WHERE id = "${nurse_id}"`;

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

//QUẢN LÍ VẬT TƯ TRANG THIẾT BỊ Y TẾ

employee.get("/view_equipments", (req, res) => {
    let list = `SELECT equipment_id, name, quantity_left, fee_per_day
                FROM equipments`;

    db.query(list, (err, result) => {
        if (err) console.log(err);
        res.send(result);
    })
})

employee.post('/add_equipment', (req, res) => {
    const equipmentData = {
        name: req.body.name,
        quantity_left: req.body.quantity_left,
        fee_per_day: req.body.fee_per_day
    }

    let find = `SELECT * FROM equipments WHERE name = "${equipmentData.name}"`;

    db.query(find, (err1, result1) => {
        if (err1) console.log(err1);

        if (result1[0] == undefined) {
            let create = `INSERT INTO equipments (name, quantity_left, fee_per_day)
                              VALUES ("${equipmentData.name}", 
                                    "${equipmentData.quantity_left}", 
                                    "${equipmentData.fee_per_day}")`;

            db.query(create, (err2, result2) => {
                if (err2) console.log(err2);
                res.send("Add equipment successfully!")
            });
        } else {
            res.send("Equipment already exists...");
        }
    });
});

employee.put('/update_equipment', (req, res) => {
    const updatedData = {
        equipment_id: req.body.equipment_id,
        quantity_left: req.body.quantity_left,
        fee_per_day: req.body.fee_per_day
    };

    let updateQuery = `UPDATE equipments
                       SET 
                       fee_per_day = "${updatedData.fee_per_day}",
                       quantity_left = "${updatedData.quantity_left}"
                       WHERE 
                       equipment_id = "${updatedData.equipment_id}"`;

    db.query(updateQuery, (err, result) => {
        if (err) console.log(err);
    });
    res.send('Equipment information updated successfully');
});
employee.delete('/delete_equipment', (req, res) => {
    const equipment_id = req.body.equipment_id;
    console.log('Equipment ID to delete:', equipment_id);

    let delete_equipment = `UPDATE equipments SET quantity_left = 0 WHERE equipment_id = "${equipment_id}"`;

    db.query(delete_equipment, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error deleting equipment');
        } else {
            res.status(200).json({ success: true, message: 'Delete equipment successfully!' });
        }
    });
});

//                                    THUỐC

employee.get("/view_drugs", (req, res) => {
    let list = `SELECT drug_id, drug_name, description, dosage, price, origin, quantity_left
                FROM drugs`;

    db.query(list, (err, result) => {
        if (err) console.log(err);
        res.send(result);
    })
})

employee.post('/add_drug', (req, res) => {
    const drugData = {
        drug_name: req.body.drug_name,
        description: req.body.description,
        dosage: req.body.dosage,
        price: req.body.price,
        origin: req.body.origin,
        quantity: req.body.quantity
    }
    console.log(drugData);
    let find = `SELECT * FROM drugs WHERE drug_name = "${drugData.drug_name}"`;

    db.query(find, (err1, result1) => {
        if (err1) console.log(err1);

        if (result1[0] == undefined) {
            let create = `INSERT INTO drugs (drug_name, description, dosage, price, origin, quantity_left)
                              VALUES ("${drugData.drug_name}",
                                       "${drugData.description}", 
                                       "${drugData.dosage}",
                                       "${drugData.price}", 
                                       "${drugData.origin}",
                                       "${drugData.quantity}")`;

            db.query(create, (err2, result2) => {
                if (err2) console.log(err2);
                res.send("Add drug successfully!")
            });
        } else {
            res.send("Drug already exists...");
        }
    });
});

employee.put('/update_drug', (req, res) => {
    const updatedData = {
        drug_id: req.body.drug_id,
        price: req.body.price,
        quantity_left: req.body.quantity_left
    };

    let updateQuery = `UPDATE drugs
                        SET 
                        price = "${updatedData.price}"
                        WHERE drug_id = "${updatedData.drug_id}"`;

    db.query(updateQuery, (err, result) => {
        if (err) console.log(err);
    });

    if (updatedData.quantity_left) {
        let update_quantity = `UPDATE drugs
                               SET quantity_left = "${updatedData.quantity_left}"
                               WHERE drug_id = "${updatedData.drug_id}"`

        db.query(update_quantity, (err2, result2) => {
            if (err2) console.log(err2);
        })
    }

    res.send("Drug updated successfully")
});

employee.delete('/delete_drug', (req, res) => {
    const drug_id = req.body.drug_id;

    let delete_drug = `UPDATE drugs SET quantity_left = 0 WHERE drug_id = "${drug_id}"`;

    db.query(delete_drug, (err, result) => {
        if (err) {
            return res.send('Error deleting drug');
        }
        res.send('Drug deleted successfully');
    });
});


// Phòng ban
employee.get('/view_departments', (req, res) => {
    const sql = `SELECT * FROM departments`;

    db.query(sql, (err, result) => {
        if (err) console.log(err);
        res.json(result);
    });
});

employee.post('/add_department', (req, res) => {
    const departmentData = {
        department_name: req.body.department_name,
        description: req.body.description,
        head_of_department: req.body.head_of_department,
        department_phone: req.body.department_phone,
        department_email: req.body.department_email,
        department_address: req.body.department_address
    }

    let find = `SELECT * FROM departments WHERE department_name = "${departmentData.department_name}"`;

    db.query(find, (err1, result1) => {
        if (err1) console.log(err1);

        if (result1[0] == undefined) {
            let create = `INSERT INTO departments (department_name, description, head_of_department, department_phone, department_email, department_address)
                              VALUES ("${departmentData.department_name}",
                                     "${departmentData.description}",
                                     "${departmentData.head_of_department}",
                                     "${departmentData.department_phone}",
                                     "${departmentData.department_email}",
                                     "${departmentData.department_address}")`;

            db.query(create, (err2, result2) => {
                if (err2) console.log(err2);
                res.send("Add department successfully!")
            });
        } else {
            res.send("Department already exists...");
        }
    });
});

employee.put('/update_department', (req, res) => {
    const updatedData = {
        department_name: req.body.department_name,
        description: req.body.description,
        head_of_department: req.body.head_of_department,
        department_phone: req.body.department_phone,
        department_email: req.body.department_email,
        department_address: req.body.department_address
    };

    let updateQuery = `UPDATE departments
                        SET department_name = "${updatedData.department_name}",
                            description = "${updatedData.description}",
                            head_of_department = "${updatedData.head_of_department}",
                            department_phone = "${updatedData.department_phone}",
                            department_email = "${updatedData.department_email}",
                            department_address = "${updatedData.department_address}"
                        WHERE department_id = "${req.body.department_id}"`;

    db.query(updateQuery, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: 'Error updating department' });
        } else {
            res.send("Department updated successfully");
        }
    });
});

employee.delete('/delete_department', (req, res) => {
    const department_id = req.body.department_id;

    let delete_department = `DELETE FROM departments WHERE department_id = "${department_id}"`;

    db.query(delete_department, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error deleting department');
        }

        return res.send('Department deleted successfully');
    });
});

employee.post('/reset_password', async (req, res) => {
    const { username, password } = req.body;

    const find = `SELECT username FROM credentials WHERE username = "${username}"`;


    
    db.query(find, (err, result) => {
        console.log("result:", result)
        if (result.length > 0) {
         
            bcrypt.hash(password, 10, (err, hash) => {
                let password_bcrypt = hash;
                let update_password =`UPDATE credentials
                SET password = "${password_bcrypt}"
                WHERE username = "${username}"`;
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


        } else {
          res.status(500).json({ message: 'Not found!' });
        }
      });
});





module.exports = employee;
