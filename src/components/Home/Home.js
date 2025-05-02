import React, { useEffect, useState } from 'react';
import { fetchPopularMovies, fetchPopularTV, fetchGenres } from '../utils/api';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom
import MovieCard from '../MovieCard/MovieCard';
import TVShowCard from '../TVShowCard/TVShowCard'; // Import TVShowCard component
import SearchBar from '../SearchBar/SearchBar';
import './Home.css';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [genres, setGenres] = useState([]);

  // Fetch movies and TV shows data on page load
  useEffect(() => {
    fetchPopularMovies().then((res) => setMovies(res.data.results));
    fetchPopularTV().then((res) => setTvShows(res.data.results));
  }, []);

  useEffect(() => {
    fetchGenres('movie').then(res => setGenres(res.data.genres));
  }, []);

  return (
    <div className="home-page">
      <section className="hero" style={{ backgroundImage: "url('/assets/images/pexel2.jpg')" }}>
        <div className="overlay" />
        <div className="hero-content">
          <h1>Find Your Next Movie or TV Show</h1>
          <p>Search, explore, and discover trending titles</p>
          <SearchBar />
        </div>
      </section>

      <section className="genre-section">
        <h3>Explore by Genre</h3>
        <div className="genres-scroll">
          {genres.map(g => (
            <button key={g.id} className="genre-btn">{g.name}</button>
          ))}
          <span className="scroll-more">{'>'}</span>
        </div>
      </section>

      {/* Popular Movies Section */}
      <section className="movies-section">
        <h2>Popular Movies</h2>
        <div className="movies-grid">
          {movies.map((m) => (
            <Link to={`/movie/${m.id}`} key={m.id}>
              <MovieCard movie={m} />
            </Link>
          ))}
        </div>
      </section>

      {/* Popular TV Shows Section */}
      <section className="tv-shows-section">
        <h2>Popular TV Shows</h2>
        <div className="tv-shows-grid">
          {tvShows.map((show) => (
            <Link to={`/tv-show/${show.id}`} key={show.id}>
              <TVShowCard show={show} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
