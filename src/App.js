import React, { useState } from "react";
import "./App.css";
import { CiFilter } from "react-icons/ci";
import { BiSort } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";
import Table from "./Table";
import Home from "./Home";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {

  return (
    <div className="bg-image">
       <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/table" element={<Table />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
