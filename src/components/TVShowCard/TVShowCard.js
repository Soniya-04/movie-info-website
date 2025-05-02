import React from 'react';
import { Link } from 'react-router-dom';
import './TVShowCard.css';

const TVShowCard = ({ show }) => (
  <div className="tv-show-card">
    <Link to={`/tv-show/${show.id}`}>
      <img
        src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
        alt={show.name}
      />
      <h3>{show.name}</h3>
      <p>{show.vote_average}</p>
    </Link>
  </div>
);

export default TVShowCard;
