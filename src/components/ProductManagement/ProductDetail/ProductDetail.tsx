
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { IProduct } from "../../../Interfaces/ProjectInterfaces";
import Review from "../../Review/Review";
import "./ProductDetail.css";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [sessionUser, setSessionUser] = useState<any>(null);

  // Fetch product details and session user
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productResponse = await axios.get(`http://localhost:5000/products/${id}`);
        setProduct(productResponse.data);

        // Get session user from sessionStorage where auth data is stored
        const userSession = sessionStorage.getItem("auth");
        if (userSession) {
          setSessionUser(JSON.parse(userSession));
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <Container>
        <p>Đang tải...</p>
      </Container>
    );
  }

  return (
    <Container className="product-detail-container">
      {/* Product Detail Card */}
      <Row className="mb-4">
        <Col>
          <Card className="product-detail-card">
            <Row>
              <Col md={6}>
                <Card.Img
                  src={product.imageUrl || "https://via.placeholder.com/300"}
                  alt={product.name}
                  className="product-detail-image"
                />
              </Col>
              <Col md={6}>
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text>
                    <strong>Giá: </strong>
                    {product.price.toLocaleString("vi-VN")} VNĐ
                  </Card.Text>
                  <Card.Text>
                    <strong>Mô tả: </strong>
                    {product.description}
                  </Card.Text>
                  <Button variant="success">Thêm vào giỏ hàng</Button>
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
          <Review productId={id} sessionUser={sessionUser} />
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;
