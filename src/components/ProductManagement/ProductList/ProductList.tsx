// src/Components/ProductList.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Container, Row, Col, Form, Dropdown, Card, Button } from 'react-bootstrap';
import { FaShoppingCart, FaHistory } from 'react-icons/fa'; // Thêm FaHistory
import { IProduct, ICart, ICartItem, IAccount } from '../../../Interfaces/ProjectInterfaces';
import './ProductList.css';

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<string>('default');
    const [cart, setCart] = useState<ICart | null>(null);
    const [user, setUser] = useState<IAccount | null>(null);


    const navigate = useNavigate();
    // Lấy thông tin người dùng từ sessionStorage
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
                const response = await axios.get('http://localhost:5000/products');
                setProducts(response.data);
                setFilteredProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
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

    // Handle search by name and sort by price
    useEffect(() => {
        let updatedProducts = [...products];

        // Filter by search term
        if (searchTerm) {
            updatedProducts = updatedProducts.filter((product) =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sort by price
        if (sortOrder === 'lowToHigh') {
            updatedProducts.sort((a, b) => a.price - b.price);
        } else if (sortOrder === 'highToLow') {
            updatedProducts.sort((a, b) => b.price - a.price);
        }

        setFilteredProducts(updatedProducts);
    }, [searchTerm, sortOrder, products]);

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    // Handle sort selection
    const handleSortChange = (order: string) => {
        setSortOrder(order);
    };

    // Thêm sản phẩm vào giỏ hàng
    const addToCart = async (product: IProduct) => {
        if (!cart || !user) {
            alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
            return;
        }

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

    // Tính tổng số sản phẩm trong giỏ hàng
    const cartItemCount = cart
        ? cart.items.reduce((total, item) => total + item.quantity, 0)
        : 0;

    return (
        <Container className="product-list-container">
            {/* Header with Search, Sort, Cart Icon, and Order History Icon */}
            <Row className="mb-4 align-items-center">
                <Col md={4}>
                    <Form.Control
                        type="text"
                        placeholder="Tìm kiếm sản phẩm theo tên..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-input"
                    />
                </Col>
                <Col md={4}>
                    <Dropdown onSelect={(eventKey: any) => handleSortChange(eventKey)}>
                        <Dropdown.Toggle variant="secondary" id="dropdown-sort">
                            Sắp xếp theo giá
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item eventKey="default">Mặc định</Dropdown.Item>
                            <Dropdown.Item eventKey="lowToHigh">Từ thấp đến cao</Dropdown.Item>
                            <Dropdown.Item eventKey="highToLow">Từ cao đến thấp</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
                <Col md={4} className="text-end">
                    {/* Icon giỏ hàng */}
                    <Link to="/cart" className="me-3">
                        <FaShoppingCart size={30} className="cart-icon" />
                        {cartItemCount > 0 && (
                            <span className="badge bg-danger rounded-pill ms-1">
                                {cartItemCount}
                            </span>
                        )}
                    </Link>
                    {/* Icon lịch sử đơn hàng */}
                    <Link to="/order-history">
                        <FaHistory size={30} className="cart-icon" />
                    </Link>
                    <Button className='ms-3' onClick={() => {
                        sessionStorage.removeItem("auth");
                        sessionStorage.removeItem("userRole");
                        navigate("/");
                    }} variant="warning">
                        Logout
                    </Button>
                </Col>
            </Row>

            {/* Product List */}
            <Row>
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <Col md={4} key={product.id} className="mb-4">
                            <Card className="product-card">
                                <Card.Img
                                    variant="top"
                                    src={product.imageUrl || 'https://via.placeholder.com/150'}
                                    alt={product.name}
                                    className="product-image"
                                />
                                <Card.Body>
                                    <Card.Title>{product.name}</Card.Title>
                                    <Card.Text>{product.price.toLocaleString('vi-VN')} VNĐ</Card.Text>
                                    <div className="d-flex justify-content-between">
                                        <Link to={`/products/${product.id}`}>
                                            <Button variant="primary">Xem chi tiết</Button>
                                        </Link>
                                        <Button variant="success" onClick={() => addToCart(product)}>
                                            Thêm vào giỏ hàng
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Col>
                        <p>Không tìm thấy sản phẩm nào.</p>
                    </Col>
                )}
            </Row>
        </Container>
    );
};


export default ProductList;