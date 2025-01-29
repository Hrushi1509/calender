import React from "react";
import Slider from "react-slick";
import "./View.css"; // Add custom CSS for modal styling
import moment from "moment";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export const View = ({ appointment, onClose }) => {
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

    // const title = parsedAppointment?.title || "N/A";
    // const client = parsedAppointment?.client?.username || "N/A";
    // const owner = parsedAppointment?.owner?.username || "N/A";
    // const location = parsedAppointment?.appointment_location || "N/A";
    // const tattooIdea = parsedAppointment?.tatto_idea || "N/A";

    function capitalizeWords(inputStr) {
        // Split the input string by spaces
        const words = inputStr.split(" ");
    
        // Ensure the string has exactly two words
        if (words.length !== 2) {
            throw new Error("Input must be two words separated by a space.");
        }
    
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
    
    const title = parsedAppointment?.title;
    const client = parsedAppointment?.client?.username;
    const owner = formatAssignedUser(parsedAppointment?.owner?.username);
    const location = parsedAppointment?.appointment_location;
    const tattooIdea = parsedAppointment?.tatto_idea;
    
    const startTime = parsedAppointment?.start ? new Date(parsedAppointment?.start) : "N/A";
    const endTime = parsedAppointment?.end ? new Date(parsedAppointment?.end) : "N/A";

    const appointmentCount = parsedAppointment?.appointment_count ? parsedAppointment?.appointment_count : "N/A";
    const hasPreviousTattoos = parsedAppointment?.has_previous_tattoos ? parsedAppointment?.has_previous_tattoos : "N/A";
    const tattooedAtCertifiedStudios = parsedAppointment?.tattooed_at_certified_studios ? parsedAppointment?.tattooed_at_certified_studios : "N/A";
    const tattooStyle = parsedAppointment?.tattoo_style ? parsedAppointment?.tattoo_style : "N/A";
    const tattooBodyPart = parsedAppointment?.tattoo_body_part ? parsedAppointment?.tattoo_body_part : "N/A";
    const tattooSize = parsedAppointment?.tattoo_size ? parsedAppointment?.tattoo_size : "N/A";
    const colorOrBlackGrey = parsedAppointment?.color_or_black_grey ? parsedAppointment?.color_or_black_grey : "N/A";
    const coverUpOrRework = parsedAppointment?.cover_up_or_rework ? parsedAppointment?.cover_up_or_rework : "N/A";
    const preferredTattooer = parsedAppointment?.preferred_tattooer ? parsedAppointment?.preferred_tattooer : "N/A";
    const preferredLocation = parsedAppointment?.preferred_location ? parsedAppointment?.preferred_location : "N/A";



    const referenceImages = parsedAppointment?.referenceImages || [];

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

    const downloadImage = (url, fileName) => {
        fetch(url)
            .then((response) => response.blob()) // Fetch the image and convert it to a Blob
            .then((blob) => {
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob); // Create a temporary URL for the Blob
                link.download = fileName; // Set the desired file name
                document.body.appendChild(link); // Append the link to the DOM
                link.click(); // Trigger the download
                document.body.removeChild(link); // Clean up
            })
            .catch((error) => console.error('Download failed', error)); // Error handling
    };
    
    
    
    
    

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
                        <i className="fas fa-calendar-check"></i> {title}
                    </p>
                    <p>
                        <i className="fas fa-user"></i>
                        <strong>Client:</strong> {capitalizeWords(client)}
                    </p>
                    <p>
                        <i className="fas fa-user"></i>
                        <strong>Artist:</strong> {owner}
                    </p>
                    <p>
                        <i className="fas fa-calendar-alt"></i>
                        <strong>Date:</strong> {moment(startTime).format("MMMM DD, YYYY")}
                    </p>
                    <p>
                        <i className="fas fa-clock"></i>
                        <strong>Time:</strong> {moment(startTime).format("hh:mm A")} -{" "}
                        {moment(endTime).format("hh:mm A")}
                    </p>
                    <p>
                        <i className="fas fa-map-marker-alt"></i>
                        <strong>Location:</strong> {location}
                    </p>
                    <p>
                        <i className="fas fa-lightbulb"></i>
                        <strong>Tattoo Idea:</strong> {tattooIdea}
                    </p>
                    <p>
                        <i className="fas fa-lightbulb"></i>
                        <strong>Appointment Count:</strong> {appointmentCount}
                    </p>
                    <p>
                        <i className="fas fa-lightbulb"></i>
                        <strong>Has Previous Tattoos?:</strong> {hasPreviousTattoos}
                    </p>
                    <p>
                        <i className="fas fa-lightbulb"></i>
                        <strong>Tattooes At Certified Studios:</strong> {tattooedAtCertifiedStudios}
                    </p>
                    <p>
                        <i className="fas fa-lightbulb"></i>
                        <strong>Tattoo Style:</strong> {tattooStyle}
                    </p>
                    <p>
                        <i className="fas fa-lightbulb"></i>
                        <strong>Tattoo Body Part:</strong> {tattooBodyPart}
                    </p>
                    <p>
                        <i className="fas fa-lightbulb"></i>
                        <strong>Tattoo Size:</strong> {tattooSize}
                    </p>
                    <p>
                        <i className="fas fa-lightbulb"></i>
                        <strong>Color Or Black Grey:</strong> {colorOrBlackGrey}
                    </p>
                    <p>
                        <i className="fas fa-lightbulb"></i>
                        <strong>Cover Up Or Rework:</strong> {coverUpOrRework}
                    </p>
                    <p>
                        <i className="fas fa-lightbulb"></i>
                        <strong>Preferred Tattooer:</strong> {preferredTattooer}
                    </p>
                    <p>
                        <i className="fas fa-lightbulb"></i>
                        <strong>Preferred Location:</strong> {preferredLocation}
                    </p>

                    {/* Carousel for Reference Images */}
                    {referenceImages.length > 0 && (
                        <div>
                            <strong>Reference Images:</strong>
                            <Slider {...settings}>
                                {referenceImages.map((image) => (
                                    <div className="image-and-download">
                                        <div
                                            className="download-button"
                                            onClick={() => downloadImage(image.url, `reference-${image.id}.jpg`)}
                                        >
                                            <i className="fas fa-download download-icon"></i>
                                        </div>
                                        <div key={image.id} className="carousel-slide">
                                            <img
                                                src={image.url}
                                                alt={`Reference ${image.id}`}
                                                className="reference-image"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
