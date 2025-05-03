import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CastPopup.css';

const CastPopup = ({ cast, movieId, onClose }) => {
  const navigate = useNavigate();

  const handleActorClick = (actorId) => {
    navigate(`/cast/${actorId}`, {
      state: { from: 'castpopup', movieId }, // ✅ pass movieId
    });
  };

  return (
    <div className="cast-popup">
      <button
        className="popup-back-button"
        onClick={onClose}
      >
        ←
      </button>

      <div className="cast-scroll-container">
        {cast.map((actor) => (
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
