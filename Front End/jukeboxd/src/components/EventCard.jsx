import { Button } from "react-bootstrap";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

function EventCard({ event }) {
	const date = new Date(event.date);
	const month = date.toLocaleString("eng", { month: "short" });
	const day = date.getDate();
	const navigate = useNavigate();

	return (
		<div className="d-flex justify-content-between align-items-center eventCard">
			<div className="d-flex">
				<div className="d-flex flex-column justify-content-center align-items-center eventDateDiv">
					<h4 className="mb-0">{month}</h4>
					<p className="mb-0">{day}</p>
				</div>
				<div className="eventInfoDiv pe-0">
					<h5>{event.artist.name}</h5>
					<p className="mb-0">{event.city}</p>
					<p className="mb-0">{event.venue}</p>
				</div>
			</div>
			<div className="eventButtonDiv">
				<Button className="eventButton" onClick={() => navigate("/events/event/" + event.id)}>
					See tickets
				</Button>
			</div>
		</div>
	);
}

EventCard.propTypes = {
	event: PropTypes.shape({
		id: PropTypes.number.isRequired,
		date: PropTypes.string.isRequired,
		city: PropTypes.string.isRequired,
		venue: PropTypes.string.isRequired,
		artist: PropTypes.shape({
			name: PropTypes.string.isRequired,
		}).isRequired,
	}).isRequired,
};

export default EventCard;
