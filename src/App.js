import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './components/layout/Navbar/Navbar';
import Footer from './components/layout/Footer/Footer';

import Home from './components/Home/Home';
import Movies from './components/MoviesTv/Movies/Movies';
import TVShows from './components/MoviesTv/TVShows/TVShows';
import MovieDetail from './components/MovieDetails/MovieDetail/MovieDetail';
import TVShowDetail from './components/MovieDetails/TVShowDetail/TVShowDetail'; // ✅ TV Show Detail
import SearchResults from './components/SearchResults/SearchResults';
import CastDetail from './components/MovieDetails/CastPopup/CastDetail';
import CastPopup from './components/MovieDetails/CastPopup/CastPopup';

function AppRoutes() {
  const location = useLocation();
  const state = location.state;

  return (
    <>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 120px)' }}>
        <Routes location={state?.backgroundLocation || location}>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/tv-shows" element={<TVShows />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/tv-show/:id" element={<TVShowDetail />} />
          <Route path="/tv/:id" element={<TVShowDetail />} />
          <Route path="/cast/:id" element={<CastDetail />} />
          <Route path="/search/:query" element={<SearchResults />} />
        </Routes>

        {state?.backgroundLocation && (
          <Routes>
            <Route path="/movie/:id/cast" element={<CastPopup />} />
          </Routes>
        )}
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
