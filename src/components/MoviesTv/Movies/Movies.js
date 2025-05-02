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
  const [sortAZ, setSortAZ] = useState('');

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
        results = results.filter(movie => movie.title.startsWith(sortAZ));
      }
      setMovies(results);
    });
  }, [sortBy, selectedGenre, minRating, selectedYear, sortAZ]);

  return (
    <div className="movies-page">
      <div className="top-bar">
        <h2 className="app-title">🎬 AAA Movies</h2>
        <SearchBar context="movies" />

      </div>

      <GenreFilter
        genres={genres}
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
      />

      <div className="sort-rating-container">
        <Sortbar
          sortBy={sortBy}
          setSortBy={setSortBy}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          selectedAZ={sortAZ}
          setSelectedAZ={setSortAZ}
        />
        <RatingFilter
          minRating={minRating}
          setMinRating={setMinRating}
        />
      </div>

      <section className="movies-section">
      <h2>
  {(() => {
    if (sortBy === 'release_date.desc') return 'Latest Movies';
    if (sortBy === 'vote_average.desc') return 'Top Rated Movies';
    if (selectedGenre) return 'Filtered Movies';
    return 'Popular Movies';
  })()}
</h2>

        <div className="movies-grid">
        {movies
  .filter(movie => movie.poster_path) // Only include movies with posters
  .map(movie => (
    <MovieCard key={movie.id} movie={movie} />
))}

        </div>
      </section>
    </div>
  );
}
