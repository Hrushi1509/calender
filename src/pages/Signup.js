import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignUp.css";

function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");


  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const baseURL = process.env.REACT_APP_API_BASE_URL || "https://apptbackend.cercus.app"
  // const baseURL = process.env.REACT_APP_API_BASE_URL || "https://tattosagencyghl.onrender.com"

  const handleSignUpClick = async () => {
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setError("");
      const response = await axios.post(`${baseURL}/signup/`, {
        email,
        username,
        password,
        selectedLocation
      });

      if (response.status === 201 || response.status === 200) {
        setSuccess("Signup successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError("Unexpected response from server.");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError("");
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <div className="container">
      <header className="header">
        {/* <img src={require('./icons/logo.png')} alt="logo" className="headerLogo"/> */}
      </header>

      <div className="signup-form-container">
        <div className="signup-form">
          <h2>SIGN UP</h2>
          <input
            type="email"
            placeholder="Enter Your Email"
            className={`input-field ${error ? "error" : ""}`}
            value={email}
            onChange={handleEmailChange}
          />
          <input
            type="text"
            placeholder="Enter Your Username"
            className="input-field"
            value={username}
            onChange={handleUsernameChange}
          />
          <input
            type="password"
            placeholder="Enter Your Password"
            className="input-field"
            value={password}
            onChange={handlePasswordChange}
          />

          <select
            className="custom-dropdown"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            style={{
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          >
            <option value="">Select a location</option>
            <option value="Lakewood, Co. (West Colfax)">Lakewood, Co. (West Colfax)</option>
            <option value="Southeast Denver, Co. (Yale)">Southeast Denver, Co. (Yale)</option>
            <option value="Colorado Springs, Co. (Weber St.)">Colorado Springs, Co. (Weber St.)</option>
            <option value="East Downtown Denver, Co. (East)">East Downtown Denver, Co. (East)</option>
          </select>

          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <button
            className="signup-button"
            onClick={handleSignUpClick}
            disabled={!email || !username || !password}
          >
            SIGN UP
          </button>
          <p className="redirect-paragraph">
            Already a user?{" "}
            <span
              className="redirect-link"
              onClick={() => navigate("/login")}
            >
              Log in here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
