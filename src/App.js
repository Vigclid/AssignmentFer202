import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Testing } from './components/Testing';
import { LoginForm } from './components/Login/LoginForm';
import { Register } from './components/Login/Register';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginForm />}></Route>
      <Route path="/register" element={<Register />}></Route>
      <Route path="/home" element={<Testing />}></Route>
    </Routes>
  );
}

export default App;
