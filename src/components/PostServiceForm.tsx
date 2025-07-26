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
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Interface for component props
interface PostServiceFormProps {
  onClose: () => void;
  openLogin: () => void;
  user: any; // Ideally, define a proper interface for your user object (e.g., { _id: string; /* other user props */ })
}

// Suggestions for service names
const serviceNameSuggestions = [
  'Plumber', 'Electrician', 'Cleaner', 'Carpenter', 'Painter',
  'AC Repair', 'Appliance Repair', 'Pest Control', 'Gardener', 'Home Renovation',
  'Tutor', 'Yoga Instructor', 'Photographer', 'Web Developer', 'Content Writer'
];

const PostServiceForm: React.FC<PostServiceFormProps> = ({ onClose, openLogin, user }) => {
  // State variables for form fields
  const [serviceName, setServiceName] = useState('');
  const [description, setDescription] = useState('');
  const [experience, setExperience] = useState(''); // Stored as string from input, converted to number before sending
  const [type, setType] = useState<'service' | 'owner'>('service');
  const [price, setPrice] = useState(''); // Stored as string from input, converted to number before sending
  const [category, setCategory] = useState('');
  const [features, setFeatures] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [searchTermService, setSearchTermService] = useState('');
  const [selectedServiceName, setSelectedServiceName] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]); // Array to hold Cloudinary URLs
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]); // Refs for hidden file inputs

  // Backend API base URL from environment variables
  const backend = import.meta.env.VITE_API_BASE_URL;

  // Function to get user's current location
  const handleLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLocation({ lat, lng }); // Set location state

          try {
            // Reverse geocode to get human-readable address
            const response = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
            );
            const result = response.data;
            const displayName = result.display_name;
            const pincode = result.address.postcode || '';
            const suburb = result.address.suburb || result.address.village || result.address.town || '';
            const finalAddress = `${displayName} (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
            setAddress(finalAddress); // Set address state
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

  // Function to clear location data
  const clearLocation = () => {
    setLocation(null);
    setAddress(null);
    toast.info("📍 Location cleared.");
  };

  // Handles form submission for posting a service
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !user._id) {
      toast.error("❌ Please login to post your service.");
      openLogin();
      return;
    }

    const postData = {
      name: serviceName,
      category,
      description,
      // ✨✨✨ CRITICAL FIX: Convert experience AND price to numbers from strings ✨✨✨
      experience: experience ? parseInt(experience, 10) : 0, // Parse to integer, default to 0 if empty
      price: price ? parseFloat(price) : 0,                   // Parse to float, default to 0 if empty
      features,
      type,
      location, // Pass as {lat, lng} object or null
      address,  // Pass as string or null
      images: uploadedImages, // Array of Cloudinary URLs - THIS IS THE KEY FIELD
      userId: user._id, // User ID from the logged-in user
    };

    console.log('Frontend: Sending Post Data to Backend:', postData);
    console.log('Frontend: Images array being sent:', postData.images);

    try {
      await axios.post(`${backend}/api/services`, postData);
      toast.success('✅ Service Posted Successfully!');
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
          toast.error('❌ Failed to Post Service: Check console for details');
        }
      } else {
        toast.error('❌ Failed to Post Service: An unknown error occurred');
      }
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (!file) return;

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
        service.toLowerCase().includes(searchTermService.toLowerCase())
      )
    : [];

  const handleServiceSuggestionClick = (service: string) => {
    setSelectedServiceName(service);
    setServiceName(service);
    setSearchTermService(service);
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
                    <p>Add Image</p>
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
                    {service}
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
              onChange={(e) => setExperience(e.target.value)}
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