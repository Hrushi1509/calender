import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleNextClick = () => {
    if (emailRegex.test(email)) {
      setError("");
      navigate("/table");
    } else {
      setError("Please enter a valid email address.");
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError(""); // Clear error when the user starts typing again
  };

  return (
    <div className="container">
      <header className="header">
        {/* <img src={require('./icons/logo.png')} alt="logo" className="headerLogo"/> */}
      </header>

      <div className="email-form-container">
        <div className="email-form">
          <h2>ENTER YOUR EMAIL</h2>
          <input
            type="email"
            placeholder="Enter your email"
            className={`email-input ${error ? "error" : ""}`}
            value={email}
            onChange={handleEmailChange}
          />
          {error && <p className="error-message">{error}</p>}
          <button
            className="next-button"
            onClick={handleNextClick}
            disabled={!email}
          >
            NEXT
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
