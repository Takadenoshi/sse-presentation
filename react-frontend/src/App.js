import { BrowserRouter, Routes, Route, } from "react-router-dom";
import './App.css';
import Demo from './routes/Demo.jsx';
import Playground from './routes/Playground.jsx';

function App() {
  return <BrowserRouter>
    <Routes>
      <Route path="/" element={<Playground />} />
      <Route path="/demo" element={<Demo />} />
    </Routes>
  </BrowserRouter>;
}

export default App;
