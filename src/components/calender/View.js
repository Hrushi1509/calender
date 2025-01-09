import React from "react";
import "./View.css"; // Add custom CSS for modal styling
import moment from "moment";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export const View = ({ appointment, onClose }) => {
    //   const event = JSON.parse(appointment); // Parse the JSON string back to an object
    const parsedAppointment = typeof appointment === 'string' ? JSON.parse(appointment) : appointment;

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
    const owner = parsedAppointment?.owner?.username || "N/A";
    const location = parsedAppointment?.appointment_location || "N/A";
    const tattooIdea = parsedAppointment?.tatto_idea || "N/A";
    const startTime = parsedAppointment?.start ? new Date(parsedAppointment.start) : "N/A";
    const endTime = parsedAppointment?.end ? new Date(parsedAppointment.end) : "N/A";
    const referenceImages = parsedAppointment?.referenceImages || "N/A";

    // const convertReferenceImageURL = (url) => {
    //     if (url.startsWith("/media/")) {
    //         const decodedURL = decodeURIComponent(url.replace("/media/", ""));
    //         // Ensure the URL starts with "https://"
    //         if (decodedURL.startsWith("https:/") && !decodedURL.startsWith("https://")) {
    //             return decodedURL.replace("https:/", "https://");
    //         }
    //         return decodedURL;
    //     }
    //     return url;
    // };


    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };


    return (
        <div className="modal-overlay">
            <div className="modal-content-view">
                <button className="close-button" onClick={onClose}>
                    ×
                </button>

                <div className="modal-details">
                    <p className="modal-title">
                        <i className="fas fa-calendar-check"></i> 
                        <strong>Title:</strong> {title}
                    </p>
                    <p>
                        <i className="fas fa-user"></i>
                        <strong>Client:</strong> {client}
                    </p>
                    <p>
                        <i className="fas fa-clock"></i>
                        <strong>Time:</strong> {moment(startTime).format("hh:mm A")} -{" "}
                        {moment(endTime).format("hh:mm A")}
                    </p>
                    <p>
                        <i className="fas fa-calendar-alt"></i>
                        <strong>Date:</strong> {moment(startTime).format("MMMM DD, YYYY")}
                    </p>
                    <p>
                        <i className="fas fa-map-marker-alt"></i>
                        <strong>Location:</strong> {location}
                    </p>
                    <p>
                        <i className="fas fa-lightbulb"></i>
                        <strong>Tattoo Idea:</strong> {tattooIdea}
                    </p>

                    {/* Carousel for Reference Images */}
                    {/* {referenceImages.length > 0 && (

                        <div>
                            <strong>Reference Images:</strong>
                            <Slider {...settings}>
                                {referenceImages.map((image) => (
                                    <div key={image.id} className="carousel-slide">
                                        <img
                                            src={image.url}
                                            alt={`Reference ${image.id}`}
                                            className="reference-image"
                                        />
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    )} */}
                </div>

            </div>
        </div>
    );
};
