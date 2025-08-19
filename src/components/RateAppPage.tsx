// RateAppPage.tsx
import React, { useState } from 'react';
import './RateAppPage.css';

const RateAppPage: React.FC = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState('');
  const [reviewsList, setReviewsList] = useState<{rating: number, text: string}[]>([]);

  const handleSubmit = () => {
    if (rating === 0 || review.trim() === '') {
      alert("Please give a rating and write a review.");
      return;
    }

    setReviewsList([...reviewsList, { rating, text: review }]);
    setRating(0);
    setReview('');
  };

  return (
    <div className="rate-container">
      <h2>Rate Our App</h2>
      
      <div className="stars">
        {[1,2,3,4,5].map((star) => (
          <span
            key={star}
            className={`star ${star <= (hover || rating) ? 'filled' : ''}`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
          >★</span>
        ))}
      </div>

      <textarea
        placeholder="Write a review..."
        value={review}
        onChange={(e) => setReview(e.target.value)}
      />

      <button onClick={handleSubmit}>Submit Review</button>

      <h3>User Reviews</h3>
      <div className="reviews-list">
        {reviewsList.length === 0 && <p>No reviews yet</p>}
        {reviewsList.map((r, i) => (
          <div key={i} className="review-item">
            <div className="review-stars">
              {[1,2,3,4,5].map((star) => (
                <span key={star} className={`star ${star <= r.rating ? 'filled' : ''}`}>★</span>
              ))}
            </div>
            <p>{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RateAppPage;
