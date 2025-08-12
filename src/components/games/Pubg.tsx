import React, { useState } from 'react';
import './Pubg.css';

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
  liveStreamUrl?: string;
  prizePool: string;
  rules: string[];
  registeredTeams: Team[];
  registeredMembersCount: number;
}

const initialTournaments: Tournament[] = [
  {
    id: 1,
    date: 'AUG 12, 2025',
    time: '12:00 PM',
    name: 'Desert Knights',
    hostedBy: 'Squad Zone',
    status: 'Open',
    teamSize: '4v4',
    image: 'https://ik.imagekit.io/pimx50ija/pubg_1.jpg?updatedAt=1754320849325',
    prizePool: '₹15,000',
    rules: ['4 vs 4 team match', 'No cheats or hacks allowed', 'Map: Erangel', 'Winner takes all'],
    registeredTeams: [],
    registeredMembersCount: 45,
  },
  {
    id: 2,
    date: 'AUG 13, 2025',
    time: '07:00 PM',
    name: 'Battle Royale Classic',
    hostedBy: 'Alpha Esports',
    status: 'Live',
    teamSize: '1v1',
    image: 'https://ik.imagekit.io/pimx50ija/pubg_2.jpg?updatedAt=1754320849325',
    liveStreamUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
    prizePool: '₹20,000',
    rules: ['Solo match', 'Last man standing wins', 'Map: Vikendi'],
    registeredTeams: [{ name: 'PlayerX', points: 150 }, { name: 'PlayerY', points: 120 }],
    registeredMembersCount: 50,
  },
  {
    id: 3,
    date: 'AUG 15, 2025',
    time: '08:30 PM',
    name: 'Miramar Mayhem',
    hostedBy: 'Gamers Inc.',
    status: 'Open',
    teamSize: '2v2',
    image: 'https://ik.imagekit.io/pimx50ija/pubg_3.jpg?updatedAt=1754320849325',
    prizePool: '₹10,000',
    rules: ['2 vs 2 team match', 'Map: Miramar', 'Highest kills wins'],
    registeredTeams: [],
    registeredMembersCount: 50,
  },
  {
    id: 4,
    date: 'AUG 17, 2025',
    time: '03:00 PM',
    name: 'Squad Battle',
    hostedBy: 'Elite Gamers',
    status: 'Open',
    teamSize: '4v4',
    image: 'https://ik.imagekit.io/pimx50ija/pubg_4.jpg?updatedAt=1754320849325',
    prizePool: '₹50,000',
    rules: ['4 vs 4 match', 'Team coordination required'],
    registeredTeams: [],
    registeredMembersCount: 55,
  },
  {
    id: 5,
    date: 'AUG 08, 2025',
    time: '08:00 PM',
    name: 'Final Round',
    hostedBy: 'Legends Club',
    status: 'Completed',
    teamSize: '5v5',
    image: 'https://ik.imagekit.io/pimx50ija/pubg_5.jpg?updatedAt=1754320849325',
    prizePool: '₹50,000',
    rules: ['5 vs 5 match'],
    registeredTeams: [{ name: 'Winners Squad', points: 300 }, { name: 'Runners Squad', points: 250 }],
    registeredMembersCount: 50,
  },
];

const Pubg: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'tournaments' | 'live' | 'ranking' | 'schedule' | 'details' | 'liveStream'>('home');
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [tournaments, setTournaments] = useState<Tournament[]>(initialTournaments);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleApplyClick = (tournament: Tournament) => {
    if (tournament.registeredMembersCount >= 50) {
      showNotification("Registration is currently closed or full.", 'error');
      return;
    }
    setSelectedTournament(tournament);
    setIsApplyModalOpen(true);
  };
  
  const handleBookClick = (tournament: Tournament) => {
    setSelectedTournament(tournament);
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

  const handleRegisterSubmit = (e: React.FormEvent, isBooking: boolean) => {
    e.preventDefault();
    if (selectedTournament) {
      const newTeam: Team = { name: teamName, points: 0 };
      setTournaments(prevTournaments =>
        prevTournaments.map(t =>
          t.id === selectedTournament.id
            ? { ...t, registeredTeams: [...t.registeredTeams, newTeam], registeredMembersCount: t.registeredMembersCount + 1 }
            : t
        )
      );

      showNotification(`Team "${teamName}" has been successfully registered for ${selectedTournament.name}. Good luck!`, 'success');
      if(isBooking) setIsBookingModalOpen(false);
      else setIsApplyModalOpen(false);
      
      setTeamName('');
    }
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
      if (tournament.registeredMembersCount >= 50) {
        return (
          <button className="cta-button full-btn" disabled>
            Registration Full
          </button>
        );
      } else if (tournament.registeredMembersCount >= 45) {
        return (
          <button className="cta-button waiting-btn" disabled>
            Waiting Period (2 hrs)
          </button>
        );
      }
      return (
        <button className="cta-button apply-now-btn" onClick={(e) => { e.stopPropagation(); handleApplyClick(tournament); }}>
          Apply Now
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
    const allScheduledDates = [...new Set(tournaments.map(t => t.date))].sort();

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
              <h3>Tournament Rules</h3>
              <ul>
                {selectedTournament.rules.map((rule, index) => <li key={index}>{rule}</li>)}
              </ul>
            </div>
            <div className="details-card">
              <h3>Tournament Bracket</h3>
              <div className="bracket-placeholder">
                <p>Tournament bracket will be visible here after registration closes.</p>
              </div>
            </div>
            <div className="details-card">
              <h3>Registered Teams ({selectedTournament.registeredMembersCount})</h3>
              <ul>
                {selectedTournament.registeredTeams.map((team, index) => <li key={index}>{team.name}</li>)}
              </ul>
              {selectedTournament.registeredMembersCount >= 50 && (
                <p className="registration-status-message">Registration closed as the maximum limit has been reached. A 2-hour waiting period is in effect.</p>
              )}
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
                  <img src={t.image} alt={t.name} />
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
          <h1 className="main-logo">PUBG Esports</h1>
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
            <p>మా వెబ్‌సైట్ ఎటువంటి మోసాలను ప్రోత్సహించదు. మీరు ఏవైనా తప్పులు చేసినట్లైతే డిస్‌క్వాలిఫై చేయబడతారు.</p>
        </div>
      </div>
      
      {isApplyModalOpen && selectedTournament && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Apply for {selectedTournament.name}</h2>
            <form onSubmit={(e) => handleRegisterSubmit(e, false)}>
              <label htmlFor="teamName">Team Name</label>
              <input 
                type="text" 
                id="teamName" 
                value={teamName} 
                onChange={(e) => setTeamName(e.target.value)} 
                required 
              />
              <div className="modal-buttons">
                <button type="submit" className="cta-button">Register</button>
                <button type="button" className="close-modal-btn" onClick={() => setIsApplyModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {isBookingModalOpen && selectedTournament && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Book Game: {selectedTournament.name}</h2>
            <p>Date: {selectedTournament.date} @ {selectedTournament.time}</p>
            <form onSubmit={(e) => handleRegisterSubmit(e, true)}>
              <label htmlFor="bookingTeamName">Team Name</label>
              <input 
                type="text" 
                id="bookingTeamName" 
                value={teamName} 
                onChange={(e) => setTeamName(e.target.value)} 
                required 
              />
              <div className="modal-buttons">
                <button type="submit" className="cta-button">Confirm Booking</button>
                <button type="button" className="close-modal-btn" onClick={() => setIsBookingModalOpen(false)}>Cancel</button>
              </div>
            </form>
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

export default Pubg;
