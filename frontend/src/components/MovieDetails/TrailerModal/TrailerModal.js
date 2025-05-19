import React, { useEffect, useState } from 'react';
import './TrailerModal.css';

const TrailerModal = ({ movieId, onClose, autoPlay = false }) => {
  const [trailerKey, setTrailerKey] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchTrailer = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=c850e02b709d94899963809f882c9ead`
        );
        const data = await res.json();

        const trailer = data.results.find(
          (vid) => vid.type === 'Trailer' && vid.site === 'YouTube'
        );

        if (trailer?.key) {
          setTrailerKey(trailer.key);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching trailer:', err);
        setError(true);
      }
    };

    fetchTrailer();
  }, [movieId]);

  if (error) {
    return (
      <div className="trailer-modal">
        <button className="close-button" onClick={onClose}>×</button>
        <div className="error-message">Trailer not available.</div>
      </div>
    );
  }

  if (!trailerKey) return null;

  const embedUrl = `https://www.youtube.com/embed/${trailerKey}?rel=0&controls=1${autoPlay ? '&autoplay=1' : ''}`;

  return (
    <div className="trailer-modal">
      <button className="close-button" onClick={onClose}>×</button>
      <iframe
        width="100%"
        height="100%"
        src={embedUrl}
        frameBorder="0"
        allow={`${autoPlay ? 'autoplay;' : ''} encrypted-media; fullscreen`}
        allowFullScreen
        title="YouTube Trailer"
      ></iframe>
    </div>
  );
};

export default TrailerModal;
