import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

export default function SearchBar({ context = 'home' }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search/${query}?context=${context}`);
    }
  };

  let placeholderText = "Search  movies or shows...";
  if (context === 'movies') placeholderText = "Search for movies only";
  else if (context === 'tvshows') placeholderText = "Search for tvshows only";
  const inputStyle =
  context === 'home'
    ? { paddingRight: '3rem' } // bigger right padding for home placeholder
    : {};
  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <input
        type="text"
        placeholder={placeholderText}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit">🔍</button>
    </form>
  );
}
