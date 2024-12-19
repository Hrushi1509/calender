import React, { useState } from "react";
import "./App.css";
import { CiFilter } from "react-icons/ci";
import { BiSort } from "react-icons/bi";

function App() {
  // Sample appointment data
  const [appointments] = useState([
    {
      id: 1,
      client: "Alex Turner",
      status: "Confirmed",
      appointmentTime: "Dec 20 2025, 8:00 am (EST)",
      owner: "Alex Turner",
    },
    {
      id: 2,
      client: "Alex Turner",
      status: "Confirmed",
      appointmentTime: "Dec 20 2025, 8:00 am (EST)",
      owner: "Alex Turner",
    },
    {
      id: 3,
      client: "Alex Turner",
      status: "Confirmed",
      appointmentTime: "Dec 20 2025, 8:00 am (EST)",
      owner: "Alex Turner",
    },
    {
      id: 4,
      client: "Alex Turner",
      status: "Confirmed",
      appointmentTime: "Dec 20 2025, 8:00 am (EST)",
      owner: "Alex Turner",
    },
    {
      id: 5,
      client: "Alex Turner",
      status: "Confirmed",
      appointmentTime: "Dec 20 2025, 8:00 am (EST)",
      owner: "Alex Turner",
    },
    {
      id: 6,
      client: "Alex Turner",
      status: "Confirmed",
      appointmentTime: "Dec 20 2025, 8:00 am (EST)",
      owner: "Alex Turner",
    },
  ]);

  const [selectedFilter, setSelectedFilter] = useState("All");
  
    const handleFilterClick = (filter) => {
      setSelectedFilter(filter);
    };
  

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 3;

  const totalPages = Math.ceil(appointments.length / rowsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const paginatedAppointments = appointments.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="app-container">
      {/* Header */}
      <div className="header">
        <h1>Appointments</h1>
        <button className="new-appointment-btn">+ New Appointment</button>
      </div>

      <div className="filters">
        {["All", "Upcoming", "Cancelled"].map((filter) => (
          <span
            key={filter}
            className={selectedFilter === filter ? "selected" : ""}
            onClick={() => handleFilterClick(filter)}
          >
            {filter}
          </span>
        ))}
      </div>

      <div class="styled-box"></div>

      <div className="filter-section">
        <div className="filter-section-left">
          <div className="filter">
            <CiFilter />
            <span>Filter</span>
          </div>
          <div>
            <BiSort />
            <span>Sort By</span>
          </div>
        </div>
        <div className="filter-section-right">
          <div>
            <input type="text" />
          </div>
          <div>logo</div>
        </div>
      </div>

      {/* Appointments Table */}
      <table className="appointments-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Client</th>
            <th>Status</th>
            <th>Appointment Time</th>
            <th>Appointment Owner</th>
          </tr>
        </thead>
        <tbody>
          {paginatedAppointments.map((appointment, index) => (
            <tr key={appointment.id}>
              <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
              <td>{appointment.client}</td>
              <td>
                <span className="status-dropdown">{appointment.status}</span>
              </td>
              <td>{appointment.appointmentTime}</td>
              <td>{appointment.owner}</td>
            </tr>
          ))}

          <tr><div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        {[...Array(totalPages).keys()].map((number) => (
          <button
            key={number + 1}
            onClick={() => handlePageChange(number + 1)}
            className={currentPage === number + 1 ? "active" : ""}
          >
            {number + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div></tr>
        </tbody>
      </table>

      {/* Pagination */}
      
    </div>
  );
}

export default App;
