import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; 
import './Home.css';
import { useAuth } from './auth/AuthContext';

function Home() {
  const navigate = useNavigate();
  const { setAuthData } = useAuth(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { loginResponse } = useAuth();
  const userId = loginResponse?.id;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const baseURL = process.env.REACT_APP_API_BASE_URL || "https://apptbackend.cercus.app";
  // const baseURL = process.env.REACT_APP_API_BASE_URL || "https://tattosagencyghl.onrender.com";

  const handleNextClick = async () => {
    
    if (emailRegex.test(email)) {
      setError('');
      try {
        const response = await axios.post(`${baseURL}/login/`, {
          email: email,
          password: password,
        });

        // console.log(response,'response')
        // console.log(baseURL,'url')

        const { refresh, access, username, email:responseEmail, user_id:id } = response.data;
        // const { refresh, access } = response.data;

        // Decode the access token
        const decodedAccessToken = jwtDecode(access);
        // console.log("Decoded Access Token:", decodedAccessToken);

        const loginUserId = decodedAccessToken?.user_id

        // console.log(loginUserId, 'id.............')


        // Save data in global context
        const loginResponse = {
          refresh: refresh,
          access: access,
          username: username,
          userEmail: decodedAccessToken?.email,
          id: decodedAccessToken?.user_id,
        };
        setAuthData({ loginResponse });

        // Store tokens in localStorage if needed
        localStorage.setItem("refreshToken", refresh);
        localStorage.setItem("accessToken", access);
        localStorage.setItem("loginUserId", loginUserId);

        // console.log("Login successful:", response.data);
        // console.log("accessToken",access);

        if (response.status === 200) {
          navigate(`/get-appointments/?id=${loginUserId}`);
          // navigate('/get-registred-users')
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
      // } catch (error) {
      //   if (error.response) {
      //     setError(error.response.data.message || 'Login failed. Please check your credentials.');
      //   } else if (error.request) {
      //     setError('No response from server. Please try again later.');
      //   } else {
      //     setError('An error occurred. Please try again.');
      //   }
      // }
      }catch (error) {
        // console.error("Error details:", error);
        if (error.response) {
          // console.error("Server response:", error.response.data);
          setError(error.response.data.message || 'Login failed. Please check your credentials.');
        } else if (error.request) {
          // console.error("No response from server:", error.request);
          setError('No response from server. Please try again later.');
        } else {
          // console.error("Unknown error:", error.message);
          setError('An error occurred. Please try again.');
        }
      }
    } else {
      setError('Please enter a valid email address.');
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error) setError('');
  };

  return (
    <div className="container">
      <header className="header"></header>
      <div className="email-form-container">
        <div className="email-form">
          <h2>Log In</h2>
          <input
            type="email"
            placeholder="Enter Your Email"
            className={`email-input ${error ? 'error' : ''}`}
            value={email}
            onChange={handleEmailChange}
          />
          <input
            type="password"
            placeholder="Enter Your Password"
            className="email-input"
            value={password}
            onChange={handlePasswordChange}
          />
          {error && <p className="error-message">{error}</p>}
          <button
            className="next-button"
            onClick={handleNextClick}
            disabled={!email || !password}
          >
            Sign In
          </button>
          <p className="redirect-paragraph">
            New user?{" "}
            <span
              className="redirect-link"
              onClick={() => navigate("/")}
            >
              Sign up here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
