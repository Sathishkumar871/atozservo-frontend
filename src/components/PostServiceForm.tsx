// src/components/PostServiceForm.tsx
import React, { useReducer, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FiPlusCircle, FiLoader } from 'react-icons/fi';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useAuth } from '../contexts/AuthContext';
import { serviceNameSuggestions } from '../constants/services';
// import './PostServiceForm.css';
import 'leaflet/dist/leaflet.css';

// Leaflet Icon Fix
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// --- State and Actions for useReducer ---
interface FormState {
  serviceName: string;
  description: string;
  experience: string;
  type: 'service' | 'owner';
  price: string;
  category: string;
  features: string;
  location: { lat: number; lng: number } | null;
  address: string | null;
  searchTermService: string;
  selectedServiceName: string;
  uploadedImages: { url: string | null; loading: boolean }[];
}

type FormAction =
  | { type: 'SET_FIELD'; field: keyof FormState; payload: any }
  | { type: 'SET_LOCATION'; location: { lat: number; lng: number } | null; address: string | null }
  | { type: 'SET_IMAGE'; index: number; url: string | null; loading: boolean }
  | { type: 'RESET_FORM' };

const initialState: FormState = {
  serviceName: '',
  description: '',
  experience: '',
  type: 'service',
  price: '',
  category: '',
  features: '',
  location: null,
  address: null,
  searchTermService: '',
  selectedServiceName: '',
  uploadedImages: Array(5).fill({ url: null, loading: false }),
};

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.payload };
    case 'SET_LOCATION':
        return { ...state, location: action.location, address: action.address };
    case 'SET_IMAGE':
      const newImages = [...state.uploadedImages];
      newImages[action.index] = { url: action.url, loading: action.loading };
      return { ...state, uploadedImages: newImages };
    case 'RESET_FORM':
      return initialState;
    default:
      return state;
  }
};

interface PostServiceFormProps {
  onClose: () => void;
}

const PostServiceForm: React.FC<PostServiceFormProps> = ({ onClose }) => {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const backend = import.meta.env.VITE_API_BASE_URL;

  const handleFieldChange = (field: keyof FormState, value: any) => {
    dispatch({ type: 'SET_FIELD', field, payload: value });
  };
  
  const handleLocation = async () => { /* Location logic here */ };
  const clearLocation = () => { /* Clear location logic here */ };
  const handleSubmit = async (e: React.FormEvent) => { /* Form submission logic here */ };
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, index: number) => { /* Image upload logic here */ };
  const triggerFileInput = (index: number) => { fileInputRefs.current[index]?.click(); };
  const handleServiceSuggestionClick = (service: { name: string, category: string }) => { /* Suggestion click logic here */ };
  
  const filteredServiceSuggestions = state.searchTermService
    ? serviceNameSuggestions.filter(s => s.name.toLowerCase().includes(state.searchTermService.toLowerCase()))
    : [];

  // JSX for the form goes here, using `state.fieldName` and `handleFieldChange`
  return ( 
    <div className="post-form-overlay">
      {/* ... Full form JSX from previous answer ... */}
    </div>
  );
};

export default PostServiceForm;