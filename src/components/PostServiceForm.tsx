"use client";
import React, { useState, useRef } from 'react';
import './PostServiceForm.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FiPlusCircle } from 'react-icons/fi';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon paths to ensure markers display correctly
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '[https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png](https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png)',
  iconUrl: '[https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png](https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png)',
  shadowUrl: '[https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png](https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png)',
});

// Interface for component props
interface PostServiceFormProps {
  onClose: () => void;
  openLogin: () => void;
  user: any; 
}

// ✅ Suggestions for service names and their categories
const serviceNameSuggestions = [
  { name: 'Plumber', category: 'Plumbing' },
  { name: 'Electrician', category: 'Electrical' },
  { name: 'Cleaner', category: 'Cleaning' },
  { name: 'Carpenter', category: 'Carpentry' },
  { name: 'Painter', category: 'Painting' },
  { name: 'AC Repair', category: 'Appliance Repair' },
  { name: 'Appliance Repair', category: 'Appliance Repair' },
  { name: 'Pest Control', category: 'Pest Control' },
  { name: 'Gardener', category: 'Gardening' },
  { name: 'Home Renovation', category: 'Renovation' },
  { name: 'Tutor', category: 'Education' },
  { name: 'Yoga Instructor', category: 'Health & Wellness' },
  { name: 'Photographer', category: 'Photography' },
  { name: 'Web Developer', category: 'IT & Digital' },
  { name: 'Content Writer', category: 'Writing' }
];

const PostServiceForm: React.FC<PostServiceFormProps> = ({ onClose, openLogin, user }) => {
  // State variables for form fields
  const [serviceName, setServiceName] = useState('');
  const [description, setDescription] = useState('');
  const [experience, setExperience] = useState('');
  const [type, setType] = useState<'service' | 'owner'>('service');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [features, setFeatures] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [searchTermService, setSearchTermService] = useState('');
  const [selectedServiceName, setSelectedServiceName] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>(new Array(5).fill(null));
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const backend = import.meta.env.VITE_API_BASE_URL;

  const handleLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLocation({ lat, lng });

          try {
            const response = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
            );
            const result = response.data;
            const displayName = result.display_name;
            const pincode = result.address.postcode || '';
            const suburb = result.address.suburb || result.address.village || result.address.town || '';
            const finalAddress = `${displayName} (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
            setAddress(finalAddress);
            toast.success(`📍 Location: ${suburb} - ${pincode}`);
          } catch (error) {
            console.error("Reverse geocoding failed:", error);
            setAddress(`(${lat.toFixed(4)}, ${lng.toFixed(4)})`);
            toast.error("❌ Failed to get address from location.");
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast.error("❌ Location access denied. Please allow location.");
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      toast.error("❌ Geolocation not supported by your browser.");
    }
  };
  
  const clearLocation = () => {
    setLocation(null);
    setAddress(null);
    toast.info("📍 Location cleared.");
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !user._id) {
      toast.error("❌ Please login to post your service.");
      openLogin();
      return;
    }
    
    // ✅ కేవలం 10 పదాలు మాత్రమే ఉండేలా డిస్క్రిప్షన్ చెక్
    if (description.split(' ').length > 10) {
      toast.error("❌ Description must be a maximum of 10 words.");
      return;
    }
    
    // ✅ కనీసం 2 ఫోటోలు ఉన్నాయో లేదో చెక్
    const validImages = uploadedImages.filter(img => img !== null);
    if (validImages.length < 2) {
        toast.error("❌ Please upload at least two images for your service.");
        return;
    }
    
    const postData = {
      name: serviceName,
      category,
      description,
      experience: experience ? parseInt(experience, 10) : 0,
      price: price ? parseFloat(price) : 0,                  
      features,
      type,
      location, 
      address, 
      images: validImages, 
      userId: user._id, 
    };

    console.log('Frontend: Sending Post Data to Backend:', postData);
    console.log('Frontend: Images array being sent:', postData.images);

    try {
      await axios.post(`${backend}/api/services`, postData);
      toast.success('✅ Service Posted Successfully!');
      toast.warn('⚠️ Remember to provide fast service, or your account may be blocked.');
      onClose();
    } catch (err: any) {
      console.error('❌ Failed to Post Service:', err);
      if (axios.isAxiosError(err) && err.response) {
        console.error('Server Response Data:', err.response.data);
        console.error('Server Status:', err.response.status);
        if (err.response.data.error) {
          toast.error(`❌ Failed to Post Service: ${err.response.data.error}`);
        } else if (err.response.data.message) {
          toast.error(`❌ Failed to Post Service: ${err.response.data.message}`);
        } else {
          toast.error('❌ Failed to Post Service: An unknown error occurred');
        }
      } else {
        toast.error('❌ Failed to Post Service: An unknown error occurred');
      }
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // ✅ మొదటి ఫోటో లైవ్ ఫోటో అని నిర్ధారించుకోవడం
    if (index === 0 && file.size === 0) {
        toast.error("❌ First image must be a live photo.");
        return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(`${backend}/api/services/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const imageUrl = response.data.url;
      setUploadedImages(prevImages => {
        const newImages = [...prevImages];
        newImages[index] = imageUrl;
        return newImages;
      });
      toast.success("✅ Image uploaded successfully");
      console.log(`Frontend: Image ${index} uploaded. URL:`, imageUrl);
    } catch (error) {
      console.error("❌ Image Upload Error:", error);
      toast.error("❌ Image upload failed");
    }
  };

  const triggerFileInput = (index: number) => {
    fileInputRefs.current[index]?.click();
  };

  const filteredServiceSuggestions = searchTermService
    ? serviceNameSuggestions.filter(service =>
        service.name.toLowerCase().includes(searchTermService.toLowerCase())
      )
    : [];

  // ✅ సర్వీస్ పేరును క్లిక్ చేసినప్పుడు, దానికి సంబంధించిన కేటగిరీని కూడా ఫిల్ చేస్తుంది
  const handleServiceSuggestionClick = (service: { name: string, category: string }) => {
    setSelectedServiceName(service.name);
    setServiceName(service.name);
    setSearchTermService(service.name);
    setCategory(service.category); // ✅ కేటగిరీని ఆటోమేటిక్‌గా ఫిల్ చేస్తుంది
  };

  return (
    <div className="post-form-overlay fade-in">
      <div className="post-form-container slide-up">
        <button className="back-button" onClick={onClose}>←</button>
        <div className="welcome-banner">
          <h2>Post Your Service</h2>
          <p>Make your business visible to nearby users.</p>
        </div>

        <div className="type-selector">
          <button className={type === 'service' ? 'active-service' : ''} onClick={() => setType('service')}>🔧 Service Provider</button>
          <button className={type === 'owner' ? 'active-owner' : ''} onClick={() => setType('owner')}>🏪 Owner</button>
        </div>

        <div className="image-upload-wrapper">
          <h3>Upload Your Service Images</h3>
          <div className="image-scroll-section-postform">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="image-upload-card" onClick={() => triggerFileInput(i)}>
                {uploadedImages[i] ? (
                  <img src={uploadedImages[i]} alt={`Uploaded ${i}`} className="uploaded-image-preview" />
                ) : (
                  <div className="upload-placeholder">
                    <FiPlusCircle className="upload-icon" />
                    <p>{i === 0 ? 'Add Live Photo' : 'Add Service Photo'}</p>
                  </div>
                )}
                <input
                  type="file"
                  style={{ display: "none" }}
                  onChange={(e) => handleImageUpload(e, i)}
                  ref={(el) => {
                    if (el) fileInputRefs.current[i] = el;
                  }}
                  accept="image/*"
                />
              </div>
            ))}
          </div>
          <p className="image-tip">Upload good quality images of your service.</p>
        </div>

        <form onSubmit={handleSubmit} className="post-form">
          <div className="form-group sticky-searchbar">
            <label>Service Name</label>
            <input
              type="text"
              placeholder="Search or type your service..."
              value={searchTermService}
              onChange={(e) => {
                setSearchTermService(e.target.value);
                setServiceName(e.target.value);
                setSelectedServiceName('');
              }}
              required
            />
            {filteredServiceSuggestions.length > 0 && (
              <div className="post-form-suggestions">
                {filteredServiceSuggestions.map((service, index) => (
                  <div
                    key={index}
                    className="suggestion-item-post-form"
                    onClick={() => handleServiceSuggestionClick(service)}
                  >
                    {service.name}
                  </div>
                ))}
              </div>
            )}
            {selectedServiceName && (
              <div className="selected-service-display-post-form">
                Selected: <strong>{selectedServiceName}</strong>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              placeholder="e.g., Plumbing, Cleaning"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label>Experience (Years)</label>
            <input
              type="number"
              value={experience}
              onChange={(e) => {
                  setExperience(e.target.value);
                  // ✅ ఎక్స్‌పీరియన్స్ ఆధారంగా కీ ఫీచర్లను సూచించడం
                  if (parseInt(e.target.value) >= 5) {
                      setFeatures('5+ years of experience, certified professional');
                  } else if (parseInt(e.target.value) >= 2) {
                      setFeatures('2+ years of experience, guaranteed service');
                  } else {
                      setFeatures('');
                  }
              }}
              placeholder="e.g., 2"
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Price (in ₹)</label>
            <input
              type="number"
              placeholder="e.g., ₹499"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Key Features</label>
            <textarea
              placeholder="e.g., Certified professional, same-day service"
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
            ></textarea>
          </div>

          <div className="form-group">
            <button type="button" className="location-btn" onClick={handleLocation}>
              {location ? '📍 Location Added' : 'Add Location'}
            </button>
          </div>

          {location && (
            <div className="live-map">
              <div className="map-header">
                <h4>Your Location</h4>
                <button className="close-map-btn" onClick={clearLocation}>✖</button>
              </div>
              <MapContainer
                center={[location.lat, location.lng]}
                zoom={15}
                scrollWheelZoom={false}
                style={{ height: '300px', width: '100%', borderRadius: '8px' }}
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[location.lat, location.lng]}>
                  <Popup>
                    You are here <br /> {address}
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          )}

          {location && <div className="location-display">{address}</div>}

          <button type="submit" className="submit-btn">✅ Post Now</button>
        </form>
      </div>
    </div>
  );
};

export default PostServiceForm;
