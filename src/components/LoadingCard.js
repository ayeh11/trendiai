import React from 'react';
import '../views/Trending.css'; 
const LoadingCard = () => {
  return (
    <div className="small-box loading-card">
      <div className="image-container">No Image Available</div>
      <div className="trending-card-info">
        <div className="rectangle-container">
          <div className="loading-rectangle"></div>
        </div>
        <div className="rectangle-container">
          <div className="loading-rectangle"></div>
        </div>
        <div className="rectangle-container">
          <div className="loading-rectangle"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingCard;
