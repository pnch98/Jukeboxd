import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEvent } from "../redux/actions/eventActions";
import { useCallback } from "react";
import { Button, Col, Row } from "react-bootstrap";
import EventCard from "./EventCard";
import { buyTicket } from "../redux/actions/ticketActions";
import { useSelector } from "react-redux";
import { stripePk } from "../functions/config";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";

function EventDetailsPage() {
	const { eventId } = useParams();
	const [event, setEvent] = useState(null);
	const userData = useSelector((state) => state.storeUser.userData);
	const stripePromise = loadStripe(stripePk);

	useEffect(() => {
		const root = document.querySelector("#root");
		root.style.backgroundColor = "rgba(230, 230, 230, 0.7)";

		return () => {
			root.style.backgroundColor = "";
		};
	}, []);

	const fetchEvent = useCallback(async () => {
		getEvent(eventId).then((data) => {
			setEvent(data);
		});
	}, [eventId]);

	useEffect(() => {
		if (eventId) {
			fetchEvent();
		}
	}, [eventId, fetchEvent]);

	const handleBuyTicket = async () => {
		if (!userData || !userData.token) {
			toast.info("Sign in to complete the purchase");
		} else {
			const ticket = {
				EventId: event.event.id,
				Price: event.event.price,
				UserId: userData.id,
			};

			const orderData = await buyTicket(ticket);
			const stripe = await stripePromise;

			const result = await stripe.redirectToCheckout({
				sessionId: orderData.sessionId,
			});

			if (result.error) {
				// If redirectToCheckout fails due to a browser or network
				// error, display the localized error message to your customer.
				console.log(result.error.message);
			}
		}
	};

	return (
		<div className="jukeContainer text-dark mb-5">
			{event ? (
				<>
					<div id="eventDetailsDiv" className="d-flex flex-column flex-sm-row mb-5">
						<div id="outerEventImgDiv" className="d-flex justify-content-center">
							<div className="rounded" style={{ width: "300px" }}>
								<img src={event.event.artist.image} className="img-fluid rounded" />
							</div>
						</div>
						<div className="d-flex flex-column justify-content-between">
							<div>
								<h4 className="fw-light">
									{new Date(event.event.date).toLocaleString("eng", {
										month: "short",
										day: "numeric",
										year: "numeric",
										hour: "2-digit",
										minute: "2-digit",
									})}
								</h4>
								<h3 className="display-5">{event.event.artist.name}</h3>
								<h4 className="fw-light">{event.event.city}</h4>
								<h4 className="fw-light">{event.event.venue}</h4>
							</div>
							<div>
								<p className="font-monospace mb-0">Price: ${event.event.price}</p>
								{event.event.isSoldOut ? (
									<p className="bg-danger p-2 text-white mb-0">Sold Out</p>
								) : (
									<Button className="eventButton" onClick={handleBuyTicket}>
										Buy Ticket
									</Button>
								)}
							</div>
						</div>
					</div>
					<hr />
					<Row xs={1} className="gy-2 mb-5">
						<h2 className="fw-light">Other {event.event.artist.name} events</h2>
						{event.otherEvents.map((event) => (
							<Col key={event.id}>
								<EventCard event={event} />
							</Col>
						))}
					</Row>
				</>
			) : (
				<h3 className="display-3 text-center">No artist found</h3>
			)}
		</div>
	);
}

export default EventDetailsPage;
