// src/components/ServiceListPage.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
// import './ServiceListPage.css';

interface ServiceProvider {
  _id: string;
  name: string;
  address: string;
  description: string;
  price: number;
  images: string[];
}

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
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/providers?category=${decodedServiceType}`)
      .then((res) => {
        setProviders(res.data);
      })
      .catch((err) => console.error('Failed to fetch providers:', err))
      .finally(() => setLoading(false));
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
                <div className="provider-price">Starting at ₹{provider.price}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No providers found for this service.</p>
      )}
    </div>
  );
};

export default ServiceListPage;