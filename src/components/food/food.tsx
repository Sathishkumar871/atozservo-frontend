import React, { useState, useEffect } from 'react';
import './food.css';
import { FaStar } from 'react-icons/fa';
import { MdFastfood, MdRestaurant, MdOutlineLocalOffer, MdLocationOn, MdArrowBack, MdAdd, MdRemove, MdDone, MdAccessTime, MdDeliveryDining, MdRestaurantMenu as MdRestaurantMenuIcon } from 'react-icons/md';
import socket from '../../socket';

const cuisines = [
  { name: 'Biryani', image: 'https://via.placeholder.com/100/ff6f61' },
  { name: 'Pizza', image: 'https://via.placeholder.com/100/f7cac9' },
  { name: 'South Indian', image: 'https://via.placeholder.com/100/88b04b' },
  { name: 'Chinese', image: 'https://via.placeholder.com/100/6b5b95' },
];

const dailySpecials = [
  { title: 'Flat 50% Off!', subtitle: 'On all desserts', image: 'https://via.placeholder.com/400x150/ff7f50/ffffff?text=Daily+Special' },
  { title: 'Buy 1 Get 1 Free', subtitle: 'On select pizzas', image: 'https://via.placeholder.com/400x150/f08080/ffffff?text=BOGO+Offer' },
];

// Dummy data for restaurants with menus
const restaurants = [
  { id: 1, name: 'Paradise Biryani', location: { lat: 17.4375, lng: 78.4482 }, cuisine: 'Biryani, North Indian', rating: 4.5, image: 'https://via.placeholder.com/250/ff6f61', menu: [
    { id: 'b1', name: 'Chicken Biryani', price: 250 },
    { id: 'b2', name: 'Mutton Biryani', price: 350 },
    { id: 'b3', name: 'Veg Biryani', price: 200 }
  ]},
  { id: 2, name: 'Domino\'s Pizza', location: { lat: 17.4420, lng: 78.4550 }, cuisine: 'Pizza, Fast Food', rating: 4.2, image: 'https://via.placeholder.com/250/f7cac9', menu: [
    { id: 'p1', name: 'Margherita Pizza', price: 300 },
    { id: 'p2', name: 'Peppy Paneer Pizza', price: 400 },
    { id: 'p3', name: 'Farmhouse Pizza', price: 450 }
  ]},
  { id: 3, name: 'Minerva Coffee Shop', location: { lat: 17.4200, lng: 78.4700 }, cuisine: 'South Indian, Tiffins', rating: 4.7, image: 'https://via.placeholder.com/250/88b04b', menu: [
    { id: 's1', name: 'Masala Dosa', price: 80 },
    { id: 's2', name: 'Idli Vada', price: 60 },
    { id: 's3', name: 'Poori Bhaji', price: 70 }
  ]},
  { id: 4, name: 'Shanghai Chefs', location: { lat: 17.4050, lng: 78.4200 }, cuisine: 'Chinese, Momos', rating: 4.3, image: 'https://via.placeholder.com/250/6b5b95', menu: [
    { id: 'c1', name: 'Veg Noodles', price: 180 },
    { id: 'c2', name: 'Chicken Manchurian', price: 250 },
    { id: 'c3', name: 'Paneer Chilli', price: 220 }
  ]},
];

const Food: React.FC = () => {
  const [currentOrder, setCurrentOrder] = useState<{ orderId: string, userId: string, status: string, eta: string, restaurantName: string } | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<any | null>(null);
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const userId = "user-123";

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`Lat: ${position.coords.latitude.toFixed(2)}, Lng: ${position.coords.longitude.toFixed(2)}`);
          socket.emit('fetchRestaurants', { lat: position.coords.latitude, lng: position.coords.longitude });
        },
        (err) => {
          setError(err.message);
          setLocation("Location not available. Displaying all restaurants.");
          socket.emit('fetchRestaurants', null);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setLocation("Location not supported. Displaying all restaurants.");
      socket.emit('fetchRestaurants', null);
    }

    socket.on('restaurantsData', (data) => {
      // Not used here as data is hardcoded for simplicity, but good practice
    });

    socket.on('orderStatusUpdate', (data) => {
      setCurrentOrder(data);
    });

    return () => {
      socket.off('restaurantsData');
      socket.off('orderStatusUpdate');
    };
  }, []);

  const handleAddToCart = (itemId: string) => {
    setCart(prevCart => ({ ...prevCart, [itemId]: (prevCart[itemId] || 0) + 1 }));
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart(prevCart => {
      const newCart = { ...prevCart };
      if (newCart[itemId] > 1) {
        newCart[itemId] -= 1;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const cartTotal = Object.keys(cart).reduce((total, itemId) => {
    const item = selectedRestaurant.menu.find((menuItem: any) => menuItem.id === itemId);
    return item ? total + item.price * cart[itemId] : total;
  }, 0);

  const handlePlaceOrder = () => {
    if (!selectedRestaurant) return;
    const orderId = `order-${Date.now()}`;
    setCurrentOrder({ orderId, userId, status: 'Placed', eta: '45 mins', restaurantName: selectedRestaurant.name });
    socket.emit("placeOrder", { orderId, restoId: selectedRestaurant.id, userId });
    setCart({}); // Clear cart
  };

  const getStatusIcon = (status: string, currentStatus: string) => {
    const isActive = status === currentStatus;
    const isCompleted = ['Out for Delivery', 'Delivered'].includes(currentStatus) && (status === 'Accepted' || status === 'Preparing');
    
    let icon;
    switch (status) {
      case 'Placed': icon = <MdDone />; break;
      case 'Accepted': icon = <MdRestaurantMenuIcon />; break;
      case 'Preparing': icon = <MdAccessTime />; break;
      case 'Out for Delivery': icon = <MdDeliveryDining />; break;
      default: icon = <MdDone />;
    }
    return <div className={`status-icon ${isActive || isCompleted ? 'active' : ''}`}>{icon}</div>;
  };

  const getStatusLine = (status: string) => {
    const isCompleted = ['Out for Delivery', 'Delivered'].includes(currentOrder?.status || '') && (status === 'Accepted' || status === 'Preparing');
    const isActive = status === currentOrder?.status;
    return <div className={`status-line ${isActive || isCompleted ? 'active' : ''}`}></div>;
  };

  if (currentOrder) {
    return (
      <div className="order-tracking-container">
        <div className="tracking-header">
          <h1>Tracking Your Order</h1>
          <p>From: <strong>{currentOrder.restaurantName}</strong></p>
        </div>
        <div className="tracking-status-bar">
          <div className="status-step">{getStatusIcon('Placed', currentOrder.status)}<p>Order Placed</p></div>
          {getStatusLine('Placed')}
          <div className="status-step">{getStatusIcon('Accepted', currentOrder.status)}<p>Accepted</p></div>
          {getStatusLine('Accepted')}
          <div className="status-step">{getStatusIcon('Preparing', currentOrder.status)}<p>Preparing</p></div>
          {getStatusLine('Preparing')}
          <div className="status-step">{getStatusIcon('Out for Delivery', currentOrder.status)}<p>Out for Delivery</p></div>
        </div>
        <div className="current-status-card">
          <h3>Current Status: <span className="status-text">{currentOrder.status}</span></h3>
          <p>Estimated Delivery: <strong>{currentOrder.eta}</strong></p>
        </div>
      </div>
    );
  }

  if (selectedRestaurant) {
    const hasItemsInCart = Object.keys(cart).length > 0;
    return (
      <div className="menu-container">
        <header className="menu-header">
          <MdArrowBack className="back-icon" onClick={() => setSelectedRestaurant(null)} />
          <div className="restaurant-details">
            <MdRestaurant className="header-icon" />
            <h1>{selectedRestaurant.name}</h1>
            <p>{selectedRestaurant.cuisine}</p>
          </div>
        </header>
        <section className="menu-section">
          <h2>Full Menu</h2>
          <div className="menu-grid">
            {selectedRestaurant.menu.map((item: any) => (
              <div key={item.id} className="menu-item-card">
                <div className="item-info"><h4>{item.name}</h4><p className="item-price">₹{item.price}</p></div>
                <div className="item-actions">
                  {cart[item.id] ? (<><button className="quantity-button" onClick={() => handleRemoveFromCart(item.id)}><MdRemove /></button><span>{cart[item.id]}</span><button className="quantity-button" onClick={() => handleAddToCart(item.id)}><MdAdd /></button></>) : (<button className="add-button" onClick={() => handleAddToCart(item.id)}>Add</button>)}
                </div>
              </div>
            ))}
          </div>
        </section>
        {hasItemsInCart && (
          <div className="cart-summary-panel">
            <div className="cart-info"><p>Total Items: {Object.values(cart).reduce((sum, qty) => sum + qty, 0)}</p><p>Total: ₹{cartTotal.toFixed(2)}</p></div>
            <button className="place-order-button" onClick={handlePlaceOrder}>Place Order</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="food-container">
      <header className="food-header">
        <MdFastfood className="header-icon" />
        <h1>Food Delivery</h1>
        <div className="location-info"><MdLocationOn className="location-icon" /><p>{location || "Detecting your location..."}</p></div>
        {error && <p className="error-message">{error}</p>}
      </header>
      <section className="food-section daily-specials-section">
        <div className="section-title"><MdOutlineLocalOffer className="title-icon" /><h2>Daily Specials & Offers</h2></div>
        <div className="banner-carousel">
          {dailySpecials.map((special, index) => (<div key={index} className="banner-card"><img src={special.image} alt={special.title} className="banner-image" /><div className="banner-text"><h3>{special.title}</h3><p>{special.subtitle}</p></div></div>))}
        </div>
      </section>
      <section className="food-section">
        <h2>Top Cuisines</h2>
        <div className="cuisine-grid">
          {cuisines.map(c => (<div key={c.name} className="cuisine-card"><img src={c.image} alt={c.name} className="cuisine-image" /><span>{c.name}</span></div>))}
        </div>
      </section>
      <section className="food-section">
        <div className="section-title"><MdRestaurant className="title-icon" /><h2>Popular Restaurants</h2></div>
        <div className="restaurant-grid">
          {restaurants.map(resto => (<div key={resto.id} className="restaurant-card" onClick={() => setSelectedRestaurant(resto)}><img src={resto.image} alt={resto.name} className="restaurant-image" /><div className="restaurant-info"><h4>{resto.name}</h4><p className="cuisine-type">{resto.cuisine}</p><div className="rating"><FaStar className="star-icon" /> {resto.rating}</div></div><button className="order-button">View Menu</button></div>))}
        </div>
      </section>
    </div>
  );
};

export default Food;