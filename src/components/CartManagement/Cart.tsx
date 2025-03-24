import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Container, Row, Col, Card, Modal } from "react-bootstrap";
import { IProduct, ICart, IAccount, IPaymentHistory } from "../../Interfaces/ProjectInterfaces";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaMinus, FaTrash, FaShoppingBag, FaArrowLeft, FaQrcode } from "react-icons/fa";
import "./Cart.css";
import "../../css/shared-styles.css";

const MY_BANK = {
  BANK_ID: "970422", //MB Bank
  ACCOUNT_NO: "0356759177",
  TEMPLATE: "compact2",
  ACCOUNT_NAME: "Doan Xuan Son",
};

export const Cart = () => {
  const [cart, setCart] = useState<ICart | null>(null);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [user, setUser] = useState<IAccount | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const authData = sessionStorage.getItem("auth");
    if (authData) {
      const parsedUser: IAccount = JSON.parse(authData);
      setUser(parsedUser);
    } else {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error:", error);
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
          console.error("Error:", error);
        }
      }
    };

    fetchProducts();
    if (user) fetchCart();
  }, [user]);

  const updateCart = async (updatedCart: ICart) => {
    if (!user) return;
    setCart(updatedCart);
    sessionStorage.setItem(`cart_${user.id}`, JSON.stringify(updatedCart));

    try {
      const existingCart = await axios.get(`http://localhost:5000/carts?user=${user.id}`);
      if (existingCart.data.length > 0) {
        await axios.put(`http://localhost:5000/carts/${updatedCart.id}`, updatedCart);
      } else {
        await axios.post("http://localhost:5000/carts", updatedCart);
      }
    } catch (error) {
      console.error("Error when update cart on server:", error);
    }
  };

  const increaseQuantity = (productId: string) => {
    if (!cart) return;

    const updatedItems = cart.items.map((item) =>
      item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
    );

    const newTotal = updatedItems.reduce((sum, item) => {
      const productPrice = products.find((p) => p.id === item.productId)?.price || 0;
      return sum + productPrice * item.quantity;
    }, 0);

    const updatedCart: ICart = { ...cart, items: updatedItems, total: newTotal };
    updateCart(updatedCart);
  };

  const decreaseQuantity = (productId: string) => {
    if (!cart) return;

    const updatedItems = cart.items
      .map((item) => (item.productId === productId ? { ...item, quantity: item.quantity - 1 } : item))
      .filter((item) => item.quantity > 0);

    const newTotal = updatedItems.reduce((sum, item) => {
      const productPrice = products.find((p) => p.id === item.productId)?.price || 0;
      return sum + productPrice * item.quantity;
    }, 0);

    const updatedCart: ICart = { ...cart, items: updatedItems, total: newTotal };
    updateCart(updatedCart);
  };

  const removeItem = (productId: string) => {
    if (!cart) return;

    const updatedItems = cart.items.filter((item) => item.productId !== productId);
    const newTotal = updatedItems.reduce((sum, item) => {
      const productPrice = products.find((p) => p.id === item.productId)?.price || 0;
      return sum + productPrice * item.quantity;
    }, 0);

    const updatedCart: ICart = { ...cart, items: updatedItems, total: newTotal };
    updateCart(updatedCart);
  };

  const handleCheckout = () => {
    setShowPaymentModal(true);
  };

  const QR =
    "https://img.vietqr.io/image/" +
    MY_BANK.BANK_ID +
    "-" +
    MY_BANK.ACCOUNT_NO +
    "-" +
    MY_BANK.TEMPLATE +
    ".png?" +
    "&addInfo=" +
    user?.id +
    user?.role +
    "&amount=" +
    cart?.total +
    "&accountName=" +
    MY_BANK.ACCOUNT_NAME;

  const AppScript =
    "https://script.googleusercontent.com/macros/echo?user_content_key=BkINLbtlTn49vfGL7uDFErRGyFRs-i-0j4f98qZpOrySgH3A4XWudFvBAnnOOluUkSRIgUXC0-Ikkbmzr1rJCIA5e_tt4tP5m5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnDzsAlD6ug9FsXOxdoyN-BO226sy0AJl2UoKLOqjRp3h9KpIYTSbk9vet7j5ea-Rg4Ol3lRZLwCEBiCs-ictM-yoBFes96d7Hg&lib=MLQuxm21goJkl3evos7ArRqisV3GZFA2q";

  const handleBackToProducts = () => {
    navigate("/products");
  };

  return (
    <div className="cart-container">
      <div className="cart-header glass-container">
        <h1 className="cart-title text-light">
          <FaShoppingBag className="me-2" /> Your Cart
        </h1>
        <Button variant="primary" onClick={handleBackToProducts} className="back-btn">
          <FaArrowLeft className="me-2" /> Continue Shopping
        </Button>
      </div>

      {!user ? (
        <div className="empty-cart glass-card">
          <p className="text-light">Please login to view cart.</p>
        </div>
      ) : !cart || cart.items.length === 0 ? (
        <div className="empty-cart glass-card">
          <FaShoppingBag className="empty-cart-icon" />
          <p className="text-light">Your cart is empty.</p>
          <Button variant="primary" onClick={handleBackToProducts} className="continue-shopping-btn">
            Start Shopping
          </Button>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cart.items.map((item, index) => {
              const product = products.find((p) => p.id === item.productId);
              return (
                <div key={index} className="cart-item glass-card">
                  <img src={product?.imageUrl || "/placeholder.jpg"} alt={product?.name} className="item-image" />
                  <div className="item-details">
                    <h3 className="item-name text-light">{product?.name}</h3>
                    <p className="item-description text-light-muted">{product?.description}</p>
                  </div>
                  <div className="quantity-controls">
                    <Button
                      variant="outline-primary"
                      className="quantity-btn"
                      onClick={() => decreaseQuantity(item.productId)}>
                      <FaMinus />
                    </Button>
                    <span className="quantity-display text-light">{item.quantity}</span>
                    <Button
                      variant="outline-primary"
                      className="quantity-btn"
                      onClick={() => increaseQuantity(item.productId)}>
                      <FaPlus />
                    </Button>
                  </div>
                  <div className="item-price">
                    {((product?.price || 0) * item.quantity).toLocaleString("vi-VN")} VND
                  </div>
                  <Button variant="danger" className="remove-btn" onClick={() => removeItem(item.productId)}>
                    <FaTrash />
                  </Button>
                </div>
              );
            })}
          </div>

          <div className="cart-summary glass-card">
            <h2 className="summary-title text-light">Order Summary</h2>
            <div className="summary-items">
              <div className="summary-item">
                <span className="text-light-muted">Subtotal</span>
                <span className="text-light">{cart.total.toLocaleString("vi-VN")} VND</span>
              </div>
              <div className="summary-item">
                <span className="text-light-muted">Shipping</span>
                <span className="text-light">Free</span>
              </div>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>{cart.total.toLocaleString("vi-VN")} VND</span>
            </div>
            <Button variant="success" onClick={handleCheckout} className="checkout-btn">
              Proceed to Checkout
            </Button>
          </div>
        </div>
      )}

      <Modal
        show={showPaymentModal}
        onHide={() => setShowPaymentModal(false)}
        className="payment-modal glass-container"
        centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-light">
            <FaQrcode className="qr-icon me-2" /> Scan QR to Pay
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <div className="qr-container">
            <img src={QR} alt="QR Code" className="qr-image" />
          </div>
          <p className="payment-instructions text-light-muted">
            Scan this QR code using your banking app to complete the payment
          </p>
          <div className="payment-amount">Total: {cart?.total.toLocaleString("vi-VN")} VND</div>
        </Modal.Body>
      </Modal>
    </div>
  );
};
