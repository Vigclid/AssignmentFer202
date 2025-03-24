import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Button, Alert } from "react-bootstrap";
import { IAccount, IPaymentHistory } from "../../Interfaces/ProjectInterfaces";
import { useNavigate } from "react-router-dom";
import { FaHistory, FaShoppingBag, FaCalendarAlt, FaBox } from "react-icons/fa";
import "./OrderHistory.css";
import "../../css/shared-styles.css";

export const OrderHistory = () => {
  const [paymentHistories, setPaymentHistories] = useState<IPaymentHistory[]>([]);
  const [user, setUser] = useState<IAccount | null>(null);
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
    const fetchPaymentHistories = async () => {
      if (user) {
        try {
          const response = await axios.get(`http://localhost:5000/paymentHistories?userId=${user.id}`);
          setPaymentHistories(response.data);
        } catch (error) {
          console.error("Error while retrieving payment history:", error);
        }
      }
    };

    if (user) fetchPaymentHistories();
  }, [user]);

  const handleBackToProducts = () => {
    navigate("/products");
  };

  return (
    <div className="order-history-container">
      <div className="order-history-header glass-container">
        <h1 className="order-history-title text-light">
          <FaHistory className="order-icon" /> Order History
        </h1>
        <Button variant="primary" onClick={handleBackToProducts} className="back-btn">
          <FaShoppingBag className="me-2" /> Continue Shopping
        </Button>
      </div>

      {!user ? (
        <div className="empty-history glass-card">
          <p className="text-light">Please login to view order history.</p>
        </div>
      ) : paymentHistories.length === 0 ? (
        <div className="empty-history glass-card">
          <FaHistory className="empty-history-icon" />
          <p className="text-light">You have no orders yet.</p>
          <Button variant="primary" onClick={handleBackToProducts} className="continue-shopping-btn">
            Start Shopping
          </Button>
        </div>
      ) : (
        <div className="orders-list">
          {paymentHistories.map((history) => (
            <div key={history.id} className="order-card glass-container">
              <div className="order-header">
                <div className="order-number text-light">Order #{history.id}</div>
                <div className="order-date text-light-muted">
                  <FaCalendarAlt className="me-2" />
                  {new Date(history.date).toLocaleDateString("vi-VN")}
                </div>
              </div>
              <div className="order-content">
                <div className="order-items">
                  {history.products.map((product, index) => (
                    <div key={index} className="order-item glass-card">
                      <img src={product.imageUrl || "/placeholder.jpg"} alt={product.name} className="item-image" />
                      <div className="item-details">
                        <h3 className="item-name text-light">{product.name}</h3>
                        <p className="item-description text-light-muted">Product ID: #{product.id}</p>
                      </div>
                      <div className="item-price">{product.price.toLocaleString("vi-VN")} VND</div>
                    </div>
                  ))}
                </div>
                <div className="order-summary">
                  <div className="summary-row">
                    <span className="text-light-muted">Order Total</span>
                    <span className="text-light">{history.total.toLocaleString("vi-VN")} VND</span>
                  </div>
                </div>
                <div className="order-actions">
                  <Button variant="primary" className="action-btn view-details-btn">
                    <FaBox className="me-2" /> View Details
                  </Button>
                  <Button variant="success" className="action-btn reorder-btn" onClick={() => navigate("/products")}>
                    <FaShoppingBag className="me-2" /> Shop Again
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
