import {BrowserRouter, Routes, Route} from 'react-router-dom';

import Login from './pages/auth/login';
import Register from './pages/auth/register';
import Preface from './pages/auth/preface';
import VerfifyMail from './pages/auth/verifymail.js'
import ResetMail from './pages/auth/resetmail.js'
import ResetPassword from './pages/auth/resetpassword.js'

import PathMain from './pages/path/pathmain';
import Path from './pages/path/path';
import PathMap from './pages/path/pathmap';

import All from './pages/all/all';
import Spot from './pages/global/spot';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Preface/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/verifymail/:token" element={<VerfifyMail/>} />
          <Route path="/resetmail" element={<ResetMail/>} />
          <Route path="/resetpassword/:token" element={<ResetPassword/>} />

          <Route path="/path" element={<PathMain/>} />
					<Route path="/path/:pathID" element={<Path/>} />
          <Route path="/path/map" element={<PathMap/>}/>

          <Route path="/spot/:spotID" element={<Spot/>} />
          <Route path="/all" element={<All/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
