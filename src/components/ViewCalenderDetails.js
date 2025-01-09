export const ViewCalenderDetails = ({ appointment, onClose }) => {
  // If the appointment is passed as a string, parse it back into an object
  const parsedAppointment = typeof appointment === 'string' ? JSON.parse(appointment) : appointment;

  // Now you can access parsedAppointment properties like a normal object
  if (!parsedAppointment) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h3>Appointment Details</h3>
          <p>No appointment data available.</p>
          <div className="modal-actions">
            <button onClick={onClose} type="button">Close</button>
          </div>
        </div>
      </div>
    );
  }

  const title = parsedAppointment?.title || "N/A";
  const client = parsedAppointment?.client?.username || "N/A";
  const owner= parsedAppointment?.owner?.username || "N/A";
  const location =  parsedAppointment?.appointment_location || "N/A";
  const tattooIdea = parsedAppointment?.tatto_idea || "N/A";
  const startTime = parsedAppointment?.start ? new Date(parsedAppointment.start) : "N/A";
  const endTime = parsedAppointment?.end ? new Date(parsedAppointment.end) : "N/A";
  const referenceImageURL = parsedAppointment?.reference_image || "N/A";

  const convertReferenceImageURL = (url) => {
    if (url.startsWith("/media/")) {
      const decodedURL = decodeURIComponent(url.replace("/media/", ""));
      // Ensure the URL starts with "https://"
      if (decodedURL.startsWith("https:/") && !decodedURL.startsWith("https://")) {
        return decodedURL.replace("https:/", "https://");
      }
      return decodedURL;
    }
    return url;
  };

  const formatDateTime = (date) => {
    if (!date) return "N/A";
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    });
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

  return (
    <div className="modal-overlay">
      <div className="modal-content scrollable">
        <h3>Appointment Details</h3>
        <div className="form-group">
          <label>Title:</label>
          <p>{title}</p>
        </div>
        <div className="form-group">
          <label>Client:</label>
          <p>{formatAssignedUser(client) || "N/A"}</p>
        </div>
        <div className="form-group">
          <label>Appointment Owner:</label>
          <p>{formatAssignedUser(owner) || "N/A"}</p>
        </div>

        <div className="form-group">
          <label>Location:</label>
          <p>{location}</p>
        </div>
        <div className="form-group">
          <label>Tattoo Idea:</label>
          <p>{tattooIdea}</p>
        </div>

        {/* Session details */}
        <div className="form-group">
          <label>Sessions:</label>
          {startTime !== "N/A" || endTime !== "N/A" ? (
            <div className="sessions">
              <div className="session-details">
                <p>Start Time: {formatDateTime(startTime)}</p>
                <p>End Time: {formatDateTime(endTime)}</p>
              </div>
            </div>
          ) : (
            <p>No sessions available.</p>
          )}
        </div>

        <div className="form-group">
          <label>Reference Image:</label>
          <div className="image-preview">
            {referenceImageURL !== "N/A" && (
              <img
                src={convertReferenceImageURL(referenceImageURL)}
                alt="Reference"
                style={{ width: "100%", maxHeight: "200px", objectFit: "contain" }}
              />
            )}
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={onClose} type="button">Close</button>
        </div>
      </div>
    </div>
  );
};
