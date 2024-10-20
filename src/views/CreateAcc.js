import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';
import '../style.css';

const CreateAcc = () => {
  const [registerInfo, setRegisterInfo] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    validEmail: true,
    passwordsMatch: true,
    registrationFailed: false,
  });

  const checkEmail = () => {
    const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const isValidEmail = emailPattern.test(registerInfo.email);
    setRegisterInfo((prev) => ({ ...prev, validEmail: isValidEmail }));
    return isValidEmail;
  };

  const checkPasswordsMatch = () => {
    const passwordsMatch = registerInfo.password === registerInfo.confirmPassword;
    setRegisterInfo((prev) => ({ ...prev, passwordsMatch }));
    return passwordsMatch;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!checkEmail() || !checkPasswordsMatch()) {
      return;
    }

    // Mock Registration Process
    console.log('Account created successfully:', {
      name: registerInfo.name,
      email: registerInfo.email,
      password: registerInfo.password,
    });

    setRegisterInfo((prev) => ({ ...prev, registrationFailed: false }));
    // Redirect to home or another page after successful registration
  };

  return (
    <div className="container">
      <img alt="logo" className="img" src={require('../assets/navyLogo.png')} width="250" height="250" />
      <div className='bold navy-text title'>Trendi.ai</div>
      <h2 className='grey-text'>Create Your Account</h2>
      <div className='box-container'>
        <form onSubmit={handleSubmit}>
          <input
            className="name"
            type="text"
            value={registerInfo.name}
            onChange={(e) => setRegisterInfo({ ...registerInfo, name: e.target.value })}
            id="name"
            placeholder="Name"
            required
          />

          <input
            className="email"
            type="text"
            onBlur={checkEmail}
            value={registerInfo.email}
            onChange={(e) => setRegisterInfo({ ...registerInfo, email: e.target.value })}
            id="email"
            placeholder="Email"
            autoComplete="email"
            required
          />
          {!registerInfo.validEmail && registerInfo.email !== '' && (
            <p className="error-text">Please enter a valid email address!</p>
          )}

          <input
            type="password"
            value={registerInfo.password}
            onChange={(e) => setRegisterInfo({ ...registerInfo, password: e.target.value })}
            id="password"
            placeholder="Password"
            autoComplete="new-password"
            required
          />

          <input
            type="password"
            value={registerInfo.confirmPassword}
            onChange={(e) => setRegisterInfo({ ...registerInfo, confirmPassword: e.target.value })}
            id="confirm-password"
            placeholder="Confirm Password"
            autoComplete="new-password"
            required
          />
          {!registerInfo.passwordsMatch && (
            <p className="error-text">Passwords do not match!</p>
          )}

          <button
            type="submit"
            className={registerInfo.validEmail && registerInfo.name && registerInfo.password && registerInfo.passwordsMatch ? '' : 'disabled-button'}
          >
            Create Account
          </button>
        </form>
      </div>

      {registerInfo.registrationFailed && (
        <p className="error-text">Registration failed!</p>
      )}

      <div className="have-an-account">
        <h3 className='navy-text'>
          Already have an account? <Link to="/login" className="create-account-link">Log In</Link>
        </h3>
      </div>
    </div>
  );
};

export default CreateAcc;
