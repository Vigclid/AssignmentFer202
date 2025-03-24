import "./App.css";
import "./css/shared-styles.css"; // Ensure shared styles are imported at the root
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

const Layout = ({ children }) => {
  return (
    <>
      <div className="main-content">{children}</div>
      <Footer />
    </>
  );
};

function App() {
  return (
    <div className="app">
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <LoginForm />
            </Layout>
          }
        />
        <Route
          path="/register"
          element={
            <Layout>
              <Register />
            </Layout>
          }
        />
        <Route
          path="/home"
          element={
            <Layout>
              <Testing />
            </Layout>
          }
        />
        <Route
          path="/products"
          element={
            <Layout>
              <ProductList />
            </Layout>
          }
        />
        <Route
          path="/products/:id"
          element={
            <Layout>
              <ProductDetail />
            </Layout>
          }
        />
        <Route
          path="/cart"
          element={
            <Layout>
              <Cart />
            </Layout>
          }
        />
        <Route
          path="/order-history"
          element={
            <Layout>
              <OrderHistory />
            </Layout>
          }
        />
        <Route
          path="/products/manage"
          element={
            <Layout>
              <ManageProduct />
            </Layout>
          }
        />
        <Route
          path="/products/add"
          element={
            <Layout>
              <AddProduct />
            </Layout>
          }
        />
        <Route
          path="/products/update/:id"
          element={
            <Layout>
              <UpdateProduct />
            </Layout>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
