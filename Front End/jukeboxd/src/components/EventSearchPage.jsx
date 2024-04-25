import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setArtistSearched, setCitySearched } from "../redux/reducers/eventReducer";
import { searchEvents } from "../redux/actions/eventActions";
import EventCard from "./EventCard";

function EventSearchPage() {
	const artistSearched = useSelector((state) => state.event.artistSearched);
	const citySearched = useSelector((state) => state.event.citySearched);
	const events = useSelector((state) => state.event.searchEvents);
	const [formArtist, setFormArtist] = useState(artistSearched);
	const [formCity, setFormCity] = useState(citySearched);
	const dispatch = useDispatch();

	useEffect(() => {
		const root = document.querySelector("#root");
		root.style.backgroundColor = "rgba(230, 230, 230, 0.7)";

		return () => {
			root.style.backgroundColor = "";
		};
	}, []);

	const handleSubmit = (event) => {
		event.preventDefault();
		dispatch(setArtistSearched(formArtist));
		dispatch(setCitySearched(formCity));
		dispatch(searchEvents(formArtist, formCity));
	};

	return (
		<div className="jukeContainer text-dark">
			<Form className="mb-5" onSubmit={handleSubmit}>
				<div className="d-flex justify-content-center align-items-center">
					<Form.Control
						type="text"
						placeholder="Search artist"
						className="w-50 me-2"
						value={formArtist}
						onChange={(e) => setFormArtist(e.target.value)}
					/>
					<Form.Control
						type="text"
						placeholder="City"
						className="w-25 me-2"
						value={formCity}
						onChange={(e) => setFormCity(e.target.value)}
					/>
					<Button type="submit" className="rounded-circle eventButton">
						<i className="bi bi-search"></i>
					</Button>
				</div>
			</Form>
			{events.length > 0 ? (
				<Row xs={1} className="gy-2">
					{events.map((event) => (
						<Col key={event.id}>
							<EventCard event={event} />
						</Col>
					))}
				</Row>
			) : (
				<h1 className="display-3 fst-italic text-center">No events found</h1>
			)}
		</div>
	);
}

export default EventSearchPage;
