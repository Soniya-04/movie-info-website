import React from 'react';
import { Link } from 'react-router-dom';
import './MovieCard.css';

export default function MovieCard({ movie }) {
  return (
    <Link to={`/movie/${movie.id}`} className="card-link">
      <div className="movie-card">
        <img
          src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
          alt={movie.title}
        />
        <div className="card-info">
          <div className="movie-title">{movie.title}</div>
          <div className="movie-meta">
            <span className="year">{movie.release_date?.split('-')[0]}</span>
            <span className="rating">★ {movie.vote_average.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
