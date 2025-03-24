import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { IProduct } from "../../../Interfaces/ProjectInterfaces";
import Review from "../../Review/Review";
import "./ProductDetail.css";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [sessionUser, setSessionUser] = useState<any>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productResponse = await axios.get(`http://localhost:5000/products/${id}`);
        setProduct(productResponse.data);

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

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:5000/products/${id}`);
        navigate(-1);
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  if (!product) {
    return (
      <Container>
        <p>Loading...</p>
      </Container>
    );
  }

  return (
    <Container className="product-detail-container">
      {/* Back to product list button */}
      <Row className="mb-3">
        <Col className="text-start">
          <Button variant="secondary" onClick={() => navigate("/products")}>
            Back to product list
          </Button>
        </Col>
      </Row>

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
                    <strong>Price: </strong>
                    {product.price.toLocaleString("vi-VN")} VND
                  </Card.Text>
                  <Card.Text>
                    <strong>Description: </strong>
                    {product.description}
                  </Card.Text>
                  {sessionUser?.role === 'admin' ? (
                    <div className="d-flex justify-content-between">
                      <Button variant="warning" onClick={() => navigate(`/products/update/${id}`)}>
                        Update
                      </Button>
                      <Button variant="danger" onClick={handleDelete}>
                        Delete
                      </Button>
                    </div>
                  ) : (
                    <Button variant="success">Add to cart</Button>
                  )}
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Reviews Section */}
      <Row>
        <Col>
          <h3>Product Reviews</h3>
          <Review productId={id} sessionUser={sessionUser} />
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;
