import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { searchMovies, searchTVShows } from '../utils/api'; // Add searchTVShows if you're creating it

const SearchResults = () => {
  const { query } = useParams();
  const [results, setResults] = useState({ movies: [], tvShows: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      const movieResults = await searchMovies(query);
      const tvShowResults = await searchTVShows(query); // or use searchMovies if you want
      setResults({
        movies: movieResults.data.results,
        tvShows: tvShowResults.data.results,
      });
      setLoading(false);
    };

    fetchResults();
  }, [query]);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="search-results">
      <div className="movies">
        <h2>Movies</h2>
        <div className="movie-cards">
          {results.movies.length > 0 ? (
            results.movies.map(movie => (
              <div key={movie.id} className="movie-card">
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                <h3>{movie.title}</h3>
              </div>
            ))
          ) : (
            <p>No movies found.</p>
          )}
        </div>
      </div>
      <div className="tv-shows">
        <h2>TV Shows</h2>
        <div className="tv-show-cards">
          {results.tvShows.length > 0 ? (
            results.tvShows.map(tvShow => (
              <div key={tvShow.id} className="tv-show-card">
                <img src={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`} alt={tvShow.name} />
                <h3>{tvShow.name}</h3>
              </div>
            ))
          ) : (
            <p>No TV shows found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
