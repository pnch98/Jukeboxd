import { url } from "../../functions/config";
import { setSaved } from "../reducers/savedReducer";
import { store } from "../store/store";

export const fetchSaved = async (dispatch) => {
	const state = store.getState();
	const userId = state.profile.loggedProfile.id;

	let response = await getAllSaved(userId);

	dispatch(setSaved(response));
};

export const getAllSaved = async (userId) => {
	try {
		const response = await fetch(url + `Saved/getAllSaved/${userId}`, {
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

export const getSavedAlbums = () => {
	return async (dispatch) => {
		const state = store.getState();
		const userId = state.profile.loggedProfile.id;

		try {
			const response = await fetch(url + `Album/getSavedAlbums/${userId}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});

			const data = await response.json();

			dispatch(setSaved(data));

			return data;
		} catch (error) {
			console.error(error);
		}
	};
};
