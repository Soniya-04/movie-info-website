import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { fetchMovieDetail, fetchWatchProviders } from '../../utils/api';
import CastPopup from '../CastPopup/CastPopup';
import TrailerModal from '../TrailerModal/TrailerModal';
import Review from '../Review/Review';
import './MovieDetail.css';

const MovieDetail = () => {
  const { id } = useParams();
  const location = useLocation();

  const [movie, setMovie] = useState(null);
  const [watchLink, setWatchLink] = useState(null);
  const [showCastPopup, setShowCastPopup] = useState(false);
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);
  const [loadingWatchlist, setLoadingWatchlist] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchMovieDetail(id);
        setMovie(res.data);

        const providerRes = await fetchWatchProviders(id);
        const providers = providerRes.data.results.IN || providerRes.data.results.US;
        if (providers?.link) setWatchLink(providers.link);

        const favRes = await fetch('http://localhost:8080/api/list-favorites');
        const favList = await favRes.json();
        setIsFavorite(favList.some(item => String(item.mediaId) === String(id) && item.mediaType === 'movie'));

        const watchRes = await fetch('http://localhost:8080/api/list-watchlist');
        const watchList = await watchRes.json();
        setInWatchlist(watchList.some(item => String(item.mediaId) === String(id) && item.mediaType === 'movie'));
      } catch (err) {
        console.error('Error fetching movie detail:', err);
      }
    };

    fetchData();

    if (location?.state?.reopenPopup) {
      setShowCastPopup(true);
    }
  }, [id, location?.state?.reopenPopup]);

  const handleToggleFavorite = async () => {
    if (loadingFavorite || !movie) return;
    setLoadingFavorite(true);
    const endpoint = isFavorite ? 'remove-favorite' : 'add-favorite';

    try {
      await fetch(`http://localhost:8080/api/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          media_id: id,
          media_type: 'movie',
          title: movie.title,
          poster_path: movie.poster_path,
        }),
      });
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Favorite toggle failed:', err);
    } finally {
      setLoadingFavorite(false);
    }
  };

  const handleToggleWatchlist = async () => {
    if (loadingWatchlist || !movie) return;
    setLoadingWatchlist(true);
    const endpoint = inWatchlist ? 'remove-watchlist' : 'add-watchlist';

    try {
      await fetch(`http://localhost:8080/api/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          media_id: id,
          media_type: 'movie',
          title: movie.title,
          poster_path: movie.poster_path,
        }),
      });
      setInWatchlist(!inWatchlist);
    } catch (err) {
      console.error('Watchlist toggle failed:', err);
    } finally {
      setLoadingWatchlist(false);
    }
  };

  if (!movie) return <div className="loading">Loading...</div>;

  const {
    backdrop_path,
    title,
    overview,
    genres,
    vote_average,
    runtime,
    release_date,
    credits,
    videos,
  } = movie;

  const releaseYear = release_date ? new Date(release_date).getFullYear() : 'N/A';
  const director = credits?.crew?.find(person => person.job === 'Director');
  const cast = credits?.cast?.slice(0, 5);

  return (
    <div
      className="movie-detail-container"
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original${backdrop_path})`,
      }}
    >
      <div className="overlay">
        <div className={`details ${showReviews ? 'center-content' : ''}`}>
          <h1 className="title">{title}</h1>

          <div className="sub-info">
            <span className="rating">⭐ {Math.round(vote_average || 0)}</span>
            <span className="duration">{runtime || 'N/A'} min</span>
            <span className="year">• {releaseYear}</span>

            <div className="icon-buttons inline-icons">
              <button
                className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                onClick={handleToggleFavorite}
                title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              >
                {isFavorite ? '❤️' : '🤍'}
              </button>

              <button
                className={`watchlist-btn ${inWatchlist ? 'added' : ''}`}
                onClick={handleToggleWatchlist}
                title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                style={{ marginLeft: '0.5rem', cursor: 'pointer' }}
              >
                {inWatchlist ? '✔' : '➕'}
              </button>
            </div>
          </div>

          <p className="overview">{overview}</p>
          <p className="director"><strong>Director:</strong> {director?.name || 'N/A'}</p>
          <p className="cast">
            <strong>Starring:</strong>{' '}
            <span className="clickable-cast" onClick={() => setShowCastPopup(true)}>
              {cast?.map(actor => actor.name).join(', ') || 'N/A'}
            </span>
          </p>

          <div className="genres">
            {genres?.map(genre => (
              <span key={genre.id} className="genre-tag">{genre.name}</span>
            ))}
          </div>

          <div className="action-buttons left-align">
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
            {videos?.results?.length > 0 && (
              <button
                className="watch-trailer"
                onClick={() => setShowTrailerModal(true)}
              >
                <span>Watch Trailer</span>
              </button>
            )}
          </div>

          <div className="review-button-wrapper">
            <button
              className="read-reviews-button"
              onClick={() => setShowReviews(prev => !prev)}
            >
              {showReviews ? 'Hide Reviews' : 'Read Reviews'}
            </button>
          </div>

          {showReviews && <Review id={id} type="movie" />}
        </div>
      </div>

      {showCastPopup && (
        <CastPopup cast={credits?.cast} movieId={id} onClose={() => setShowCastPopup(false)} />
      )}
      {showTrailerModal && (
        <TrailerModal movieId={id} onClose={() => setShowTrailerModal(false)} />
      )}
    </div>
  );
};

export default MovieDetail;
