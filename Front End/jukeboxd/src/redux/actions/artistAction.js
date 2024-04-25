import { baseUrl, url } from "../../functions/config";
import { fetchWithAuth } from "../../functions/interceptor";
import { store } from "../store/store";

export const fetchArtistData = async (artistId) => {
	try {
		const response = await fetchWithAuth(`${baseUrl}artists/${artistId}`, {
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

export const saveArtist = async (artist) => {
	try {
		const response = await fetch(url + "Artist/saveArtist", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(artist),
		});

		if (!response.ok) {
			throw new Error("Server response was not ok");
		}

		return response.ok;
	} catch (error) {
		console.error(error);
	}
};

export const addToDiscover = async (artistId) => {
	const state = store.getState();
	const userId = state.profile.loggedProfile.id;

	const discoverObj = {
		UserId: userId,
		ArtistId: artistId,
	};

	try {
		const response = await fetch(url + "Discover/addArtistToDiscover", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(discoverObj),
		});

		if (!response.ok) {
			throw new Error("Server response was not ok");
		}

		return response.ok;
	} catch (error) {
		console.error(error);
		return false;
	}
};

export const removeFromDiscover = async (artistId) => {
	const state = store.getState();
	const userId = state.profile.loggedProfile.id;

	const discoverObj = {
		UserId: userId,
		ArtistId: artistId,
	};

	try {
		const response = await fetch(url + "Discover/removeArtistFromDiscover", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(discoverObj),
		});

		if (!response.ok) {
			throw new Error("Server response was not ok");
		}

		return response.ok;
	} catch (error) {
		console.error(error);
		return false;
	}
};

export const fetchArtistAlbums = async (artistId) => {
	try {
		const response = await fetchWithAuth(`${baseUrl}artists/${artistId}/albums`, {
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

export const fetchArtistTopTracks = async (artistId) => {
	try {
		const response = await fetchWithAuth(`${baseUrl}artists/${artistId}/top-tracks?market=US`, {
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

export const fetchSeveralArtists = async (artistIds) => {
	try {
		const response = await fetchWithAuth(`${baseUrl}artists?ids=${artistIds.join(",")}`, {
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
