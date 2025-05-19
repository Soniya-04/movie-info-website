// src/components/MovieDetails/CastPopup/CastPopup.js

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './CastPopup.css';

const CastPopup = ({ cast, onClose, movieId }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleActorClick = (actorId) => {
    navigate(`/cast/${actorId}`, {
      state: {
        from: location.pathname, // e.g., "/movie/550" or "/tv/22980"
        movieId,                 // same ID used to go back to the detail page
      },
    });
  };

  return (
    <div className="cast-popup">
      <button className="popup-back-button" onClick={onClose}>←</button>
      <div className="cast-scroll-container">
        {cast
          .filter((actor) => actor.profile_path) // ✅ Skip actors without images
          .map((actor) => (
            <div
              key={actor.id}
              className="cast-card"
              onClick={() => handleActorClick(actor.id)}
            >
              <img
                src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                alt={actor.name}
              />
              <p className="actor-name">{actor.name}</p>
              <p className="character-name">{actor.character || 'Character N/A'}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CastPopup;
