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
    const pincodeMap: Record<string, string[]> = {
      '533289': ['Burugupudi', 'Butchempeta', 'Dosakayalapalle', 'Gadala', 'Gadarada', 'jambupatnam', 'kanupuru', 'Kapavaram', 'Korukonda', 'Koti', 'Kotikesavaram', 'Madurapudi', 'Munagala', 'Narasapuram', 'Nidigatla', 'Ragavapuram', 'Srirangapatnam'],
      '533102': ['Bommuru', 'Dowleswaram'],
      '533103': ['Rajahmundry Rural', 'Diwan Cheruvu'],
      '533104': ['Morampudi', 'Nandamuru'],
      '533105': ['Katheru', 'Rajahmundry Urban'],
    };

    setVillageList(pincodeMap[pincode] || []);
  }, [pincode]);

  const handleSave = async () => {
    const data = {
      gender,
      name,
      phone: mobile,
      district: 'East Godavari',
      pincode,
      village,
      house,
      area,
      addressType,
    };

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("❌ No token found. Please log in again.");
        return;
      }

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/user/update-profile`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Profile updated:", res.data);
      alert("✅ Profile saved successfully!");
      onComplete();
      onClose();
    } catch (err) {
      console.error("❌ Failed to update profile", err);
      if (axios.isAxiosError(err) && err.response) {
        alert(`❌ Profile update failed: ${err.response.data?.message || 'Server error.'}`);
      } else {
        alert("❌ Profile update failed. Network error or unexpected issue.");
      }
    }
  };

  return (
    <div className="fullscreen-panel">
      <div className="edit-profile-container">
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
            <input value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder=" " required />
            <label className="floating-label">Pincode</label>
          </div>

          {villageList.length > 0 ? (
            <div className="input-group">
              <select value={village} onChange={(e) => setVillage(e.target.value)} required>
                <option value="">Select Village</option>
                {villageList.map((v, i) => (
                  <option key={i} value={v}>{v}</option>
                ))}
              </select>
              <label className="floating-label"></label>
            </div>
          ) : (
            pincode.length === 6 && (
              <div className="location-message">🤷‍♂ Location not found for this pincode.</div>
            )
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
            <label className="floating-label"></label>
          </div>

          <div className="form-actions">
            <button className="save-btn" onClick={handleSave}>💾 Save Address</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
