import React from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import Landings from './component/Landings/Landings';
import Login from './component/Login/Login';
import DoctorAccount from './component/Manager/DoctorAccount';
import NurseAccount from './component/Manager/NurseAccount';
import SignUp from './component/SignUp/SignUp';
import PatientProfile from './component/Patient/PatientProfile';
import DoctorProfile from './component/Doctor/DoctorProfile';
import NurseProfile from './component/Nurse/NurseProfile';
function App() {
  return (
    <div className="App">
    <Router>
      <Route exact path="/" component={Landings} />
      <Route exact path="/login" component={Login} /> 
      {/* patient */}
      <Route exact path="/sign_up" component = {SignUp}/> 
      <Route exact path="/patient/get_profile" component = {PatientProfile} />
      {/* doctor */}
      <Route exact path="/doctor/get_profile" component = {DoctorProfile}/>
      {/* nurse  */}
      <Route exact path="/nurse/get_profile" component = {NurseProfile}/>
      {/* manager */}
      <Route exact path="/manager/doctor_account" component = {DoctorAccount}/>
      <Route exact path="/manager/nurse_account" component = {NurseAccount}/>
    </Router>
    </div>
  );
}
export default App;
