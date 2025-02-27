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
import MyCalendar from "./components/calender/Calender";
import Data from "./pages/Data";

function App() {
  const [showCalendar, setShowCalendar] = useState(false);

  const isAuthenticated = !!localStorage.getItem("accessToken");

  const handleToggleView = () => {
    setShowCalendar(!showCalendar);
  };

  return (
    <div className="bg-image">
       <Router>
      <Routes>
        <Route path="/login" element={<Home />} />
        <Route path="/" element={<SignUp />} />
        {/* <Route path="/" element={<MyCalendar />} /> */}
        {/* <Route
            path="/get-appointments"
            element={<ProtectedRoute isAuthenticated={isAuthenticated} element={<Table />} />}
          /> */}
        <Route
            path="/get-appointments"
            element={<ProtectedRoute isAuthenticated={isAuthenticated} element={<Data />} />}
          />


        
      </Routes>
    </Router>
    </div>
  );
}

export default App;
