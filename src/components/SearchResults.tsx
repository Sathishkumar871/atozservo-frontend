// src/pages/SearchResults.tsx

import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import './SearchResults.css';

// సర్వీస్ కేటగిరీ ఆబ్జెక్ట్ యొక్క స్ట్రక్చర్ (Interface)
interface ServiceCategory {
  _id: string;
  name: string;
  image: string;
  description: string;
}

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchResults: React.FC = () => {
  const query = useQuery();
  const type = query.get('type');
  
  // useState కు మనం సృష్టించిన Interface ను టైప్‌గా ఇస్తాము
  const [services, setServices] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!type) return;

    axios
      .get<{ data: ServiceCategory[] }>(`${import.meta.env.VITE_API_BASE_URL}/api/services?search=${type}`)
      .then((res) => setServices(res.data.data)) // మీ API రెస్పాన్స్ స్ట్రక్చర్‌ను బట్టి res.data లేదా res.data.data వాడండి
      .catch((err) => console.error('Failed to fetch results:', err))
      .finally(() => setLoading(false));
  }, [type]);

  return (
    <div className="search-results-page">
      <h2>Results for: <span className="highlight">{type}</span></h2>
      {loading ? (
        <p>Loading...</p>
      ) : services.length > 0 ? (
        <div className="services-grid">
          {services.map((service) => (
            <Link 
              to={`/services/${encodeURIComponent(service.name)}`} 
              key={service._id} 
              className="service-card-link"
            >
              <div className="service-card">
                <img src={service.image} alt={service.name} />
                <h3>{service.name}</h3>
                <p>{service.description}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p>No matching services found.</p>
      )}
    </div>
  );
};

export default SearchResults;