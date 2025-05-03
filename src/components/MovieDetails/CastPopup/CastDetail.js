import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './CastDetail.css';

const API_KEY = 'c850e02b709d94899963809f882c9ead';

const CastDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [actor, setActor] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchActor = async () => {
      try {
        const res = await axios.get(`https://api.themoviedb.org/3/person/${id}`, {
          params: { api_key: API_KEY },
        });
        setActor(res.data);
      } catch (error) {
        console.error('Error fetching actor details:', error);
      }
    };
    fetchActor();
  }, [id]);

  
  const handleBack = () => {
    if (location.state?.from === 'castpopup' && location.state?.movieId) {
      navigate(`/movie/${location.state.movieId}`, {
        state: { reopenPopup: true },
      });
    } else {
      navigate('/');
    }
  };
  
  if (!actor) return <div className="loading">Loading...</div>;

  const imageUrl = actor.profile_path
    ? `https://image.tmdb.org/t/p/w300${actor.profile_path}`
    : 'https://via.placeholder.com/200x300?text=No+Image';

  return (
    <div className="cast-detail">
      <button className="back-button" onClick={handleBack}>←</button>
      <div className="cast-detail-content">
        <div className="cast-image">
          <img src={imageUrl} alt={actor.name} />
        </div>
        <div className="cast-info">
          <h2>{actor.name}</h2>
          <p className={`bio-text ${expanded ? 'expanded' : ''}`}>
            {actor.biography || 'No biography available.'}
          </p>
          {actor.biography &&
  actor.biography.length > 600 && !expanded && (
    <button className="read-more-btn" onClick={() => setExpanded(true)}>
      Read More
    </button>
)}

{actor.biography && expanded && (
  <button className="read-more-btn" onClick={() => setExpanded(false)}>
    Read Less
  </button>
)}

        </div>
      </div>
    </div>
  );
};

export default CastDetail;
