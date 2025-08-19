// src/pages/ServiceListPage.tsx

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ServiceListPage.css';

// సర్వీస్ ప్రొవైడర్ ఆబ్జెక్ట్ యొక్క స్ట్రక్చర్ (Interface)
interface ServiceProvider {
  _id: string;
  name: string;
  address: string;
  description: string;
  price: number;
  images: string[]; // చిత్రాలు URL ల యొక్క array
}

// URL పారామీటర్ల కోసం టైప్స్
type ServicePageParams = {
  serviceType: string;
};

const ServiceListPage: React.FC = () => {
  const { serviceType } = useParams<ServicePageParams>();
  const decodedServiceType = decodeURIComponent(serviceType || '');
  
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!decodedServiceType) return;

    axios
      .get<{ data: ServiceProvider[] }>(`${import.meta.env.VITE_API_BASE_URL}/api/providers?category=${decodedServiceType}`)
      .then((res) => {
        setProviders(res.data.data); // మీ API రెస్పాన్స్ స్ట్రక్చర్‌ను బట్టి res.data లేదా res.data.data వాడండి
      })
      .catch((err) => {
        console.error('Failed to fetch service providers:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [decodedServiceType]);

  return (
    <div className="service-list-page">
      <h2>Available Providers for: <span className="highlight">{decodedServiceType}</span></h2>
      {loading ? (
        <p>Loading providers...</p>
      ) : providers.length > 0 ? (
        <div className="providers-grid">
          {providers.map((provider) => (
            <div key={provider._id} className="provider-card">
              <img src={provider.images[0]} alt={provider.name} className="provider-image" />
              <div className="provider-details">
                <h3>{provider.name}</h3>
                <p className="provider-location">{provider.address}</p>
                <p className="provider-description">{provider.description}</p>
                <div className="provider-price">Starting at ₹{provider.price}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No providers found for this service. Be the first to post!</p>
      )}
    </div>
  );
};

export default ServiceListPage;