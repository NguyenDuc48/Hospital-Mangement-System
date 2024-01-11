const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const home = express.Router();

const db = require('../../utils/db');

process.env.SECRET_KEY = 'Arijit';

home.post('/login', (req, res) => {
    const { username, password } = req.body;
    const find = `SELECT password, id FROM credentials WHERE username = "${username}"`;
    console.log("reqbody:" , req.body)
    db.query(find, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }
    
        if (result.length > 0) {
            const storedPassword = result[0].password;
            console.log("store pass:", storedPassword)
            
            bcrypt.compare(password, storedPassword, (bcryptErr, bcryptResult) => {
                if (bcryptErr) {
                    console.error(bcryptErr);
                    res.status(500).json({ message: 'Internal Server Error' });
                    return;
                }
                console.log("bcryptResult:", bcryptResult)
                //  password trong database dạng hash thì sẽ dùng so sánh này
                // if (bcryptResult){ 
                if (password === result[0].password) {
                    let userId = result[0].id.toString();
                    console.log("Userid:" , userId)
                    const token = jwt.sign({ userId }, process.env.SECRET_KEY, { expiresIn: '1h' });
                    if (userId.substring(0,2)=== "QL") {
                        res.status(200).json({ message: 'Login manager successful', token });
                    }
                    else if (userId.substring(0,2)=== "BS") {
                        res.status(201).json({ message: 'Login doctor successful', token });
                    }
                    else if (userId.substring(0,2)=== "BN") {
                        res.status(202).json({ message: 'Login patient successful', token });
                    }
                    else {
                        res.status(203).json({ message: 'Login nurse successful', token });
                    } 
                } else {
                    res.status(401).json({ message: 'Incorrect password' });
                }
            });
        } else {
            res.status(401).json({ message: 'Username not found' });
        }
    });
});

home.put('/change_password', (req, res) => {
    const user_id = jwt.verify(req.headers['authorization'].replace('Bearer ', ''), process.env.SECRET_KEY) 
    const password = {
        old_password : req.body.old_password,
        new_password : req.body.new_password,
        confirm : req.body.confirm
    }

    let show_password = `SELECT password 
                         FROM credentials
                         WHERE id = "${user_id}"`

    db.query(show_password, (err, result) => {
        if (err) console.log(err)
        {
            if (password.new_password == password.confirm && password.old_password == result[0]) {
                let change_password = `UPDATE credentials
                                       SET password = "${password.new_password}"`

                db.query(change_password, (err2, result2) => {
                    if (err2) console.log(err2)
                    res.send("Update successfully")
                })
            }
        }
    })
})

module.exports = home;
