import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BattleLink.css';

const images = [
  { id: 1, url: 'https://ik.imagekit.io/pimx50ija/IMG_20250804_165731.jpg?updatedAt=1754306894179', alt: 'Free Fire', name: 'Free Fire' },
  { id: 2, url: 'https://ik.imagekit.io/pimx50ija/thumb-1920-947385.jpg?updatedAt=1754320849325', alt: 'PUBG', name: 'PUBG' },
  { id: 3, url: 'https://ik.imagekit.io/pimx50ija/381347656b4efeba9c387f65628d3518.jpg?updatedAt=1754321718215', alt: 'Game 3', name: 'Game 3' },
  // ... మీ మిగతా images
];

const BattleLink: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startPos = useRef(0);
  const scrollLeft = useRef(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (containerRef.current && activeIndex !== null) {
      const activeImageElement = containerRef.current.children[activeIndex] as HTMLElement;
      if (activeImageElement) {
        const containerWidth = containerRef.current.offsetWidth;
        const activeImageWidth = activeImageElement.offsetWidth;
        const scrollPosition = activeImageElement.offsetLeft - (containerWidth / 2) + (activeImageWidth / 2);
        containerRef.current.scrollTo({ left: scrollPosition, behavior: 'smooth' });
      }
    }
  }, [activeIndex]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDragging.current = true;
    startPos.current = e.pageX - containerRef.current!.offsetLeft;
    scrollLeft.current = containerRef.current!.scrollLeft;
    containerRef.current!.style.cursor = 'grabbing';
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current!.offsetLeft;
    const walk = (x - startPos.current) * 1.5;
    containerRef.current!.scrollLeft = scrollLeft.current - walk;
  };

  const handleImageClick = (index: number) => {
    if (!isDragging.current) {
      // Logic: If the same image is clicked twice, navigate. Otherwise, just activate.
      if (activeIndex === index) {
        // If the same image is clicked again, perform navigation
        const clickedGameName = images[index].name;
        if (clickedGameName === 'Free Fire') {
          navigate('/freefire');
        } else if (clickedGameName === 'PUBG') {
          navigate('/pubg');
        }
        // Deactivate after navigation (optional)
        setActiveIndex(null);
      } else {
        // If a new image is clicked, activate it
        setActiveIndex(index);
      }
    }
  };

  return (
    <div className="slider-wrapper">
      <div
        className="image-slider-container"
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`slider-item ${index === activeIndex ? 'active' : ''}`}
            onClick={() => handleImageClick(index)}
          >
            <img
              src={image.url}
              alt={image.alt}
              className="slider-image"
              onDragStart={(e) => e.preventDefault()}
            />
            {/* Show game name only when active */}
            <div className="game-name">{image.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BattleLink;