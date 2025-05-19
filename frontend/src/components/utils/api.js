import axios from 'axios';

const API_KEY = 'c850e02b709d94899963809f882c9ead';
const BASE_URL = 'https://api.themoviedb.org/3';

// Fetch popular movies
export const fetchPopularMovies = () =>
  axios.get(`${BASE_URL}/movie/popular`, {
    params: { api_key: API_KEY }
  });

// Fetch popular TV shows
export const fetchPopularTV = () =>
  axios.get(`${BASE_URL}/tv/popular`, {
    params: { api_key: API_KEY }
  });

// Fetch movie detail with credits
export const fetchMovieDetail = (id) =>
  axios.get(`${BASE_URL}/movie/${id}`, {
    params: {
      api_key: API_KEY,
        append_to_response: 'credits,videos'
    }
  });

// Fetch TV show detail with credits
export const fetchTVShowDetail = (id) =>
  axios.get(`${BASE_URL}/tv/${id}`, {
    params: {
      api_key: API_KEY,
      append_to_response: 'credits,videos'
    }
  });

// Search movies
export const searchMovies = (query) =>
  axios.get(`${BASE_URL}/search/movie`, {
    params: {
      api_key: API_KEY,
      query
    }
  });

// Search TV shows
export const searchTVShows = (query) =>
  axios.get(`${BASE_URL}/search/tv`, {
    params: {
      api_key: API_KEY,
      query
    }
  });

// Get all genres (for horizontal category scrolling)
export const fetchGenres = () =>
  axios.get(`${BASE_URL}/genre/movie/list`, {
    params: {
      api_key: API_KEY
    }
  });

// Generic fetcher for dynamic queries (e.g., filtering & sorting)
export const fetchFromTMDb = (endpoint, extraParams = {}) =>
  axios.get(`${BASE_URL}${endpoint}`, {
    params: {
      api_key: API_KEY,
      ...extraParams
    }
  });
// Fetch where to watch (OTT providers) for a movie
export const fetchWatchProviders = (id) =>
  axios.get(`https://api.themoviedb.org/3/movie/${id}/watch/providers`, {
    params: {
      api_key: API_KEY
    }
  });
  export const fetchActorDetail = (personId) =>
    axios.get(`https://api.themoviedb.org/3/person/${personId}`, {
      params: { api_key: API_KEY }
    });
    export const fetchTrendingToday = () =>
      axios.get(`${BASE_URL}/trending/all/day?api_key=${API_KEY}`);
    
    export const fetchLatestTrailers = () =>
      axios.get(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}`);
    