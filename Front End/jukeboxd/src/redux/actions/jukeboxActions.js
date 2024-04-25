import { url } from "../../functions/config";
import { setJukebox } from "../reducers/jukeboxReducer";
import { store } from "../store/store";

export const fetchJukebox = async (dispatch) => {
	const state = store.getState();
	const userId = state.profile.loggedProfile.id;

	let response = await getAllJukebox(userId);

	dispatch(setJukebox(response));
};

export const getAllJukebox = async (userId) => {
	try {
		const response = await fetch(url + `Jukebox/getAllJukebox/${userId}`, {
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

export const getJukeboxAlbums = async () => {
	const state = store.getState();
	const userId = state.profile.loggedProfile.id;

	try {
		const response = await fetch(url + `Album/getJukeboxAlbums/${userId}`, {
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

export const getMonthlyJukeboxData = async () => {
	const state = store.getState();
	const userId = state.profile.loggedProfile.id;

	try {
		const response = await fetch(url + `Jukebox/getMonthlyJukeboxData/${userId}`, {
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

export const getWeeklyJukeboxData = async () => {
	const state = store.getState();
	const userId = state.profile.loggedProfile.id;

	try {
		const response = await fetch(url + `Jukebox/getWeeklyJukeboxData/${userId}`, {
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

export const getTotalHoursListened = async () => {
	const state = store.getState();
	const userId = state.profile.loggedProfile.id;

	try {
		const response = await fetch(url + `Jukebox/getTotalHoursListened/${userId}`, {
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

export const getWeeklyHoursListened = async () => {
	const state = store.getState();
	const userId = state.profile.loggedProfile.id;

	try {
		const response = await fetch(url + `Jukebox/getWeeklyHoursListened/${userId}`, {
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

export const getWeeklyJukeboxCount = async () => {
	const state = store.getState();
	const userId = state.profile.loggedProfile.id;

	try {
		const response = await fetch(url + `Jukebox/getWeeklyJukeboxCount/${userId}`, {
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
