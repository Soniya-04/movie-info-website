import React from 'react';
import './Sortbar.css';

export default function Sortbar({
  mediaType,
  sortBy,
  setSortBy,
  selectedYear,
  setSelectedYear,
  selectedAZ,
  setSelectedAZ,
}) {
  return (
    <div className="sortbar">
      <div className="sort-label">Sort by:</div>
      <div className="left-controls">
        <div className="custom-select-wrapper">
          <select
            className={`sort-select ${sortBy ? 'active-option' : ''}`}
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="popularity.desc">Popular</option>

            {mediaType === 'movie' && (
              <option value="release_date.desc">Latest</option>
            )}

            {mediaType === 'tv' && (
              <option value="on_the_air">Currently Airing</option>
            )}

            <option value="vote_average.desc">Top Rated</option>
          </select>
        </div>

        <div className="custom-select-wrapper">
          
            <select
  className={`sort-select ${selectedYear ? 'active-option' : ''}`}
  value={selectedYear || ''}
  onChange={e => setSelectedYear(e.target.value)}
>

            <option value="">Year</option>
            {[...Array(25)].map((_, i) => {
              const year = 2024 - i;
              return <option key={year} value={year}>{year}</option>;
            })}
          </select>
        </div>

        <div className="custom-select-wrapper">
          <select
            className={`sort-select ${selectedAZ ? 'active-option' : ''}`}
            value={selectedAZ || ''}
            onChange={e => setSelectedAZ(e.target.value)}
          >
            <option value="">A-Z</option>
            {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => (
              <option key={letter} value={letter}>{letter}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
