import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { IProduct, IReview } from '../../../Interfaces/ProjectInterfaces';
import './ProductDetail.css';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [reviews, setReviews] = useState<IReview[]>([]);

  // Fetch product details and reviews
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
    fetchProduct();
  }, [id]);

  if (!product) {
    return <Container><p>Đang tải...</p></Container>;
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
  );
};

// PropTypes (không cần thiết vì đã dùng TypeScript, nhưng thêm theo yêu cầu)
ProductDetail.propTypes = {};

export default ProductDetail;