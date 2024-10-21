import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';
import '../style.css'

const dummyUsers = [
  { email: 'test@example.com', password: 'password123' },
  // Add more dummy users as needed
];

const Login = () => {
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: '',
    validEmail: true,
    loginFailed: false,
  });

  const checkEmail = () => {
    const emailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    const isValidEmail = emailPattern.test(loginInfo.email);
    setLoginInfo((prev) => ({ ...prev, validEmail: isValidEmail }));
    return isValidEmail;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!checkEmail()) {
      return;
    }

    const user = dummyUsers.find(
      (user) => user.email === loginInfo.email && user.password === loginInfo.password
    );

    if (user) {
      console.log('Login successful:', user);
      setLoginInfo((prev) => ({ ...prev, loginFailed: false }));
      // Redirect to home or another page
    } else {
      setLoginInfo((prev) => ({ ...prev, loginFailed: true }));
      console.log('Login failed');
    }
  };

  return (
    <div className="container">
      <img alt="logo" className="img" img src={require('../assets/navyLogo.png')} width="250" height="250" />
      <div className='bold navy-text title'>Trendi.ai</div>
      <h2 className='grey-text'>Accounts coming soon!</h2>
      <div className='box-container'>
        <form onSubmit={handleSubmit}>
          <input
            className="email"
            type="text"
            onBlur={checkEmail}
            value={loginInfo.email}
            onChange={(e) => setLoginInfo({ ...loginInfo, email: e.target.value })}
            id="email"
            placeholder="Email"
            autoComplete="email"
            required
          />
          {!loginInfo.validEmail && loginInfo.email !== '' && (
            <p className="error-text">Please enter a valid email address!</p>
          )}
          <input
            type="password"
            value={loginInfo.password}
            onChange={(e) => setLoginInfo({ ...loginInfo, password: e.target.value })}
            id="password"
            placeholder="Password"
            autoComplete="current-password"
            required
          />
          <button
            type="submit"
            className={loginInfo.validEmail && loginInfo.email && loginInfo.password ? '' : 'disabled-button'}
          >
            Log In
          </button>
        </form>
      </div>
      {loginInfo.loginFailed && (
        <p className="error-text">Invalid email or password!</p>
      )}

      <div className="have-an-account">
        <h3 className='navy-text'>
          Don't have an account? <Link to="/createacc" className="create-account-link">Create Account</Link>
        </h3>
      </div>
    </div>
  );
};

export default Login;