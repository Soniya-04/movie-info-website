import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import CastPopup from '../CastPopup/CastPopup';
import Review from '../Review/Review';
import './TVShowDetail.css';

const API_KEY = 'c850e02b709d94899963809f882c9ead';

const TVShowDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const [showDetails, setShowDetails] = useState(null);
  const [showCastPopup, setShowCastPopup] = useState(false);
  const [watchLink, setWatchLink] = useState(null);
  const [showReviews, setShowReviews] = useState(false);
  const [hasReviews, setHasReviews] = useState(false);

  const [isFavorite, setIsFavorite] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);

  const backendUrl = 'http://localhost:8080';

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

    const fetchWatchProviders = async () => {
      try {
        const res = await axios.get(`https://api.themoviedb.org/3/tv/${id}/watch/providers`, {
          params: { api_key: API_KEY },
        });
        const providers = res.data.results;
        const region = providers.IN || providers.US || providers.EN || null;
        if (region?.link) {
          setWatchLink(region.link);
        }
      } catch (error) {
        console.error('Error fetching watch providers:', error);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await axios.get(`https://api.themoviedb.org/3/tv/${id}/reviews`, {
          params: { api_key: API_KEY },
        });
        if (res.data.results.length > 0) {
          setHasReviews(true);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchShow();
    fetchWatchProviders();
    fetchReviews();
  }, [id]);

  useEffect(() => {
    if (location.state?.reopenPopup) {
      setShowCastPopup(true);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const [favRes, watchRes] = await Promise.all([
          fetch(`${backendUrl}/api/list-favorites`),
          fetch(`${backendUrl}/api/list-watchlist`)
        ]);
        const favData = await favRes.json();
        const watchData = await watchRes.json();

        setIsFavorite(favData.some(item => item.mediaId === id && item.mediaType === 'tv'));
        setInWatchlist(watchData.some(item => item.mediaId === id && item.mediaType === 'tv'));
      } catch (error) {
        console.error('Error checking status:', error);
      }
    };

    fetchStatus();
  }, [id]);

  const handleFavoriteToggle = async () => {
    try {
      const url = `${backendUrl}/api/${isFavorite ? 'remove-favorite' : 'add-favorite'}`;
      const formData = new URLSearchParams();
      formData.append('media_id', id);
      formData.append('media_type', 'tv');
      formData.append('title', showDetails.name);
      formData.append('poster_path', showDetails.poster_path || '');

      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });

      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleWatchlistToggle = async () => {
    try {
      const url = `${backendUrl}/api/${inWatchlist ? 'remove-watchlist' : 'add-watchlist'}`;
      const formData = new URLSearchParams();
      formData.append('media_id', id);
      formData.append('media_type', 'tv');
      formData.append('title', showDetails.name);
      formData.append('poster_path', showDetails.poster_path || '');

      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });

      setInWatchlist(!inWatchlist);
    } catch (error) {
      console.error('Error toggling watchlist:', error);
    }
  };

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

  const reviewButtonStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    padding: '0.4rem 0.8rem',
    borderRadius: '20px',
    fontSize: '1rem',
    fontWeight: 500,
    border: 'none',
    marginTop: '1.5rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  const reviewButtonHoverStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  };

  return (
    <div
      className="tvshow-detail"
      style={{
        backgroundImage: backdrop_path
          ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(https://image.tmdb.org/t/p/original${backdrop_path})`
          : 'none',
      }}
    >
      <div className="tvshow-overlay">
        <div className="tvshow-content">
          <h1 className="title">{name}</h1>

          <div className="rating-duration">
            <span className="rating">⭐ {vote_average.toFixed(1)}</span>
            {episode_run_time?.[0] && <span>{episode_run_time[0]} min</span>}
            {first_air_date && <span>({new Date(first_air_date).getFullYear()})</span>}

            <span
              className="icon-button"
              title="Add to Favorites"
              onClick={handleFavoriteToggle}
              style={{ marginLeft: '1rem', cursor: 'pointer' }}
            >
              {isFavorite ? '❤️' : '🤍'}
            </span>
            <span
              className="icon-button"
              title="Add to Watchlist"
              onClick={handleWatchlistToggle}
              style={{ marginLeft: '0.5rem', cursor: 'pointer' }}
            >
              {inWatchlist ? '✔️' : '➕'}
            </span>
          </div>

          <p className="overview">{overview}</p>

          <div className="genres">
            <strong className="genre-heading">Genres:</strong>
            {genres?.map((genre) => (
              <span key={genre.id} className="genre-tag">{genre.name}</span>
            ))}
          </div>

          {credits?.cast?.length > 0 && (
            <div className="cast-inline">
              <strong className="section-heading">Starring:</strong>
              <div className="cast-list-scroll">
                {credits.cast.slice(0, 10).map((actor) => (
                  <span
                    key={actor.id}
                    className="clickable-cast"
                    onClick={() => setShowCastPopup(true)}
                  >
                    {actor.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {seasons?.length > 0 && (
            <div className="seasons-section">
              <h3 className="section-heading">Seasons</h3>
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
                className="watch-trailer"
              >
                Watch Trailer
              </a>
            )}
            {watchLink && (
              <a
                href={watchLink}
                target="_blank"
                rel="noopener noreferrer"
                className="watch-now"
              >
                Watch Now
              </a>
            )}
          </div>

          {hasReviews && (
            <button
              className="read-reviews-btn"
              style={reviewButtonStyle}
              onMouseOver={(e) => Object.assign(e.target.style, reviewButtonHoverStyle)}
              onMouseOut={(e) => Object.assign(e.target.style, reviewButtonStyle)}
              onClick={() => setShowReviews((prev) => !prev)}
            >
              {showReviews ? 'Hide Reviews' : 'Read Reviews'}
            </button>
          )}

          {showReviews && <Review id={id} type="tv" />}
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
