import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './finance.css';

const Finance: React.FC = () => {
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(false); // టూల్టిప్ కనిపించడానికి స్టేట్

  const handleLoanClick = () => {
    navigate('/money-lending'); // కొత్త పేజీకి నావిగేట్ చేస్తుంది
  };

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault(); // డిఫాల్ట్ బ్రౌజర్ టూల్టిప్ ను నివారించడానికి
    setShowTooltip(true);
  };

  const handleTouchEnd = () => {
    setShowTooltip(false);
  };

  return (
    <div className="finance-page-wrapper"> {/* కొత్త పేజీ wrapper */}
      <div className="loan-button-wrapper"> {/* టూల్టిప్ పొజిషన్ కోసం wrapper */}
        <button 
          onClick={handleLoanClick} 
          className="loan-button"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="loan-button-icon"
          >
            {/* చెస్ పాన్ ఐకాన్ */}
            <path d="M12 2C9.243 2 7 4.243 7 7c0 2.213 1.258 4.093 3.12 5.176L8 16h8l-2.12-3.824C15.742 11.093 17 9.213 17 7c0-2.757-2.243-5-5-5zM4 22h16" />
          </svg>
        </button>

        {/* కస్టమ్ టూల్టిప్ */}
        {showTooltip && (
          <div className="custom-tooltip">
            Lend Money for Interest
          </div>
        )}
      </div>
    </div>
  );
};

export default Finance;