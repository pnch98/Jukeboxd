import { url } from "../../functions/config";
import { store } from "../store/store";

export const saveVisited = async (artistId) => {
	const state = store.getState();
	const userId = state.profile.loggedProfile.id;

	const newVisited = {
		UserId: userId,
		ArtistId: artistId,
	};

	try {
		await fetch(url + "Visited/saveVisited", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newVisited),
		});
	} catch (error) {
		console.log(error);
	}
};

export const getVisitedArtists = async () => {
	const state = store.getState();
	const userId = state.profile.loggedProfile.id;

	try {
		const response = await fetch(url + `Visited/getVisitedArtists/${userId}`, {
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
