import React, { useState } from 'react';
import './Sortbar.css';

const Sortbar = ({ sortBy, setSortBy, selectedYear, setSelectedYear, sortAZ, setSortAZ }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const sortOptions = [
    { value: 'popularity.desc', label: 'Popular' },
    { value: 'release_date.desc', label: 'Latest' },
    { value: 'vote_average.desc', label: 'Top Rated' },
  ];

  return (
    <div className="sortbar">
      <div className="left-controls">
        <div className="dropdown">
          <button className="pill" onClick={() => setDropdownOpen(!dropdownOpen)}>
            {sortOptions.find(opt => opt.value === sortBy).label} <span className="arrow">&#x25BC;</span>
          </button>
          {dropdownOpen && (
            <div className="dropdown-menu">
              {sortOptions.map(opt => (
                <div key={opt.value} className="dropdown-item" onClick={() => {
                  setSortBy(opt.value);
                  setDropdownOpen(false);
                }}>
                  {opt.label}
                </div>
              ))}
            </div>
          )}
        </div>

        <input
          type="number"
          min="1900"
          max={new Date().getFullYear()}
          placeholder="Year"
          value={selectedYear || ''}
          onChange={e => setSelectedYear(e.target.value)}
          className="pill input-pill"
        />

        <button
          className={`pill ${sortAZ ? 'active' : ''}`}
          onClick={() => setSortAZ(prev => !prev)}
        >
          A-Z
        </button>
      </div>
    </div>
  );
};

export default Sortbar;
