import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import '../style.css'

const Footer = ({ onToggleVisibility }) => {
  const [isHidden, setIsHidden] = useState(true);
  const [ticking, setTicking] = useState(false);

  const handleScroll = () => {
    const scrollPosition = window.scrollY + window.innerHeight;
    const threshold = document.documentElement.scrollHeight - document.querySelector('.footer').clientHeight + 50;

    if (scrollPosition >= threshold) {
      if (isHidden) {
        setIsHidden(false);
        if (onToggleVisibility) onToggleVisibility(false);
      }
    } else {
      if (!isHidden) {
        setIsHidden(true);
        if (onToggleVisibility) onToggleVisibility(true);
      }
    }

    setTicking(false);
  };

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
      });
      setTicking(true);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', onScroll);
  
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', onScroll);
    };
  }, [isHidden, handleScroll, onScroll]);

  return (
    <footer className={`footer ${!isHidden ? 'footer-visible' : ''}`}>
      <div className="footer-content">
        <div className="footer-links">
          <div className="footer-column">
            <Link to="/trending"><button className="footer-button">Trending</button></Link>
            <Link to="/upload"><button className="footer-button">Create Template</button></Link>
            <Link to="/login"><button className="footer-button">Login</button></Link>
          </div>
          <div className="footer-column">
            <Link to="/"><button className="footer-button">Home</button></Link>
            <Link to="/about"><button className="footer-button">About</button></Link>
          </div>
        </div>
        <div className="footer-contact">
          <h3>Contact Us</h3>
          <h4>Email: support@trendi.com</h4>
          <h4>Phone: (123) 456-7890</h4>
        </div>
      </div>
    </footer>
  );
};

export default Footer;