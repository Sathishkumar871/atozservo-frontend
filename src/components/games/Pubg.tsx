import React, { useState, useEffect } from 'react';
import './Pubg.css'; // Pubg కోసం కొత్త CSS ఫైల్

const Pubg: React.FC = () => {
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [showInstructions, setShowInstructions] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDetails(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleInstructionsClick = (): void => {
    setShowInstructions(true);
  };

  const handleCloseInstructions = (): void => {
    setShowInstructions(false);
  };

  const handleBattleNowClick = (): void => {
    alert('Joining the PUBG match...');
  };

  return (
    <div className="pubg-container">
      <div className="card-wrapper">
        
        {/* Game Image with Animation */}
        <div className="image-container">
          <img
            src="https://ik.imagekit.io/pimx50ija/thumb-1920-947385.jpg?updatedAt=1754320849325"
            alt="PUBG"
            className="game-image"
          />
          <div className="animated-ring"></div>
        </div>

        {/* Details and Buttons */}
        <div className={`details-container ${showDetails ? 'fade-in' : ''}`}>
          <h1 className="game-title">PUBG Battlegrounds</h1>
          
          <div className="details-section">
            <h2 className="section-title">Battle Rules</h2>
            <ul className="rules-list">
              <li>4 vs 4 match</li>
              <li>No hacks or exploits allowed</li>
              <li>Match time: 20 mins</li>
              <li>Winner based on chicken dinner</li>
            </ul>
          </div>
          
          <div className="details-section">
            <h2 className="section-title">Entry Fee</h2>
            <select className="entry-fee-select">
              <option value="20">₹20</option>
              <option value="75">₹75</option>
              <option value="150">₹150</option>
              <option value="300">₹300</option>
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

      {/* Instructions Modal Panel */}
      {showInstructions && (
        <div className="modal-backdrop" onClick={handleCloseInstructions}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Tournament Instructions</h3>
              <button className="close-btn" onClick={handleCloseInstructions}>&times;</button>
            </div>
            <div className="modal-body">
              <p>Welcome to the PUBG Tournament! Please read the rules carefully before joining.</p>
              <ul className="modal-rules-list">
                <li><span role="img" aria-label="checkmark">✅</span> All matches are 4 vs 4.</li>
                <li><span role="img" aria-label="no-entry">🚫</span> Use of any hacks or exploits is strictly prohibited.</li>
                <li><span role="img" aria-label="stopwatch">⏱️</span> Each match duration is 20 minutes.</li>
                <li><span role="img" aria-label="trophy">🏆</span> The last team standing wins the chicken dinner.</li>
                <li><span role="img" aria-label="warning">⚠️</span> Disconnecting during a match will result in an automatic loss.</li>
              </ul>
              <p className="modal-disclaimer">By joining the match, you agree to all the rules.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pubg;