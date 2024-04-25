import { url } from "../../functions/config";
import { setSearchEvents, setUpcomingEvents, setEventError } from "../reducers/eventReducer";

const UPCOMING_EVENTS_URL = `${url}Event/getUpcomingEvents`;
const SEARCH_EVENTS_URL = `${url}Event/searchEvents`;

export const getUpcomingEvents = () => {
	return async (dispatch) => {
		try {
			const response = await fetch(UPCOMING_EVENTS_URL, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await response.json();

			dispatch(setUpcomingEvents(data));
			return data;
		} catch (error) {
			console.error(error);
			dispatch(setEventError(error.toString()));
		}
	};
};

export const searchEvents = (artist, city) => {
	return async (dispatch) => {
		try {
			const response = await fetch(
				`${SEARCH_EVENTS_URL}?artistName=${encodeURIComponent(artist)}&city=${encodeURIComponent(city)}`
			);
			const data = await response.json();

			dispatch(setSearchEvents(data));
			return data;
		} catch (error) {
			console.error(error);
			dispatch(setEventError(error.toString()));
		}
	};
};
export const getEvent = async (eventId) => {
	try {
		const response = await fetch(url + `Event/getEvent/${eventId}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		if (!response.ok) {
			throw new Error("Server error");
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error(error);
	}
};
