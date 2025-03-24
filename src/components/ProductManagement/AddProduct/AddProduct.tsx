import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaImage, FaArrowLeft, FaPlus } from "react-icons/fa";
import "./AddProduct.css";
import "../../../css/shared-styles.css";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    imageUrl: "",
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!product.name || !product.price || !product.description) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    try {
      const productData = {
        ...product,
        price: parseFloat(product.price),
        id: Date.now().toString(),
        reviews: [],
      };

      await axios.post("http://localhost:5000/products", productData);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/products/manage");
      }, 2000);
    } catch (error) {
      console.error("Error adding product:", error);
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  return (
    <Container className="product-form-container">
      <div className="product-form-card glass-container">
        <div className="product-form-header">
          <h2 className="form-title text-light">
            <FaPlus className="me-2" /> Add New Product
          </h2>
          <Button variant="secondary" onClick={() => navigate("/products/manage")} className="back-button">
            <FaArrowLeft className="me-2" /> Back to Products
          </Button>
        </div>

        <Form onSubmit={handleSubmit} className="product-form">
          <div className="form-section">
            <h3 className="section-title text-light">Basic Information</h3>

            <Form.Group className="mb-3">
              <Form.Label className="text-light">Product Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={product.name}
                onChange={handleChange}
                placeholder="Enter product name"
                className="glass-input"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="text-light">Price (VND)</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                placeholder="Enter price"
                className="glass-input"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="text-light">Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={product.description}
                onChange={handleChange}
                placeholder="Enter product description"
                rows={4}
                className="glass-input"
              />
            </Form.Group>
          </div>

          <div className="form-section">
            <h3 className="section-title text-light">Product Image</h3>

            <div className="image-upload-section">
              <FaImage className="upload-icon" />
              <Form.Group>
                <Form.Label className="text-light">Image URL</Form.Label>
                <Form.Control
                  type="text"
                  name="imageUrl"
                  value={product.imageUrl}
                  onChange={handleChange}
                  placeholder="Enter image URL"
                  className="glass-input"
                />
              </Form.Group>
            </div>

            {product.imageUrl && (
              <div className="image-preview">
                <img src={product.imageUrl} alt="Product preview" className="preview-image" />
              </div>
            )}
          </div>

          <div className="form-buttons">
            <Button type="submit" className="submit-btn">
              Add Product
            </Button>
            <Button variant="secondary" onClick={() => navigate("/products/manage")} className="cancel-btn">
              Cancel
            </Button>
          </div>
        </Form>
      </div>

      {showSuccess && (
        <Alert variant="success" className="glass-alert glass-alert-success">
          Product added successfully!
        </Alert>
      )}

      {showError && (
        <Alert variant="danger" className="glass-alert glass-alert-error">
          Please fill in all required fields!
        </Alert>
      )}
    </Container>
  );
};

export default AddProduct;
