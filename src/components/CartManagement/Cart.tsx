// src/Components/CartManagement/Cart.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Container, Row, Col, Card } from "react-bootstrap";
import { IProduct, ICart, ICartItem, IAccount } from "../../Interfaces/ProjectInterfaces";
import { useNavigate } from "react-router-dom";

export const Cart = () => {
    const [cart, setCart] = useState<ICart | null>(null);
    const [products, setProducts] = useState<IProduct[]>([]);
    const [user, setUser] = useState<IAccount | null>(null);
    const navigate = useNavigate();

    // Lấy thông tin người dùng từ sessionStorage
    useEffect(() => {
        const authData = sessionStorage.getItem("auth");
        if (authData) {
            const parsedUser: IAccount = JSON.parse(authData);
            setUser(parsedUser);
        } else {
            navigate("/"); // Chuyển hướng về trang đăng nhập nếu chưa đăng nhập
        }
    }, [navigate]);

    // Tải danh sách sản phẩm và giỏ hàng
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("http://localhost:5000/products");
                setProducts(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy sản phẩm:", error);
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
                    console.error("Lỗi khi lấy giỏ hàng:", error);
                }
            }
        };

        fetchProducts();
        if (user) fetchCart();
    }, [user]);

    // Hàm để quay lại trang danh sách sản phẩm
    const handleBackToProducts = () => {
        navigate("/home");
    };

    return (
        <Container className="my-5">
            <h1>Giỏ hàng của bạn</h1>
            <Button variant="secondary" onClick={handleBackToProducts} className="mb-3">
                Quay lại danh sách sản phẩm
            </Button>
            {!user ? (
                <p>Vui lòng đăng nhập để xem giỏ hàng.</p>
            ) : !cart || cart.items.length === 0 ? (
                <p>Giỏ hàng của bạn đang trống.</p>
            ) : (
                <div>
                    {cart.items.map((item, index) => {
                        const product = products.find(p => p.id === item.productId);
                        return (
                            <Row key={index} className="mb-3">
                                <Col>
                                    <Card>
                                        <Card.Body>
                                            <Card.Title>{product?.name}</Card.Title>
                                            <Card.Text>Số lượng: {item.quantity}</Card.Text>
                                            <Card.Text>
                                                Tổng: {(product?.price || 0) * item.quantity} VND
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        );
                    })}
                    <h4>Tổng cộng: {cart.total} VND</h4>
                </div>
            )}
        </Container>
    );
};