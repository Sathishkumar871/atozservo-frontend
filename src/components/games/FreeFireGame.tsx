import React, { useState } from 'react';
import './FreeFire.css';

interface Team {
  name: string;
  points: number;
}

interface Tournament {
  id: number;
  date: string;
  time: string;
  name: string;
  hostedBy: string;
  status: 'Open' | 'Live' | 'Completed' | 'Waiting';
  teamSize: string;
  image: string;
  homeImage?: string; // Added an optional image for the home page
  liveStreamUrl?: string;
  prizePool: string;
  rules: string[];
  venue: string;
  bookingOpens: string;
  registeredTeams: Team[];
  registeredMembersCount: number;
}

const initialTournaments: Tournament[] = [
    {
        id: 1,
        date: 'SEP 06, 2025',
        time: '12:00 PM',
        name: 'DARK DEMONS',
        hostedBy: 'COSMOS • Ind...',
        status: 'Open',
        teamSize: '1v1',
        // This is the image for the Tournaments/Details page
        image: 'https://ik.imagekit.io/pimx50ija/a10b4aeb2ed3e55021954e9e0c6f46da.jpg?updatedAt=1755529182983',
        // This is the special image ONLY for the Home page
        homeImage: 'https://ik.imagekit.io/pimx50ija/5741f98c94fcddb5f3df4c1f21d8d411.jpg?updatedAt=1755529107252',
        prizePool: '₹5,000',
        rules: ['1 vs 1 match', 'No hacks allowed', 'Match time: 10 mins', 'Highest kill wins'],
        venue: 'To be Announced',
        bookingOpens: 'AUG 28, 2025',
        registeredTeams: [],
        registeredMembersCount: 0,
    },
    {
        id: 2,
        date: 'AUG 13, 2025',
        time: '07:00 PM',
        name: 'El mejor',
        hostedBy: 'Mccloving Free...',
        status: 'Live',
        teamSize: '1v1',
        image: 'https://ik.imagekit.io/pimx50ija/fa16c1fbedf78148009999701ceb7088.jpg?updatedAt=1755529050548',
        liveStreamUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        prizePool: '₹10,000',
        rules: ['1 vs 1 match', 'No hacks allowed', 'Match time: 10 mins', 'Highest kill wins'],
        venue: 'Online',
        bookingOpens: 'AUG 01, 2025',
        registeredTeams: [{ name: 'Team Alpha', points: 150 }, { name: 'Team Beta', points: 120 }],
        registeredMembersCount: 50,
    },
    {
        id: 3,
        date: 'SEP 15, 2025',
        time: '08:30 PM',
        name: 'Pro Game - 2v2',
        hostedBy: 'esports',
        status: 'Open',
        teamSize: '2v2',
        image: 'https://ik.imagekit.io/pimx50ija/989837009ed106b791ed2c448ae2e31c.jpg?updatedAt=1755528995793',
        prizePool: '₹20,000',
        rules: ['2 vs 2 match', 'Team coordination required', 'Match time: 15 mins'],
        venue: 'To be Announced',
        bookingOpens: 'SEP 10, 2025',
        registeredTeams: [],
        registeredMembersCount: 0,
    },
    {
        id: 4,
        date: 'SEP 17, 2025',
        time: '03:00 PM',
        name: 'Squad Battle',
        hostedBy: 'Elite Gamers',
        status: 'Open',
        teamSize: '4v4',
        image: 'https://ik.imagekit.io/pimx50ija/0c6145222ef8a3b420f4e6f7cfb15cb1.jpg?updatedAt=1755528694210',
        prizePool: '₹50,000',
        rules: ['4 vs 4 match', 'Team coordination required'],
        venue: 'To be Announced',
        bookingOpens: 'SEP 10, 2025',
        registeredTeams: [],
        registeredMembersCount: 0,
    },
];

const FreeFire: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'tournaments' | 'live' | 'ranking' | 'schedule' | 'details' | 'liveStream'>('home');
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  
  const [bookingStep, setBookingStep] = useState<'details' | 'payment' | 'upload' | 'confirm'>('details');
  const [teamName, setTeamName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [bookingId, setBookingId] = useState('');

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [tournaments] = useState<Tournament[]>(initialTournaments);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };
  
  const handleBookClick = (tournament: Tournament) => {
    if (tournament.teamSize !== '1v1') {
        showNotification("Booking for this mode will open after the 1v1 tournament is completed.", 'error');
        return;
    }
    setSelectedTournament(tournament);
    setBookingStep('details');
    setTeamName('');
    setMobileNumber('');
    setPaymentScreenshot(null);
    setBookingId('');
    setIsBookingModalOpen(true);
  };

  const handleWatchLiveClick = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setActiveTab('liveStream');
  };
  
  const handleViewDetails = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setActiveTab('details');
  };

  const handleProceedToPayment = () => {
    if (!teamName) {
      showNotification("Please enter your team name.", 'error');
      return;
    }
    if (!mobileNumber || !/^\d{10}$/.test(mobileNumber)) {
        showNotification("Please enter a valid 10-digit mobile number.", 'error');
        return;
    }
    setBookingStep('payment');
  };

  const handlePaymentDone = () => {
    setBookingStep('upload');
  };

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        setPaymentScreenshot(e.target.files[0]);
    }
  };

  const handleSubmitProof = () => {
    if (!paymentScreenshot) {
        showNotification("Please upload the payment screenshot.", 'error');
        return;
    }
    const randomId = `${selectedTournament?.name.substring(0, 4).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;
    setBookingId(randomId);

    const message = `
      --- New Tournament Booking ---
      Tournament: ${selectedTournament?.name}
      Team Name: ${teamName}
      Mobile: ${mobileNumber}
      Booking ID: ${randomId}
      -----------------------------
      I have uploaded the payment screenshot. Please verify and confirm my slot.
    `;
    
    const whatsappUrl = `https://wa.me/918179477995?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    setBookingStep('confirm');
  };

  const handleCustomerSupport = () => {
    setIsSupportModalOpen(true);
  };

  const renderActionButton = (tournament: Tournament) => {
    if (tournament.status === 'Live') {
      return (
        <button className="cta-button live-btn" onClick={(e) => { e.stopPropagation(); handleWatchLiveClick(tournament); }}>
          Watch Live
        </button>
      );
    } else if (tournament.status === 'Open') {
        const now = new Date();
        const bookingOpenDate = new Date(tournament.bookingOpens);
        now.setHours(0,0,0,0);
        bookingOpenDate.setHours(0,0,0,0);

        if (now < bookingOpenDate) {
            return (
                <button className="cta-button disabled-btn" disabled>
                    Booking starts {tournament.bookingOpens.split(',')[0]}
                </button>
            );
        }
        return (
            <button className="cta-button book-btn" onClick={(e) => { e.stopPropagation(); handleBookClick(tournament); }}>
              Book Now
            </button>
        );
    } else {
      return null;
    }
  };

  const renderContent = () => {
    const liveTournaments = tournaments.filter(t => t.status === 'Live');
    const upcomingTournaments = tournaments.filter(t => t.status === 'Open' || t.status === 'Waiting');
    const completedTournaments = tournaments.filter(t => t.status === 'Completed');

    if (activeTab === 'liveStream' && selectedTournament) {
      return (
        <div className="live-stream-page">
          <button className="back-button" onClick={() => setActiveTab('live')}>← Back</button>
          <div className="live-header">
            <h2 className="live-stream-title">{selectedTournament.name} - LIVE</h2>
            <div className="live-scoreboard">
              <span>{selectedTournament.registeredTeams[0]?.name || 'Team 1'}: 150</span>
              <span>{selectedTournament.registeredTeams[1]?.name || 'Team 2'}: 120</span>
            </div>
          </div>
          <div className="video-player">
            <iframe src={selectedTournament.liveStreamUrl} title="Live Stream" allowFullScreen></iframe>
          </div>
          <div className="live-info-panel">
            <h3>Live Leaderboard</h3>
            <ul className="live-leaderboard">
              {selectedTournament.registeredTeams.sort((a,b) => b.points - a.points).map((team, index) => (
                <li key={index}>
                  <span>{index + 1}. {team.name}</span>
                  <span>{team.points} Points</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }
    
    if (activeTab === 'details' && selectedTournament) {
      return (
        <div className="tournament-details-page">
          <button className="back-button" onClick={() => setActiveTab('tournaments')}>← Back</button>
          <div className="details-header">
            <img src={selectedTournament.image} alt={selectedTournament.name} />
            <div className="details-header-info">
              <h1>{selectedTournament.name}</h1>
              <p>Hosted by {selectedTournament.hostedBy}</p>
              <div className="action-buttons">
                {renderActionButton(selectedTournament)}
              </div>
            </div>
          </div>
          <div className="details-body">
            <div className="details-card">
              <h3>Prize Pool</h3>
              <p className="prize-pool-text">{selectedTournament.prizePool}</p>
            </div>
            <div className="details-card">
                <h3>Venue</h3>
                <p>{selectedTournament.venue}</p>
            </div>
            <div className="details-card">
              <h3>Tournament Rules</h3>
              <ul>
                {selectedTournament.rules.map((rule, index) => <li key={index}>{rule}</li>)}
              </ul>
            </div>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'home':
        return (
          <div className="home-dashboard">
            <h2>Live Now</h2>
            <div className="tournament-list horizontal-scroll">
              {liveTournaments.map(t => (
                <div key={t.id} className="tournament-card wide-card" onClick={() => handleWatchLiveClick(t)}>
                  <img src={t.image} alt={t.name} />
                  <p>{t.name}</p>
                  <button className="live-btn">WATCH LIVE</button>
                </div>
              ))}
            </div>
            <h2>Upcoming Tournaments</h2>
            <div className="tournament-list">
              {upcomingTournaments.map(t => (
                <div key={t.id} className="tournament-card" onClick={() => handleViewDetails(t)}>
                  {/* --- THIS LOGIC WAS CHANGED TO SHOW A DIFFERENT HOME IMAGE --- */}
                  <img src={t.homeImage || t.image} alt={t.name} />
                  <div className="card-info">
                    <h3>{t.name}</h3>
                    <p>{t.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'tournaments':
        return (
          <div className="full-tournament-list">
            <h1>Upcoming Tournaments</h1>
            {upcomingTournaments.map(t => (
              <div key={t.id} className="tournament-card" onClick={() => handleViewDetails(t)}>
                <img src={t.image} alt={t.name} />
                <div className="card-info">
                  <h3>{t.name}</h3>
                  <p>{t.date} @ {t.time}</p>
                  <p className="prize-pool">Prize Pool: {t.prizePool}</p>
                </div>
                {renderActionButton(t)}
              </div>
            ))}
          </div>
        );
      case 'live':
        return (
          <div className="full-tournament-list">
            <h1>Live Tournaments</h1>
            {liveTournaments.map(t => (
              <div key={t.id} className="tournament-card" onClick={() => handleWatchLiveClick(t)}>
                <img src={t.image} alt={t.name} />
                <div className="card-info">
                  <h3>{t.name}</h3>
                  <p>LIVE NOW</p>
                </div>
                {renderActionButton(t)}
              </div>
            ))}
          </div>
        );
      case 'ranking':
        return (
          <div className="ranking-page">
            <h1>Leaderboards</h1>
            {completedTournaments.map(t => (
              <div key={t.id} className="leaderboard-card">
                <h3>{t.name} - Final Standings</h3>
                <ul>
                  {t.registeredTeams.sort((a,b) => b.points - a.points).map((team, index) => (
                    <li key={index} className={index === 0 ? 'first-place' : ''}>
                      <span>{index + 1}. {team.name}</span>
                      <span>{team.points} Points</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );
      case 'schedule':
        return (
          <div className="schedule-page">
            <h1>Tournament Schedule</h1>
            <div className="schedule-list">
              {[...new Set(tournaments.map(t => t.date))].sort().map(date => (
                <div key={date} className="schedule-day">
                  <h2>{date}</h2>
                  {tournaments.filter(t => t.date === date).map(t => (
                    <div key={t.id} className="scheduled-game-card">
                      <img src={t.image} alt={t.name} />
                      <div className="game-info">
                        <h3>{t.name} ({t.teamSize})</h3>
                        <p>Time: {t.time}</p>
                        <div className="registered-teams-list">
                          <p>Booked Teams ({t.registeredTeams.length}):</p>
                          {t.registeredTeams.length > 0 ? (
                            <ul>
                              {t.registeredTeams.map((team, index) => <li key={index}>{team.name}</li>)}
                            </ul>
                          ) : (
                            <p>No teams booked yet.</p>
                          )}
                        </div>
                      </div>
                      <button className="book-btn" onClick={() => handleBookClick(t)}>
                        Book Game
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`app-container ${activeTab}-bg`}>
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      <div className="freefire-app">
        <header className="header">
          <h1 className="main-logo">FreeFire Esports</h1>
          <button className="customer-support-btn" onClick={handleCustomerSupport}>
            Support
          </button>
        </header>

        <nav className="nav-bar">
          <button className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>Home</button>
          <button className={`nav-item ${activeTab === 'tournaments' ? 'active' : ''}`} onClick={() => setActiveTab('tournaments')}>Tournaments</button>
          <button className={`nav-item ${activeTab === 'live' ? 'active' : ''}`} onClick={() => setActiveTab('live')}>Live</button>
          <button className={`nav-item ${activeTab === 'ranking' ? 'active' : ''}`} onClick={() => setActiveTab('ranking')}>Ranking</button>
          <button className={`nav-item ${activeTab === 'schedule' ? 'active' : ''}`} onClick={() => setActiveTab('schedule')}>Schedule</button>
        </nav>

        <main className="main-content">
          {renderContent()}
        </main>

        <div className="policy-section">
            <p>Our website does not encourage any fraud. You will be disqualified if you make any mistakes.</p>
        </div>
      </div>
      
      {isBookingModalOpen && selectedTournament && (
        <div className="modal-overlay">
          <div className="modal payment-modal">
            {bookingStep === 'details' && (
              <>
                <h2>Book Your Slot (Step 1 of 4)</h2>
                <p>To join, please provide your details. Our team will call you for confirmation.</p>
                <div className="trust-badge">
                  <p>🎁 <strong>Share & Win:</strong> A special gift will be given to the person who shares this tournament the most!</p>
                </div>
                <form className="booking-form" onSubmit={(e) => e.preventDefault()}>
                  <label htmlFor="teamName">Your Team Name (or Game Name)</label>
                  <input 
                    type="text" 
                    id="teamName" 
                    value={teamName} 
                    onChange={(e) => setTeamName(e.target.value)} 
                    placeholder="Enter your team name"
                    required 
                  />
                   <label htmlFor="mobileNumber">Your 10-Digit Mobile Number</label>
                  <input 
                    type="tel" 
                    id="mobileNumber" 
                    value={mobileNumber} 
                    onChange={(e) => setMobileNumber(e.target.value)} 
                    placeholder="Enter your mobile number"
                    maxLength={10}
                    required 
                  />
                  <div className="modal-buttons">
                    <button type="button" className="cta-button" onClick={handleProceedToPayment}>
                      Proceed to Payment
                    </button>
                    <button type="button" className="close-modal-btn" onClick={() => setIsBookingModalOpen(false)}>Cancel</button>
                  </div>
                </form>
              </>
            )}

            {bookingStep === 'payment' && (
              <>
                <h2>Pay Entry Fee (Step 2 of 4)</h2>
                <div className="trust-badge">
                  <p><b>Note:</b> After payment, our team will call you to confirm your slot. If you are not satisfied, your money will be fully refunded before the tournament date.</p>
                </div>
                <p className="payment-instructions">
                  Please scan the QR code below to pay the entry fee of <strong>₹50</strong>. The amount is automatically set.
                </p>
                <img 
                  src="https://ik.imagekit.io/pimx50ija/WhatsApp%20Image%202025-08-19%20at%2012.02.46_5f461ad5.jpg?updatedAt=1755585267709" 
                  alt="Payment QR Code for 50 INR" 
                  className="payment-qr-code"
                />
                <div className="modal-buttons">
                  <button type="button" className="cta-button" onClick={handlePaymentDone}>
                    I have Paid, Next
                  </button>
                  <button type="button" className="close-modal-btn" onClick={() => setBookingStep('details')}>Back</button>
                </div>
              </>
            )}

            {bookingStep === 'upload' && (
                <>
                    <h2>Upload Payment Proof (Step 3 of 4)</h2>
                    <p>To verify your payment, please upload a screenshot of the successful transaction.</p>
                    <form className="booking-form" onSubmit={(e) => e.preventDefault()}>
                        <label htmlFor="screenshot">Upload Screenshot</label>
                        <input 
                            type="file" 
                            id="screenshot"
                            accept="image/*"
                            onChange={handleScreenshotUpload}
                            required
                        />
                        {paymentScreenshot && <p className="file-name">Selected: {paymentScreenshot.name}</p>}
                        <div className="modal-buttons">
                            <button type="button" className="cta-button" onClick={handleSubmitProof}>
                                Submit Proof & Get Code
                            </button>
                            <button type="button" className="close-modal-btn" onClick={() => setBookingStep('payment')}>Back</button>
                        </div>
                    </form>
                </>
            )}

            {bookingStep === 'confirm' && (
              <>
                <h2>Booking Submitted! (Step 4 of 4)</h2>
                <p className="success-message">Thank you! Your booking request has been submitted.</p>
                <p>Please save this confirmation code:</p>
                <p className="booking-id">{bookingId}</p>
                <p>Our team will verify your payment and call you on <strong>{mobileNumber}</strong> to confirm your slot. Please send your screenshot on WhatsApp if prompted.</p>
                <div className="modal-buttons">
                  <button type="button" className="close-modal-btn" onClick={() => setIsBookingModalOpen(false)}>Close</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {isSupportModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Customer Support</h2>
            <p>For immediate assistance, please contact us on WhatsApp.</p>
            <a href="https://wa.me/918179477995" className="whatsapp-button" target="_blank" rel="noopener noreferrer">
              Contact on WhatsApp
            </a>
            <button className="close-modal-btn" onClick={() => setIsSupportModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FreeFire;