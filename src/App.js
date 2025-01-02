import React, { useState } from "react";
import "./App.css";
import { CiFilter } from "react-icons/ci";
import { BiSort } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";
import Table from "./Table";
import Home from "./Home";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/Signup";
import ProtectedRoute from "./auth/ProtectedRoute";

function App() {

  const isAuthenticated = !!localStorage.getItem("accessToken");

  return (
    <div className="bg-image">
       <Router>
      <Routes>
        <Route path="/login" element={<Home />} />
        <Route path="/" element={<SignUp />} />
        <Route
            path="/get-appointments"
            element={<ProtectedRoute isAuthenticated={isAuthenticated} element={<Table />} />}
          />
      </Routes>
    
    </Router>
    </div>
  );
}

export default App;
