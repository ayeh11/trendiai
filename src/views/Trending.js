import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './Trending.css';
import '../style.css';
import { fetchTikToks, toggleFavorite, selectTikTok } from '../store'; 
import LoadingCard from '../components/LoadingCard'; 

const Trending = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  // Get tiktoks and selected TikTok from Redux state
  const tiktoks = useSelector((state) => state.tiktoks);
  const error = useSelector((state) => state.tiktoks.error);

  const [searchName, setSearchName] = useState('');
  const [searchCategories, setSearchCategories] = useState([]);
  const [searchEases, setSearchEases] = useState([]);
  const [searchFavorite, setSearchFavorite] = useState(false);
  const [searchDuration, setSearchDuration] = useState(60);
  const [sliderValue, setSliderValue] = useState(60);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipWidth, setTooltipWidth] = useState(0);

  const categoriesList = ['Beauty', 'Fashion', 'Dance', 'Humor', 'Advice', 'News'];
  const easesList = ['Easy', 'Medium', 'Hard'];

  // Fetch TikToks when the component mounts
  useEffect(() => {
    dispatch(fetchTikToks()); // Dispatch the action to fetch TikToks
  }, [dispatch]);

  if (error) {
    return <div>
      <div className="grid-container container-trending">
        <header className="header">
          <h1 className='navy-text'>Error: {error}</h1>
        </header>
      </div>
    </div>;
  } else if(!Array.isArray(tiktoks) || tiktoks.length === 0) {
    return (
      <div className="grid-container container-trending">
        <header className="header">
          <h1 className='navy-text'>Trending TikToks</h1>
        </header>
        <div className="trending-card-container">
          {Array.from({ length: 5 }, (_, index) => (
            <LoadingCard key={index} />
          ))}
        </div>
      </div>
    );
  }
  // TODO: if load for more than a minute then crash to error

  const handleCardClick = (tiktok) => {
    dispatch(selectTikTok(tiktok)); 
    navigate(`/trend-analysis/${tiktok.name}`); 
  };

  const parseArray = (array) => {
    try {
      return JSON.parse(array);
    } catch (e) {
      console.error('Error parsing categories: ', e);
      return [];
    }
  };

  const toggleCategory = (category) => {
    if (searchCategories.includes(category)) {
      setSearchCategories(searchCategories.filter((cat) => cat !== category));
    } else {
      setSearchCategories([...searchCategories, category]);
    }
  };

  const toggleEase = (ease) => {
    if (searchEases.includes(ease)) {
      setSearchEases(searchEases.filter((e) => e !== ease));
    } else {
      setSearchEases([...searchEases, ease]);
    }
  };

  const handleSliderChange = (e) => {
    setSearchDuration(e.target.value);
    setSliderValue(e.target.value);
  };

  const showSliderTooltip = () => {
    setShowTooltip(true);
    setTooltipWidth(document.querySelector('.slider-value')?.offsetWidth || 0);
  };

  const filteredTiktoks = (tiktoks || [])
    .filter((tiktok) => {
      const tiktokCategoriesSet = new Set(parseArray(tiktok.categories));
      const searchCategoriesSet = new Set(searchCategories);
      const searchEaseSet = new Set(searchEases);
      const matchesName = tiktok.name.toLowerCase().includes(searchName.toLowerCase());
      const matchesCategory =
        !searchCategories.length || [...searchCategoriesSet].some((category) => tiktokCategoriesSet.has(category));
      const matchesEases = !searchEases.length || [...searchEaseSet].includes(tiktok.ease);
      const matchesFavorite = !searchFavorite || tiktok.favorite;
      const matchesDuration = searchDuration === 60 || tiktok.duration <= searchDuration;
      return matchesName && matchesCategory && matchesEases && matchesFavorite && matchesDuration;
    })
    .sort((a, b) => b.popularity - a.popularity);

  return (
    <div className="grid-container container-trending">
      <header className="header">
        <h1 className='navy-text'>Trending TikToks</h1>
      </header>

      <div className="trending-card-container">
        {filteredTiktoks.map((tiktok) => (
          <div key={tiktok.name} className="small-box trending-card" onClick={() => handleCardClick(tiktok)}>
            <div className="image-container">
              {parseArray(tiktok.clips)[0]?.thumbnail ? (
                <img src={parseArray(tiktok.clips)[0].thumbnail} alt="TikTok thumbnail" />
              ) : (
                <div className="image-container">No Image Available</div>
              )}
            </div>

            <div className="trending-card-info">
              <h3 className="bold navy-text no-margin">{tiktok.name}</h3>
              <div className="bubble-container trending-card-bubble no-margin">
                {parseArray(tiktok.categories).map((category, idx) => (
                  <h3 key={idx} className="bubble">
                    {category}
                  </h3>
                ))}
              </div>

              <div className="bubble-container trending-card-bubble">
                <h3 className={`no-margin bubble ease-bubble ${tiktok.ease}`}>{tiktok.ease}</h3>
              </div>

              <p className="dark-grey-text small-margin left-align">{tiktok.description}</p>
              {tiktok.duration === 'Slideshow' ? (
                <p className='no-margin navy-text'>Slideshow</p>
              ) : (
                <p className='no-margin navy-text'>
                  <strong>Duration:</strong> {tiktok.duration} seconds
                </p>
              )}
            </div>

            <div className="favorite-star" onClick={(e) => { e.stopPropagation(); dispatch(toggleFavorite(tiktok.name)); }}>
              <i className={`star-icon ${tiktok.favorite ? 'favorite' : ''}`}>&#9733;</i>
            </div>
          </div>
        ))}
      </div>

      <aside className="filter-search-container">
        <section className="margin-bottom">
          <input type="text" value={searchName} onChange={(e) => setSearchName(e.target.value)} placeholder="Search..." />
        </section>

        <section className="margin-bottom">
          <h3 className='navy-text margin-bottom'>Categories</h3>
          <div className="bubble-container">
            {categoriesList.map((category) => (
              <div
                key={category}
                className={`bubble filter-bubble ${searchCategories.includes(category) ? 'selected' : ''}`}
                onClick={() => toggleCategory(category)}
              >
                {category}
              </div>
            ))}
          </div>
        </section>

        <section className="margin-bottom">
          <h3 className='navy-text margin-bottom'>Easiness</h3>
          <div className="bubble-container">
            {easesList.map((ease) => (
              <div
                key={ease}
                className={`bubble filter-bubble ${searchEases.includes(ease) ? 'selected' : ''}`}
                onClick={() => toggleEase(ease)}
              >
                {ease}
              </div>
            ))}
          </div>
        </section>

        <section className='margin-bottom'>
          <h3 className='navy-text'>Time Length</h3>
          <div className="slider-container" onMouseEnter={showSliderTooltip} onMouseLeave={() => setShowTooltip(false)}>
            <span className="slider-label">0</span>
            <div className="slider-wrapper">
              <input
                type="range"
                min="0"
                max="60"
                value={searchDuration}
                className="slider"
                onChange={handleSliderChange}
              />
              {showTooltip && (
                <div
                  className="slider-value"
                  style={{ left: `calc(${(sliderValue / 60) * 100}% - ${tooltipWidth / 2 - 10}px)` }}
                >
                  {sliderValue}
                </div>
              )}
            </div>
            <span className="slider-label">60+</span>
          </div>
        </section>

        <section className='margin-bottom'>
          <input type="checkbox" checked={searchFavorite} onChange={() => setSearchFavorite(!searchFavorite)} />
          <label>Favorites Only</label>
        </section>
      </aside>
    </div>
  );
};

export default Trending;
