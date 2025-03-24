import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Dropdown, Card, Button } from "react-bootstrap";
import { FaShoppingCart, FaHistory, FaSearch, FaSort, FaSignOutAlt, FaCog } from "react-icons/fa";
import { IProduct, ICart, ICartItem, IAccount } from "../../../Interfaces/ProjectInterfaces";
import "./ProductList.css";
import "../../../css/shared-styles.css";

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("default");
  const [cart, setCart] = useState<ICart | null>(null);
  const [user, setUser] = useState<IAccount | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const authData = sessionStorage.getItem("auth");
    if (authData) {
      const parsedUser: IAccount = JSON.parse(authData);
      setUser(parsedUser);
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/products");
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
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
              id: `${user.id}-${Date.now()}`,
            };
            setCart(newCart);
          }
        } catch (error) {
          console.error("Error fetching cart:", error);
        }
      }
    };

    fetchProducts();
    if (user) fetchCart();
  }, [user]);

  useEffect(() => {
    let updatedProducts = [...products];

    if (searchTerm) {
      updatedProducts = updatedProducts.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortOrder === "lowToHigh") {
      updatedProducts.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "highToLow") {
      updatedProducts.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(updatedProducts);
  }, [searchTerm, sortOrder, products]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (order: string) => {
    setSortOrder(order);
  };

  const addToCart = async (product: IProduct) => {
    if (!cart || !user) {
      alert("Please log in to add products to the cart!");
      return;
    }

    const existingItem = cart.items.find((item) => item.productId === product.id);
    let updatedItems: ICartItem[];

    if (existingItem) {
      updatedItems = cart.items.map((item) =>
        item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedItems = [...cart.items, { productId: product.id, quantity: 1 }];
    }

    const newTotal = updatedItems.reduce((sum, item) => {
      const productPrice = products.find((p) => p.id === item.productId)?.price || 0;
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
      console.error("Error updating cart on the server:", error);
    }
  };

  const cartItemCount = cart ? cart.items.reduce((total, item) => total + item.quantity, 0) : 0;

  const handleLogout = () => {
    sessionStorage.removeItem("auth");
    sessionStorage.removeItem(`cart_${user?.id}`);
    sessionStorage.removeItem(`userRole`);
    navigate("/");
  };

  return (
    <Container className="product-list-container">
      <div className="product-list-header glass-container">
        <h1 className="product-list-title text-light">Product Catalog</h1>
        <div className="search-filter-section">
          <div className="search-box">
            <FaSearch className="search-icon text-light" />
            <Form.Control
              type="text"
              placeholder="Search products by name..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="glass-input search-input"
            />
          </div>
          <Dropdown onSelect={(eventKey: any) => handleSortChange(eventKey)}>
            <Dropdown.Toggle variant="secondary" id="dropdown-sort" className="glass-button">
              <FaSort className="me-2" /> Sort by price
            </Dropdown.Toggle>
            <Dropdown.Menu className="glass-container">
              <Dropdown.Item eventKey="default">Default</Dropdown.Item>
              <Dropdown.Item eventKey="lowToHigh">Low to High</Dropdown.Item>
              <Dropdown.Item eventKey="highToLow">High to Low</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <div className="header-actions">
            {user?.role === "admin" ? (
              <Button variant="primary" onClick={() => navigate("/products/manage")} className="glass-button">
                <FaCog className="me-2" /> Manage Products
              </Button>
            ) : (
              <>
                <Button variant="link" onClick={() => navigate("/cart")} className="cart-button glass-icon">
                  <FaShoppingCart size={24} />
                  {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
                </Button>
                <Button variant="link" onClick={() => navigate("/order-history")} className="glass-icon">
                  <FaHistory size={24} />
                </Button>
              </>
            )}
            <Button variant="warning" onClick={handleLogout} className="glass-button logout-btn">
              <FaSignOutAlt className="me-2" /> Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="glass-card product-card">
              <div className="product-image-wrapper">
                <img
                  src={product.imageUrl || "https://via.placeholder.com/150"}
                  alt={product.name}
                  className="product-image"
                />
              </div>
              <div className="product-card-body">
                <h3 className="product-title text-light">{product.name}</h3>
                <p className="product-price">{product.price.toLocaleString("vi-VN")} VND</p>
                <p className="product-description text-light-muted">{product.description}</p>
                <div className="product-actions">
                  <Button variant="primary" onClick={() => navigate(`/products/${product.id}`)} className="view-btn">
                    View Details
                  </Button>
                  {user?.role !== "admin" && (
                    <Button variant="success" onClick={() => addToCart(product)} className="add-to-cart-btn">
                      Add to Cart
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state glass-card">
            <p className="text-light">No products found.</p>
          </div>
        )}
      </div>
    </Container>
  );
};

export default ProductList;
