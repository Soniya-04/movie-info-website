import React, { useEffect, useRef, useState } from 'react';
import { fetchPopularMovies, fetchPopularTV, fetchGenres } from '../utils/api';
import MovieCard from '../MovieCard/MovieCard';
import TVShowCard from '../TVShowCard/TVShowCard';
import SearchBar from '../SearchBar/SearchBar';
import './Home.css';
import { Link, useNavigate } from 'react-router-dom';

export default function Home() {
  const [popularItems, setPopularItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [trendingToday, setTrendingToday] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [scrollY, setScrollY] = useState(0);

  const genreRef = useRef(null);
  const popularRef = useRef(null);
  const trendingRef = useRef(null);
  const favoritesRef = useRef(null);
  const watchlistRef = useRef(null);
  const navigate = useNavigate();

  const [scrollState, setScrollState] = useState({
    genre: { left: false, right: false },
    popular: { left: false, right: false },
    trending: { left: false, right: false },
    favorites: { left: false, right: false },
    watchlist: { left: false, right: false },
  });

  const updateScrollButtons = (ref, key) => {
    if (!ref.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = ref.current;
    setScrollState(prev => ({
      ...prev,
      [key]: {
        left: scrollLeft > 0,
        right: scrollLeft + clientWidth < scrollWidth - 1,
      },
    }));
  };

  const scrollHorizontally = (ref, direction, key) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === 'left' ? -500 : 500,
        behavior: 'smooth',
      });
      setTimeout(() => updateScrollButtons(ref, key), 300); // Delay to update after scroll completes
    }
  };
  const removeFromFavorites = async (mediaId) => {
  try {
    await fetch('http://localhost:8080/api/remove-favorite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `media_id=${mediaId}`, // ✅ fixed field name
    });
    setFavorites(prev => prev.filter(item => item.id !== mediaId));
  } catch (err) {
    console.error('Failed to remove favorite:', err);
  }
};

const removeFromWatchlist = async (mediaId) => {
  try {
    await fetch('http://localhost:8080/api/remove-watchlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `media_id=${mediaId}`, // ✅ fixed field name
    });
    setWatchlist(prev => prev.filter(item => item.id !== mediaId));
  } catch (err) {
    console.error('Failed to remove from watchlist:', err);
  }
};

  

  useEffect(() => {
    async function fetchData() {
      try {
        const [moviesRes, tvRes] = await Promise.all([
          fetchPopularMovies(),
          fetchPopularTV(),
        ]);
        const combined = [
          ...(moviesRes?.data?.results || []).map(item => ({ ...item, media_type: 'movie' })),
          ...(tvRes?.data?.results || []).map(item => ({ ...item, media_type: 'tv' }))
        ];
        const shuffled = [...combined].sort(() => Math.random() - 0.5);
        setPopularItems(shuffled);
        setFilteredItems(shuffled);
        setTrendingToday(combined.slice(0, 10));
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    fetchGenres('movie').then(res => setGenres(res?.data?.genres || []));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % filteredItems.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [filteredItems]);

  useEffect(() => {
    if (popularRef.current && filteredItems.length > 0) {
      const container = popularRef.current;
      const cards = container.children;
      if (cards[currentIndex]) {
        const card = cards[currentIndex];
        const cardOffset = card.offsetLeft - container.offsetWidth / 2 + card.offsetWidth / 2;
        container.scrollTo({ left: cardOffset, behavior: 'smooth' });
      }
    }
  }, [currentIndex, filteredItems]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    async function fetchFavoritesAndWatchlist() {
      try {
        const [favRes, watchRes] = await Promise.all([
          fetch('http://localhost:8080/api/list-favorites'),
          fetch('http://localhost:8080/api/list-watchlist'),
        ]);
        const favList = await favRes.json();
        const watchList = await watchRes.json();

        const favDetails = await Promise.all(
          favList.map(async item => {
            const tmdbUrl = `https://api.themoviedb.org/3/${item.mediaType}/${item.mediaId}?api_key=c850e02b709d94899963809f882c9ead&language=en-US`;
            const res = await fetch(tmdbUrl);
            const data = await res.json();
            return { ...data, media_type: item.mediaType };
          })
        );

        const watchDetails = await Promise.all(
          watchList.map(async item => {
            const tmdbUrl = `https://api.themoviedb.org/3/${item.mediaType}/${item.mediaId}?api_key=c850e02b709d94899963809f882c9ead&language=en-US`;
            const res = await fetch(tmdbUrl);
            const data = await res.json();
            return { ...data, media_type: item.mediaType };
          })
        );

        setFavorites(favDetails);
        setWatchlist(watchDetails);
      } catch (err) {
        console.error('Failed to fetch favorites or watchlist:', err);
      }
    }
    fetchFavoritesAndWatchlist();
  }, []);

  useEffect(() => {
    updateScrollButtons(genreRef, 'genre');
    updateScrollButtons(popularRef, 'popular');
    updateScrollButtons(trendingRef, 'trending');
    updateScrollButtons(favoritesRef, 'favorites');
    updateScrollButtons(watchlistRef, 'watchlist');
  }, [filteredItems, favorites, watchlist]);

  const current = filteredItems[currentIndex];

  const handleGenreClick = (genreId) => {
    setSelectedGenre(genreId);
    const filtered = genreId
      ? popularItems.filter(item => item.genre_ids?.includes(genreId))
      : popularItems;
    setFilteredItems(filtered);
    setCurrentIndex(0);
  };

  const handleHeroClick = () => {
    if (current) {
      navigate(current.media_type === 'tv' ? `/tv-show/${current.id}` : `/movie/${current.id}`);
    }
  };

  const renderCard = (item) => {
    return item.media_type === 'tv'
      ? <TVShowCard key={item.id} show={item} />
      : <MovieCard key={item.id} movie={item} />;
  };

  // Render scroll buttons - with special case for popular to always show both arrows
  const renderScrollButtons = (key, ref) => {
    if (key === 'popular') {
      // Always show both arrows for popular section
      return (
        <div className="arrow-group static-buttons">
          <button onClick={() => scrollHorizontally(ref, 'left', key)}>{'<'}</button>
          <button onClick={() => scrollHorizontally(ref, 'right', key)}>{'>'}</button>
        </div>
      );
    } else {
      // For others, use scrollState to decide visibility (no changes here)
      return (
        <div className="arrow-group static-buttons">
          <button
            style={{ visibility: scrollState[key].left ? 'visible' : 'hidden' }}
            onClick={() => scrollHorizontally(ref, 'left', key)}
          >
            {'<'}
          </button>
          <button
            style={{ visibility: scrollState[key].right ? 'visible' : 'hidden' }}
            onClick={() => scrollHorizontally(ref, 'right', key)}
          >
            {'>'}
          </button>
        </div>
      );
    }
  };

  return (
    <div className="home-page">
      <div className={`top-bar ${scrollY > 50 ? 'hidden' : ''}`}>
        <h2 className="explore-label">Explore Movies & Shows</h2>
        <div className="search-container">
          <SearchBar context="home" />
        </div>
      </div>

      {current && (
        <div
          className="hero-small"
          style={{
            backgroundImage: current.backdrop_path
              ? `url(https://image.tmdb.org/t/p/original${current.backdrop_path})`
              : 'none'
          }}
          onClick={handleHeroClick}
        >
          <div className="hero-overlay" />
          <div className="hero-info">
            <h2>{current.title || current.name}</h2>
            <p className="meta">
              ⭐ {current.vote_average?.toFixed(1) || 'N/A'} • {current.release_date?.slice(0, 4) || current.first_air_date?.slice(0, 4)} • 2h
            </p>
            <p className="overview">{(current.overview || '').split(' ').slice(0, 35).join(' ')}...</p>
          </div>
        </div>
      )}

      {/* Genre Section */}
      <section className="genre-section">
        <h3>Explore by Genre</h3>
        {renderScrollButtons('genre', genreRef)}
        <div className="genres-scroll" ref={genreRef}>
          <button className={`genre-btn ${selectedGenre === null ? 'active' : ''}`} onClick={() => handleGenreClick(null)}>All</button>
          {genres.map(g => (
            <button key={g.id} className={`genre-btn ${selectedGenre === g.id ? 'active' : ''}`} onClick={() => handleGenreClick(g.id)}>{g.name}</button>
          ))}
        </div>
      </section>

      {/* Popular Section */}
      <section className="popular-section">
        <h2>What's Popular</h2>
        {renderScrollButtons('popular', popularRef)}
        <div className="scroll-wrapper no-scrollbar" ref={popularRef}>
          {filteredItems.map((item, idx) => (
            <div key={item.id} className={`popular-card ${idx === currentIndex ? 'active' : ''}`}>
              {renderCard(item)}
            </div>
          ))}
        </div>
      </section>

     {/* Favorites Section */}
<section className="trending-section">
  <h2>Your Favorites</h2>
  {favorites.length > 0 ? (
    <>
      {renderScrollButtons('favorites', favoritesRef)}
      <div className="scroll-horizontal" ref={favoritesRef}>
        {favorites.map(item => (
          <div key={item.id} className="trending-card card-with-remove">
            <Link to={item.media_type === 'tv' ? `/tv-show/${item.id}` : `/movie/${item.id}`}>
              {renderCard(item)}
            </Link>
            <button className="remove-btn" onClick={() => removeFromFavorites(item.id)}>
            −
            </button>
          </div>
        ))}
      </div>
    </>
  ) : (
    <p className="empty-section">No favorites yet. Start adding some from the <Link to="/movies">Movies</Link> or <Link to="/tv-shows">TV Shows</Link> page!</p>
  )}
</section>
{/* Watchlist Section */}
<section className="trending-section">
  <h2>Your Watchlist</h2>
  {watchlist.length > 0 ? (
    <>
      {renderScrollButtons('watchlist', watchlistRef)}
      <div className="scroll-horizontal" ref={watchlistRef}>
        {watchlist.map(item => (
          <div key={item.id} className="trending-card card-with-remove">
            <Link to={item.media_type === 'tv' ? `/tv-show/${item.id}` : `/movie/${item.id}`}>
              {renderCard(item)}
            </Link>
            <button className="remove-btn" onClick={() => removeFromWatchlist(item.id)}>
            −
            </button>
          </div>
        ))}
      </div>
    </>
  ) : (
    <p className="empty-section">Your watchlist is empty. Explore <Link to="/movies">Movies</Link> or <Link to="/tv-shows">TV Shows</Link> to start adding items!</p>
  )}
</section>

      {/* Trending Today Section */}
      <section className="trending-section">
        <h2>Trending Today</h2>
        {renderScrollButtons('trending', trendingRef)}
        <div className="scroll-horizontal" ref={trendingRef}>
          {trendingToday.map(item => (
            <div key={item.id} className="trending-card">
              <Link to={item.media_type === 'tv' ? `/tv-show/${item.id}` : `/movie/${item.id}`}>
                {renderCard(item)}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
