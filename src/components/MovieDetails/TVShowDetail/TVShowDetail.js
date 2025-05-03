// src/components/Details/TVShowDetail.js

import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import CastPopup from '../CastPopup/CastPopup';
import './TVShowDetail.css'; // Using a dedicated CSS for TV shows

const API_KEY = 'c850e02b709d94899963809f882c9ead';

const TVShowDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const [showDetails, setShowDetails] = useState(null);
  const [showCastPopup, setShowCastPopup] = useState(false);

  useEffect(() => {
    const fetchShow = async () => {
      try {
        const res = await axios.get(`https://api.themoviedb.org/3/tv/${id}`, {
          params: { api_key: API_KEY, append_to_response: 'credits,videos' },
        });
        setShowDetails(res.data);
      } catch (error) {
        console.error('Error fetching show details:', error);
      }
    };
    fetchShow();
  }, [id]);

  useEffect(() => {
    if (location.state?.reopenPopup) {
      setShowCastPopup(true);
    }
  }, [location.state]);

  if (!showDetails) return <div className="loading">Loading...</div>;

  const {
    name,
    overview,
    genres,
    credits,
    backdrop_path,
    vote_average,
    episode_run_time,
    first_air_date,
    videos,
    seasons,
  } = showDetails;

  const trailerKey = videos?.results?.find(
    (video) => video.type === 'Trailer' && video.site === 'YouTube'
  )?.key;

  return (
    <div
      className="tvshow-detail"
      style={{
        backgroundImage: backdrop_path
          ? `url(https://image.tmdb.org/t/p/original${backdrop_path})`
          : 'none',
      }}
    >
      <div className="tvshow-overlay">
        <div className="tvshow-content">
          <h1 className="title">{name}</h1>
          <div className="rating-duration">
            <span className="rating">⭐ {vote_average.toFixed(1)}</span>
            {episode_run_time?.[0] && <span className="duration">{episode_run_time[0]} min</span>}
            {first_air_date && (
              <span className="release-date">
                ({new Date(first_air_date).getFullYear()})
              </span>
            )}
          </div>

          <p className="overview">{overview}</p>

          <div className="genres">
            {genres?.map((genre) => (
              <span key={genre.id} className="genre-tag">{genre.name}</span>
            ))}
          </div>

          {seasons?.length > 0 && (
  <div className="seasons-section">
    <h3>Seasons</h3>
    <div className="season-list">
      {seasons.map((season) => (
        <div key={season.id} className="season-card">
          {season.poster_path && (
            <img
              src={`https://image.tmdb.org/t/p/w200${season.poster_path}`}
              alt={season.name}
            />
          )}
          <div className="season-info">
            <strong>{season.name}</strong>
            <p>{season.episode_count} episodes</p>
            <p>{season.air_date?.split('-')[0]}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

          

          <div className="actions">
            {trailerKey && (
              <a
                href={`https://www.youtube.com/watch?v=${trailerKey}`}
                target="_blank"
                rel="noopener noreferrer"
                className="trailer-button"
              >
                ▶ Watch Trailer
              </a>
            )}
            <button className="cast-button" onClick={() => setShowCastPopup(true)}>
              Cast & Crew
            </button>
          </div>
        </div>
      </div>

      {showCastPopup && (
        <CastPopup
          cast={credits?.cast || []}
          onClose={() => setShowCastPopup(false)}
          movieId={id}
        />
      )}
    </div>
  );
};

export default TVShowDetail;
