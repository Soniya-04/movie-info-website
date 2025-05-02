import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMovieDetail } from '../utils/api'; // Only fetch movie details now
import './MovieDetail.css';

const MovieDetail = () => {
  const { id } = useParams(); // Get movie ID from URL
  const [item, setItem] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchMovieDetail(id); // Fetch movie detail
        setItem(res.data);
      } catch (err) {
        console.error('Error fetching movie detail:', err);
      }
    };

    fetchData();
  }, [id]);

  if (!item) return <div className="loading">Loading...</div>;

  const { poster_path, title, overview, genres, credits, vote_average } = item;
  const displayOverview = overview || 'No overview available.';
  const displayGenres = genres ? genres.map(genre => genre.name).join(', ') : 'No genres available.';
  const displayCast = credits?.cast?.slice(0, 5).map(actor => actor.name).join(', ') || 'No cast available.';

  return (
    <div className="movie-detail-container">
      <div className="poster">
        <img
          src={`https://image.tmdb.org/t/p/w500${poster_path}`}
          alt={title}
          onError={(e) => e.target.src = '/assets/images/no-image.jpg'} // Fallback image in case poster_path is missing
        />
      </div>

      <div className="details">
        <h2>{title}</h2>
        <p>{displayOverview}</p>

        <h4>Genres:</h4>
        <p>{displayGenres}</p>

        <h4>Top Cast:</h4>
        <p>{displayCast}</p>

        <h4>Rating:</h4>
        <p>{vote_average ? `${vote_average} / 10` : 'No rating available'}</p>
      </div>
    </div>
  );
};

export default MovieDetail;
