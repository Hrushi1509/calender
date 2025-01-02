import React, { useState } from "react";
import "./App.css";
import { CiFilter } from "react-icons/ci";
import { BiSort } from "react-icons/bi";
import AddAppointmentModal from "./components/AddAppointmentModal";
import "react-datepicker/dist/react-datepicker.css";
import { EditModal } from "./components/EditModal";

function Table() {
  const [appointments, setAppointments] = useState([
    {
      id: 27,
      user: {
        id: 55,
        username: "TEST Web19",
        email: "web@test1783.com",
      },
      appointment_title: null,
      start_date: "2024-12-27",
      start_time: "12:00:00",
      end_time: "13:00:00",
      assigned_user: "EAST - Camille Shotliff1",
      created_at: "2024-12-24T13:05:21.932158Z",
      appointment_location: "Colorado Springs, Co. (Weber St.)",
      tatto_idea: "nil",
      reference_image:
        "/media/https%3A/services.leadconnectorhq.com/documents/download/4qTpfUo6h0RnPCUimxDJ",
    },
    {
      id: 28,
      user: {
        id: 56,
        username: "John Doe",
        email: "john.doe@example.com",
      },
      appointment_title: "Consultation",
      start_date: "2024-12-28",
      start_time: "14:00:00",
      end_time: "15:00:00",
      assigned_user: "WEST - Jane Smith",
      created_at: "2024-12-24T14:05:21.932158Z",
      appointment_location: "Denver, Co. (Main St.)",
      tatto_idea: "Flower design",
      reference_image: "/media/design_reference.jpg",
    },
  ]);

  const [selectedFilter, setSelectedFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "username", direction: "asc" });
  const [showModal, setShowModal] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(null);
  const [editAppointment, setEditAppointment] = useState(null);

  const rowsPerPage = 3;

  const handleAddAppointment = (newAppointment) => {
    setAppointments((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        user: {
          id: prev.length + 1,
          username: newAppointment.client,
          email: "placeholder@example.com",
        },
        appointment_title: newAppointment.title,
        start_date: newAppointment.date,
        start_time: newAppointment.startTime,
        end_time: newAppointment.endTime,
        assigned_user: newAppointment.owner,
        created_at: new Date().toISOString(),
        appointment_location: newAppointment.location,
        tatto_idea: newAppointment.idea,
        reference_image: newAppointment.referenceImage,
      },
    ]);
    setShowModal(false);
  };

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSortChange = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortedAppointments = [...appointments].sort((a, b) => {
    let aKey = a[sortConfig.key];
    let bKey = b[sortConfig.key];

    if (sortConfig.key === "username") {
      aKey = a.user.username;
      bKey = b.user.username;
    }

    if (aKey < bKey) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (aKey > bKey) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const filteredAppointments = sortedAppointments.filter((appointment) => {
    const matchesSearchTerm =
      appointment.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.assigned_user.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      selectedFilter === "All" || appointment.status === selectedFilter;

    return matchesSearchTerm && matchesFilter;
  });

  const totalPages = Math.ceil(filteredAppointments.length / rowsPerPage);

  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleDeleteAppointment = (id) => {
    setAppointments((prevAppointments) =>
      prevAppointments.filter((appt) => appt.id !== id)
    );
    setShowOptionsModal(null);
  };

  const handleSaveEdit = (id, updatedAppointment) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appt) =>
        appt.id === id ? { ...appt, ...updatedAppointment } : appt
      )
    );
    setEditAppointment(null);
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>Appointments</h1>
        <button
          className="new-appointment-btn"
          onClick={() => setShowModal(true)}
        >
          + New Appointment
        </button>
      </div>

      {showModal && (
        <AddAppointmentModal
          onClose={() => setShowModal(false)}
          onSave={handleAddAppointment}
        />
      )}

      <div className="filters">
        {["All", "Confirmed", "Cancelled"].map((filter) => (
          <span
            key={filter}
            className={selectedFilter === filter ? "selected" : ""}
            onClick={() => handleFilterClick(filter)}
          >
            {filter}
          </span>
        ))}
      </div>

      <table className="appointments-table">
        <thead>
          <tr>
            <th>No.</th>
            <th onClick={() => handleSortChange("username")}>Client</th>
            <th>Status</th>
            <th>Start Date</th>
            <th>Assigned User</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {paginatedAppointments.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>No data found</td>
            </tr>
          ) : (
            paginatedAppointments.map((appointment, index) => (
              <tr key={appointment.id}>
                <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                <td>{appointment.user.username}</td>
                <td>{appointment.status || "Pending"}</td>
                <td>{appointment.start_date}</td>
                <td>{appointment.assigned_user}</td>
                <td>
                  <button
                    onClick={() => handleDeleteAppointment(appointment.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;





import React, { useState } from "react";
import "./AddAppointmentModal.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function AddAppointmentModal({ onClose, onSave }) {
  const [client, setClient] = useState("");
  const [status, setStatus] = useState("Confirmed");
  const [appointmentDateTime, setAppointmentDateTime] = useState(new Date());
  const [owner, setOwner] = useState("");

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Format the date to EST
    const formattedAppointmentTime = appointmentDateTime.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "America/New_York",
      timeZoneName: "short",
    });
  
    // Call the onSave function with the data
    onSave({ client, status, appointmentTime: formattedAppointmentTime, owner });
    // console.log( client, status, 'appointmentTime:' formattedAppointmentTime, owner)

  };
  
  
  
  

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>New Appointment</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Client</label>
            <input
              type="text"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="form-group">
            <label>Appointment Time</label>
            <DatePicker
              selected={appointmentDateTime}
              onChange={(date) => setAppointmentDateTime(date)}
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mm aa"
              timeIntervals={15}
              className="date-picker"
            />
          </div>

          <div className="form-group">
            <label>Owner</label>
            <input
              type="text"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddAppointmentModal;

