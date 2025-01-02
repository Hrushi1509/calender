import { useState } from "react";
import './ViewDetails.css';

export const ViewDetails = ({ appointment, onClose }) => {
  const convertReferenceImageURL = (url) => {
    if (url.startsWith("/media/")) {
      const decodedURL = decodeURIComponent(url.replace("/media/", ""));
      return decodedURL;
    }
    return url;
  };

  function formatAssignedUser(assignedUser) {
    if (!assignedUser) {
      return "Not Assigned";
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

  const referenceImageURL = convertReferenceImageURL(appointment.reference_image);

  return (
    <div className="modal-overlay">
      <div className="modal-content scrollable">
        <h3>Appointment Details</h3>
        <div className="form-group">
          <label>Title:</label>
          <p>{appointment.appointment_title || "N/A"}</p>
        </div>
        <div className="form-group">
          <label>Client:</label>
          <p>{formatAssignedUser(appointment?.user?.username) || "N/A"}</p>
        </div>
        <div className="form-group">
          <label>Appointment Owner:</label>
          <p>{formatAssignedUser(appointment?.assigned_user?.username) || "N/A"}</p>
        </div>
        <div className="form-group">
          <label>Location:</label>
          <p>{appointment.appointment_location || "N/A"}</p>
        </div>
        <div className="form-group">
          <label>Tattoo Idea:</label>
          <p>{appointment.tatto_idea || "N/A"}</p>
        </div>
        
        {/* Session details */}
        <div className="form-group">
          <label>Sessions:</label>
          {appointment.sessions && appointment.sessions.length > 0 ? (
            <div className="sessions">
              {appointment.sessions.map((session, index) => (
                <div key={session.id} className="session-details">
                  <p><strong>Session {index + 1}:</strong></p>
                  <p>Session Date: {session.session_date || "N/A"}</p>
                  <p>Start Time: {session.start_time || "N/A"}</p>
                  <p>End Time: {session.end_time || "N/A"}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No sessions available.</p>
          )}
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
          <button onClick={onClose} type="button">Close</button>
        </div>
      </div>
    </div>
  );
};
