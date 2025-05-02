import React from 'react';
import './RatingFilter.css';


export default function RatingFilter({ minRating, setMinRating }) {
  return (
    <div className="rating-filter">
      <span>⭐</span>
      <input
        type="range"
        min="0"
        max="10"
        step="0.1"
        value={minRating}
        onChange={e => setMinRating(e.target.value)}
      />
      <span>{minRating}</span>
    </div>
  );
}
