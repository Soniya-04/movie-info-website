import React, { useEffect, useState } from 'react';
import { fetchFromTMDb, fetchGenres } from '../../utils/api';
import TVShowCard from '../../TVShowCard/TVShowCard';
import SearchBar from '../../SearchBar/SearchBar';
import GenreFilter from '../GenreFilter/GenreFilter';
import Sortbar from '../Sortbar/Sortbar';
import RatingFilter from '../RatingFilter/RatingFilter';
import './TVShows.css';

export default function TVShows() {
  const [tvShows, setTVShows] = useState([]);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [minRating, setMinRating] = useState(0);
  const [selectedYear, setSelectedYear] = useState(null);
  const [sortAZ, setSortAZ] = useState('');
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let results = [];
  
      if (sortBy === 'on_the_air') {
        const response = await fetchFromTMDb('/tv/on_the_air');
        results = response.data.results;
  
        // ✅ Manually filter by year if selected
        if (selectedYear) {
          results = results.filter(show => {
            const year = new Date(show.first_air_date).getFullYear();
            return year === parseInt(selectedYear);
          });
        }
      } else {
        let query = `/discover/tv?sort_by=${sortBy}`;
        if (selectedGenre) query += `&with_genres=${selectedGenre}`;
        if (minRating > 0) query += `&vote_average.gte=${minRating}`;
        if (selectedYear) query += `&first_air_date_year=${selectedYear}`;
        const response = await fetchFromTMDb(query);
        results = response.data.results;
      }
  
      if (sortAZ) {
        results = results.filter(show =>
          show.name.toLowerCase().startsWith(sortAZ.toLowerCase())
        );
      }
  
      setTVShows(results);
    };
  
    fetchData();
  }, [sortBy, selectedGenre, minRating, selectedYear, sortAZ]);
  
  useEffect(() => {
    fetchGenres('tv').then(res => setGenres(res.data.genres));
  }, []);

  return (
    <div className="tvshows-page">
      <div className="top-bar">
        <h2 className="app-title">📺 TV Shows</h2>
        <SearchBar context="tvshows" />
      </div>

      <GenreFilter
        genres={genres}
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
      />

      <div className="sort-rating-container">
        <Sortbar
          mediaType="tv"
          sortBy={sortBy}
          setSortBy={setSortBy}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          selectedAZ={sortAZ}
          setSelectedAZ={setSortAZ}
        />

{sortBy !== 'vote_average.desc' && (
  <RatingFilter
    minRating={minRating}
    setMinRating={setMinRating}
  />
)}

        
      </div>

      <h2>
        {(() => {
          if (sortBy === 'on_the_air') return 'Currently Airing TV Shows';
          if (sortBy === 'vote_average.desc') return 'Top Rated TV Shows';
          if (selectedGenre) return 'Filtered TV Shows';
          return 'Popular TV Shows';
        })()}
      </h2>

      <div className="tvshows-grid">
        {tvShows.length > 0 ? (
          tvShows
            .filter(show => show.poster_path)
            .map(show => (
              <TVShowCard key={show.id} show={show} />
            ))
        ) : (
          <p style={{ color: '#ccc', textAlign: 'center' }}>No TV shows found.</p>
        )}
      </div>
    </div>
  );
}
