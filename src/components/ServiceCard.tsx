

const ServiceCard = ({ service }: { service: any }) => {
  return (
    <div className="border p-4 rounded shadow">
      <img src={service.image} alt={service.name} className="w-full h-40 object-cover mb-2" />
      <h3 className="text-lg font-semibold">{service.name}</h3>
      <p className="text-sm text-gray-600">{service.description}</p>
    </div>
  );
};

export default ServiceCard;
