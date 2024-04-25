import { baseUrl, url } from "../../functions/config";
import { fetchWithAuth } from "../../functions/interceptor";
import { store } from "../store/store";

export const fetchAlbumData = async (albumId) => {
	try {
		const response = await fetchWithAuth(`${baseUrl}albums/${albumId}`, {
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

export const saveAlbum = async (album) => {
	try {
		const response = await fetch(url + "Album/saveAlbum", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(album),
		});

		if (!response.ok) {
			throw new Error("Server response was not ok");
		}

		return response.ok;
	} catch (error) {
		console.error(error);
	}
};

export const addToSaved = async (albumId) => {
	const state = store.getState();
	const userId = state.profile.loggedProfile.id;

	const savedObj = {
		UserId: userId,
		AlbumId: albumId,
	};

	try {
		const response = await fetch(url + "Saved/addAlbumToSaved", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(savedObj),
		});

		if (!response.ok) {
			throw new Error("Server response was not ok");
		}

		return response.ok;
	} catch (error) {
		console.error(error);
	}
};

export const addToJukebox = async (albumId) => {
	const state = store.getState();
	const userId = state.profile.loggedProfile.id;

	const jukeboxObj = {
		UserId: userId,
		AlbumId: albumId,
	};

	try {
		const response = await fetch(url + "Jukebox/addAlbumToJukebox", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(jukeboxObj),
		});

		if (!response.ok) {
			throw new Error("Server response was not ok");
		}

		return response.ok;
	} catch (error) {
		console.error(error);
	}
};

export const removeFromSaved = async (albumId) => {
	const state = store.getState();
	const userId = state.profile.loggedProfile.id;

	const savedObj = {
		UserId: userId,
		AlbumId: albumId,
	};

	try {
		const response = await fetch(url + "Saved/removeAlbumFromSaved", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(savedObj),
		});

		if (!response.ok) {
			throw new Error("Server response was not ok");
		}

		return response.ok;
	} catch (error) {
		console.error(error);
	}
};

export const removeFromJukebox = async (albumId) => {
	const state = store.getState();
	const userId = state.profile.loggedProfile.id;

	const jukeboxObj = {
		UserId: userId,
		AlbumId: albumId,
	};

	try {
		const response = await fetch(url + "Jukebox/removeAlbumFromJukebox", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(jukeboxObj),
		});

		if (!response.ok) {
			throw new Error("Server response was not ok");
		}

		return response.ok;
	} catch (error) {
		console.error(error);
	}
};

export const getRandomAlbums = async () => {
	try {
		const response = await fetch(url + "Album/getRandomAlbums", {
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
