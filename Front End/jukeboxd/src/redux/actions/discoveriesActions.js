import { store } from "../store/store";
import { setDiscoveries } from "../reducers/discoveriesReducer";
import { url } from "../../functions/config";

export const fetchDiscoveries = async (dispatch) => {
	const state = store.getState();
	const userId = state.profile.loggedProfile.id;

	let response = await getAllDiscoveries(userId);

	dispatch(setDiscoveries(response));
};

export const getDiscoveredArtists = () => {
	return async (dispatch) => {
		const state = store.getState();
		const userId = state.profile.loggedProfile.id;

		try {
			const response = await fetch(url + `Artist/getDiscoveredArtists/${userId}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error("Server response was not ok");
			}
			const data = await response.json();

			dispatch(setDiscoveries(data));

			return data;
		} catch (error) {
			console.error(error);
		}
	};
};

export const getAllDiscoveries = async (userId) => {
	try {
		const response = await fetch(url + `Discover/getAllDiscoveries/${userId}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		const data = await response.json();

		return data;
	} catch (error) {
		console.error(error);
	}
};
