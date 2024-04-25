import { url } from "../../functions/config";
import { store } from "../store/store";

export const getAlbumReviews = async (albumId) => {
	try {
		const response = await fetch(url + `Review/getReviews/${albumId}`, {
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

export const getAlbumRating = async (albumId) => {
	try {
		const response = await fetch(url + `Review/getAlbumRating/${albumId}`, {
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

export const getUserReview = async (albumId) => {
	const state = store.getState();
	const userId = state.profile.loggedProfile.id;
	try {
		const response = await fetch(url + `Review/getUserReview/${userId}/${albumId}`, {
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
export const getAllUserReviews = async () => {
	const state = store.getState();
	const userId = state.profile.loggedProfile.id;
	try {
		const response = await fetch(url + `Review/getUserReviews/${userId}`, {
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
export const addReview = async (review) => {
	const state = store.getState();
	const userId = state.profile.loggedProfile.id;

	review.UserId = userId;
	try {
		const response = await fetch(url + "Review/addReview", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(review),
		});

		if (!response.ok) {
			throw new Error("Server response was not ok");
		}

		return response.ok;
	} catch (error) {
		console.error(error);
	}
};
