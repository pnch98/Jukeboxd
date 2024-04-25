import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import img1 from "../../public/imgs/eventCard1.jpg";
import img2 from "../../public/imgs/eventCard2.jpg";
import img3 from "../../public/imgs/eventCard3.avif";
import img4 from "../../public/imgs/eventCard4.avif";
import { searchEvents, getUpcomingEvents } from "../redux/actions/eventActions";
import { useNavigate } from "react-router-dom";
import { setArtistSearched, setCitySearched } from "../redux/reducers/eventReducer";

function EventPage() {
	const [artist, setArtist] = useState("");
	const [city, setCity] = useState("");

	const images = [img1, img2, img3, img4];

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const upcomingEvents = useSelector((state) => state.event.upcomingEvents);

	useEffect(() => {
		const backdrop = document.querySelector("#eventBackdrop");
		const root = document.querySelector("#root");
		root.style.backgroundColor = "#192324";
		backdrop.style.backgroundImage = `url("/public/imgs/eventBg.png")`;
		backdrop.style.width = "100vw";
		backdrop.style.height = "100vh";

		return () => {
			backdrop.style.backgroundImage = "";
			backdrop.style.width = "0";
			backdrop.style.height = "0";
			root.style.backgroundColor = "";
		};
	}, []);

	useEffect(() => {
		if (upcomingEvents.length === 0) {
			dispatch(getUpcomingEvents());
		}
	}, [dispatch, upcomingEvents]);

	const handleSubmit = (event) => {
		event.preventDefault();
		dispatch(setArtistSearched(artist));
		dispatch(setCitySearched(city));
		dispatch(searchEvents(artist, city)).then(() => navigate("/events/search"));
	};

	return (
		<div className="d-flex justify-content-center align-items-center jukeContainer eventPageContent mb-5">
			<div className="mt-3">
				<h1 className="display-1 fst-italic text-white text-center mb-5">Feel the music. Live the experience.</h1>
				<Form onSubmit={handleSubmit} className="mb-5">
					<div className="d-flex justify-content-center align-items-center">
						<Form.Control
							type="text"
							placeholder="Search artist"
							className="w-50 me-2"
							value={artist}
							onChange={(e) => setArtist(e.target.value)}
						/>
						<Form.Control
							type="text"
							placeholder="City"
							className="w-25 me-2"
							value={city}
							onChange={(e) => setCity(e.target.value)}
						/>
						<Button type="submit" className="rounded-circle eventButton2">
							<i className="bi bi-search"></i>
						</Button>
					</div>
				</Form>
				{upcomingEvents.length > 0 ? (
					<div>
						<h3 className="fw-light ps-5 mt-5">Upcoming events</h3>
						<Row xs={1} md={2} xl={4} id="eventDiv" className="g-3 px-5 mb-5">
							{upcomingEvents.map((event, index) => (
								<Col
									key={event.id || index}
									className="d-flex flex-column align-items-center upcomingCard"
									onClick={() => navigate("/events/event/" + event.id)}
								>
									<div
										className="d-flex align-items-center justify-content-center rounded"
										style={{ width: "100%", height: "200px" }}
									>
										<img src={images[index]} alt="event" className="eventImg rounded" />
									</div>
									<div className="w-100">
										<p className="text-white mb-0">
											{event.city} - {event.venue}
										</p>
										<p className="text-white mb-0">
											{event.date.split("T")[0]} {event.date.split("T")[1]}
										</p>
										<p className="text-white-50 mb-0">{event.artist}</p>
									</div>
								</Col>
							))}
						</Row>
					</div>
				) : (
					<h2 className="text-white text-center">No upcoming events</h2>
				)}
			</div>
		</div>
	);
}

export default EventPage;
