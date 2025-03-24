import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Products } from './components/Products'; //cm
import { CartPage } from './components/CartManagement/CartPage'; //cm
// import { Testing } from './components/Testing';

function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<Testing />}></Route> */}
      <Route path="/products" element={<Products />} />
      <Route path="/cart" element={<CartPage userId={1} />} /> {/* userId tạm để 1, bạn có thể thay đổi theo logic đăng nhập */}
    </Routes>
  );
}

export default App;
