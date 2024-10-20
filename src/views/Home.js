import React from 'react';
import '../assets/whiteLogo.png'; 
import './Home.css'
import '../style.css';

const Home = () => {
  const steps = [
    {
      title: 'Step 1',
      description: "Click on 'Trending' tab and choose a trend",
      image: 'https://trendiai.s3.amazonaws.com/main/main_step1.png?AWSAccessKeyId=AKIAVRUVUT7MXIJPOIGH&Signature=o8BSIhRELkySn4uB5mNmLobrl4w%3D&Expires=1750755483',
    },
    {
      title: 'Step 2',
      description: "Look at each trend's breakdown",
      image: 'https://trendiai.s3.amazonaws.com/main/main_step2.png?AWSAccessKeyId=AKIAVRUVUT7MXIJPOIGH&Signature=%2FPOCheXRmJMiDoMzzLta%2BJbaE%2FI%3D&Expires=1750755483',
    },
    {
      title: 'Step 3',
      description: "Click 'Recreate' to generate the template",
      image: 'https://trendiai.s3.amazonaws.com/main/main_step3.png?AWSAccessKeyId=AKIAVRUVUT7MXIJPOIGH&Signature=bv%2FhjNTj5gQl0wR4EJ8jNm715A4%3D&Expires=1750755483',
    },
    {
      title: 'Step 4',
      description: 'Upload files to template spaces',
      image: 'https://trendiai.s3.amazonaws.com/main/main_step4.png?AWSAccessKeyId=AKIAVRUVUT7MXIJPOIGH&Signature=hArPXtlZW39RGL3NVSOxDT8uwW4%3D&Expires=1750755483',
    },
    {
      title: 'Step 5',
      description: 'Download synced video for social media!',
      image: 'https://trendiai.s3.amazonaws.com/main/main_step5.png?AWSAccessKeyId=AKIAVRUVUT7MXIJPOIGH&Signature=%2BgqZbmp1K3Fs%2FSuiO73Sc0UtRqc%3D&Expires=1750755483',
    },
  ];

  return (
    <div className="container-home">
      <div className="subcontainers-title subcontainers-home">
        <img src={require('../assets/whiteLogo.png')} alt="Trendi" className="logo" />
        <h1 className="bold title">Trendi.ai</h1>
        <h2 className="grey-text">Templates to recreate the latest trends!</h2>
      </div>

      <div className="diagonal"></div>

      <div className="container-roadmap">
        {steps.map((step, index) => (
          <div className={`step step-${index % 2 ? 'right' : 'left'}`} key={index}>
            <div className="step-content">
              <div className="step-words">
                <h1 className='navy-text'>{step.title}</h1>
                <h3 className='grey-text'>{step.description}</h3>
              </div>
              <img src={step.image} alt={step.title} />
            </div>
          </div>
        ))}
      </div>

      <div className="diagonal upside-diagonal"></div>

      <div className="subcontainers-home">
        <h1 className='bold white-text'>Future Functionalities</h1>
        <h3 className='light-grey-text'>We're excited to share some upcoming features that will enhance your experience with Trendi.ai:</h3>
        <ul className="white-text centered-list">
          <li>Continuous addition of new templates to keep up with the latest trends</li>
          <li>Personalized trend recommendations based on your company's products</li>
          <li>AI-driven ideas to replicate trends effectively tailored to your business needs</li>
        </ul>
      </div>

      <div className="diagonal"></div>

      <div className="subcontainers-home" style={{ backgroundColor: 'var(--color-white)' }}>
        <h1 className='bold navy-text'>Upcoming Fixes</h1>
        <h3 className='light-navy-text'>Features that are currently being developed:</h3>
        <ul className="navy-text centered-list">
          <li>Accounts will allow users to 'Favorite' trends while browsing</li>
          <li>Improved UI to select video segments</li>
          <li>Customizable templates made by users uploading their own videos</li>
        </ul>
      </div>

      <div className="diagonal upside-diagonal"></div>
    </div>
  );
};

export default Home;
