import React from "react";
import "./NewsLetter.css";

const NewsLetter: React.FC = () => {
  return (
    <div className="newsletter-container">
      <h1>Never Miss a Deal!</h1>
      <p>
        Subscribe to get the latest offers, new arrivals, and exclusive
        discounts
      </p>
      <form className="newsletter-form">
        <input
          type="text"
          placeholder="Enter your email id"
          required
        />
        <button type="submit">Subscribe</button>
      </form>
    </div>
  );
};

export default NewsLetter;
