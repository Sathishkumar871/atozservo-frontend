import React, { useState } from 'react';
import './MoneyLending.css';

const MoneyLending: React.FC = () => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('');
  const [photoFiles, setPhotoFiles] = useState<FileList | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoFiles(e.target.files);
  };

  const handleSendWhatsApp = () => {
    if (!name || !amount || !duration) {
      alert('Please fill in all required fields.');
      return;
    }

    const phoneNumber = '918179477995';
    const message = `Loan Application Details:
Name: ${name}
Amount: ₹${amount}
Duration: ${duration} months

*Please find attached the required documents (Aadhar, PAN, etc.).*`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    alert('WhatsApp chat opened. Please attach your documents manually in the chat.');
  };

  return (
    <div className="lending-container">
      <div className="lending-wrapper">
        <h1 className="lending-title">Money Lending Application</h1>
        <p className="lending-subtitle">Fill in the details and send to our team via WhatsApp.</p>

        <div className="lending-form">
          <div className="form-group">
            <label htmlFor="name">Your Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="amount">Loan Amount (₹)</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g., 50000"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="duration">Loan Duration (Months)</label>
            <input
              type="number"
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g., 12"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="photos">Upload Photos (e.g., Aadhar, PAN)</label>
            <input
              type="file"
              id="photos"
              multiple
              onChange={handleFileChange}
              className="form-input-file"
            />
            {photoFiles && (
              <ul className="photo-preview">
                {Array.from(photoFiles).map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            )}
          </div>

          <button
            onClick={handleSendWhatsApp}
            className="send-whatsapp-btn"
            disabled={!name || !amount || !duration}
          >
            Send on WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoneyLending;
