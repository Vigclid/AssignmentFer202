import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Testing } from "./components/Testing";
import { LoginForm } from "./components/Login/LoginForm";
import { Register } from "./components/Login/Register";
import ProductList from "./components/ProductManagement/ProductList/ProductList";
import ProductDetail from "./components/ProductManagement/ProductDetail/ProductDetail";
import { Cart } from "./components/CartManagement/Cart";
import { OrderHistory } from "./components/CartManagement/OrderHistory";
import ManageProduct from "./components/ProductManagement/ManageProduct/ManageProduct";
import AddProduct from "./components/ProductManagement/AddProduct/AddProduct";
import UpdateProduct from "./components/ProductManagement/UpdateProduct/UpdateProduct";
import Footer from "./components/Review/Footer";
import Services from "./components/Review/FooterService/Services";
import AboutUs from "./components/Review/FooterService/AboutUs";
import WebDesign from "./components/Review/FooterService/WebDesign";
import Development from "./components/Review/FooterService/Development";

function App() {
  return (
    <div className="App">
      <main>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Testing />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/products/manage" element={<ManageProduct />} />
          <Route path="/products/add" element={<AddProduct />} />
          <Route path="/products/update/:id" element={<UpdateProduct />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/web-design" element={<WebDesign />} />
          <Route path="/development" element={<Development />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
