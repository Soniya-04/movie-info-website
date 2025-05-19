// src/components/MovieDetails/Reviews/Review.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Review.css';

const Review = ({ id, type }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/${type}/${id}/reviews`,
          {
            params: {
              api_key: 'c850e02b709d94899963809f882c9ead',
            },
          }
        );
        setReviews(res.data.results || []);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      }
    };

    fetchReviews();
  }, [id, type]);

  if (!reviews.length) return null;

  return (
    <div className="review-section-wrapper">
      <div className="review-section-inner">
        <h3 className="review-heading">User Reviews</h3>
        {reviews.slice(0, 4).map((review) => (
          <div key={review.id} className="review-card">
            <h4>{review.author}</h4>
            <p>{review.content.slice(0, 300)}{review.content.length > 300 && '...'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Review;
