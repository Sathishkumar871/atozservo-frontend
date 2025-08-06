// FreeFire.jsx లో ఎటువంటి మార్పులు అవసరం లేదు.
// పాత కోడ్ ను అలాగే ఉంచుకోవచ్చు.
import React, { useState, useEffect } from 'react';
import './FreeFire.css';

const FreeFire: React.FC = () => {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDetails(true);
    }, 1500); // యానిమేషన్ తర్వాత వివరాలు కనిపించేలా 1.5 సెకన్లు వెయిట్ చేయండి

    return () => clearTimeout(timer);
  }, []);

  const handleInstructionsClick = () => {
    alert('Tournament Instructions:\n1. 1 vs 1 match\n2. No hacks allowed\n3. Match time: 10 mins\n4. Highest kill wins');
  };

  const handleBattleNowClick = () => {
    alert('Joining the match...');
  };

  return (
    <div className="freefire-container">
      <div className="card-wrapper">
        
        {/* Game Image with Animation */}
        <div className="image-container">
          <img
            src="https://ik.imagekit.io/pimx50ija/IMG_20250804_165731.jpg?updatedAt=1754306894179"
            alt="Free Fire"
            className="game-image"
          />
          <div className="animated-ring"></div>
        </div>

        {/* Details and Buttons */}
        <div className={`details-container ${showDetails ? 'fade-in' : ''}`}>
          <h1 className="game-title">Free Fire Battle</h1>
          
          <div className="details-section">
            <h2 className="section-title">Battle Rules</h2>
            <ul className="rules-list">
              <li>1 vs 1 match</li>
              <li>No hacks allowed</li>
              <li>Match time: 10 mins</li>
              <li>Highest kill wins</li>
            </ul>
          </div>
          
          <div className="details-section">
            <h2 className="section-title">Entry Fee</h2>
            <select className="entry-fee-select">
              <option value="10">₹10</option>
              <option value="50">₹50</option>
              <option value="100">₹100</option>
              <option value="200">₹200</option>
            </select>
          </div>

          <div className="button-group">
            <button onClick={handleInstructionsClick} className="instructions-btn">
              Instructions
            </button>
            <button onClick={handleBattleNowClick} className="battle-btn">
              Battle Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeFire;