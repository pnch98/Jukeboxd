import { baseUrl, url } from "../../functions/config";
import { fetchWithAuth } from "../../functions/interceptor";
import { setLoggedProfile } from "../reducers/profileReducer";

export const fetchAuth = async (state) => {
	try {
		const response = await fetch(url + "Auth/authenticate", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ state: state }),
		});
		const data = await response.json();

		window.location.assign(data.url);
	} catch (error) {
		console.error(error);
	}
};

export const fetchToken = async (code, state) => {
	try {
		const response = await fetch(url + "Auth/callback", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ code: code, state: state }),
		});
		const data = await response.json();

		return data;
	} catch (error) {
		console.error(error);
	}
};

export const fetchRefreshToken = async (refreshToken) => {
	try {
		const response = await fetch(url + "Auth/refresh", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ refreshToken: refreshToken }),
		});
		const data = await response.json();

		return data;
	} catch (error) {
		console.error(error);
	}
};

export const setUser = async (userData) => {
	const transformedUserData = {
		Id: userData.id,
		Username: userData.display_name,
		Email: userData.email,
		Image: userData.images.length > 0 ? userData.images[0].url : "",
	};

	const userResponse = await fetch(url + "Auth/setUser", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(transformedUserData),
	});

	if (!userResponse.ok) {
		throw new Error("Failed to create user");
	}
};

export const getUserData = async () => {
	const response = await fetchWithAuth(baseUrl + "me", {
		headers: {
			"Content-Type": "application/json",
		},
	});
	const userData = await response.json();

	return userData;
};

export const fetchAndSetUser = () => async (dispatch) => {
	const userData = await getUserData();
	dispatch(setLoggedProfile({ id: userData.id, displayName: userData.display_name, email: userData.email }));
	await setUser(userData);
};
