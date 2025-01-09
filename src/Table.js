import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { CiFilter } from "react-icons/ci";
import { BiSort } from "react-icons/bi";
import AddAppointmentModal from "./components/AddAppointmentModal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, isSameDay, parse } from "date-fns";
import { EditModal } from "./components/EditModal";
import { ViewDetails } from "./components/ViewDetails";
import { useAuth } from './auth/AuthContext';
import { useNavigate } from 'react-router-dom';


function Table({ showTable, setShowTable }) {

  const [appointments, setAppointments] = useState([]);

  const [selectedFilter, setSelectedFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "client", direction: "asc" });
  const [showModal, setShowModal] = useState(false);
  const [selectedSessionIndex, setSelectedSessionIndex] = useState(0);


  const [showOptionsModal, setShowOptionsModal] = useState(null);
  const [editAppointment, setEditAppointment] = useState(null);
  const [viewDetailsAppointment, setViewDetailsAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [originalSessions, setOriginalSessions] = useState({});
  const [rowsPerPage, setRowsPerPage] = useState(10);


  const { authData, setAuthData } = useAuth();
  const navigate = useNavigate();

  const email = authData?.loginResponse?.userEmail;
  // const assignedUser = email.split("@")[0];


  const normalizeDate = (date) => {
    if (!date) return null;
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  };

  // const normalizeDate = (date) => {
  //   return date ? new Date(date.toISOString().split("T")[0]) : null; // Normalize to UTC without time
  // };


  function formatAssignedUser(assignedUser) {
    if (!assignedUser) {
      return "Anonymous";
    }

    // List of prefixes to remove
    const prefixesToRemove = ['WEST -', 'YALE -', 'WEBER -', 'EAST -', 'WEST-', 'EAST-', 'WEBER-', 'YALE-'];

    // Remove the prefix if it exists
    prefixesToRemove.forEach(prefix => {
      if (assignedUser.startsWith(prefix)) {
        assignedUser = assignedUser.slice(prefix.length);
      }
    });

    return assignedUser.trim();
  }



  const formatToDayMonthYear = (dateString) => {
    if (!dateString) return null;

    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  };



  // for date filter
  const [dateRange, setDateRange] = useState([null, null]);


  const [startDate, endDate] = dateRange;


  const parseCustomDate = (dateString) => {
    if (!dateString || typeof dateString !== "string") return null;

    // Handle YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return new Date(dateString);
    }

    // Handle MM/DD/YYYY with time and AM/PM
    const parts = dateString.split(/,?\s+/);
    if (parts.length < 3) return null;

    const [datePart, timePart, period] = parts;

    // Ensure datePart and timePart are valid
    if (!datePart || !timePart || !period) return null;

    const [month, day, year] = datePart.split("/").map(Number);
    if (isNaN(month) || isNaN(day) || isNaN(year)) return null;

    let [hours, minutes, seconds] = timePart.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) return null;
    if (!seconds) seconds = 0; // Default seconds if not provided

    // Adjust for AM/PM
    if (period === "PM" && hours < 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    return new Date(year, month - 1, day, hours, minutes, seconds);
  };



  const id = authData?.loginResponse?.id || localStorage.getItem('loginUserId');
  const loginResponse = authData?.loginResponse
  const accessToken = authData?.loginResponse?.access || localStorage.getItem("accessToken");

  const tokenFromStorage = localStorage.getItem('accessToken');
  const userId = localStorage.getItem('loginUserId');

  const baseURL = process.env.REACT_APP_API_BASE_URL || "https://apptbackend.cercus.app"
  // const baseURL = process.env.REACT_APP_API_BASE_URL || "https://tattosagencyghl.onrender.com"
  useEffect(() => {


    const fetchAppointments = async () => {
      setLoading(true);

      try {

        const config = {
          headers: {
            Authorization: `Bearer ${tokenFromStorage}`,
          },
        };
        const response = await axios.get(`${baseURL}/get-appointments/?id=${id}`, config) || await axios.get(`${baseURL}/get-appointments/?id=${userId}`, config)
        const fetchedAppointments = response.data;


        // Map API response to your data structure
        const mappedAppointments = fetchedAppointments.map((appt) => ({
          id: appt.id,
          user: appt.user,
          sessions: appt.sessions,
          appointment_title: appt.appointment_title,
          start_date: appt.start_date,
          // start_time: appt.start_time,
          // end_time: appt.end_time,
          assigned_user: appt.assigned_user,
          created_at: appt.created_at,
          title: appt.appointment_title,
          appointment_location: appt.appointment_location,
          tatto_idea: appt.tatto_idea,
          reference_image: appt.reference_images,
        }));

        setAppointments(mappedAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [loginResponse, id, baseURL]);
  // }, []);





  // const rowsPerPage = 3;


  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleStatusChange = (id, newStatus) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appointment) =>
        appointment.id === id ? { ...appointment, status: newStatus } : appointment
      )
    );
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // const handleSortChange = (key) => {
  //   setSortConfig((prevConfig) => ({
  //     key,
  //     direction: prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc",
  //   }));
  // };

  // Sort appointments
  // const sortedAppointments = [...appointments].sort((a, b) => {
  //   if (a[sortConfig.key] < b[sortConfig.key]) {
  //     return sortConfig.direction === "asc" ? -1 : 1;
  //   }
  //   if (a[sortConfig.key] > b[sortConfig.key]) {
  //     return sortConfig.direction === "asc" ? 1 : -1;
  //   }
  //   return 0;
  // });

  const handleSortChange = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Sort appointments
  const sortedAppointments = [...appointments].sort((a, b) => {
    let aKey = a[sortConfig.key];
    let bKey = b[sortConfig.key];

    // Special handling for nested keys
    if (sortConfig.key === "username") {
      aKey = a.user?.username ?? "";
      bKey = b.user?.username ?? "";
    }

    // Handle string comparison
    if (typeof aKey === "string" && typeof bKey === "string") {
      aKey = aKey.toLowerCase();
      bKey = bKey.toLowerCase();
    }

    // Determine sorting order
    const direction = sortConfig.direction === "asc" ? 1 : -1;
    if (aKey < bKey) return -1 * direction;
    if (aKey > bKey) return 1 * direction;
    return 0;
  });



  // Filter appointments based on search term and selected filter
  // const filteredAppointments = sortedAppointments.filter((appointment) => {
  //   const matchesSearchTerm =
  //     appointment.user.username.toLowerCase().includes(searchTerm.toLowerCase())

  //   const matchesFilter =
  //     selectedFilter === "All" || appointment.status === selectedFilter;


  //   const contactCreatedAtDate = appointment?.sessions[0]?.session_date
  //     ? parseCustomDate(appointment?.sessions[0]?.session_date)
  //     : null;

  //   // Ensure you don't override the contactCreatedAtDate with startDate or other filters
  //   const adjustedEndDate = endDate
  //     ? new Date(new Date(endDate).setHours(23, 59, 59, 999))  // Adjust endDate to the last moment of the day
  //     : null;

  //   // Normalize the date values without affecting the original contactCreatedAtDate
  //   const startDateNormalized = normalizeDate(startDate);
  //   const adjustedEndDateNormalized = normalizeDate(adjustedEndDate);
  //   const contactCreatedAtDateNormalized = normalizeDate(contactCreatedAtDate);

  //   // console.log(startDateNormalized,'startDateNormalized')
  //   // console.log(adjustedEndDateNormalized,'adjustedEndDateNormalized')
  //   // console.log(contactCreatedAtDate,'contactCreatedAtDate')
  //   // console.log(appointment?.sessions[0]?.session_date,'appointment?.sessions[0]?.session_date')

  //   // Compare the contactCreatedAtDate with the date range (keeping original API data intact)



  //   // Filter sessions based on the date range
  //   const filteredSessions = appointment.sessions.filter((session) => {
  //     const sessionDate = session?.session_date
  //       ? normalizeDate(parseCustomDate(session.session_date))
  //       : null;

  //     return (
  //       (!startDateNormalized || sessionDate >= startDateNormalized) &&
  //       (!adjustedEndDateNormalized || sessionDate <= adjustedEndDateNormalized)
  //     );
  //   });

  //   appointment.sessions = filteredSessions;


  //   const matchesDateRange =
  //     (!startDateNormalized || contactCreatedAtDateNormalized >= startDateNormalized) &&
  //     (!adjustedEndDateNormalized || contactCreatedAtDateNormalized <= adjustedEndDateNormalized);


  //   return matchesSearchTerm && matchesFilter && matchesDateRange;
  // });



  const filteredAppointments = sortedAppointments.filter((appointment) => {
    const matchesSearchTerm =
      appointment.user.username.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      selectedFilter === "All" || appointment.status === selectedFilter;

    const contactCreatedAtDate = appointment?.sessions[0]?.session_date
      ? parseCustomDate(appointment?.sessions[0]?.session_date)
      : null;

    const adjustedEndDate = endDate
      ? new Date(new Date(endDate).setHours(23, 59, 59, 999))  // Adjust endDate to the last moment of the day
      : null;

    // Normalize the date values without affecting the original contactCreatedAtDate
    const startDateNormalized = normalizeDate(startDate);
    const adjustedEndDateNormalized = normalizeDate(adjustedEndDate);
    const contactCreatedAtDateNormalized = normalizeDate(contactCreatedAtDate);

    // Check if the original session data is already stored
    if (!originalSessions[appointment.id]) {
      setOriginalSessions((prev) => ({
        ...prev,
        [appointment.id]: [...appointment.sessions], // Save a copy of original sessions
      }));
    }

    // If no date range is set, reset the sessions to the original (before any date filter)
    if (!startDateNormalized && !adjustedEndDateNormalized) {
      appointment.sessions = originalSessions[appointment.id] || appointment.sessions;
    } else {
      // Filter sessions based on the date range
      const filteredSessions = appointment.sessions.filter((session) => {
        const sessionDate = session?.session_date
          ? normalizeDate(parseCustomDate(session.session_date))
          : null;

        return (
          (!startDateNormalized || sessionDate >= startDateNormalized) &&
          (!adjustedEndDateNormalized || sessionDate <= adjustedEndDateNormalized)
        );
      });

      appointment.sessions = filteredSessions;
    }

    const matchesDateRange =
      (!startDateNormalized || contactCreatedAtDateNormalized >= startDateNormalized) &&
      (!adjustedEndDateNormalized || contactCreatedAtDateNormalized <= adjustedEndDateNormalized);

    return matchesSearchTerm && matchesFilter && matchesDateRange;
  });



  const totalPages = Math.ceil(filteredAppointments.length / rowsPerPage);


  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const OptionsModal = ({ onEdit, onDelete, onClose, onViewDetails }) => (
    <div className="options-modal">
      <div onClick={onViewDetails}>View Details</div>
      {/* <div onClick={onEdit}>Edit</div> */}
      {/* <div onClick={onDelete}>Delete</div> */}
      <div onClick={onClose}>Close</div>
    </div>
  );

  const handleSaveEdit = (id, updatedAppointment) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appt) =>
        appt.id === id ? updatedAppointment : appt
      )
    );
    setEditAppointment(null);
  };

  {
    viewDetailsAppointment && (
      <ViewDetails
        appointment={viewDetailsAppointment}
        onClose={() => setViewDetailsAppointment(null)}
      />
    )
  }

  // {
  //   editAppointment && (
  //     <EditModal
  //       appointment={editAppointment}
  //       onSave={handleSaveEdit}
  //       onClose={() => setEditAppointment(null)}
  //     />
  //   )
  // }

  // const handleDeleteAppointment = (id) => {
  //   setAppointments((prevAppointments) =>
  //     prevAppointments.filter((appt) => appt.id !== id)
  //   );
  //   setShowOptionsModal(null);
  // };

  const handleLogout = () => {
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("loginUserId");
    setAuthData(null); // Clear context or state
    navigate('/login')
  };


  return (
    <div className="app-container">
      {/* Header */}
      <div className="header">
        <h1>Appointments</h1>
        {/* <button className="new-appointment-btn" onClick={() => setShowModal(true)}>+ New Appointment</button> */}
        <div className="btn-groups">
          <button className="btn-toggle" onClick={() => { setShowTable(!showTable) }}>{showTable ? "Calendar" : "List"}</button>
          <button className="btn-logout" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </div>

      {/* {showModal && (
        <AddAppointmentModal
          onClose={() => setShowModal(false)}
          onSave={handleAddAppointment}
        />
      )} */}

      {/* Filter Options */}
      {/* <div className="filters">
        {["All", "Confirmed", "Cancelled"].map((filter) => (
          <span
            key={filter}
            className={selectedFilter === filter ? "selected" : ""}
            onClick={() => handleFilterClick(filter)}
          >
            {filter}
          </span>
        ))}
      </div> */}

      <div className="styled-box"></div>

      {/* Filter and Search Section */}
      <div className="filter-section">
        <div className="filter-section-left">
          <div className="filter-left-with-icon">
            <CiFilter />
            <span>Filter</span>
            <DatePicker
              selected={startDate}
              onChange={(update) => setDateRange(update)}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              isClearable
              placeholderText="Select a date range"
              className="date-picker"
            />
          </div>
          {/* <div className="sort-left-with-icon" onClick={() => handleSortChange("assigned_user")}>
            <BiSort /> */}
          {/* <span>Sort By Appointment Owner ({sortConfig.direction === "asc" ? "↑" : "↓"})</span> */}
          {/* <span>Sort By Appointment Owner ({sortConfig.direction === "asc" ? "↓" : "↑"})</span>
          </div> */}
        </div>
        <div className="filter-section-right">
          <input
            type="text"
            className="searchbar"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {/* <div>
            <img src={require("./icons/box.png")} alt="box" />
          </div> */}
        </div>
      </div>

      {/* Appointments Table */}
      <table className="appointments-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Title</th>
            <th onClick={() => handleSortChange("client")}>
              Client {sortConfig.key === "client" && (sortConfig.direction === "asc" ? "↑" : "↓")}
            </th>
            {/* <th>Status</th> */}
            <th onClick={() => handleSortChange("appointmentTime")}>
              Appointment Time{" "}
              {sortConfig.key === "appointmentTime" && (sortConfig.direction === "asc" ? "↑" : "↓")}
            </th>
            <th>Appointment Owner</th>
            <th></th>
          </tr>
        </thead>
       
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                Loading...
              </td>
            </tr>
          ) : filteredAppointments.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                No data found
              </td>
            </tr>
          ) : (
            paginatedAppointments.map((appointment, index) => (
              <tr key={appointment.id}>
                <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                {/* <td>{appointment.user.username}</td> */}
                <td>{formatAssignedUser(appointment?.title)}</td>
                <td>{formatAssignedUser(appointment?.user?.username)}</td>


                {/* <td>
                  {appointment.sessions && appointment.sessions.length > 0
                    ? (
                      <div>
                        {formatToDayMonthYear(appointment.sessions[0].session_date)} , {appointment.sessions[0].start_time} - {appointment.sessions[0].end_time}
                      </div>
                    )
                    : "No session available"}
                </td> */}

                <td>
                  {appointment.sessions && appointment.sessions.length > 0 ? (
                    <div>
                      <select
                        onChange={(e) => setSelectedSessionIndex(e.target.value)}
                        value={selectedSessionIndex}
                      >
                        {appointment.sessions.map((session, index) => (
                          <option key={index} value={index}>
                            {formatToDayMonthYear(session.session_date)} , {session.start_time} - {session.end_time}
                          </option>
                        ))}
                      </select>

                      {/* <div>
                        {formatToDayMonthYear(appointment.sessions[selectedSessionIndex].session_date)} ,
                        {appointment.sessions[selectedSessionIndex].start_time} - {appointment.sessions[selectedSessionIndex].end_time}
                      </div> */}
                    </div>
                  ) : (
                    "No session available"
                  )}
                </td>


                {/* <td>{appointment.assigned_user}</td> */}
                <td>{formatAssignedUser(appointment?.assigned_user?.username)}</td>
                {/* <td>{assignedUser}</td> */}

                <td style={{ position: "relative" }}>
                  <img
                    src={require("./icons/dots.png")}
                    alt="dots"
                    onClick={() => setShowOptionsModal(appointment.id)}
                    style={{ cursor: "pointer" }}
                  />
                  {showOptionsModal === appointment.id && (
                    <OptionsModal
                      onViewDetails={() => {
                        setViewDetailsAppointment(appointment);
                        setShowOptionsModal(null);
                      }}
                      // onEdit={() => {
                      //   setEditAppointment(appointment);
                      //   setShowOptionsModal(null);
                      // }}
                      // onDelete={() => handleDeleteAppointment(appointment.id)}
                      onClose={() => setShowOptionsModal(null)}
                    />
                  )}
                </td>
                {viewDetailsAppointment && (
                  <ViewDetails
                    appointment={viewDetailsAppointment}
                    onClose={() => setViewDetailsAppointment(null)}
                  />
                )}
                {/* {editAppointment && (
                  <EditModal
                    appointment={editAppointment}
                    onSave={handleSaveEdit}
                    onClose={() => setEditAppointment(null)}
                  />
                )} */}
              </tr>
            ))
          )}
          

          <tr className="pagination-box">
            <td colSpan="6" className="pagination-container">
              <div className="pagination">

                <div className="rows-per-page">
                  <select
                    id="rows-per-page"
                    value={rowsPerPage}
                    onChange={(e) => setRowsPerPage(Number(e.target.value))}
                  >
                    {[10, 30, 50, 100].map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>


                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
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
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                  &gt;
                </button>
              </div>
            </td>
          </tr>
          </tbody>
      </table>
      </div>
  );
}

export default Table;
