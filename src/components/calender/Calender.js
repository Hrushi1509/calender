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

const CustomCalendar = ({ showTable, setShowTable }) => {
  // console.log(setShowTable,showTable)
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]); // Filtered events
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [currentDate, setCurrentDate] = useState(new Date());
  const { authData } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filterOption, setFilterOption] = useState("All");

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

        // const response =
        //   (await axios.get(`${baseURL}/get-appointments/?id=${id}`, config)) ||
        //   (await axios.get(`${baseURL}/get-appointments/?id=${userId}`, config));
        // const fetchedAppointments = response.data;

        let response;
        if (filterOption === "Completed") {
          // response = await axios.get(`${baseURL}/get-completed-upcoming-appointments/?status=completed`, config);
          response = await axios.get(`${baseURL}/get-completed-upcoming-appointments/?status=completed&id=${id}`);

        } else if (filterOption === "Upcoming") {
          // response = await axios.get(`${baseURL}/get-completed-upcoming-appointments/?status=upcoming`, config);
          response = await axios.get(`${baseURL}/get-completed-upcoming-appointments/?status=upcoming&id=${id}`);
          ;
        } else {
          response =
            (await axios.get(`${baseURL}/get-appointments/?id=${id}`, config)) ||
            (await axios.get(`${baseURL}/get-appointments/?id=${userId}`, config));
        }

        const fetchedAppointments = response.data;

        // const mappedAppointments = fetchedAppointments.flatMap((appt) =>
        //   appt?.sessions?.map((session) => ({
        //     id: `${appt?.id}-${session?.session_no}`,
        //     title: `${appt?.appointment_title} (Session ${session?.session_no})`,
        //     start: moment(`${session?.session_date}T${session?.start_time}`).toDate(),
        //     end: moment(`${session?.session_date}T${session?.end_time}`).toDate(),
        //     appointment_location: appt?.appointment_location,
        //     tatto_idea: appt?.tatto_idea,
        //     client: appt?.user,
        //     owner: appt?.assigned_user,
        //     referenceImages: appt?.reference_images
        //   }))
        // );



        const mappedAppointments = fetchedAppointments?.flatMap((appt) =>
          appt?.sessions?.map((session) => ({
            id: `${appt?.id}-${session?.session_no}`,
            // id: appt.id,
            title: `${appt?.appointment_title} (Session ${session?.session_no})`,
            start: moment(`${session?.session_date}T${session?.start_time}`).toDate(),
            end: moment(`${session?.session_date}T${session?.end_time}`).toDate(),
            owner: {
              id: appt.assigned_user?.id,
              username: appt.assigned_user?.username,
              email: appt.assigned_user?.email,
            },
            client: {
              id: appt.user?.id,
              username: appt.user?.username,
              email: appt.user?.email,
            },
            sessions: appt.sessions?.map((session) => ({
              id: session.id,
              start_time: session.start_time,
              end_time: session.end_time,
              session_date: session.session_date,
              session_no: session.session_no,
              appointment: session.appointment,
            })),
            // appointment_title: appt.appointment_title,
            appointment_location: appt?.appointment_location?.name,
            reference_images: appt?.reference_images,
            created_at: appt?.created_at,
            tatto_idea: appt?.tatto_idea,
            appointment_count: appt?.appointment_count,
            has_previous_tattoos: appt?.has_previous_tattoos,
            tattooed_at_certified_studios: appt?.tattooed_at_certified_studios,
            tattoo_style: appt?.tattoo_style,
            tattoo_body_part: appt?.tattoo_body_part,
            tattoo_size: appt?.tattoo_size,
            color_or_black_grey: appt?.color_or_black_grey,
            cover_up_or_rework: appt?.cover_up_or_rework,
            preferred_tattooer: appt?.preferred_tattooer,
            preferred_location: appt?.preferred_location,
            specific_dates: appt?.specific_dates,
            is_traveling: appt?.is_traveling,
            deposite_amount: appt?.deposite_amount,
            total_project_cost: appt?.total_project_cost,
          }))
        );




        setEvents(mappedAppointments);
        setFilteredEvents(mappedAppointments); // Initialize filtered events
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [filterOption, id, userId, tokenFromStorage, baseURL]);

  // const handleSearch = (letter) => {
  //   const query = letter.toLowerCase();
  //   setSearchQuery(query);

  //   const filtered = events.filter((event) =>
  //     event.title.toLowerCase().includes(query)
  //   );
  //   setFilteredEvents(filtered);
  // };

  const handleSearch = React.useCallback((letter) => {
    const query = letter.toLowerCase();
    setSearchQuery(query);

    const filtered = events.filter((event) =>
      event.title.toLowerCase().includes(query)
    );
    setFilteredEvents(filtered);
  }, [events]);

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
        justifyContent: 'center',
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

  const handleMonthChange = (offset) => {
    const newDate = moment(currentDate).add(offset, "months").toDate();
    setCurrentDate(newDate);
  };



  // console.log("CustomCalendar rendered");
  return (
    <div className="custom-calendar-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <button className="menu-button">☰</button>
          <h3>Calendar</h3>
        </div>

        <div className="date-section">
          <div className="month-navigation">
            <button onClick={() => handleMonthChange(-1)}>←</button> {/* Previous Month */}
            <h4>{monthYearLabel}</h4>
            <button onClick={() => handleMonthChange(1)}>→</button> {/* Next Month */}
          </div>
          <div className="date-grid">
            <div className="date-grid">
              <div>SUN</div>
              <div>MON</div>
              <div>TUE</div>
              <div>WED</div>
              <div>THU</div>
              <div>FRI</div>
              <div>SAT</div>
              {Array.from({ length: daysInMonth }, (_, i) => {
                const date = moment(currentDate).date(i + 1).toDate(); // Calculate the specific date
                return (
                  <div
                    key={i + 1}
                    className={`date-item ${i + 1 === moment(currentDate).date() ? "selected-date" : ""
                      }`}
                    onClick={() => handleNavigate(date)} // Navigate to the selected date
                    style={{ cursor: "pointer" }}
                  >
                    {i + 1}
                  </div>
                );
              })}
            </div>
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
          date={currentDate}
          endAccessor="end"
          views={["week"]}
          defaultView="week"
          currentTimeIndicator={true}
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
                onSearch={handleSearch}
                filterOption={filterOption}
                setFilterOption={setFilterOption}
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


const CustomToolbar = React.memo(({ label, onView, onSearch, onNavigate, searchQuery, setSearchQuery, filterOption, setFilterOption, showTable, setShowTable }) => {

  const handleSearch = (e) => {
    if (!e || !e.target) {
      return;
    }
    onSearch(e.target.value);
  };

  const handleToday = () => {
    onNavigate("TODAY");
  };

  const handleFilterChange = (e) => {
    setFilterOption(e.target.value);
  };

  return (
    <div className="calendar-toolbar">
      <button onClick={handleToday} className="today-button">
        Today
      </button>
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
        <select
          className="filter-dropdown"
          onChange={handleFilterChange}
          value={filterOption}
        >
          <option value="All">All</option>
          <option value="Completed">Completed</option>
          <option value="Upcoming">Upcoming</option>
        </select>
      </div>
      <div className="toolbar-right">
        <button className="list-view-button"
          onClick={() => { setShowTable(!showTable) }}>
          {showTable ? "Calender" : "List"}
        </button>

        <button
          onClick={() => {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("loginUserId");
            window.location.href = "/login";
          }}
          className="logout-button"
        >
          Logout
        </button>
      </div>
    </div>
  );
});




