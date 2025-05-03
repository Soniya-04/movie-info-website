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

    // ✅ Reopen CastPopup if coming back from CastDetail
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
    credits,
  } = movie;

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
          </div>
          <p className="overview">{overview}</p>
          <p className="director">
            <strong>Director:</strong> {director?.name || 'N/A'}
          </p>
          <div className="cast">
            <strong>Starring:</strong>{' '}
            {cast?.map(actor => actor.name).join(', ') || 'N/A'}{' '}
            <button onClick={() => setShowCastPopup(true)}>More</button>
          </div>
          <div className="genres">
            {genres?.map(genre => (
              <span key={genre.id} className="genre-tag">
                {genre.name}
              </span>
            ))}
          </div>
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
        <div className="trailer-button">
          <button onClick={() => setShowTrailerModal(true)}>▶ Watch Trailer</button>
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
