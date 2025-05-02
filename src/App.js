import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/layout/Navbar/Navbar';
import Footer from './components/layout/Footer/Footer';

import Home from './components/Home/Home';
import Movies from './components/MoviesTv/Movies/Movies'; // ✅ fixed path
import TVShows from './components/MoviesTv/TVShows/TVShows'; // ✅ fixed path
import MovieDetail from './components/MovieDetail/MovieDetail';
import SearchResults from './components/SearchResults/SearchResults';

function App() {
  return (
    <Router>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 120px)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/tv-shows" element={<TVShows />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/search/:query" element={<SearchResults />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
