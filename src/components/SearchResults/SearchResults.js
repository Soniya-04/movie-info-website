import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { searchMovies, searchTVShows } from '../utils/api';
import MovieCard from '../MovieCard/MovieCard';
import TVShowCard from '../TVShowCard/TVShowCard';
import './SearchResults.css';

const SearchResults = () => {
  const { query } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const context = searchParams.get('context') || 'home';

  const [results, setResults] = useState({ movies: [], tvShows: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);

      const [movieResults, tvShowResults] = await Promise.all([
        (context === 'home' || context === 'movies') ? searchMovies(query) : Promise.resolve({ data: { results: [] } }),
        (context === 'home' || context === 'tvshows') ? searchTVShows(query) : Promise.resolve({ data: { results: [] } }),
      ]);

      setResults({
        movies: movieResults.data.results || [],
        tvShows: tvShowResults.data.results || [],
      });

      setLoading(false);
    };

    fetchResults();
  }, [query, context]);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="search-results">
      {(context === 'home' || context === 'movies') && (
        <div className="section">
          <h2>🎬 Movies</h2>
          <div className="horizontal-scroll movie-scroll">
            {results.movies.length > 0 ? (
              results.movies
                .filter(movie => movie.poster_path)
                .map(movie => <MovieCard key={movie.id} movie={movie} />)
            ) : (
              <p>No movies found.</p>
            )}
          </div>
        </div>
      )}

      {(context === 'home' || context === 'tvshows') && (
        <div className="section">
          <h2>📺 TV Shows</h2>
          <div className="horizontal-scroll tvshow-scroll">
            {results.tvShows.length > 0 ? (
              results.tvShows
                .filter(show => show.poster_path)
                .map(show => <TVShowCard key={show.id} show={show} />)
            ) : (
              <p>No TV shows found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
