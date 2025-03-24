import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Testing } from './components/Testing';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Testing />}></Route>
    </Routes>
  );
}

export default App;
