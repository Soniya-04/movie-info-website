import React from 'react';
import { Link } from 'react-router-dom';
import '../MovieCard/MovieCard.css';

export default function TVShowCard({ show }) {
  const handleAddFavorite = async () => {
    const data = {
      mediaId: show.id,
      mediaType: "tv",
      title: show.name,
      posterPath: show.poster_path,
    };

    try {
      const res = await fetch("http://localhost:8080/api/add-favorite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const text = await res.text();
      console.log("Favorite response:", text);
    } catch (err) {
      console.error("Error adding to favorites:", err);
    }
  };

  return (
    <div className="movie-card">
      <Link to={`/tv/${show.id}`} className="card-link">
        <img
          src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
          alt={show.name}
        />
        <div className="card-info">
          <div className="movie-title">{show.name}</div>
          <div className="movie-meta">
            <span>{show.first_air_date?.split('-')[0]}</span>
            <span className="rating">★ {show.vote_average?.toFixed(1)}</span>
          </div>
        </div>
      </Link>
      
    </div>
  );
}
