import { useParams } from "react-router-dom";
import { useServiceContext } from '../contexts/ServiceContext';

export default function ServiceDetails() {
  const { id } = useParams();
  const { allServices } = useServiceContext(); 

  const matchedServices = allServices.filter(service => service.name.toLowerCase() === id?.toLowerCase());

  if (matchedServices.length === 0) return <p>No providers found for {id}</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>🔧 {id} Service Providers</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {matchedServices.map((service) => (
          <div
            key={service._id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "1rem",
              width: "250px"
            }}
          >
            <img src={service.image} alt={service.name} style={{ width: "100%", height: "150px", objectFit: "cover" }} />
            <h3>{service.name}</h3>
            <p>{service.description}</p>
            <p>📍 {service.address}</p>
            <p>📞 {service.phone}</p>
          </div>
        ))}
      </div>
    </div>
  );
}