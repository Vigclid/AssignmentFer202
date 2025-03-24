// src/Testing.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Container, Row, Col, Card, Navbar, Nav } from "react-bootstrap";
import { IProduct, ICart, ICartItem, IAccount } from "../Interfaces/ProjectInterfaces";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export const Testing = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [cart, setCart] = useState<ICart | null>(null);
    const [user, setUser] = useState<IAccount | null>(null);

    // Lấy thông tin người dùng từ sessionStorage khi component được mount
    useEffect(() => {
        const authData = sessionStorage.getItem("auth");
        if (authData) {
            const parsedUser: IAccount = JSON.parse(authData);
            setUser(parsedUser);
        }
    }, []);

    // Tải danh sách sản phẩm và giỏ hàng của người dùng
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
                    } else {
                        const newCart: ICart = {
                            user: Number(user.id),
                            items: [],
                            total: 0,
                            id: `${user.id}-${Date.now()}`
                        };
                        setCart(newCart);
                    }
                } catch (error) {
                    console.error("Lỗi khi lấy giỏ hàng:", error);
                }
            }
        };

        fetchProducts();
        if (user) fetchCart();
    }, [user]);

    // Thêm sản phẩm vào giỏ hàng
    const addToCart = async (product: IProduct) => {
        if (!cart || !user) return;

        const existingItem = cart.items.find(item => item.productId === product.id);
        let updatedItems: ICartItem[];

        if (existingItem) {
            updatedItems = cart.items.map(item =>
                item.productId === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
        } else {
            updatedItems = [...cart.items, { productId: product.id, quantity: 1 }];
        }

        const newTotal = updatedItems.reduce((sum, item) => {
            const productPrice = products.find(p => p.id === item.productId)?.price || 0;
            return sum + productPrice * item.quantity;
        }, 0);

        const updatedCart: ICart = { ...cart, items: updatedItems, total: newTotal };

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
            console.error("Lỗi khi cập nhật giỏ hàng trên server:", error);
        }
    };

    const cartItemCount = cart ? cart.items.reduce((total, item) => total + item.quantity, 0) : 0;

    return (
        <div>
            {/* Thanh điều hướng với icon giỏ hàng */}
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand>Danh sách sản phẩm</Navbar.Brand>
                    {user && (
                        <Nav className="ms-auto">
                            <Nav.Link as={Link} to="/cart">
                                <FontAwesomeIcon icon={faShoppingCart} size="lg" />
                                {cartItemCount > 0 && (
                                    <span className="badge bg-danger rounded-pill ms-1">
                                        {cartItemCount}
                                    </span>
                                )}
                            </Nav.Link>
                        </Nav>
                    )}
                </Container>
            </Navbar>

            <Container className="my-5">
                {!user ? (
                    <p>Vui lòng đăng nhập để xem giỏ hàng.</p>
                ) : (
                    <Row>
                        {products.map((product) => (
                            <Col md={4} key={product.id} className="mb-4">
                                <Card>
                                    <Card.Img variant="top" src={product.imageUrl} />
                                    <Card.Body>
                                        <Card.Title>{product.name}</Card.Title>
                                        <Card.Text>{product.description}</Card.Text>
                                        <Card.Text><strong>Giá:</strong> {product.price} VND</Card.Text>
                                        <Button variant="primary" onClick={() => addToCart(product)}>
                                            Thêm vào giỏ hàng
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>
        </div>
    );
};