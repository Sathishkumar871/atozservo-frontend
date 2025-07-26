import React from 'react';
import './PolicyPanel.css';
import { RiFilePaper2Line } from 'react-icons/ri';

interface PolicyPanelProps {
  onClose: () => void;
}

const PolicyPanel: React.FC<PolicyPanelProps> = ({ onClose }) => {
  return (
    <div className="policy-panel-wrapper" role="dialog" aria-modal="true" aria-labelledby="policy-title">
      <div className="policy-panel-header">
        <RiFilePaper2Line size={22} />
        <h2 id="policy-title">Privacy Policy</h2>
        <button className="close-btn" onClick={onClose} aria-label="Close policy panel">✕</button>
      </div>

      <div className="policy-content">
        <section className="policy-section">
          <h3>1. Introduction</h3>
          <p>Welcome to AtoZServo.xyz! This document outlines our privacy policies and user expectations.</p>
        </section>

        <section className="policy-section">
          <h3>2. Services Offered</h3>
          <ul>
            <li>Chat Room Access (₹39/month)</li>
            <li>Verified Dating Profiles</li>
            <li>NEET Coaching by Experts</li>
            <li>Tool/Grocery/Food Delivery</li>
            <li>Marriage Matchmaking</li>
          </ul>
        </section>

        <section className="policy-section">
          <h3>3. Privacy & Data</h3>
          <p>Your data is securely encrypted. We never sell your information. Users may request deletion at any time.</p>
        </section>

        <section className="policy-section">
          <h3>4. Contact & Support</h3>
          <p>
            📞 +91 81794 77995<br />
            ✉ support@atozservo.xyz<br />
            🌐 <a href="https://atozservo.xyz" target="_blank" rel="noopener noreferrer">atozservo.xyz</a>
          </p>
        </section>

        <footer className="policy-footer">
          🕒 Last updated: July 7, 2025 — Subject to change without notice.
        </footer>
      </div>
    </div>
  );
};

export default PolicyPanel;