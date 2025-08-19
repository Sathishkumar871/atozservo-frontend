// scrolling.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import './scrolling.css';

const offersData = [
  { title: "Big Billion Days", subtitle: "Up to 80% Off", imageUrl: "https://ik.imagekit.io/pimx50ija/636ee70be2835491a950ed7a96606560.jpg?updatedAt=1755527253562" },
  { title: "Diwali Sale", subtitle: "Buy 1 Get 1 Free", imageUrl: "https://placehold.co/600x400/3498db/ffffff?text=Offer+2" },
  { title: "Mega Electronics", subtitle: "Latest Gadgets", imageUrl: "https://placehold.co/600x400/2ecc71/ffffff?text=Offer+3" },
  { title: "Fashion Fiesta", subtitle: "New Styles Added", imageUrl: "https://placehold.co/600x400/9b59b6/ffffff?text=Offer+4" },
  { title: "Grocery Deals", subtitle: "Save Big Daily", imageUrl: "https://placehold.co/600x400/f1c40f/ffffff?text=Offer+5" },
  { title: "Winter Wear", subtitle: "Stay Warm & Cozy", imageUrl: "https://placehold.co/600x400/e67e22/ffffff?text=Offer+6" },
  { title: "Summer Splash", subtitle: "Cool Offers", imageUrl: "https://ik.imagekit.io/pimx50ija/videoframe_9573.png?updatedAt=1755526656759" },
  { title: "Home Essentials", subtitle: "Daily Discounts", imageUrl: "https://placehold.co/600x400/34495e/ffffff?text=Offer+8" },
  { title: "Kitchen Sale", subtitle: "Up to 60% Off", imageUrl: "https://placehold.co/600x400/c0392b/ffffff?text=Offer+9" },
  { title: "Beauty Deals", subtitle: "Glow Every Day", imageUrl: "https://placehold.co/600x400/8e44ad/ffffff?text=Offer+10" },
  { title: "Extra Offer", subtitle: "Not Visible", imageUrl: "https://placehold.co/600x400/2c3e50/ffffff?text=Offer+11" },
];

interface FeaturedCardProps {
  title: string;
  subtitle: string;
  imageUrl: string;
}

const FeaturedCard: React.FC<FeaturedCardProps> = ({ title, subtitle, imageUrl }) => (
  <div
    className="featured-card"
    style={{
      backgroundImage: `url(${imageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  >
    <div className="overlay">
      <div className="text-box">
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
    </div>
  </div>
);

const Scrolling: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const scrollToIndex = useCallback((i: number) => {
    const container = scrollRef.current;
    if (container) {
      container.scrollTo({
        left: i * container.clientWidth,
        behavior: "smooth"
      });
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => {
        const next = (prev + 1) % 10;
        scrollToIndex(next);
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [scrollToIndex]);

  return (
    <div className="scroll-wrapper">
      <div className="scroll-container" ref={scrollRef}>
        {offersData.slice(0, 10).map((offer, i) => (
          <div key={i} className="scroll-item">
            <FeaturedCard {...offer} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Scrolling;