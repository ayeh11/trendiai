import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './TrendAnalysis.css';
import '../style.css';
import { toggleFavorite, selectTikTok } from '../store';

const TrendAnalysis = () => {
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  
  // Get the selected TikTok from Redux state
  
  const tiktok = useSelector((state) => state.tiktoks);

  const accountTypes = ['beauty salon account', 'jewelry seller account', 'cheese factory'];

  const parseArray = (array) => {
    try {
      return JSON.parse(array);
    } catch (e) {
      console.error('Error parsing array: ', e);
      return [];
    }
  };

  const handleFavoriteToggle = () => {
    dispatch(toggleFavorite(tiktok.name)); 
  };

  const goToUpload = (tiktok) => {
    dispatch(selectTikTok(tiktok));
    navigate(`/upload/${tiktok.name}`);
  };
  

  const toggleSuggestion = (index) => {
    setActiveSuggestionIndex(activeSuggestionIndex === index ? null : index);
  };

  const isActive = (index) => activeSuggestionIndex === index;

  useEffect(() => {
    if (tiktok) {
      const clipCard = document.querySelector('.clip-card');
      if (clipCard) {
        const clipHeight = clipCard.offsetHeight * 0.85;
        document.documentElement.style.setProperty('--clip-height', `${clipHeight}px`);
      }
    }
  }, [tiktok]); // Moved useEffect outside the conditional, but inside we check if tiktok exists

  if (!tiktok) {
    return <div>TikTok not found</div>;
  }

  const suggestions = {
    'beauty salon account': tiktok.suggestions[0],
    'jewelry seller account': tiktok.suggestions[1],
    'cheese factory': tiktok.suggestions[2],
  };

  return (
    <div className="grid-container container-ta">
      <header className="header header-ta">
        <h1 className='navy-text'>{tiktok.name}</h1>
        <div className="favorite-star" onClick={handleFavoriteToggle}>
          <i className={`star-icon ${tiktok.favorite ? 'favorite' : ''}`}>&#9733;</i>
        </div>
      </header>

      <div className="trend-information">
        <p style={{ textAlign: 'center', marginBottom: '10px' }}>
          <a href={tiktok.video_link} target="_blank" rel="noopener noreferrer">
            Link to Example
          </a>
        </p>
        <p style={{ textAlign: 'center', marginBottom: '10px' }}>
          <a href={tiktok.sound_link} target="_blank" rel="noopener noreferrer">
            Link to Sound Used
          </a>
        </p>
        <p className='navy-text'>
          <strong>Description:</strong> {tiktok.description}
        </p>

        <strong>Categories:</strong>
        <div className="bubble-container">
          {parseArray(tiktok.categories).map((category, index) => (
            <h3 key={index} className="bubble">
              {category}
            </h3>
          ))}
        </div>

        <p className='navy-text'>
          <strong>Easiness:</strong> {tiktok.ease}
        </p>

        {tiktok.duration === 'Slideshow' ? (
          <p className='navy-text'>Slideshow</p>
        ) : (
          <p className='navy-text'>
            <strong>Duration:</strong> {tiktok.duration} seconds
          </p>
        )}

        <p className='navy-text'>
          <strong>Popularity:</strong> {tiktok.popularity}
        </p>

        {tiktok.duration !== 'Slideshow' ? (
          <button className="button-ta" onClick={() => goToUpload(tiktok)}>
            Recreate
          </button>
        ) : (
          <div className="disabled-button-ta">Recreate on Social Media Directly</div>
        )}

        <div className="suggestions-box">
          <h4>Personalized Suggestions (beta)</h4>
          <div className="accounts-box">
            {accountTypes.map((account, index) => (
              <div key={index} className="account-suggestion">
                <div className="account-header" onClick={() => toggleSuggestion(index)}>
                  <span>{account}</span>
                  <div className={`arrow ${isActive(index) ? 'expanded' : 'collapsed'}`}></div>
                </div>
                {isActive(index) && (
                  <div className="small-box">
                    <p className='no-margin dark-grey-text'>{suggestions[account]}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="timeline-ta">
          <h2 className='navy-text'>
            <strong>Timeline</strong>
          </h2>
          <div className="timeline-container-ta">
            <div className="timeline-item-container">
              {parseArray(tiktok.timestamps).map((timestamp, index) => (
                <div key={index} className="timeline-item-wrapper-ta">
                  {index !== parseArray(tiktok.timestamps).length - 1 && <div className="timeline-line"></div>}
                  <div className="bubble timestamp-bubble timestamp-bubble-ta">{timestamp}</div>
                </div>
              ))}
            </div>

            <div className="clip-container">
              {parseArray(tiktok.clips).map((clip) => (
                <div key={clip.id} className="small-box clip-card">
                  <div className="clip-content">
                    <div className="image-container">
                      {clip.thumbnail ? (
                        <img src={clip.thumbnail} alt={`${clip.description} thumbnail`} />
                      ) : (
                        <div>No Image Available</div>
                      )}
                    </div>
                    <div className="clip-details">
                      <p className="left-align small-margin navy-text">{clip.description}</p>
                      <p className="left-align small-margin dark-grey-text">Type: {clip.type}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
    </div>
  );
};

export default TrendAnalysis;
