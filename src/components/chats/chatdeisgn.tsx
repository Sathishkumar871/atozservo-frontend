// src/components/ChatDesign.tsx

"use client";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { MessageCircle, Users, X, Plus, Crown, Coffee, History, Lock, Settings } from 'lucide-react';
import io from "socket.io-client";
import './chatdesign.css';



const SERVER_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://atozservo-backend.onrender.com";

const socket = io(SERVER_URL, { transports: ["websocket"] });

// Mock data is now removed for dynamic group creation
// const initialMockGroups = [];

// --- Group Card Component ---
interface User {
  id: number;
  name: string;
  isSpeaking: boolean;
  isOwner: boolean;
  imageUrl: string;
}

interface Group {
    id: number;
    language: string;
    level: string;
    topic: string;
    members: number;
    users: User[];
}

interface UserProfileProps {
    user: User;
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
    return (
        <div className={`user-profile ${user.isSpeaking ? 'speaking-animation' : ''}`}>
            <img
                className="user-profile-image"
                src={user.imageUrl}
                alt={user.name}
            />
            {user.isOwner && (
                <span className="owner-badge">
                    Owner
                </span>
            )}
        </div>
    );
};

interface GroupCardProps {
    group: Group;
    onJoin: (groupId: number) => void;
}

const GroupCard: React.FC<GroupCardProps> = ({ group, onJoin }) => {
    const [isJoined, setIsJoined] = useState(false);
    const handleJoin = () => {
        setIsJoined(true);
        onJoin(group.id);
    };

    return (
        <div className="group-card">
            <div className="group-card-header">
                <div className="group-language-info">
                    <span className="group-status-dot animate-pulse"></span>
                    <span>{group.language}</span>
                    <span className="group-level">({group.level})</span>
                </div>
                <Settings className="settings-icon" size={20} />
            </div>

            <div className="group-users-container">
                {group.users && group.users.length > 0 ? (
                    group.users.map(user => (
                        <UserProfile key={user.id} user={user} />
                    ))
                ) : (
                    <div className="empty-group-placeholder">
                        Empty
                    </div>
                )}
            </div>

            <h4 className="group-topic">{group.topic}</h4>
            <p className="group-members">Members: {group.members}</p>
            <button
                onClick={handleJoin}
                className={`join-button ${isJoined ? "joined" : "not-joined"}`}
                disabled={isJoined}
            >
                {isJoined ? "Joined!" : "Join and talk now!"}
            </button>
        </div>
    );
};


// --- AlertDialog Component ---
interface AlertDialogProps {
    message: string;
    onClose: () => void;
}

const AlertDialog: React.FC<AlertDialogProps> = ({ message, onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="alert-dialog-box">
                <p className="alert-dialog-message">{message}</p>
                <button
                    onClick={onClose}
                    className="alert-dialog-button"
                >
                    OK
                </button>
            </div>
        </div>
    );
};

// --- CreateGroupModal Component ---
interface CreateGroupModalProps {
    onClose: () => void;
    onCreateGroup: (groupData: any) => void;
}

const languages = [
    "English", "Hindi", "Telugu", "Tamil", "Kannada", "Malayalam", "Bengali", "Urdu", "Vietnamese", "Indonesian", "Arabic",
    "French", "Nepali", "Spanish", "Catalan"
];

const levels = [
    "Any Level", "Beginner", "Upper Beginner", "Intermediate", "Upper Intermediate", "Advanced", "Upper Advanced", "Native"
];

const interests = [
    "Fun Chat", "Language Practice", "Dating"
];

const maxPeopleOptions = ["Unlimited", "2", "3", "4", "5", "10", "20"];

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ onClose, onCreateGroup }) => {
    const [customTopic, setCustomTopic] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("Any Level");
    const [selectedInterest, setSelectedInterest] = useState("");
    const [maxPeople, setMaxPeople] = useState("Unlimited");

    const handleCreate = () => {
        onCreateGroup({
            customTopic,
            selectedLanguage,
            selectedLevel,
            selectedInterest,
            maxPeople,
        });
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="create-group-modal-box">
                <button
                    onClick={onClose}
                    className="modal-close-button"
                    aria-label="Close modal"
                >
                    <X size={24} />
                </button>

                <h3 className="create-group-modal-title">Create New Group</h3>
                
                <div className="form-grid">
                    <div>
                        <label htmlFor="custom-topic" className="form-label">Custom Topic</label>
                        <input
                            id="custom-topic"
                            type="text"
                            placeholder="e.g., Hobbies, Travel"
                            value={customTopic}
                            onChange={(e) => setCustomTopic(e.target.value)}
                            className="form-input"
                            aria-label="Custom topic input"
                        />
                    </div>
                    <div>
                        <label htmlFor="max-people" className="form-label">Maximum People</label>
                        <div className="form-select-container">
                            <select
                                id="max-people"
                                value={maxPeople}
                                onChange={(e) => setMaxPeople(e.target.value)}
                                className="form-select"
                                aria-label="Select maximum people"
                            >
                                {maxPeopleOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                            <div className="select-arrow">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="form-grid">
                    <div>
                        <label htmlFor="language" className="form-label">Language</label>
                        <div className="form-select-container">
                            <select
                                id="language"
                                value={selectedLanguage}
                                onChange={(e) => setSelectedLanguage(e.target.value)}
                                className="form-select"
                                aria-label="Select language"
                            >
                                <option value="">Select a language</option>
                                {languages.map(lang => (
                                    <option key={lang} value={lang}>{lang}</option>
                                ))}
                            </select>
                            <div className="select-arrow">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="level" className="form-label">Level</label>
                        <div className="form-select-container">
                            <select
                                id="level"
                                value={selectedLevel}
                                onChange={(e) => setSelectedLevel(e.target.value)}
                                className="form-select"
                                aria-label="Select level"
                            >
                                {levels.map(level => (
                                    <option key={level} value={level}>{level}</option>
                                ))}
                            </select>
                            <div className="select-arrow">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <label className="form-label">Group Interest</label>
                    <div className="interest-buttons-container">
                        {interests.map(interest => (
                            <button
                                key={interest}
                                onClick={() => setSelectedInterest(interest)}
                                className={`interest-button ${selectedInterest === interest ? "selected" : ""}`}
                            >
                                {interest}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="modal-buttons-container">
                    <button
                        onClick={onClose}
                        className="modal-cancel-button"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreate}
                        className="modal-create-button"
                    >
                        Create Group
                    </button>
                </div>
            </div>
        </div>
    );
};

const ChatDesign: React.FC = () => {
    const navigate = useNavigate();
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
    const [activeLanguage, setActiveLanguage] = useState("All");
    const [groups, setGroups] = useState<Group[]>([]);

    const showAlert = (message: string) => {
        setAlertMessage(message);
    };

    const closeAlert = () => {
        setAlertMessage(null);
    };

    const handleCreateGroup = (groupData: any) => {
        console.log("Attempting to create group with data:", groupData);
        // The backend will generate the ID, so we don't need it here
        socket.emit('createGroup', groupData);
        showAlert("Group creation initiated! Waiting for other users to join.");
    };

    const handleJoinGroup = (groupId: number) => {
        navigate(`/room/${groupId}`);
    };

    useEffect(() => {
        console.log("ChatDesign useEffect running. Setting up listeners.");
        
        // This is the new logic to fetch initial groups from the server
        socket.emit('getGroups');
        
        socket.on('groupsList', (initialGroups: Group[]) => {
            console.log("Received initial groups list:", initialGroups);
            setGroups(initialGroups);
        });

        socket.on('newGroupCreated', (group: Group) => {
            console.log("New group created event received:", group);
            setGroups(prevGroups => {
                if (!prevGroups.some(g => g.id === group.id)) {
                    return [...prevGroups, group];
                }
                return prevGroups;
            });
        });
        
        socket.on('groupDeleted', (groupId: number) => {
            console.log("Group deleted event received:", groupId);
            setGroups(prevGroups => prevGroups.filter(g => g.id !== groupId));
        });

        return () => {
            console.log("ChatDesign useEffect cleanup.");
            socket.off('groupsList');
            socket.off('newGroupCreated');
            socket.off('groupDeleted');
        };
    }, []);

    // Calculate counts for language tabs
    const languageCounts: { [key: string]: number } = {};
    groups.forEach(group => {
        languageCounts[group.language] = (languageCounts[group.language] || 0) + 1;
    });

    const languageTabs = [
        { name: "All", count: groups.length },
        { name: "English", count: languageCounts["English"] || 0 },
        { name: "Hindi", count: languageCounts["Hindi"] || 0 },
        { name: "Telugu", count: languageCounts["Telugu"] || 0 },
        { name: "Kannada", count: languageCounts["Kannada"] || 0 },
        { name: "Tamil", count: languageCounts["Tamil"] || 0 },
        { name: "Bengali", count: languageCounts["Bengali"] || 0 },
        { name: "Urdu", count: languageCounts["Urdu"] || 0 },
        { name: "Indonesian", count: languageCounts["Indonesian"] || 0 },
        { name: "Arabic", count: languageCounts["Arabic"] || 0 },
        { name: "French", count: languageCounts["French"] || 0 },
        { name: "Spanish", count: languageCounts["Spanish"] || 0 },
        { name: "Vietnamese", count: languageCounts["Vietnamese"] || 0 },
    ];

    const filteredGroups = activeLanguage === "All"
        ? groups
        : groups.filter(group => group.language === activeLanguage);

    return (
        <div className="chat-container">
            
            {/* Header Section */}
            <header className="header-section">
                <div className="header-brand">
                    <h2 className="app-title" tabIndex={0}>Free4Talk</h2>
                    <div className="mobile-search-button">
                        <button className="search-icon-button">
                            <FiSearch size={24} />
                        </button>
                    </div>
                </div>

                <h1 className="app-subtitle">Language Practice Community</h1>
                
                <div className="header-buttons-container scrollbar-hide">
                    <button
                        onClick={() => setShowCreateGroupModal(true)}
                        className="header-button create-group-button"
                        aria-label="Create a new group"
                    >
                        <Plus size={18} />
                        Create a new group
                    </button>
                    <button
                        onClick={() => showAlert("Thanks for your support! Buy me a coffee feature coming soon.")}
                        className="header-button buy-coffee-button"
                        aria-label="Buy me a coffee"
                    >
                        <Coffee size={18} />
                        Buy me a coffee
                    </button>
                    <button className="header-button app-button" aria-label="Free4Talk App">
                        <Crown size={16} /> Free4Talk APP
                    </button>
                    <button className="header-button privacy-button" aria-label="Privacy Policy">
                        <Lock size={16} /> Privacy Policy
                    </button>
                </div>
            </header>

            {/* Search and Filters Section */}
            <section className="search-section">
                <div className="search-bar-container">
                    <FiSearch className="search-icon" aria-hidden="true" />
                    <input
                        type="search"
                        placeholder="Search for Language, Level, Topic. Username. Mic On, Mic Off. Mic allow, Full, Empty, Crowded. Unlimited..."
                        className="search-input"
                        aria-label="Search for groups or users"
                    />
                </div>
            </section>

            {/* Language Filter Tabs */}
            <section className="language-tabs-section scrollbar-hide">
                <div className="language-tabs-container">
                    {languageTabs.map(tab => (
                        <button
                            key={tab.name}
                            onClick={() => setActiveLanguage(tab.name)}
                            className={`language-tab-button ${activeLanguage === tab.name ? "active" : ""}`}
                            aria-pressed={activeLanguage === tab.name}
                        >
                            {tab.name} ({tab.count})
                        </button>
                    ))}
                </div>
            </section>

            {/* Group List Section */}
            <main className="group-list-section scrollbar-hide">
                {filteredGroups.length > 0 ? (
                    filteredGroups.map(group => (
                        <GroupCard key={group.id} group={group} onJoin={handleJoinGroup} />
                    ))
                ) : (
                    <p className="no-groups-message">No groups found for this language.</p>
                )}
            </main>

            {/* Custom Alert Dialog */}
            {alertMessage && <AlertDialog message={alertMessage} onClose={closeAlert} />}

            {/* Create Group Modal */}
            {showCreateGroupModal && (
                <CreateGroupModal
                    onClose={() => setShowCreateGroupModal(false)}
                    onCreateGroup={handleCreateGroup}
                />
            )}
            
            {/* Bottom Navigation Bar */}
            <nav className="bottom-nav-bar" role="navigation" aria-label="Main navigation">
                <button
                    className="nav-item"
                >
                    <MessageCircle size={20} aria-hidden="true" />
                    <span>Chats</span>
                </button>

                <button
                    className="find-partner-button"
                    onClick={() => navigate("/find-partner-options")}
                    aria-label="Find a partner"
                >
                    <Users size={24} aria-hidden="true" />
                    <span className="sr-only">Partner</span>
                </button>

                <button
                    className="nav-item"
                    onClick={() => navigate("/history")}
                    aria-label="Chat History"
                >
                    <History size={20} aria-hidden="true" />
                    <span>History</span>
                </button>
            </nav>
        </div>
    );
};

export default ChatDesign;