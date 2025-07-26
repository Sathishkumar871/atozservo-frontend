import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './SearchResults.css';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchResults = () => {
  const query = useQuery();
  const type = query.get('type');
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!type) return;

    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/services?search=${type}`)
      .then((res) => setServices(res.data))
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
            <div key={service._id} className="service-card">
              <img src={service.image} alt={service.name} />
              <h3>{service.name}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No matching services found.</p>
      )}
    </div>
  );
};

export default SearchResults;
