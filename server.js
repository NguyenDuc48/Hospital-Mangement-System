const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const Patient = require('./routes/users/Patient/patient');
const Doctor = require('./routes/users/Employee/doctor');
const Manager = require('./routes/users/Employee/manager');
const Nurse = require('./routes/users/Employee/nurse');
const Login = require('./routes/users/Login/login');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/patient', Patient);
app.use('/doctor' , Doctor);
app.use('/manager', Manager);
app.use('/nurse', Nurse);
app.use('/manager', Manager);
app.use('/login', Login);

app.use(express.static(path.join(__dirname + '/client/build')));

app.use('/*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
