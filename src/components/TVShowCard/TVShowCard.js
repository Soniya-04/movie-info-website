import React from 'react';
import '../MovieCard/MovieCard.css'; 


export default function TVShowCard({ show }) {
  return (
    <div className="movie-card"> {/* same class name as MovieCard for reuse */}
      <img
        src={`https://image.tmdb.org/t/p/w342${show.poster_path}`}
        alt={show.name}
      />
      <div className="card-info">
        <div className="movie-title" title={show.name}>
          {show.name.length > 25 ? show.name.slice(0, 22) + '...' : show.name}
        </div>
        <div className="movie-meta">
          <span className="year">{show.first_air_date?.split('-')[0]}</span>
          <span className="rating">★ {show.vote_average.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}
