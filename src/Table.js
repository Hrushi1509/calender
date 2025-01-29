import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import "./App.css";
import { CiFilter } from "react-icons/ci";
import { BiSort } from "react-icons/bi";
import { FaSyncAlt } from "react-icons/fa";
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
  const [status, setStatus] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const [showOptionsModal, setShowOptionsModal] = useState(null);
  const [editAppointment, setEditAppointment] = useState(null);
  const [viewDetailsAppointment, setViewDetailsAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [originalSessions, setOriginalSessions] = useState({});
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [refreshKey, setRefreshKey] = useState(0);
  const currentStatus = useRef(status);



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


  function capitalizeWords(inputStr) {
    // Split the input string by spaces
    const words = inputStr.split(" ");

    // Ensure the string has exactly two words
    // if (words.length !== 2) {
    //   throw new Error("Input must be two words separated by a space.");
    // }

    let [firstWord, secondWord] = words;

    // Capitalize the first word if it is 'test'
    if (firstWord.toLowerCase() === "test") {
      firstWord = firstWord.charAt(0).toUpperCase() + firstWord.slice(1);
    }

    // Format the second word to show only the first letter followed by a dot
    secondWord = secondWord.charAt(0).toUpperCase() + '.';

    // Combine and return the formatted string
    return `${firstWord} ${secondWord}`;
  }


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


  // const fetchAppointments = async () => {
  //   const currentFetchStatus = status;
  //   setLoading(true);
  //   setAppointments([]);

  //   try {
  //     const config = {
  //       headers: {
  //         Authorization: `Bearer ${tokenFromStorage}`,
  //       },
  //     };

  //     let endpoint = `${baseURL}/get-appointments/?id=${id}`;

  //     if (currentFetchStatus === "completed") {
  //       endpoint = `${baseURL}/get-completed-upcoming-appointments/?status=completed&id=${id}`;
  //       // endpoint = `${baseURL}/get-completed-upcoming-appointments/?status=${currentFetchStatus}&id=${id}`;
  //     } else if (status === "upcoming") {
  //       endpoint = `${baseURL}/get-completed-upcoming-appointments/?status=upcoming&id=${id}`;
  //       // endpoint = `${baseURL}/get-completed-upcoming-appointments/?status=${currentFetchStatus}&id=${id}`;
  //     }

  //     const response = await axios.get(endpoint, config);



  //     const mappedAppointments = response?.data.map((appt) => ({
  //       id: appt?.id,
  //       assigned_user: {
  //         id: appt?.assigned_user?.id,
  //         username: appt?.assigned_user?.username,
  //         email: appt?.assigned_user?.email,
  //       },
  //       user: {
  //         id: appt?.user?.id,
  //         username: appt?.user?.username,
  //         email: appt?.user?.email,
  //       },
  //       sessions: appt?.sessions?.map((session) => ({
  //         id: session?.id,
  //         start_time: session?.start_time,
  //         end_time: session?.end_time,
  //         session_date: session?.session_date,
  //         session_no: session?.session_no,
  //         appointment: session?.appointment,
  //       })),
  //       appointment_title: appt?.appointment_title,
  //       appointment_location: appt?.appointment_location?.name,
  //       reference_images: appt?.reference_images,
  //       created_at: appt?.created_at,
  //       tatto_idea: appt?.tatto_idea,
  //       appointment_count: appt?.appointment_count,
  //       has_previous_tattoos: appt?.has_previous_tattoos,
  //       tattooed_at_certified_studios: appt?.tattooed_at_certified_studios,
  //       tattoo_style: appt?.tattoo_style,
  //       tattoo_body_part: appt?.tattoo_body_part,
  //       tattoo_size: appt?.tattoo_size,
  //       color_or_black_grey: appt?.color_or_black_grey,
  //       cover_up_or_rework: appt?.cover_up_or_rework,
  //       preferred_tattooer: appt?.preferred_tattooer,
  //       preferred_location: appt?.preferred_location,
  //       specific_dates: appt?.specific_dates,
  //       is_traveling: appt?.is_traveling,
  //       deposite_amount: appt?.deposite_amount,
  //       total_project_cost: appt?.total_project_cost,
  //     }));


  //     if (currentStatus.current === status) {
  //       setAppointments(mappedAppointments);
  //     } else {
  //       console.warn("Skipped updating appointments due to status mismatch");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching appointments:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Call `fetchAppointments` only when a button is clicked
  // const handleFetchAppointments = (newStatus) => {
  //   setStatus(newStatus);
  //   fetchAppointments(); // Explicitly call the function
  // };

  // Remove `selectedLocation` from the dependency array
  // useEffect(() => {
  //   fetchAppointments();
  // }, [loginResponse, id, baseURL, status]);

  // useEffect(() => {
  //   currentStatus.current = status;
  // }, [status])



  const handleFetchAppointments = (newStatus) => {
    setStatus(newStatus);
    fetchAppointments(newStatus); // Fetch appointments based on the selected status
  };

  useEffect(() => {
    fetchAppointments(status); // Fetch appointments when `status` changes
  }, [loginResponse, id, baseURL, status]);

  useEffect(() => {
    currentStatus.current = status;
  }, [status]);

  const fetchAppointments = async (currentFetchStatus) => {
    setLoading(true);
    setAppointments([]);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${tokenFromStorage}`,
        },
      };

      let endpoint;

      if (!currentFetchStatus) {
        // Default behavior (when no status is selected)
        endpoint = `${baseURL}/get-appointments/?id=${id}`;
      } else if (currentFetchStatus === "all") {
        // "All" option
        endpoint = `${baseURL}/get-completed-upcoming-appointments/?status=completed&id=${id}&session_type=regular`;
      } else if (currentFetchStatus === "touched") {
        endpoint = `${baseURL}/get-completed-upcoming-appointments/?status=completed&id=${id}&session_type=touchup`;
      } else if (currentFetchStatus === "completed") {
        endpoint = `${baseURL}/get-completed-upcoming-appointments/?status=completed&id=${id}`;
      } else if (currentFetchStatus === "upcoming") {
        endpoint = `${baseURL}/get-completed-upcoming-appointments/?status=upcoming&id=${id}`;
      } else {
        console.warn("Invalid status:", currentFetchStatus);
        return;
      }

      const response = await axios.get(endpoint, config);

      const mappedAppointments = response?.data.map((appt) => ({
        id: appt?.appointment_id,
        assigned_user: {
          id: appt?.appointment_details?.assigned_user?.id,
          username: appt?.appointment_details?.assigned_user?.username,
          email: appt?.appointment_details?.assigned_user?.email,
        },
        user: {
          id: appt?.appointment_details?.user?.id,
          username: appt?.appointment_details?.user?.username,
          email: appt?.appointment_details?.user?.email,
        },
        sessions: appt?.appointment_details?.sessions?.map((session) => ({
          id: session?.id,
          start_time: session?.start_time,
          end_time: session?.end_time,
          session_date: session?.session_date,
          session_no: session?.session_no,
          appointment: session?.appointment,
        })),
        appointment_title: appt?.appointment_details?.appointment_title,
        appointment_location: appt?.appointment_details?.appointment_location?.name,
        reference_images: appt?.appointment_details?.reference_images,
        created_at: appt?.appointment_details?.created_at,
        tatto_idea: appt?.appointment_details?.tatto_idea,
        appointment_count: appt?.appointment_details?.appointment_count,
        has_previous_tattoos: appt?.appointment_details?.has_previous_tattoos,
        tattooed_at_certified_studios: appt?.appointment_details?.tattooed_at_certified_studios,
        tattoo_style: appt?.appointment_details?.tattoo_style,
        tattoo_body_part: appt?.appointment_details?.tattoo_body_part,
        tattoo_size: appt?.appointment_details?.tattoo_size,
        color_or_black_grey: appt?.appointment_details?.color_or_black_grey,
        cover_up_or_rework: appt?.appointment_details?.cover_up_or_rework,
        preferred_tattooer: appt?.appointment_details?.preferred_tattooer,
        preferred_location: appt?.appointment_details?.preferred_location,
        specific_dates: appt?.appointment_details?.specific_dates,
        is_traveling: appt?.appointment_details?.is_traveling,
        deposite_amount: appt?.appointment_details?.deposite_amount,
        total_project_cost: appt?.appointment_details?.total_project_cost,
      }));

      if (currentStatus.current === currentFetchStatus) {
        setAppointments(mappedAppointments);
      } else {
        console.warn("Skipped updating appointments due to status mismatch");
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };



  const handleGetTodaysAppointments = async () => {
    setLoading(true);
    setAppointments([]);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${tokenFromStorage}`,
        },
      };

      let endpoint = `${baseURL}/todays-sessions`;
      // if (selectedLocation) {
      //   endpoint = `${baseURL}/todays-sessions/?studio_name=${selectedLocation}`;
      // }

      const response = await axios.get(endpoint, config);
      const mappedAppointments = response?.data.map((appt) => ({
        id: appt.id,
        user: appt.user,
        sessions: appt.sessions,
        appointment_title: appt.appointment_title,
        // start_date: appt.start_date,
        assigned_user: appt.assigned_user,
        created_at: appt.created_at,
        title: appt.appointment_title,
        appointment_location: appt.appointment_location,
        tatto_idea: appt.tatto_idea,
        reference_image: appt.reference_images,
      }));

      // const mappedAppointments = response?.data.map((appt) => ({
      //   id: appt.id,
      //   assigned_user: {
      //     id: appt.assigned_user?.id,
      //     username: appt.assigned_user?.username,
      //     email: appt.assigned_user?.email,
      //   },
      //   user: {
      //     id: appt.user?.id,
      //     username: appt.user?.username,
      //     email: appt.user?.email,
      //   },
      //   sessions: appt.sessions?.map((session) => ({
      //     id: session.id,
      //     start_time: session.start_time,
      //     end_time: session.end_time,
      //     session_date: session.session_date,
      //     session_no: session.session_no,
      //     appointment: session.appointment,
      //   })),
      //   appointment_title: appt.appointment_title,
      //   appointment_location: appt.appointment_location?.name,
      //   reference_images: appt.reference_images,
      //   created_at: appt.created_at,
      //   tatto_idea: appt.tatto_idea,
      //   appointment_count: appt.appointment_count,
      //   has_previous_tattoos: appt.has_previous_tattoos,
      //   tattooed_at_certified_studios: appt.tattooed_at_certified_studios,
      //   tattoo_style: appt.tattoo_style,
      //   tattoo_body_part: appt.tattoo_body_part,
      //   tattoo_size: appt.tattoo_size,
      //   color_or_black_grey: appt.color_or_black_grey,
      //   cover_up_or_rework: appt.cover_up_or_rework,
      //   preferred_tattooer: appt.preferred_tattooer,
      //   preferred_location: appt.preferred_location,
      //   specific_dates: appt.specific_dates,
      //   is_traveling: appt.is_traveling,
      //   deposite_amount: appt.deposite_amount,
      //   total_project_cost: appt.total_project_cost,
      // }));


      setAppointments(mappedAppointments);
    } catch (error) {
      console.error("Error fetching today's appointments:", error);
    } finally {
      setLoading(false);
    }
  };





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



  // console.log(JSON.stringify(sortedAppointments, null, 2),'sortedAppointments')
  // console.log(appointments,'appointmnes external')
  // const filteredAppointments = appointments.filter((appointment) => {
  //   // console.log("Appointment object:", appointment);

  //   const matchesSearchTerm =
  //     appointment.user.username.toLowerCase().includes(searchTerm.toLowerCase());

  //   const contactCreatedAtDate = appointment?.sessions[0]?.session_date
  //     ? parseCustomDate(appointment?.sessions[0]?.session_date)
  //     : null;

  //   const adjustedEndDate = endDate
  //     ? new Date(new Date(endDate).setHours(23, 59, 59, 999))  
  //     : null;

  //   // Normalize the date values without affecting the original contactCreatedAtDate
  //   const startDateNormalized = normalizeDate(startDate);
  //   const adjustedEndDateNormalized = normalizeDate(adjustedEndDate);
  //   const contactCreatedAtDateNormalized = normalizeDate(contactCreatedAtDate);

  //   // Check if the original session data is already stored
  //   if (!originalSessions[appointment.id]) {
  //     setOriginalSessions((prev) => ({
  //       ...prev,
  //       [appointment.id]: [...appointment.sessions], // Save a copy of original sessions
  //     }));
  //   }

  //   // If no date range is set, reset the sessions to the original (before any date filter)
  //   if (!startDateNormalized && !adjustedEndDateNormalized) {
  //     appointment.sessions = originalSessions[appointment.id] || appointment.sessions;
  //   } else {
  //     // Filter sessions based on the date range
  //     const filteredSessions = appointment.sessions.filter((session) => {
  //       const sessionDate = session?.session_date
  //         ? normalizeDate(parseCustomDate(session.session_date))
  //         : null;

  //       return (
  //         (!startDateNormalized || sessionDate >= startDateNormalized) &&
  //         (!adjustedEndDateNormalized || sessionDate <= adjustedEndDateNormalized)
  //       );
  //     });

  //     appointment.sessions = filteredSessions;
  //   }

  //   const matchesDateRange =
  //     (!startDateNormalized || contactCreatedAtDateNormalized >= startDateNormalized) &&
  //     (!adjustedEndDateNormalized || contactCreatedAtDateNormalized <= adjustedEndDateNormalized);

  //   return matchesSearchTerm && matchesDateRange;
  // });
  // console.log(filteredAppointments, 'appointments after filtering');


  const filteredAppointments = appointments?.map((appointment) => {
    // Clone the appointment object to avoid mutation
    const clonedAppointment = { ...appointment, sessions: [...appointment.sessions] };

    const matchesSearchTerm =
      clonedAppointment.user.username.toLowerCase().includes(searchTerm.toLowerCase());

    const contactCreatedAtDate = clonedAppointment?.sessions[0]?.session_date
      ? parseCustomDate(clonedAppointment?.sessions[0]?.session_date)
      : null;

    const adjustedEndDate = endDate
      ? new Date(new Date(endDate).setHours(23, 59, 59, 999))
      : null;

    const startDateNormalized = normalizeDate(startDate);
    const adjustedEndDateNormalized = normalizeDate(adjustedEndDate);
    const contactCreatedAtDateNormalized = normalizeDate(contactCreatedAtDate);

    // Filter sessions based on the date range
    const filteredSessions = clonedAppointment.sessions.filter((session) => {
      const sessionDate = session?.session_date
        ? normalizeDate(parseCustomDate(session.session_date))
        : null;

      return (
        (!startDateNormalized || sessionDate >= startDateNormalized) &&
        (!adjustedEndDateNormalized || sessionDate <= adjustedEndDateNormalized)
      );
    });

    // Assign filtered sessions to the cloned object
    clonedAppointment.sessions = filteredSessions;

    const matchesDateRange =
      (!startDateNormalized || contactCreatedAtDateNormalized >= startDateNormalized) &&
      (!adjustedEndDateNormalized || contactCreatedAtDateNormalized <= adjustedEndDateNormalized);

    return matchesSearchTerm && matchesDateRange ? clonedAppointment : null;
  }).filter(Boolean);

  // console.log(filteredAppointments, 'appointments after filtering');




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

  const handleRefresh = () => {
    window.location.reload();
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
        <div className="btn-groups">
          {/* <button className="btn-toggle"
            onClick={() => handleFetchAppointments("completed")}
          // onClick={() => setStatus("completed")}
          >
            Completed
          </button>
          <button className="btn-toggle"
            onClick={() => handleFetchAppointments("upcoming")}
          // onClick={() => setStatus("upcoming")}
          >
            Upcoming
          </button> */}


          {/* <select
            className="dropdown-toggle"
            onChange={(e) => handleFetchAppointments(e.target.value)}
            defaultValue="all"
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="upcoming">Upcoming</option>
            <option value="touched">Touched</option>
          </select> */}

          <select
            className="dropdown-toggle"
            onChange={(e) => handleFetchAppointments(e.target.value)}
            value={status} // Reflect the current status
          >
            <option value="">Main API (Default)</option>
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="upcoming">Upcoming</option>
            <option value="touched">Touched</option>
          </select>



          <FaSyncAlt
            onClick={handleRefresh}
            style={{
              fontSize: "1.5rem",
              marginLeft: "1rem",
              cursor: "pointer",
              color: "#007bff",
            }}
            title="Refresh"
          />

          <button
            onClick={handleGetTodaysAppointments}
            className="btn-toggle"
          >
            Get Today's Appointments
          </button>
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

      {/* <div className="filter-container">
        <div className="btn-groups">
            <select
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
            <button
              onClick={handleGetTodaysAppointments}
              className="btn-toggle"
            >
              Get Today's Appointments
            </button>
          </div>
        </div> */}

      {/* Appointments Table */}
      <div className="table-container">
        <table className="appointments-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Title</th>
              <th onClick={() => handleSortChange("client")}>
                Client
                {/* {sortConfig.key === "client" && (sortConfig.direction === "asc" ? "↑" : "↓")} */}
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
                  <td>{capitalizeWords(formatAssignedUser(appointment?.user?.username))}</td>


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
                    {appointment?.sessions && appointment?.sessions?.length > 0 ? (
                      <div>
                        <select
                          onChange={(e) => setSelectedSessionIndex(e.target.value)}
                          value={selectedSessionIndex}
                        >

                          {/* {appointment?.sessions?.map((session, index) => (
                          <option key={index} value={index}>

                            {session?.session_date && session?.start_time && session?.end_time 
                              ? `${formatToDayMonthYear(session?.session_date)}, ${session?.start_time} - ${session?.end_time}`
                              : `No Appointment for ${session?.appointment}` }
                          </option>
                        ))} */}
                          {appointment?.sessions
                            ?.filter(
                              (session) =>
                                session?.session_date &&
                                session?.start_time &&
                                session?.end_time &&
                                session?.session_no
                            ).length > 0 ? (
                            appointment.sessions
                              .filter(
                                (session) =>
                                  session?.session_date &&
                                  session?.start_time &&
                                  session?.end_time &&
                                  session?.session_no
                              )
                              .map((session, index) => (
                                <option key={index} value={index}>
                                  {`${formatToDayMonthYear(session.session_date)}, ${session.start_time} - ${session.end_time}`}
                                </option>
                              ))
                          ) : (
                            <option>No Appointment</option>
                          )}


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
    </div>
  );
}

export default Table;
