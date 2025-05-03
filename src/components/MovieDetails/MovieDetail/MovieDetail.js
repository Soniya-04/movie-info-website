import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { fetchMovieDetail, fetchWatchProviders } from '../../utils/api';
import CastPopup from '../CastPopup/CastPopup';
import TrailerModal from '../TrailerModal/TrailerModal';
import './MovieDetail.css';

const MovieDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const [movie, setMovie] = useState(null);
  const [watchLink, setWatchLink] = useState(null);
  const [showCastPopup, setShowCastPopup] = useState(false);
  const [showTrailerModal, setShowTrailerModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchMovieDetail(id);
        setMovie(res.data);

        const providerRes = await fetchWatchProviders(id);
        const providers = providerRes.data.results.IN || providerRes.data.results.US;
        if (providers?.link) setWatchLink(providers.link);
      } catch (err) {
        console.error('Error fetching movie detail or watch provider:', err);
      }
    };

    fetchData();

    if (location.state?.reopenPopup) {
      setShowCastPopup(true);
    }
  }, [id]);

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
        <div className="details">
          <h1 className="title">{title}</h1>
          <div className="sub-info">
            <span className="rating">⭐ {vote_average ? Math.round(vote_average) : 'N/A'}</span>
            <span className="duration">{runtime || 'N/A'} min</span>
            <span className="year">• {releaseYear}</span>
          </div>
          <p className="overview">{overview}</p>
          <p className="director">
            <strong>Director:</strong> {director?.name || 'N/A'}
          </p>
          <p className="cast">
            <strong>Starring:</strong>{' '}
            <span className="clickable-cast" onClick={() => setShowCastPopup(true)}>
              {cast?.map(actor => actor.name).join(', ') || 'N/A'}
            </span>
          </p>
          <div className="genres">
            {genres?.map(genre => (
              <span key={genre.id} className="genre-tag">
                {genre.name}
              </span>
            ))}
          </div>
          <div className="action-buttons">
            {watchLink && (
              <a
                href={watchLink}
                target="_blank"
                rel="noopener noreferrer"
                className="watch-now"
              >
                ▶ Watch Now
              </a>
            )}

            {videos?.results?.length > 0 && (
              <button
                className="watch-trailer"
                onClick={() => setShowTrailerModal(true)}
                title="Watch Trailer"
              >
                ▶ <span>Watch Trailer</span>
              </button>
            )}
          </div>
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
