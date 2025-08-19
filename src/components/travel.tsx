// Travel.tsx
import React, { useState, useEffect } from 'react';
import './Travel.css';
import { FaCar, FaMotorcycle, FaSuitcaseRolling, FaMapMarkedAlt, FaCalendarAlt, FaUser, FaPhone, FaTimes, FaCheckCircle, FaRupeeSign } from 'react-icons/fa';

// --- INTERFACES AND DATA (No changes here) ---
const carRentals = [
  { id: 1, name: 'Toyota Innova Crysta', type: 'SUV', seats: 7, transmission: 'Manual', price: 2500, image: 'https://ik.imagekit.io/pimx50ija/Toyota%20Innova%20Crysta.jpeg?updatedAt=1755525602775' },
  { id: 2, name: 'Maruti Swift Dzire', type: 'Sedan', seats: 5, transmission: 'Automatic', price: 1800, image: 'https://ik.imagekit.io/pimx50ija/708ff800aa0630f2f0577299fc23403a.jpg?updatedAt=1755525927476' },
  { id: 3, name: 'Tata Safari', type: 'SUV', seats: 7, transmission: 'Automatic', price: 3000, image: 'https://ik.imagekit.io/pimx50ija/69b78990f27fd10a402824de3bd33c62.jpg?updatedAt=1755526103772' },
  { id: 4, name: 'Hyundai i20', type: 'Hatchback', seats: 5, transmission: 'Manual', price: 1600, image: 'https://ik.imagekit.io/pimx50ija/e1b51f2985af556609c1e8391c50fe9d.jpg?updatedAt=1755526025511' },
  { id: 5, name: 'Mahindra Thar', type: 'Off-road', seats: 4, transmission: 'Manual', price: 2800, image: 'https://ik.imagekit.io/pimx50ija/mahindra-thar-right-front-three-quarter3.jpg?updatedAt=1755607584850' },
  { id: 6, name: 'Kia Seltos', type: 'SUV', seats: 5, transmission: 'Automatic', price: 2200, image: 'https://ik.imagekit.io/pimx50ija/kia-seltos-right-front-three-quarter-2.jpg?updatedAt=1755607584852' },
];
const bikeRentals = [
  { id: 1, name: 'Royal Enfield Classic', type: 'Cruiser', engine: '350cc', price: 1200, image: 'https://ik.imagekit.io/pimx50ija/2f0b6773b1733088ff96e993205f6145.jpg?updatedAt=1755526145461' },
  { id: 2, name: 'Honda Activa 6G', type: 'Scooter', engine: '110cc', price: 500, image: 'https://ik.imagekit.io/pimx50ija/activa-6g-right-front-three-quarter-2.jpg?updatedAt=1755607584903' },
  { id: 3, name: 'Bajaj Pulsar NS200', type: 'Sports', engine: '200cc', price: 900, image: 'https://ik.imagekit.io/pimx50ija/bajaj-pulsar-ns200-right-front-three-quarter-3.jpg?updatedAt=1755607584883' },
  { id: 4, name: 'Yamaha MT-15', type: 'Sports', engine: '155cc', price: 1000, image: 'https://ik.imagekit.io/pimx50ija/yamaha-mt-15-v2-right-front-three-quarter-3.jpg?updatedAt=1755607584869' },
];
const privateTravels = [
  { id: 1, name: 'Outstation Cabs', description: 'Comfortable rides to any city with professional drivers.', icon: <FaCar /> },
  { id: 2, name: 'Tour Packages', description: 'Explore top destinations with our curated all-inclusive packages.', icon: <FaSuitcaseRolling /> },
];


// --- COMPONENT DEFINITION ---
// 1. Accept a 'user' prop which contains the profile data.
interface TravelProps {
  user: {
    name: string;
    phone: string;
  };
}

const Travel: React.FC<TravelProps> = ({ user }) => {
  const [modalVehicle, setModalVehicle] = useState<any>(null);
  const [bookingStep, setBookingStep] = useState(1);
  
  // 2. Removed local state for name and phone. We will use the 'user' prop directly.
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [days, setDays] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  const [myBookings, setMyBookings] = useState<any[]>([]);

  const handleBookNow = (vehicle: any) => {
    setModalVehicle(vehicle);
    setBookingStep(1);
    setStartDate('');
    setEndDate('');
    setDays(0);
    setTotalCost(0);
  };

  const handleCloseModal = () => {
    setModalVehicle(null);
  };

  const handleDateChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
    if (start && end) {
      const date1 = new Date(start);
      const date2 = new Date(end);
      if (date2 > date1) {
        const timeDiff = date2.getTime() - date1.getTime();
        const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        setDays(dayDiff);
        setTotalCost(dayDiff * modalVehicle.price);
      } else {
        setDays(0);
        setTotalCost(0);
      }
    }
  };

  const handleProceedToPayment = () => {
    // 3. Validation now checks the user prop and dates.
    if (user && user.name && user.phone && startDate && endDate && days > 0) {
      setBookingStep(2);
    } else {
      alert('Please complete your profile and select valid dates to book.');
    }
  };

  const handleConfirmBooking = () => {
    const newBooking = {
      id: Date.now(),
      vehicleName: modalVehicle.name,
      image: modalVehicle.image,
      totalCost,
      days,
      startDate,
      endDate,
      status: 'Confirmed'
    };
    setMyBookings([...myBookings, newBooking]);
    setBookingStep(3);
  };

  return (
    <div className="travel-container">
      <header className="travel-header">
        <FaMapMarkedAlt className="header-icon" />
        <h1>Explore & Rent</h1>
        <p>Your premium solution for vehicle rentals and travel packages.</p>
      </header>

      {/* My Bookings Section */}
      {myBookings.length > 0 && (
        <section className="travel-section">
          <div className="section-title">
            <FaSuitcaseRolling className="title-icon" />
            <h2>My Bookings</h2>
          </div>
          <div className="bookings-grid">
            {myBookings.map(booking => (
              <div key={booking.id} className="booking-status-card">
                <img src={booking.image} alt={booking.vehicleName} />
                <div className="booking-status-info">
                  <h4>{booking.vehicleName}</h4>
                  <p><strong>Dates:</strong> {booking.startDate} to {booking.endDate} ({booking.days} days)</p>
                  <p><strong>Total Cost:</strong> ₹{booking.totalCost}</p>
                  <p className={`status ${booking.status.toLowerCase()}`}>{booking.status}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Car Rentals */}
      <section className="travel-section">
        <div className="section-title">
          <FaCar className="title-icon" />
          <h2>Car Rentals</h2>
        </div>
        <div className="rental-grid">
          {carRentals.map(car => (
            <div key={car.id} className="rental-card" onClick={() => handleBookNow(car)}>
              <img src={car.image} alt={car.name} className="rental-image" />
              <div className="rental-info">
                <h4>{car.name}</h4>
                <div className="rental-specs">
                  <span>{car.type}</span>
                  <span>{car.seats} Seater</span>
                  <span>{car.transmission}</span>
                </div>
                <p className="rental-price">₹{car.price}<span>/day</span></p>
              </div>
              <button className="book-button">Book Now</button>
            </div>
          ))}
        </div>
      </section>

      {/* Other sections (Bike, Private Travels) remain the same */}
      {/* ... */}

      {/* Booking Modal */}
      {modalVehicle && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={handleCloseModal}><FaTimes /></button>
            
            {bookingStep === 1 && (
              <div className="booking-step">
                <h2>Booking Details</h2>
                <p>You are booking: <strong>{modalVehicle.name}</strong></p>
                
                {/* 4. Removed manual input fields for name and phone. Displaying them instead. */}
                <div className="profile-info-display">
                  <p><strong>Name:</strong> {user?.name || 'Please complete your profile'}</p>
                  <p><strong>Phone:</strong> {user?.phone || 'Please complete your profile'}</p>
                </div>

                <div className="form-group date-group">
                  <FaCalendarAlt />
                  <input type="date" value={startDate} onChange={e => handleDateChange(e.target.value, endDate)} />
                  <span>to</span>
                  <input type="date" value={endDate} onChange={e => handleDateChange(startDate, e.target.value)} />
                </div>
                {days > 0 && (
                  <div className="cost-summary">
                    <p>Duration: {days} Day(s)</p>
                    <p>Total Cost: <strong>₹{totalCost}</strong></p>
                  </div>
                )}
                <button className="confirm-button" onClick={handleProceedToPayment} disabled={!user?.name || !user?.phone || days <= 0}>
                  Proceed to Payment
                </button>
              </div>
            )}

            {bookingStep === 2 && (
              <div className="booking-step">
                <h2>Payment</h2>
                <p>Please confirm the payment for:</p>
                <div className="payment-summary">
                  <h4>{modalVehicle.name}</h4>
                  <p>{days} Day(s) from {startDate} to {endDate}</p>
                  <p className="total-cost">Total: ₹{totalCost}</p>
                </div>
                <button className="confirm-button payment-btn" onClick={handleConfirmBooking}>
                  <FaRupeeSign /> Pay Now (Simulated)
                </button>
                <button className="cancel-button" onClick={() => setBookingStep(1)}>Go Back</button>
              </div>
            )}

            {bookingStep === 3 && (
              <div className="booking-step confirmation">
                <FaCheckCircle className="confirmation-icon" />
                <h2>Booking Confirmed!</h2>
                <p>Your booking for <strong>{modalVehicle.name}</strong> is successful.</p>
                <p>A confirmation has been sent to your mobile number ({user.phone}).</p>
                <button className="confirm-button" onClick={handleCloseModal}>Done</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Travel;
