import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ServiceDetailPage.css';

interface Provider { name: string; avatar?: string; email?: string; phone?: string; }
interface ServiceDetails { _id: string; name: string; description: string; images: string[]; price: number; features?: string; userId: Provider; }

const ServiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<ServiceDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/services/${id}`)
        .then(res => setService(res.data))
        .catch(err => console.error(err))
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  if (isLoading) return <div className="detail-loading">Loading...</div>;
  if (!service) return <div className="detail-loading">Service not found.</div>;

  return (
    <div className="service-detail-page">
      <button className="detail-back-btn" onClick={() => navigate(-1)}>← Back</button>
      <div className="detail-images-carousel">
        {service.images.map((img, i) => <img key={i} src={img} alt={`${service.name}-${i}`} className="carousel-image" />)}
      </div>

      <div className="detail-content">
        <h1>{service.name}</h1>
        <div className="provider-info-box">
          <img src={service.userId.avatar || 'default-avatar.png'} alt={service.userId.name} />
          <div>
            <p>Posted by</p>
            <h3>{service.userId.name}</h3>
            {service.userId.email && <p>Email: {service.userId.email}</p>}
            {service.userId.phone && <p>Phone: {service.userId.phone}</p>}
          </div>
        </div>

        <p>{service.description}</p>
        {service.features && <p><strong>Features:</strong> {service.features}</p>}
        <p><strong>Price:</strong> ₹{service.price}</p>
      </div>

      <button className="detail-book-now-btn" onClick={() => navigate(`/booking/${service._id}`)}>Book Now</button>
    </div>
  );
};

export default ServiceDetailPage;
