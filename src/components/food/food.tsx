import React, { useState } from 'react';
import './food.css'; 
import { FaStar } from 'react-icons/fa';
import { MdFastfood, MdRestaurant } from 'react-icons/md';
import socket from '../../socket';
import OrderTrackingPanel from './OrderTrackingPanel';

const cuisines = [
  { name: 'Biryani', image: 'https://via.placeholder.com/100/ff6f61' },
  { name: 'Pizza', image: 'https://via.placeholder.com/100/f7cac9' },
  { name: 'South Indian', image: 'https://via.placeholder.com/100/88b04b' },
  { name: 'Chinese', image: 'https://via.placeholder.com/100/6b5b95' },
];

const restaurants = [
  { id: 1, name: 'Paradise Biryani', cuisine: 'Biryani, North Indian', rating: 4.5, image: 'https://via.placeholder.com/250/ff6f61' },
  { id: 2, name: 'Domino\'s Pizza', cuisine: 'Pizza, Fast Food', rating: 4.2, image: 'https://via.placeholder.com/250/f7cac9' },
  { id: 3, name: 'Minerva Coffee Shop', cuisine: 'South Indian, Tiffins', rating: 4.7, image: 'https://via.placeholder.com/250/88b04b' },
  { id: 4, name: 'Shanghai Chefs', cuisine: 'Chinese, Momos', rating: 4.3, image: 'https://via.placeholder.com/250/6b5b95' },
];

const Food: React.FC = () => {
  const [currentOrder, setCurrentOrder] = useState<{orderId: string, userId: string} | null>(null);

  const userId = "user-123"; // Example user id

  return (
    <div className="food-container">
      <header className="food-header">
        <MdFastfood className="header-icon" />
        <h1>Food Delivery</h1>
        <p>Order delicious food from the best restaurants near you.</p>
      </header>

      <section className="food-section">
        <h2>Top Cuisines</h2>
        <div className="cuisine-grid">
          {cuisines.map(c => (
            <div key={c.name} className="cuisine-card">
              <img src={c.image} alt={c.name} className="cuisine-image" />
              <span>{c.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="food-section">
        <div className="section-title">
          <MdRestaurant className="title-icon" />
          <h2>Popular Restaurants</h2>
        </div>
        <div className="restaurant-grid">
          {restaurants.map(resto => (
            <div key={resto.id} className="restaurant-card">
              <img src={resto.image} alt={resto.name} className="restaurant-image" />
              <div className="restaurant-info">
                <h4>{resto.name}</h4>
                <p className="cuisine-type">{resto.cuisine}</p>
                <div className="rating">
                  <FaStar className="star-icon" /> {resto.rating}
                </div>
              </div>
              <button className="order-button"
                onClick={() => {
                  const orderId = `order-${Date.now()}`;
                  setCurrentOrder({ orderId, userId });
                  socket.emit("placeOrder", { orderId, restoId: resto.id, userId });
                }}
              >
                Order Now
              </button>
            </div>
          ))}
        </div>
      </section>

      {currentOrder && <OrderTrackingPanel orderId={currentOrder.orderId} userId={currentOrder.userId} />}
    </div>
  );
};

export default Food;
