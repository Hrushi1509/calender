import React, { useState } from "react";
import "./AddAppointmentModal.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function AddAppointmentModal({ onClose, onSave }) {
  const [client, setClient] = useState("");
  const [status, setStatus] = useState("Confirmed");
  const [appointmentDate, setAppointmentDate] = useState(new Date());
  const [startTime, setStartTime] = useState("12:00");
  const [endTime, setEndTime] = useState("13:00");
  const [owner, setOwner] = useState("");
  const [appointmentLocation, setAppointmentLocation] = useState("");
  const [tattooIdea, setTattooIdea] = useState("");
  const [referenceImage, setReferenceImage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedDate = appointmentDate.toISOString().split("T")[0];

    const newAppointment = {
      // id: Math.floor(Math.random() * 1000), // Example ID generation; replace with actual logic
      user: {
        // id: Math.floor(Math.random() * 100), // Replace with actual user ID
        username: client,
        email: `${client.toLowerCase().replace(/\s+/g, "")}@example.com`,
      },
      appointment_title: null,
      start_date: formattedDate,
      start_time: startTime,
      end_time: endTime,
      assigned_user: owner,
      created_at: new Date().toISOString(),
      appointment_location: appointmentLocation,
      tatto_idea: tattooIdea,
      reference_image: referenceImage,
    };

    onSave(newAppointment);
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
            <label>Appointment Date</label>
            <DatePicker
              selected={appointmentDate}
              onChange={(date) => setAppointmentDate(date)}
              dateFormat="yyyy-MM-dd"
              className="date-picker"
            />
          </div>

          <div className="form-group">
            <label>Start Time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>End Time</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
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

          <div className="form-group">
            <label>Appointment Location</label>
            <input
              type="text"
              value={appointmentLocation}
              onChange={(e) => setAppointmentLocation(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Tattoo Idea</label>
            <input
              type="text"
              value={tattooIdea}
              onChange={(e) => setTattooIdea(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Reference Image URL</label>
            <input
              type="text"
              value={referenceImage}
              onChange={(e) => setReferenceImage(e.target.value)}
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
