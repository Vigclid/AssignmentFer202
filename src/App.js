import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Testing } from './components/Testing';
import { LoginForm } from './components/Login/LoginForm';
import { Register } from './components/Login/Register';
import { Cart } from './components/CartManagement/Cart';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginForm />}></Route>
      <Route path="/register" element={<Register />}></Route>
      <Route path="/home" element={<Testing />}></Route>
      <Route path="/cart" element={<Cart />} />
    </Routes>
  );
}

export default App;
