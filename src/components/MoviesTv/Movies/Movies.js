import React, { useEffect, useState } from 'react';
import { fetchGenres, fetchFromTMDb } from '../../utils/api';
import MovieCard from '../../MovieCard/MovieCard';
import SearchBar from '../../SearchBar/SearchBar';
import Sortbar from '../Sortbar/Sortbar';
import GenreFilter from '../GenreFilter/GenreFilter';
import RatingFilter from '../RatingFilter/RatingFilter';
import './Movies.css';

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [minRating, setMinRating] = useState(0);
  const [selectedYear, setSelectedYear] = useState(null);
  const [sortAZ, setSortAZ] = useState(false);

  useEffect(() => {
    fetchGenres('movie').then(res => setGenres(res.data.genres));
  }, []);

  useEffect(() => {
    let query = `/discover/movie?sort_by=${sortBy}`;
    if (selectedGenre) query += `&with_genres=${selectedGenre}`;
    if (minRating > 0) query += `&vote_average.gte=${minRating}`;
    if (selectedYear) query += `&primary_release_year=${selectedYear}`;
    fetchFromTMDb(query).then(res => {
      let results = res.data.results;
      if (sortAZ) {
        results = results.sort((a, b) => a.title.localeCompare(b.title));
      }
      setMovies(results);
    });
  }, [sortBy, selectedGenre, minRating, selectedYear, sortAZ]);

  return (
    <div className="movies-page">
      <section className="hero" style={{ backgroundImage: "url('/assets/images/pexel2.jpg')" }}>
        <div className="overlay" />
        <div className="hero-content">
          <h1>Explore Popular Movies</h1>
          <SearchBar />
        </div>
      </section>

      <Sortbar
        sortBy={sortBy}
        setSortBy={setSortBy}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        sortAZ={sortAZ}
        setSortAZ={setSortAZ}
      />

      <GenreFilter
        genres={genres}
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
      />

      <RatingFilter
        minRating={minRating}
        setMinRating={setMinRating}
      />

      <section className="movies-section">
        <h2>{selectedGenre ? 'Filtered Movies' : 'Popular Movies'}</h2>
        <div className="movies-grid">
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
    </div>
  );
}
