import React, { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaSearch, FaTimes, FaCrown, FaHeart } from 'react-icons/fa';
import { BsPeopleFill } from 'react-icons/bs';

import './Lobby.css';
import {
  collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc,
  arrayUnion, deleteDoc, getDoc, arrayRemove
} from 'firebase/firestore';
import { db } from '../../firebase';

interface RoomInfo {
  id: string;
  name: string;
  category: string;
  language: string;
  level: 'Any Level' | 'Beginner' | 'Intermediate' | 'Upper Intermediate' | 'Advanced';
  maxMembers: number;
  currentMembers: { name: string; avatar: string; roses: number }[];
  owner: string;
  createdAt: number;
}

const categories = ['All', 'Fun', 'Learning', 'Interview Prep', 'Others'];
const languages = ['All', 'English', 'Telugu', 'Hindi', 'Tamil', 'Kannada', 'Spanish', 'French', 'Japanese', 'German', 'Nepali', 'Urdu', 'Indonesian', 'Arabic'];
const levels = ['Any Level', 'Beginner', 'Intermediate', 'Upper Intermediate', 'Advanced'];

const Lobby: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>('');
  const [tempUserName, setTempUserName] = useState<string>('');
  const [rooms, setRooms] = useState<RoomInfo[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<RoomInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeLanguage, setActiveLanguage] = useState<string>('All');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showNameModal, setShowNameModal] = useState<boolean>(false);
  const [newRoomName, setNewRoomName] = useState<string>('');
  const [newRoomCategory, setNewRoomCategory] = useState<string>('Fun');
  const [newRoomLanguage, setNewRoomLanguage] = useState<string>('English');
  const [newRoomLevel, setNewRoomLevel] = useState<RoomInfo['level']>('Any Level');
  const [newRoomMembers, setNewRoomMembers] = useState<number>(10);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const savedName = sessionStorage.getItem('display_name') || '';
    setUserName(savedName);
    setTempUserName(savedName);

    const q = query(collection(db, "rooms"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedRooms: RoomInfo[] = [];
      querySnapshot.forEach(docSnap => {
        const roomData = docSnap.data();
        
        if (roomData.currentMembers && roomData.currentMembers.length === 0) {
            deleteDoc(doc(db, "rooms", docSnap.id));
        } else {
            fetchedRooms.push({ id: docSnap.id, ...roomData } as RoomInfo);
        }
      });
      setRooms(fetchedRooms);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = async (event: BeforeUnloadEvent) => {
      const currentRoomId = sessionStorage.getItem('current_room_id');
      const currentUserName = sessionStorage.getItem('display_name');
      if (currentRoomId && currentUserName) {
        event.preventDefault();
        const roomDocRef = doc(db, "rooms", currentRoomId);
        const memberToRemove = { name: currentUserName, avatar: `https://i.pravatar.cc/150?u=${currentUserName}`, roses: 0 };
        
       
        await updateDoc(roomDocRef, {
          currentMembers: arrayRemove(memberToRemove)
        });
        
        const updatedRoomSnap = await getDoc(roomDocRef);
        if (updatedRoomSnap.exists()) {
          const roomData = updatedRoomSnap.data();
          if (!roomData.currentMembers || roomData.currentMembers.length === 0) {
            await deleteDoc(roomDocRef);
          }
        }
        
        sessionStorage.removeItem('current_room_id');
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const results = rooms.filter(room => {
      const categoryMatch = activeCategory === 'All' || room.category === activeCategory;
      const languageMatch = activeLanguage === 'All' || room.language === activeLanguage;
      const searchMatch = room.name.toLowerCase().includes(searchTerm.toLowerCase());
      return categoryMatch && languageMatch && searchMatch;
    });
    setFilteredRooms(results);
  }, [searchTerm, activeCategory, activeLanguage, rooms]);

  const handleJoinRoom = async (room: RoomInfo) => {
    if (!userName) {
      setShowNameModal(true);
      return;
    }
    if (room.currentMembers.length >= room.maxMembers) {
      alert(`Sorry, the group "${room.name}" is full.`);
      return;
    }
    
    const roomDocRef = doc(db, "rooms", room.id);
    const newMember = { name: userName, avatar: `https://i.pravatar.cc/150?u=${userName}`, roses: 0 };
    
    try {
      await updateDoc(roomDocRef, {
        currentMembers: arrayUnion(newMember)
      });
      sessionStorage.setItem('current_room_id', room.id);
      navigate(`/room/${room.id}?user=${userName}`);
    } catch (e) {
      console.error("Error joining room:", e);
      alert("Failed to join the group. Please try again.");
    }
  };

  const handleCreateRoomSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newRoomName || !userName) {
      alert('Please enter a group name and ensure your name is set.');
      return;
    }

    const newRoom = {
      name: newRoomName, category: newRoomCategory, language: newRoomLanguage,
      level: newRoomLevel, maxMembers: newRoomMembers,
      currentMembers: [{ name: userName, avatar: `https://i.pravatar.cc/150?u=${userName}`, roses: 0 }],
      owner: userName, createdAt: Date.now(),
    };
    
    try {
      const docRef = await addDoc(collection(db, "rooms"), newRoom);
      setShowCreateModal(false);
      sessionStorage.setItem('current_room_id', docRef.id);
      navigate(`/room/${docRef.id}?user=${userName}`);
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Failed to create group. Please try again.");
    }
  };

  const handleAutoCreateRoom = async () => {
    if (!userName) {
      setShowNameModal(true);
      return;
    }

    const randomRoomName = `Fun Hangout #${Math.floor(1000 + Math.random() * 9000)}`;
    const newRoomData = {
      name: randomRoomName, category: 'Fun', language: 'English',
      level: 'Any Level' as RoomInfo['level'], maxMembers: 10,
      currentMembers: [{ name: userName, avatar: `https://i.pravatar.cc/150?u=${userName}`, roses: 0 }],
      owner: userName, createdAt: Date.now(),
    };

    try {
      const docRef = await addDoc(collection(db, "rooms"), newRoomData);
      sessionStorage.setItem('current_room_id', docRef.id);
      navigate(`/room/${docRef.id}?user=${userName}`);
    } catch (e) {
      console.error("Error with auto-create: ", e);
      alert("Failed to auto-create a group. Please try again.");
    }
  };

  const handleSaveName = () => {
    if (tempUserName.trim() === '') {
      alert('Display name cannot be empty.');
      return;
    }
    sessionStorage.setItem('display_name', tempUserName);
    setUserName(tempUserName);
    setShowNameModal(false);
  };

  const handleLanguageClick = (lang: string) => {
    setActiveLanguage(lang);
  };

  const handleExpandToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const visibleLanguages = languages.slice(0, 6);

  const renderLanguages = () => {
    const list = isExpanded ? languages : visibleLanguages;
    return (
      <>
        {list.map(lang => (
          <div
            key={lang}
            className={`language-tag ${activeLanguage === lang ? 'active' : ''}`}
            onClick={() => handleLanguageClick(lang)}
          >
            {lang}
          </div>
        ))}
        <button className="expand-btn" onClick={handleExpandToggle}>
          <div className="language-tag expand-tag">
            {isExpanded ? 'Collapse' : 'Expand'}
          </div>
        </button>
      </>
    );
  };

  return (
    <>
      <header id="nav">
        <div className="nav-container">
          <div className="nav-top">
            <h3 id="logo">TalkHive</h3>
            <div id="nav__links">
              <button className="auto-create-btn" onClick={handleAutoCreateRoom}>
                ⚡ Auto Create
              </button>
              <button className="create__room__btn" onClick={() => userName ? setShowCreateModal(true) : setShowNameModal(true)}>
                <FaPlus />
                <span>Create Group</span>
              </button>
            </div>
          </div>
          <div className="nav-bottom">
            <a href="#">Privacy Policy</a>
          </div>
        </div>
      </header>

      <main id="room__lobby__container">
        <div className="search-and-filters-container">
          <div className="search__bar">
            <FaSearch className="search__icon" />
            <input
              type="text"
              placeholder="Search for Language, Level, Topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="language-tags">
            {renderLanguages()}
          </div>
        </div>

        <div id="rooms__list">
          {filteredRooms.length > 0 ? (
            filteredRooms.map(room => (
              <div key={room.id} className="room__card">
                <div className="card__header">
                  <div className="card__title_id">
                    <h3 className="room__name">{room.name}</h3>
                    <p className="room__level">{room.language} - {room.level}</p>
                  </div>
                  <div className="members__info">
                    <BsPeopleFill className="member__icon" />
                    <span>{room.currentMembers.length}/{room.maxMembers}</span>
                  </div>
                </div>
                <div className="card__body">
                  <div className="members__list">
                    {room.currentMembers.map((member, index) => (
                      <div key={index} className="member__card">
                        {room.owner === member.name && <FaCrown className="owner__crown" />}
                        <img src={member.avatar} alt={member.name} className="member__avatar-img" />
                        <span className="member__name">{member.name}</span>
                        <div className="roses-count">
                          <FaHeart className="rose-icon" /> {member.roses}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    className="join__button"
                    onClick={() => handleJoinRoom(room)}
                    disabled={room.currentMembers.length >= room.maxMembers}
                  >
                    {room.currentMembers.length >= room.maxMembers ? (
                      <span className="full__group__text"><FaTimes className="full-group-icon" />This group is full.</span>
                    ) : (
                      'Join Group'
                    )}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-rooms">No groups found. Create one to get started! 😊</p>
          )}
        </div>
      </main>

     
      <nav className="bottom-nav">
        <button className="bottom-nav-btn left" onClick={() => navigate('/chat')}>
          💬 Chat
        </button>
        
        <button className="bottom-nav-btn middle" onClick={() => navigate('/find-partner')}>
          🔍 Find Partner
        </button>
        
        <button className="bottom-nav-btn right" onClick={() => navigate('/chat-history')}>
          📜 Chat History
        </button>
      </nav>

      {showCreateModal && (
        <div className="modal__overlay">
          <div className="modal__content">
            <button className="modal__close" onClick={() => setShowCreateModal(false)}><FaTimes /></button>
            <h3 className="modal__title">Create a new Group</h3>
            <form onSubmit={handleCreateRoomSubmit}>
              <div className="form__field__wrapper">
                <label>Group Name</label>
                <input
                  type="text" required value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="Enter a group name..."
                />
              </div>
              <div className="form__field__wrapper">
                <label>Language</label>
                <select value={newRoomLanguage} onChange={(e) => setNewRoomLanguage(e.target.value)}>
                  {languages.filter(lang => lang !== 'All').map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
              <div className="form__field__wrapper">
                <label>Level</label>
                <select value={newRoomLevel} onChange={(e) => setNewRoomLevel(e.target.value as RoomInfo['level'])}>
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
              <div className="form__field__wrapper">
                <label>Max Members (2-20)</label>
                <input
                  type="number" min="2" max="20" value={newRoomMembers}
                  onChange={(e) => setNewRoomMembers(Number(e.target.value))}
                />
              </div>
              <div className="modal__actions">
                <button type="submit">Create</button>
                <button type="button" className="cancel__button" onClick={() => setShowCreateModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {showNameModal && (
        <div className="modal__overlay">
          <div className="modal__content">
            <button className="modal__close" onClick={() => setShowNameModal(false)}><FaTimes /></button>
            <h3 className="modal__title">Set Your Name</h3>
            <div className="form__field__wrapper">
              <label>Full Name</label>
              <input
                type="text" required value={tempUserName}
                onChange={(e) => setTempUserName(e.target.value)}
                placeholder="Enter your name..."
              />
            </div>
            <div className="modal__actions">
              <button onClick={handleSaveName}>Save</button>
              <button type="button" className="cancel__button" onClick={() => setShowNameModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Lobby;
