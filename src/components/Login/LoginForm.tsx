import axios from "axios";
import React, { useReducer, useState, useEffect } from "react";
import { Button, Form, Container, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { IAccount } from "../../Interfaces/ProjectInterfaces";
import { LoginGoogle } from "./LoginGoogle";
import { FaEnvelope, FaLock } from "react-icons/fa";
import "./LoginForm.css";
import "../../css/shared-styles.css";

export const LoginForm = () => {
  const navigate = useNavigate();

  const formReducer = (state: typeof initialState, action: any) => {
    switch (action.type) {
      case "SET_FIELD":
        return { ...state, [action.field]: action.value };
      case "SUBMIT":
        return { ...state, isSubmitted: true };
      default:
        return state;
    }
  };

  const initialState = { email: "", password: "", isSubmitted: false };
  const [state, dispatch] = useReducer(formReducer, initialState);
  const [errors, setErrors] = useState<any>({});
  const [succes, setSucces] = useState<any>(false);
  const [banned, setBanned] = useState<any>(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleValidation = () => {
    const newErrors: any = {};
    if (!state.email) newErrors.email = "Email is required";
    if (!state.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    setShowAlert(Object.keys(newErrors).length > 0);
    setTimeout(() => {
      setShowAlert(false);
    }, 1000);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch({ type: "SET_FIELD", field: name, value });
  };

  const [userAccount, setUserAccount] = useState<IAccount[]>([]);

  useEffect(() => {
    if (sessionStorage.getItem("auth")) {
      navigate("/products");
    }
    const _dataAccount = async () => {
      const _data = await axios.get(`http://localhost:5000/accounts`).then((res) => res.data);
      setUserAccount(_data);
    };
    _dataAccount();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (handleValidation()) {
      dispatch({ type: "SUBMIT" });
      let _u = userAccount.find((user) => {
        if (user.email === state.email && user.password === state.password) {
          return user;
        }
      });

      if (_u === null || _u === undefined) {
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 1000);
      } else {
        if (_u.status === "inactive") {
          setBanned(true);
          setTimeout(() => {
            setBanned(false);
          }, 1000);
        } else {
          setSucces(true);
          sessionStorage.setItem("auth", JSON.stringify(_u));
          sessionStorage.setItem("userRole", _u.role);
          setTimeout(() => {
            navigate("/products");
          }, 1000);
        }
      }
    }
  };

  return (
    <Container className="login-container glass-container">
      <h2 className="login-title text-light">Welcome Back</h2>

      <Form onSubmit={handleSubmit} className="login-form">
        <Form.Group controlId="formEmail">
          <Form.Label className="text-light">
            <FaEnvelope className="input-icon" /> Email
          </Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Enter your email"
            value={state.email}
            onChange={handleChange}
            isInvalid={!!errors.email}
            className="glass-input"
          />
          <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label className="text-light">
            <FaLock className="input-icon" /> Password
          </Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="Enter your password"
            value={state.password}
            onChange={handleChange}
            isInvalid={!!errors.password}
            className="glass-input"
          />
          <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit" className="login-btn glass-button">
          Login
        </Button>

        <Link to="/register" className="register-link glass-link">
          Don't have an account? Register here
        </Link>

        <div className="google-login">
          <LoginGoogle userAccount={userAccount} />
        </div>
      </Form>

      {showAlert && (
        <Alert variant="danger" className="glass-alert glass-alert-error">
          <strong>Error:</strong> Invalid username or password!
        </Alert>
      )}
      {succes && (
        <Alert variant="success" className="glass-alert glass-alert-success">
          <strong>Success:</strong> Welcome, {state.email.split("@")[0]}!
        </Alert>
      )}
      {banned && (
        <Alert variant="danger" className="glass-alert glass-alert-error">
          <strong>Warning:</strong> Your account has been banned
        </Alert>
      )}
    </Container>
  );
};
