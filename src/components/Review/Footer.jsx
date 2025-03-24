import React from "react";
import "./css/Footer.css";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaHeart,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer-glass">
      <div className="glass-overlay"></div>

      <div className="footer-content-wrapper">
        {/* Main Content Section */}
        <div className="footer-main">
          {/* Brand Section */}
          <div className="footer-brand">
            <h2>Your Brand</h2>
            <p className="slogan">Crafting digital experiences with passion</p>
            <div className="social-links">
              <a href="#" className="social-link glass-icon" aria-label="Facebook">
                <FaFacebook />
                <span className="tooltip">Facebook</span>
              </a>
              <a href="#" className="social-link glass-icon" aria-label="Twitter">
                <FaTwitter />
                <span className="tooltip">Twitter</span>
              </a>
              <a href="#" className="social-link glass-icon" aria-label="Instagram">
                <FaInstagram />
                <span className="tooltip">Instagram</span>
              </a>
              <a href="#" className="social-link glass-icon" aria-label="LinkedIn">
                <FaLinkedin />
                <span className="tooltip">LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Info Grid */}
          <div className="footer-grid">
            {/* Navigation Links */}
            <div className="footer-section nav-section">
              <h3>Navigation</h3>
              <ul className="footer-links">
                <li>
                  <a href="/">Home</a>
                </li>
                <li>
                  <a href="/products">Products</a>
                </li>
                <li>
                  <a href="/services">Services</a>
                </li>
                <li>
                  <a href="/about">About Us</a>
                </li>
              </ul>
            </div>

            {/* Services Section */}
            <div className="footer-section services-section">
              <h3>Our Services</h3>
              <ul className="footer-links">
                <li>
                  <a href="/web-design">Web Design</a>
                </li>
                <li>
                  <a href="/development">Development</a>
                </li>
                <li>
                  <a href="/marketing">Marketing</a>
                </li>
                <li>
                  <a href="/consulting">Consulting</a>
                </li>
              </ul>
            </div>

            {/* Contact Section */}
            <div className="footer-section contact-section">
              <h3>Get in Touch</h3>
              <div className="contact-info">
                <p>
                  <FaPhone className="contact-icon" /> (+84) 123-456-789
                </p>
                <p>
                  <FaEnvelope className="contact-icon" /> info@company.com
                </p>
                <p>
                  <FaMapMarkerAlt className="contact-icon" /> District 1, HCMC
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="copyright">
            <p>
              © {new Date().getFullYear()} Your Brand. Made with <FaHeart className="heart-icon" /> in Vietnam
            </p>
          </div>
          <div className="footer-bottom-links">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/cookies">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
