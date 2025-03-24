import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Alert } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaShoppingCart, FaArrowLeft, FaEdit, FaTrash } from "react-icons/fa";
import { IProduct, IAccount, ICart } from "../../../Interfaces/ProjectInterfaces";
import ReviewComponent from "../../Review/Review";
import "./ProductDetail.css";
import "../../../css/shared-styles.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [user, setUser] = useState<IAccount | null>(null);
  const [cart, setCart] = useState<ICart | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const authData = sessionStorage.getItem("auth");
    if (authData) {
      const parsedUser: IAccount = JSON.parse(authData);
      setUser(parsedUser);
    }
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
        navigate("/products");
      }
    };

    const fetchCart = async () => {
      if (user) {
        try {
          const response = await axios.get(`http://localhost:5000/carts?user=${user.id}`);
          const userCart = response.data[0];
          if (userCart) {
            setCart(userCart);
          }
        } catch (error) {
          console.error("Error fetching cart:", error);
        }
      }
    };

    fetchProduct();
    if (user) fetchCart();
  }, [id, navigate, user]);

  const handleDelete = async () => {
    if (!product) return;

    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:5000/products/${id}`);
        navigate("/products");
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const addToCart = async () => {
    if (!product || !cart || !user) {
      alert("Please log in to add products to cart!");
      return;
    }

    const existingItem = cart.items.find((item) => item.productId === product.id);
    let updatedItems;

    if (existingItem) {
      updatedItems = cart.items.map((item) =>
        item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedItems = [...cart.items, { productId: product.id, quantity: 1 }];
    }

    const newTotal = updatedItems.reduce((sum, item) => {
      const itemProduct = item.productId === product.id ? product : null;
      return sum + (itemProduct ? itemProduct.price * item.quantity : 0);
    }, 0);

    const updatedCart = { ...cart, items: updatedItems, total: newTotal };
    setCart(updatedCart);
    sessionStorage.setItem(`cart_${user.id}`, JSON.stringify(updatedCart));

    try {
      await axios.put(`http://localhost:5000/carts/${updatedCart.id}`, updatedCart);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  if (!product) {
    return (
      <Container className="product-detail-container">
        <div className="glass-card">
          <p className="text-light">Loading...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="product-detail-container">
      <div className="product-detail-card glass-container">
        <div className="product-detail-header">
          <Button onClick={() => navigate("/products")} className="back-button">
            <FaArrowLeft className="me-2" /> Back to Products
          </Button>
        </div>

        <div className="product-detail-content">
          <div className="product-image-section">
            <img
              src={product.imageUrl || "https://via.placeholder.com/400"}
              alt={product.name}
              className="product-detail-image"
            />
          </div>

          <div className="product-info-section glass-container">
            <h1 className="product-title text-light">{product.name}</h1>
            <div className="product-price">{product.price.toLocaleString("vi-VN")} VND</div>
            <p className="product-description text-light-muted">{product.description}</p>

            <div className="product-actions">
              {user?.role === "admin" ? (
                <>
                  <Button
                    variant="warning"
                    onClick={() => navigate(`/products/update/${product.id}`)}
                    className="action-button edit-product-btn">
                    <FaEdit className="me-2" /> Edit Product
                  </Button>
                  <Button variant="danger" onClick={handleDelete} className="action-button delete-product-btn">
                    <FaTrash className="me-2" /> Delete Product
                  </Button>
                </>
              ) : (
                <Button variant="primary" onClick={addToCart} className="action-button add-to-cart-btn">
                  <FaShoppingCart className="me-2" /> Add to Cart
                </Button>
              )}
            </div>

            {showSuccess && (
              <Alert variant="success" className="glass-alert glass-alert-success">
                Product added to cart successfully!
              </Alert>
            )}
          </div>
        </div>
      </div>

      <ReviewComponent productId={id} sessionUser={user} />
    </Container>
  );
};

export default ProductDetail;
