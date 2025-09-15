// Import the CSS file here 👇
import './MainButtons.css';

import { useNavigate } from 'react-router-dom';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';

const mainServices = [
  { name: 'Food', IconComponent: RestaurantMenuIcon, color: '#ff6f61', path: '/food' },
  { name: 'Services', IconComponent: MiscellaneousServicesIcon, color: '#6b5b95', type: 'Home Services', basePath: '/category' },
  { name: 'Grocery', IconComponent: ShoppingCartIcon, color: '#f7cac9', path: '/grocery' },
  { name: 'Money Lending', IconComponent: AttachMoneyIcon, color: '#20845a', path: '/money-lending' },
  { name: 'Games', IconComponent: VideogameAssetIcon, color: '#ff9a00', path: '/gamedesign' },
];

const MainButtons = () => {
  const navigate = useNavigate();

  const handleButtonClick = (service: any) => {
    if (service.path) {
      navigate(service.path);
    } else if (service.basePath && service.type) {
      navigate(`${service.basePath}?type=${encodeURIComponent(service.type)}`);
    }
  };

  return (
    <div className="buttons-container">
      {mainServices.map((service) => (
        <div
          key={service.name}
          className="premium-button"
          style={{ '--service-color': service.color } as React.CSSProperties}
          onClick={() => handleButtonClick(service)}
        >
          <service.IconComponent style={{ fontSize: 40 }} />
          <p>{service.name}</p>
        </div>
      ))}
    </div>
  );
};

export default MainButtons;