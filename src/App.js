import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import Preface from './pages/preface';
import All from './pages/all';
import PathMain from './pages/path/pathmain';
import Path from './pages/path/pathpage';
import PathMap from './pages/path/pathmap';
import Navbar from './navbar';

function App() {
  return (
    <div className="App">
      <Navbar/>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Preface/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/all" element={<All/>} />
          <Route path="/path" element={<PathMain/>} />
					<Route path="/path/pathpage" element={<Path/>} />
          <Route path="/path/pathmap" element={<PathMap/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
