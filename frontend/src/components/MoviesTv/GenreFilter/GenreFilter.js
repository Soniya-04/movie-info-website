import React, { useRef, useState, useEffect } from 'react';
import './GenreFilter.css';

export default function GenreFilter({ genres, selectedGenre, setSelectedGenre }) {
  const scrollRef = useRef();
  const [canScrollLeft, setCanScrollLeft] = useState(false);

  const handleScroll = (dir) => {
    const container = scrollRef.current;
    const scrollAmount = 200;

    if (dir === 'right') {
      container.scrollLeft += scrollAmount;
    } else if (dir === 'left') {
      container.scrollLeft -= scrollAmount;
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    const updateScroll = () => setCanScrollLeft(container.scrollLeft > 0);
    container.addEventListener('scroll', updateScroll);
    return () => container.removeEventListener('scroll', updateScroll);
  }, []);

  return (
    <div className="genre-filter-container">
      {canScrollLeft && <button className="scroll-btn left" onClick={() => handleScroll('left')}>&lt;</button>}
      <div className="genre-scroll" ref={scrollRef}>
        {genres.map((genre) => (
          <button
            key={genre.id}
            className={`genre-chip ${selectedGenre === genre.id ? 'active' : ''}`}
            onClick={() => setSelectedGenre(selectedGenre === genre.id ? null : genre.id)}
          >
            {genre.name}
          </button>
        ))}
      </div>
      <button className="scroll-btn right" onClick={() => handleScroll('right')}>&gt;</button>
    </div>
  );
}
