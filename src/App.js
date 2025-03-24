
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Testing } from './components/Testing';
import { LoginForm } from './components/Login/LoginForm';
import { Register } from './components/Login/Register';
import ProductList from './components/ProductManagement/ProductList/ProductList';
import ProductDetail from './components/ProductManagement/ProductDetail/ProductDetail';
import { Cart } from './components/CartManagement/Cart';
import { OrderHistory } from './components/CartManagement/OrderHistory';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginForm />}></Route>
      <Route path="/register" element={<Register />}></Route>
      <Route path="/home" element={<Testing />}></Route>
      <Route path="/products" element={<ProductList />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart/>} />
      <Route path="/order-history" element={<OrderHistory />} />
    </Routes>
  );
}

export default App;
