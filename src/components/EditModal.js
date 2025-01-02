import { useState } from "react";
import './EditModal.css';

export const EditModal = ({ appointment, onSave, onClose }) => {
  const convertReferenceImageURL = (url) => {
    if (url.startsWith("/media/")) {
      const decodedURL = decodeURIComponent(url.replace("/media/", ""));
      return decodedURL;
    }
    return url;
  };

  const [updatedTitle, setUpdatedTitle] = useState(appointment.appointment_title || "");
  const [updatedClient, setUpdatedClient] = useState(appointment.user.username || "");
  const [updatedOwner, setUpdatedOwner] = useState(appointment.assigned_user || "");
  const [updatedLocation, setUpdatedLocation] = useState(appointment.appointment_location || "");
  const [updatedStartDate, setUpdatedStartDate] = useState(appointment.start_date || "");
  const [updatedStartTime, setUpdatedStartTime] = useState(appointment.start_time || "");
  const [updatedEndTime, setUpdatedEndTime] = useState(appointment.end_time || "");
  const [updatedTattooIdea, setUpdatedTattooIdea] = useState(appointment.tatto_idea || "");

  const referenceImageURL = convertReferenceImageURL(appointment.reference_image);

  const handleSave = () => {
    const updatedAppointment = {
      ...appointment,
      appointment_title: updatedTitle,
      user: { ...appointment.user, username: updatedClient },
      assigned_user: updatedOwner,
      appointment_location: updatedLocation,
      start_date: updatedStartDate,
      start_time: updatedStartTime,
      end_time: updatedEndTime,
      tatto_idea: updatedTattooIdea,
    };
    onSave(appointment.id, updatedAppointment);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content scrollable">
        <h3>Edit Appointment</h3>
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            value={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Client:</label>
          <input
            type="text"
            value={updatedClient}
            onChange={(e) => setUpdatedClient(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Appointment Owner:</label>
          <input
            type="text"
            value={updatedOwner}
            onChange={(e) => setUpdatedOwner(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Location:</label>
          <input
            type="text"
            value={updatedLocation}
            onChange={(e) => setUpdatedLocation(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Start Date:</label>
          <input
            type="date"
            value={updatedStartDate}
            onChange={(e) => setUpdatedStartDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Start Time:</label>
          <input
            type="time"
            value={updatedStartTime}
            onChange={(e) => setUpdatedStartTime(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>End Time:</label>
          <input
            type="time"
            value={updatedEndTime}
            onChange={(e) => setUpdatedEndTime(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Tattoo Idea:</label>
          <textarea
            value={updatedTattooIdea}
            onChange={(e) => setUpdatedTattooIdea(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Reference Image:</label>
          <div className="image-preview">
            <img
              src={referenceImageURL}
              alt="Reference"
              style={{ width: "100%", maxHeight: "200px", objectFit: "contain" }}
            />
          </div>
        </div>
        <div className="modal-actions">
          <button onClick={onClose} type="button">Cancel</button>
          <button onClick={handleSave} type="submit">Save</button>
        </div>
      </div>
    </div>
  );
};
