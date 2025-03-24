import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Container, Row, Col, Card, Modal } from "react-bootstrap";
import { IProduct, ICart, IAccount, IPaymentHistory } from "../../Interfaces/ProjectInterfaces";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";

export const Cart = () => {
    const [cart, setCart] = useState<ICart | null>(null);
    const [products, setProducts] = useState<IProduct[]>([]);
    const [user, setUser] = useState<IAccount | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
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

        const updatedItems = cart.items.map(item =>
            item.productId === productId
                ? { ...item, quantity: item.quantity + 1 }
                : item
        );

        const newTotal = updatedItems.reduce((sum, item) => {
            const productPrice = products.find(p => p.id === item.productId)?.price || 0;
            return sum + productPrice * item.quantity;
        }, 0);

        const updatedCart: ICart = { ...cart, items: updatedItems, total: newTotal };
        updateCart(updatedCart);
    };

    const decreaseQuantity = (productId: string) => {
        if (!cart) return;

        const updatedItems = cart.items
            .map(item =>
                item.productId === productId
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
            .filter(item => item.quantity > 0);

        const newTotal = updatedItems.reduce((sum, item) => {
            const productPrice = products.find(p => p.id === item.productId)?.price || 0;
            return sum + productPrice * item.quantity;
        }, 0);

        const updatedCart: ICart = { ...cart, items: updatedItems, total: newTotal };
        updateCart(updatedCart);
    };

    const removeItem = (productId: string) => {
        if (!cart) return;

        const updatedItems = cart.items.filter(item => item.productId !== productId);

        const newTotal = updatedItems.reduce((sum, item) => {
            const productPrice = products.find(p => p.id === item.productId)?.price || 0;
            return sum + productPrice * item.quantity;
        }, 0);

        const updatedCart: ICart = { ...cart, items: updatedItems, total: newTotal };
        updateCart(updatedCart);
    };

    const handleCheckout = () => {
        setShowPaymentModal(true);
    };

    const confirmPayment = async () => {
        if (!cart || !user) return;

        const paymentHistory: IPaymentHistory = {
            id: Date.now(),
            userId: Number(user.id),
            products: cart.items.map(item => {
                const product = products.find(p => p.id === item.productId);
                return product || {
                    id: item.productId,
                    name: "Product does not exist",
                    price: 0,
                    description: "",
                    imageUrl: "",
                    reviews: []
                };
            }),
            total: cart.total,
            date: new Date().toISOString().split('T')[0]
        };

        try {
            await axios.post("http://localhost:5000/paymentHistories", paymentHistory);

            const updatedCart: ICart = { ...cart, items: [], total: 0 };
            await updateCart(updatedCart);

            setShowPaymentModal(false);
            alert("Payment successful! Order has been saved to history.");
        } catch (error) {
            console.error("Error saving payment history:", error);
        }
    };

    const handleBackToProducts = () => {
        navigate("/products");
    };

    return (
        <Container className="my-5">
            <h1>Your shopping cart</h1>
            <Button variant="secondary" onClick={handleBackToProducts} className="mb-3">
                Back to product list
            </Button>
            {!user ? (
                <p>Please login to view cart.</p>
            ) : !cart || cart.items.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div>
                    {cart.items.map((item, index) => {
                        const product = products.find(p => p.id === item.productId);
                        return (
                            <Row key={index} className="mb-3">
                                <Col>
                                    <Card>
                                        <Card.Body className="d-flex align-items-center justify-content-between">
                                            <div>
                                                <Card.Title>{product?.name}</Card.Title>
                                                <Card.Text>
                                                    Unit price: {(product?.price || 0).toLocaleString('vi-VN')} VND
                                                </Card.Text>
                                                <Card.Text>
                                                    Quantity: {item.quantity}
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        className="ms-2"
                                                        onClick={() => increaseQuantity(item.productId)}
                                                    >
                                                        <FaPlus />
                                                    </Button>
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        className="ms-1"
                                                        onClick={() => decreaseQuantity(item.productId)}
                                                    >
                                                        <FaMinus />
                                                    </Button>
                                                </Card.Text>
                                                <Card.Text>
                                                    Total: {((product?.price || 0) * item.quantity).toLocaleString('vi-VN')} VND
                                                </Card.Text>
                                            </div>
                                            <Button
                                                variant="danger"
                                                onClick={() => removeItem(item.productId)}
                                            >
                                                <FaTrash /> Delete
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        );
                    })}
                    <h4>Total: {cart.total.toLocaleString('vi-VN')} VND</h4>
                    <Button variant="success" onClick={handleCheckout} className="mt-3">
                        Payment
                    </Button>
                </div>
            )}

            <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Payment</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <p>Please scan the QR code to pay:</p>
                    <img
                        src="https://static.vecteezy.com/system/resources/previews/012/487/823/original/3d-hand-press-pay-button-icon-phone-with-credit-card-float-on-transparent-mobile-banking-online-payment-service-withdraw-money-easy-shop-cashless-society-concept-cartoon-minimal-3d-render-png.png"
                        alt="QR Code"
                        style={{ maxWidth: "100%", height: "auto" }}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={confirmPayment}>
                        Payment Confirmation
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};