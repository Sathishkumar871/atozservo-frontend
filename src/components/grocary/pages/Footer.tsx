import React from 'react';
import { FaInstagram, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { FiArrowRight } from 'react-icons/fi';
import './footer.css'; // This line imports the CSS file

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section footer-about">
          <h1 className="footer-logo">Grocery App</h1>
          <p className="footer-description">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
          </p>
          <div className="footer-socials">
            <a href="#" aria-label="Instagram">
              <FaInstagram className="footer-social-icon" />
            </a>
            <a href="#" aria-label="Facebook">
              <FaFacebook className="footer-social-icon" />
            </a>
            <a href="#" aria-label="Twitter">
              <FaTwitter className="footer-social-icon" />
            </a>
            <a href="#" aria-label="LinkedIn">
              <FaLinkedin className="footer-social-icon" />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <p className="footer-heading">COMPANY</p>
          <ul className="footer-list">
            <li><a href="#">About</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Press</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Partners</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <p className="footer-heading">SUPPORT</p>
          <ul className="footer-list">
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Safety Information</a></li>
            <li><a href="#">Cancellation Options</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Accessibility</a></li>
          </ul>
        </div>

        <div className="footer-section footer-newsletter">
          <p className="footer-heading">STAY UPDATED</p>
          <p className="footer-description">
            Subscribe to our newsletter for inspiration and special offers.
          </p>
          <div className="footer-form">
            <input
              type="email"
              className="newsletter-input"
              placeholder="Your email"
              aria-label="Your email"
            />
            <button className="newsletter-button" aria-label="Subscribe">
              <FiArrowRight className="newsletter-icon" />
            </button>
          </div>
        </div>
      </div>

      <hr className="footer-divider" />
      
      <div className="footer-bottom">
        <p>© {currentYear} Brand. All rights reserved.</p>
        <ul className="footer-links">
          <li><a href="#">Privacy</a></li>
          <li><a href="#">Terms</a></li>
          <li><a href="#">Sitemap</a></li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;