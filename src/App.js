import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import Profile from './pages/auth/profile'
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import VerfifyMail from './pages/auth/verifymail'
import ResetMail from './pages/auth/resetmail'
import ResetPassword from './pages/auth/resetpassword'

import PathMain from './pages/path/pathmain';
import Path from './pages/path/path';
import PathMap from './pages/path/pathmap';

import About from './pages/others/about'
import All from './pages/others/all';
import Contact from './pages/others/contact'
import Preface from './pages/others/preface';

import Spot from './pages/global/spot';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Preface/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/verifymail/:token" element={<VerfifyMail/>} />
          <Route path="/resetmail" element={<ResetMail/>} />
          <Route path="/resetpassword/:token" element={<ResetPassword/>} />

          <Route path="/path" element={<PathMain/>} />
					<Route path="/path/:pathID" element={<Path/>} />
          <Route path="/path/:pathID/map" element={<PathMap/>}/>

          <Route path="/spot/:spotID/:from" element={<Spot/>} />

          <Route path="/about" element={<About/>} />
          <Route path="/all" element={<All/>} />
          <Route path="/contact" element={<Contact/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
