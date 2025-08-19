// EditProfile.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Menu.css';
import './EditProfile.css';

interface EditProfileProps {
  user: any;
  onClose: () => void;
  onComplete: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ user, onClose, onComplete }) => {
  const [gender, setGender] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [pincode, setPincode] = useState('');
  const [villageList, setVillageList] = useState<string[]>([]);
  const [village, setVillage] = useState('');
  const [house, setHouse] = useState('');
  const [area, setArea] = useState('');
  const [addressType, setAddressType] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [isFetchingVillages, setIsFetchingVillages] = useState(false);
  const [pincodeError, setPincodeError] = useState('');

  let holdTimer: NodeJS.Timeout;

  useEffect(() => {
    if (user) {
      setGender(user.gender || '');
      setName(user.name || '');
      setMobile(user.phone || '');
      setPincode(user.pincode || '');
      setVillage(user.village || '');
      setHouse(user.house || '');
      setArea(user.area || '');
      setAddressType(user.addressType || '');
    }
  }, [user]);

  useEffect(() => {
    if (pincode.length !== 6) {
      setVillageList([]);
      setPincodeError('');
      return;
    }

    const fetchVillages = async () => {
      setIsFetchingVillages(true);
      setPincodeError('');
      setVillageList([]);

      try {
        const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
        
        if (response.data && response.data[0].Status === 'Success') {
          const postOffices = response.data[0].PostOffice;
          const uniqueVillages = [...new Set(postOffices.map((office: any) => office.Name))];
          setVillageList(uniqueVillages as string[]);
        } else {
          setPincodeError('🤷‍♂️ No locations found for this pincode.');
        }
      } catch (error) {
        console.error("❌ Failed to fetch pincode data:", error);
        setPincodeError('Could not fetch village list. Check your network.');
      } finally {
        setIsFetchingVillages(false);
      }
    };

    const debounceTimer = setTimeout(() => {
        fetchVillages();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [pincode]);

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);

    const data = {
      gender, name, phone: mobile, district: 'East Godavari',
      pincode, village, house, area, addressType,
    };

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("❌ No token found. Please log in again.");
        // Redirect to login page
        // For example: window.location.href = '/login';
        return;
      }

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/user/update-profile`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      localStorage.setItem('display_name', name);
      console.log("✅ Profile updated:", res.data);
      alert("✅ Profile saved successfully!");
      onComplete();
      onClose();
    } catch (err) {
      console.error("❌ Failed to update profile", err);
      
      // --- NEW: Improved Error Handling ---
      if (axios.isAxiosError(err)) {
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          alert(`❌ Profile update failed: ${err.response.data?.message || 'Server error.'} (Status: ${err.response.status})`);
        } else if (err.request) {
          // The request was made but no response was received
          alert("❌ Profile update failed: Could not connect to the server. Please check your internet connection or the server status.");
        } else {
          // Something happened in setting up the request that triggered an Error
          alert(`❌ Profile update failed: ${err.message}`);
        }
      } else {
        // Handle non-Axios errors
        alert("❌ An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fullscreen-panel">
      <div className="edit-profile-container">
        
        {/* Gender selection and profile banner remain the same */}
        {gender === '' ? (
          <div className="gender-select">
            <img
              src="https://res.cloudinary.com/dlkborjdl/image/upload/v1751882592/male_yzgded.jpg"
              alt="Male"
              className="gender-logo"
              draggable={false}
              onClick={() => setGender('Male')}
            />
            <img
              src="https://res.cloudinary.com/dlkborjdl/image/upload/v1751882653/female_cnakiz.jpg"
              alt="Female"
              className="gender-logo"
              draggable={false}
              onClick={() => setGender('Female')}
            />
          </div>
        ) : (
          <div className="profile-banner" style={{ backgroundColor: gender === 'Female' ? '#60A5FA' : '#C4B5FD' }}>
            <div
              className="profile-logo"
              onMouseDown={() => {
                holdTimer = setTimeout(() => {
                  setGender(prev => (prev === 'Male' ? 'Female' : 'Male'));
                }, 1500);
              }}
              onMouseUp={() => clearTimeout(holdTimer)}
              onTouchStart={() => {
                holdTimer = setTimeout(() => {
                  setGender(prev => (prev === 'Male' ? 'Female' : 'Male'));
                }, 1500);
              }}
              onTouchEnd={() => clearTimeout(holdTimer)}
            >
              <img
                src={
                  gender === 'Male'
                    ? 'https://res.cloudinary.com/dlkborjdl/image/upload/v1751882592/male_yzgded.jpg'
                    : 'https://res.cloudinary.com/dlkborjdl/image/upload/v1751882653/female_cnakiz.jpg'
                }
                alt={gender}
                draggable={false}
              />
            </div>
          </div>
        )}

        <div className="form-content">
          <div className="input-group">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder=" " required />
            <label className="floating-label">Full Name</label>
          </div>
          <div className="input-group">
            <input value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder=" " required />
            <label className="floating-label">Mobile Number</label>
          </div>
          <div className="input-group">
            <input value="East Godavari" readOnly placeholder=" " />
            <label className="floating-label">District</label>
          </div>
          
          <div className="input-group">
            <input value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder=" " required maxLength={6} />
            <label className="floating-label">Pincode</label>
          </div>

          {isFetchingVillages && <div className="location-message">🔍 Searching for locations...</div>}
          
          {pincodeError && !isFetchingVillages && <div className="location-message">{pincodeError}</div>}

          {villageList.length > 0 && !isFetchingVillages && (
            <div className="input-group">
              <select value={village} onChange={(e) => setVillage(e.target.value)} required>
                <option value="">Select Village / Area</option>
                {villageList.map((v, i) => (
                  <option key={i} value={v}>{v}</option>
                ))}
              </select>
            </div>
          )}

          <div className="input-group">
            <input value={house} onChange={(e) => setHouse(e.target.value)} placeholder=" " />
            <label className="floating-label">House / Building Name</label>
          </div>
          <div className="input-group">
            <input value={area} onChange={(e) => setArea(e.target.value)} placeholder=" " />
            <label className="floating-label">Road / Area / Colony</label>
          </div>
          <div className="input-group">
            <select value={addressType} onChange={(e) => setAddressType(e.target.value)} required>
              <option value="">Select Address Type</option>
              <option value="Home">Home</option>
              <option value="Work">Work</option>
            </select>
          </div>

          <div className="form-actions">
            <button className="save-btn" onClick={handleSave} disabled={isSaving}>
              {isSaving ? '💾 Saving...' : '💾 Save Address'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
