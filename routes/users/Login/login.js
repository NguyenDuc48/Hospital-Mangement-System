const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const login = express.Router();

const db = require('../../../utils/db');

process.env.SECRET_KEY = 'Arijit';

login.post('/', (req, res) => {
    const find = `SELECT password, id FROM credentials WHERE username = "${req.body.username}"`;
    const { username, password } = req.body;
  
    db.query(find, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
        return;
      }
  
      if (result.length > 0) {
        const storedPassword = result[0].password;
  
        bcrypt.compare(password, storedPassword, (bcryptErr, bcryptResult) => {
          if (bcryptErr) {
            console.error(bcryptErr);
            res.status(500).json({ message: 'Internal Server Error' });
            return;
          }
        //  password trong database dạng hash thì sẽ dùng so sánh này
        //   if (bcryptResult){ 
          if (password === result[0].password) {
            let userId = result[0].id.toString();
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

module.exports = login;
