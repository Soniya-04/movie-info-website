import React, { useEffect, useState } from 'react';
import { fetchFromTMDb } from '../../../../utils/api'; // ✅ correct relative path
import TVShowCard from '../../TVShowCard/TVShowCard'; // ✅ correct relative path
import './TVShows.css';

export default function TVShows() {
  const [tvShows, setTVShows] = useState([]);

  useEffect(() => {
    fetchFromTMDb('/discover/tv?sort_by=popularity.desc').then((res) =>
      setTVShows(res.data.results)
    );
  }, []);

  return (
    <div className="tvshows-page">
      <h2>Popular TV Shows</h2>
      <div className="tvshows-grid">
        {tvShows.map((show) => (
          <TVShowCard key={show.id} show={show} />
        ))}
      </div>
    </div>
  );
}
