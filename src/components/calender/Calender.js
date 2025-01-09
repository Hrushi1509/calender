import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./CalendarStyles.css";
import { useAuth } from "../../auth/AuthContext";
import { ViewCalenderDetails } from "../ViewCalenderDetails";
import { View } from "./View";

const localizer = momentLocalizer(moment);

const CustomCalendar = ({showTable,setShowTable}) => {
  console.log(setShowTable,showTable)
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]); // Filtered events
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [currentDate, setCurrentDate] = useState(new Date());
  const { authData } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState(null);

  const id = authData?.loginResponse?.id || localStorage.getItem('loginUserId');
  const tokenFromStorage = localStorage.getItem("accessToken");
  const userId = localStorage.getItem("loginUserId");

  const baseURL = process.env.REACT_APP_API_BASE_URL || "https://apptbackend.cercus.app";

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${tokenFromStorage}`,
          },
        };

        const response =
          (await axios.get(`${baseURL}/get-appointments/?id=${id}`, config)) ||
          (await axios.get(`${baseURL}/get-appointments/?id=${userId}`, config));
        const fetchedAppointments = response.data;

        const mappedAppointments = fetchedAppointments.flatMap((appt) =>
          appt.sessions.map((session) => ({
            id: `${appt.id}-${session.session_no}`,
            title: `${appt.appointment_title} (Session ${session.session_no})`,
            start: moment(`${session.session_date}T${session.start_time}`).toDate(),
            end: moment(`${session.session_date}T${session.end_time}`).toDate(),
            appointment_location: appt.appointment_location,
            tatto_idea: appt.tatto_idea,
            client: appt.user,
            owner: appt.assigned_user,
            referenceImages: appt.reference_images
          }))
        );

        setEvents(mappedAppointments);
        setFilteredEvents(mappedAppointments); // Initialize filtered events
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [id, userId, tokenFromStorage, baseURL]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = events.filter((event) =>
      event.title.toLowerCase().includes(query)
    );
    setFilteredEvents(filtered);
  };

  const handleNavigate = (date) => {
    setCurrentDate(date);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const eventRenderer = ({ event }) => (
    <div
      className="custom-event"
      onClick={(e) => {
        e.stopPropagation();
        handleEventClick(event);
      }}
      key={event.id}
      // style={{ cursor: "pointer", position: "relative", zIndex: 999 }}
      style={{
        cursor: "pointer",
        position: "relative",
               zIndex: 999,
               display: "flex",
               flexDirection: "column", // Ensure time is above the title
               justifyContent:'center',
               alignItems: "flex-start",
             }}
    >
      <div className="event-title">{event.title}</div>
      <div className="event-time">
        {/* {moment(event.start).format("hh:mm A")} - {moment(event.end).format("hh:mm A")} */}
        {moment(event.start).format("hh:mm A")}
      </div>
    </div>
  );


  // const eventRenderer = ({ event }) => (
  //   <div
  //     className="custom-event"
  //     onClick={(e) => {
  //       e.stopPropagation();
  //       handleEventClick(event);
  //     }}
  //     key={event.id}
  //     style={{
  //       cursor: "pointer",
  //       position: "relative",
  //       zIndex: 999,
  //       display: "flex",
  //       flexDirection: "column", // Ensure time is above the title
  //       alignItems: "flex-start",
  //     }}
  //   >
  //     <div className="event-time">
  //       {moment(event.start).format("hh:mm A")}
  //     </div>
  //     <div className="event-title">
  //       {event.title}
  //     </div>
  //   </div>
  // );
  

  const daysInMonth = moment(currentDate).daysInMonth();
  const monthYearLabel = moment(currentDate).format("MMMM YYYY");

  return (
    <div className="custom-calendar-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <button className="menu-button">☰</button>
          <h3>Calendar</h3>
        </div>

        <div className="date-section">
          <h4>{monthYearLabel}</h4>
          <div className="date-grid">
            <div>SUN</div>
            <div>MON</div>
            <div>TUE</div>
            <div>WED</div>
            <div>THU</div>
            <div>FRI</div>
            <div>SAT</div>
            {Array.from({ length: daysInMonth }, (_, i) => (
              <div
                key={i + 1}
                className={`date-item ${
                  i + 1 === moment(currentDate).date() ? "selected-date" : ""
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="calendar">
        {/* <div className="search-section">
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />
        </div> */}
        <Calendar
          localizer={localizer}
          events={filteredEvents} // Use filtered events
          startAccessor="start"
          endAccessor="end"
          views={["week"]}
          defaultView="week"
          // components={{
          //   event: eventRenderer,
          // }}

          components={{
            event: eventRenderer,
            toolbar: (props) => (
              <CustomToolbar
                {...props}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                showTable={showTable} 
                setShowTable={setShowTable}
              />
            ),
          }}
          onNavigate={handleNavigate}
          onSelectEvent={(event) => setSelectedEvent(event)}
        />
      </div>

      {/* {selectedEvent && (
        <ViewCalenderDetails
          appointment={JSON.stringify(selectedEvent)}
          onClose={() => setSelectedEvent(null)}
        />
      )} */}
      {selectedEvent && (
        <View
          appointment={JSON.stringify(selectedEvent)}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
};

export default CustomCalendar;


const CustomToolbar = ({ label, onView, onNavigate, searchQuery, setSearchQuery, showTable,setShowTable }) => {
  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  return (
    <div className="calendar-toolbar">
      <div className="toolbar-left">
        <button onClick={() => onNavigate("PREV")}>←</button>
        <span className="toolbar-label">{label}</span>
        <button onClick={() => onNavigate("NEXT")}>→</button>
      </div>
      <div className="toolbar-middle">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
        />
      </div>
      <div className="toolbar-right">
        {/* <button
          // onClick={() => onView("list")}

          className="list-view-button"
        >
          List
        </button> */}
        <button className="list-view-button" 
           onClick={() => { setShowTable(!showTable) }}> 
            {showTable ? "Calender" : "List"} 
          </button>

        <button
          onClick={() => {
            localStorage.removeItem("accessToken"); // Clear token
            localStorage.removeItem("loginUserId"); // Clear userId
            window.location.href = "/login"; // Redirect to login page
          }}
          className="logout-button"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

