import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function MovieCard({ movie, favorites }) {
  const [isFavorite, setIsFavorite] = useState(false);

  // Set initial favorite state from props or backend
  useEffect(() => {
    if (favorites && Array.isArray(favorites)) {
      setIsFavorite(favorites.includes(movie.id));
    } else {
      const checkFavorite = async () => {
        try {
          const res = await fetch(`http://localhost:8080/api/is-favorite?mediaId=${movie.id}&mediaType=movie`);
          const json = await res.json();
          setIsFavorite(json.isFavorite);
        } catch (err) {
          console.error("Error checking favorite status:", err);
        }
      };
      checkFavorite();
    }
  }, [movie.id, favorites]);

  const handleRemoveFavorite = async () => {
    const data = {
      mediaId: movie.id,
      mediaType: "movie",
      title: movie.title,
      posterPath: movie.poster_path,
    };

    try {
      const res = await fetch("http://localhost:8080/api/remove-favorite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const text = await res.text();
      console.log("Removed from favorites:", text);
      setIsFavorite(false);
    } catch (err) {
      console.error("Error removing favorite:", err);
    }
  };

  return (
    <div className="movie-card" style={{ position: 'relative' }}>
      <Link to={`/movie/${movie.id}`} className="card-link">
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
      </Link>

      {/* Show red heart only if already in favorites */}
      {isFavorite && (
        <button className="favorite-btn" onClick={handleRemoveFavorite}>♥</button>
      )}

      {/* Inline style block */}
      <style>{`
        .favorite-btn {
          background: transparent;
          color: red;
          border: none;
          font-size: 22px;
          cursor: pointer;
          position: absolute;
          top: 10px;
          right: 10px;
        }
      `}</style>
    </div>
  );
}
