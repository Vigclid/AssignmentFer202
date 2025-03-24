import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Container, Row, Col, Form, Dropdown, Card, Button } from 'react-bootstrap';
import { FaShoppingCart } from 'react-icons/fa';
import { IProduct } from '../../../Interfaces/ProjectInterfaces';
import './ProductList.css';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('default');

  // Fetch products from db.json
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
    fetchProducts();
  }, []);

  // Handle search by name
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

  return (
    <Container className="product-list-container">
      {/* Header with Search, Sort, and Cart Icon */}
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
          <FaShoppingCart size={30} className="cart-icon" />
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
                    <Button variant="success">Thêm vào giỏ hàng</Button>
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

// PropTypes (không cần thiết vì đã dùng TypeScript, nhưng thêm theo yêu cầu)
ProductList.propTypes = {};

export default ProductList;