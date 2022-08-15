import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Auth from './pages/auth';
import All from './pages/all';
import PathMain from './pages/path/pathmain';
import Path from './pages/path/pathpage';
import PathMap from './pages/path/pathmap';

function App() {
  return (
    <div className="App">
      <button onClick={() => {window.location.href = '/'}}>Auth</button>
      <button onClick={() => {window.location.href = '/all'}}>All</button>
      <button onClick={() => {window.location.href = '/path'}}>Path</button>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Auth/>} />
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
