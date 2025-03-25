// src/Components/ProductDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Container, Row, Col, Card, Button, Navbar, Nav } from 'react-bootstrap';
import { IProduct, IReview, ICart, ICartItem, IAccount } from '../../../Interfaces/ProjectInterfaces';
import { FaShoppingCart, FaHistory } from 'react-icons/fa'; // Thêm FaHistory
import { Link } from 'react-router-dom';
import './ProductDetail.css';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [cart, setCart] = useState<ICart | null>(null);
  const [user, setUser] = useState<IAccount | null>(null);
  const [products, setProducts] = useState<IProduct[]>([]);
  const navigate = useNavigate();

  // Lấy thông tin người dùng từ sessionStorage
  useEffect(() => {
    const authData = sessionStorage.getItem("auth");
    if (authData) {
      const parsedUser: IAccount = JSON.parse(authData);
      setUser(parsedUser);
    }
  }, []);

  // Tải thông tin sản phẩm, đánh giá, danh sách sản phẩm và giỏ hàng
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productResponse = await axios.get(`http://localhost:5000/products/${id}`);
        setProduct(productResponse.data);

        // Fetch all reviews and filter by product reviews
        if (productResponse.data.reviews && productResponse.data.reviews.length > 0) {
          const reviewsResponse = await axios.get('http://localhost:5000/reviews');
          const productReviews = reviewsResponse.data.filter((review: IReview) =>
            productResponse.data.reviews.includes(review.id)
          );
          setReviews(productReviews);
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/products');
        setProducts(response.data);
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

    fetchProduct();
    fetchProducts();
    if (user) fetchCart();
  }, [id, user]);

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = async () => {
    if (!product || !cart || !user) {
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

  if (!product) {
    return <Container><p>Đang tải...</p></Container>;
  }

  const handleBackToProducts = () => {
    navigate("/products");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("auth");
    sessionStorage.removeItem(`cart_${user?.id}`);
    sessionStorage.removeItem(`userRole`);
    navigate("/");
  };

  return (
    <div>
      {/* Thanh điều hướng với icon giỏ hàng và icon lịch sử đơn hàng */}
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand>Chi tiết sản phẩm</Navbar.Brand>
          {user && (
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/cart" className="me-3">
                <FaShoppingCart size={30} />
                {cartItemCount > 0 && (
                  <span className="badge bg-danger rounded-pill ms-1">
                    {cartItemCount}
                  </span>
                )}
              </Nav.Link>
              <Nav.Link as={Link} to="/order-history">
                <FaHistory size={30} />
              </Nav.Link>
              <Button variant="warning" onClick={() => handleLogout()} className='ms-2'>
                Logout
              </Button>
            </Nav>
          )}
        </Container>
      </Navbar>

      <Container className="product-detail-container">
        <Button variant="secondary" onClick={handleBackToProducts} className="mb-3">
          Quay lại danh sách sản phẩm
        </Button>
        {/* Product Detail Card */}
        <Row className="mb-4">
          <Col>
            <Card className="product-detail-card">
              <Row>
                <Col md={6}>
                  <Card.Img
                    src={product.imageUrl || 'https://via.placeholder.com/300'}
                    alt={product.name}
                    className="product-detail-image"
                  />
                </Col>
                <Col md={6}>
                  <Card.Body>
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text>
                      <strong>Giá: </strong>{product.price.toLocaleString('vi-VN')} VNĐ
                    </Card.Text>
                    <Card.Text>
                      <strong>Mô tả: </strong>{product.description}
                    </Card.Text>
                    <Button variant="success" onClick={addToCart}>
                      Thêm vào giỏ hàng
                    </Button>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        {/* Reviews Section */}
        <Row>
          <Col>
            <h3>Đánh giá sản phẩm</h3>
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <Card key={review.id} className="review-card mb-3">
                  <Card.Body>
                    <Card.Text>
                      <strong>Đánh giá: </strong>{review.rating}/5
                    </Card.Text>
                    <Card.Text>{review.comment}</Card.Text>
                    <Card.Text>
                      <small>Ngày: {review.date}</small>
                    </Card.Text>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <p>Chưa có đánh giá nào cho sản phẩm này.</p>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProductDetail;