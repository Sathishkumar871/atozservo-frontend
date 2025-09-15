// scrolling.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import './scrolling.css';

const offersData = [
  { title: "Infinity Play Days", subtitle: "Exclusive Gaming Tournaments", imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=60" },
  { title: "30 Minute Food Delivery", subtitle: "Hungry? Get It Fast!", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=60" },
  { title: "Instant Grocery", subtitle: "Fresh Produce at Your Door", imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=60" },
  { title: "random calls and chat", subtitle: "Connect with Privacy", imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=60" },
  { title: "Vehicle Rentals", subtitle: "Cars & Bikes On-Demand", imageUrl: "https://images.unsplash.com/photo-1517524206127-48bbd363f5d4?w=600&auto=format&fit=crop&q=60" },
  { title: "At-Home Services", subtitle: "Cleaning, Repairs & More", imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=60" },
  { title: "Fashion Outlet", subtitle: "Top Brands, Best Prices", imageUrl: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&auto=format&fit=crop&q=60" },
  { title: "Electronics Hub", subtitle: "Latest Gadgets & Deals", imageUrl: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=60" },
  { title: "Travel Bookings", subtitle: "Plan Your Next Getaway", imageUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&auto=format&fit=crop&q=60" },
  { title: "Digital Payments", subtitle: "Scan, Pay & Go", imageUrl: "https://images.unsplash.com/photo-1580592269336-c6d82390239a?w=600&auto=format&fit=crop&q=60" },
  { title: "Health & Wellness", subtitle: "Medicines & Consultations", imageUrl: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=600&auto=format&fit=crop&q=60" },
];

const TOTAL_SLIDES = offersData.length;

interface FeaturedCardProps {
  title: string;
  subtitle: string;
  imageUrl: string;
}

// --- CARD COMPONENT IS NOW SLIGHTLY RESTRUCTURED ---
const FeaturedCard: React.FC<FeaturedCardProps> = ({ title, subtitle, imageUrl }) => (
  <div className="featured-card">
    {/* This new inner div holds the content, allowing the parent to have the animated border */}
    <div 
      className="card-content" 
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className="overlay">
        <div className="text-box">
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
      </div>
    </div>
  </div>
);

const Scrolling: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [index, setIndex] = useState(0);

  const scrollToIndex = useCallback((i: number) => {
    setIndex(i);
    const container = scrollRef.current;
    if (container) {
      container.scrollTo({
        left: i * container.clientWidth,
        behavior: "smooth"
      });
    }
  }, []);

  const startAutoScroll = useCallback(() => {
    if (intervalRef.current) {
        clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setIndex(prev => {
        const nextIndex = (prev + 1) % TOTAL_SLIDES;
        scrollToIndex(nextIndex);
        return nextIndex;
      });
    }, 2000);
  }, [scrollToIndex]);

  const stopAutoScroll = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll();
  }, [startAutoScroll]);
  
  const handleNavClick = (direction: 'prev' | 'next') => {
      stopAutoScroll();
      let nextIndex;
      if (direction === 'next') {
          nextIndex = (index + 1) % TOTAL_SLIDES;
      } else {
          nextIndex = (index - 1 + TOTAL_SLIDES) % TOTAL_SLIDES;
      }
      scrollToIndex(nextIndex);
      startAutoScroll();
  };

  return (
    <div 
        className="scroll-wrapper" 
        onMouseEnter={stopAutoScroll} 
        onMouseLeave={startAutoScroll}
    >
      <div className="scroll-container" ref={scrollRef}>
        {offersData.map((offer, i) => (
          <div key={i} className="scroll-item">
            <FeaturedCard {...offer} />
          </div>
        ))}
      </div>
      
      <button className="nav-arrow prev" onClick={() => handleNavClick('prev')}>
        &#10094;
      </button>
      <button className="nav-arrow next" onClick={() => handleNavClick('next')}>
        &#10095;
      </button>

      <div className="dots-container">
        {offersData.map((_, i) => (
          <button
            key={i}
            className={`dot ${index === i ? 'active' : ''}`}
            onClick={() => {
                stopAutoScroll();
                scrollToIndex(i);
                startAutoScroll();
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Scrolling;