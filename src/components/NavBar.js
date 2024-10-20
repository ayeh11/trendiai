import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';
import '../style.css'

const NavBar = () => {
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);
  const [ticking, setTicking] = useState(false);

  const handleScroll = () => {
    const currentScrollPosition = window.scrollY;

    if (currentScrollPosition === 0) {
      setIsHidden(false);
    } else if (currentScrollPosition > lastScrollPosition) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }

    setLastScrollPosition(currentScrollPosition);
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
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [lastScrollPosition, ticking]);

  return (
    <nav className={`nav-bar ${isHidden ? 'nav-bar-hidden' : ''}`}>
      <div className="nav-container">
        <Link to="/">
          <button className="nav-button img-button">
            <img alt="logo" className="img" img src={require('../assets/whiteLogo.png')} />
          </button>
        </Link>
        <Link to="/trending">
          <button className="nav-button">Trending</button>
        </Link>
        <Link to="/createtemplates">
          <button className="nav-button">Create Templates</button>
        </Link>
        <div className="login-container">
          <Link to="/login">
            <button className="nav-button img-button">
              <img alt="profile" className="img" img src={require('../assets/blankProfile.png')} />
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
