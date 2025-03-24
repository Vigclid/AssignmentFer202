import axios from "axios";
import React, { useReducer, useState, useEffect } from "react";
import { Button, Form, Container, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { IAccount } from "../../Interfaces/ProjectInterfaces";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import "./Register.css";
import "../../css/shared-styles.css";

export const Register = () => {
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

  const initialState = { email: "", password: "", username: "", isSubmitted: false };
  const [state, dispatch] = useReducer(formReducer, initialState);
  const [errors, setErrors] = useState<any>({});
  const [succes, setSucces] = useState<Boolean>(false);
  const [duplicatedEmail, setDuplicatedEmail] = useState<Boolean>(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleValidation = () => {
    const newErrors: any = {};
    if (!state.email) newErrors.email = "Email is required";
    if (!state.password) newErrors.password = "Password is required";
    if (!state.username) newErrors.username = "Username is required";
    setErrors(newErrors);
    setShowAlert(Object.keys(newErrors).length > 0);
    setTimeout(() => {
      setShowAlert(false);
    }, 2000);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch({ type: "SET_FIELD", field: name, value });
  };

  const [userAccount, setUserAccount] = useState<IAccount[]>([]);

  useEffect(() => {
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
        if (user.email === state.email) {
          return user;
        }
      });
      const maxId = userAccount.length > 0 ? Math.max(...userAccount.map((user) => user.id)) : 0;
      const newId = maxId + 1;

      if (_u === null || _u === undefined) {
        const newUser: IAccount = {
          id: newId,
          email: state.email,
          username: state.username,
          password: state.password,
          role: "user",
          status: "active",
        };

        axios
          .post(`http://localhost:5000/accounts`, newUser)
          .then(() => {
            setSucces(true);
            setTimeout(() => {
              setSucces(false);
              navigate("/");
            }, 2000);
          })
          .catch((error) => {
            console.error("Error creating account:", error);
          });
      } else {
        setDuplicatedEmail(true);
        setTimeout(() => {
          setDuplicatedEmail(false);
        }, 2000);
      }
    }
  };

  return (
    <Container className="register-container glass-container">
      <h2 className="register-title text-light">Create Account</h2>

      <Form onSubmit={handleSubmit} className="register-form">
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

        <Form.Group controlId="formUsername">
          <Form.Label className="text-light">
            <FaUser className="input-icon" /> Username
          </Form.Label>
          <Form.Control
            type="text"
            name="username"
            placeholder="Choose a username"
            value={state.username}
            onChange={handleChange}
            isInvalid={!!errors.username}
            className="glass-input"
          />
          <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label className="text-light">
            <FaLock className="input-icon" /> Password
          </Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="Create a password"
            value={state.password}
            onChange={handleChange}
            isInvalid={!!errors.password}
            className="glass-input"
          />
          <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit" className="register-btn glass-button">
          Create Account
        </Button>

        <Link to="/" className="login-link glass-link">
          Already have an account? Login here
        </Link>
      </Form>

      {showAlert && (
        <Alert variant="danger" className="glass-alert glass-alert-error">
          <strong>Error:</strong> Please fill in all required fields!
        </Alert>
      )}
      {succes && (
        <Alert variant="success" className="glass-alert glass-alert-success">
          <strong>Success:</strong> Welcome, {state.email.split("@")[0]}! Registration successful!
        </Alert>
      )}
      {duplicatedEmail && (
        <Alert variant="danger" className="glass-alert glass-alert-error">
          <strong>Warning:</strong> This email is already registered
        </Alert>
      )}

      <div className="divider glass-divider"></div>

      <p className="terms-text text-light-muted">
        By creating an account, you agree to our Terms of Service and Privacy Policy
      </p>
    </Container>
  );
};
