import React, { useRef } from 'react';
import './GenreFilter.css';

export default function GenreFilter({ genres, selectedGenre, setSelectedGenre }) {
  const genreScrollRef = useRef(null);

  const scrollGenres = (direction) => {
    const scrollAmount = 150;
    if (genreScrollRef.current) {
      genreScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="genre-section">
      <h3>Browse by Genre</h3>
      <div className="scroll-container">
        <button className="scroll-btn" onClick={() => scrollGenres('left')}>{'<'}</button>
        <div className="genres-scroll" ref={genreScrollRef}>
          {genres.map(g => (
            <button
              key={g.id}
              className={`genre-btn ${selectedGenre === g.id ? 'active' : ''}`}
              onClick={() => setSelectedGenre(selectedGenre === g.id ? null : g.id)}
            >
              {g.name}
            </button>
          ))}
        </div>
        <button className="scroll-btn" onClick={() => scrollGenres('right')}>{'>'}</button>
      </div>
    </section>
  );
}
