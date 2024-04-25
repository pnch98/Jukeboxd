import { toast } from "react-toastify";
import { url } from "../../functions/config";
import { setUserData } from "../reducers/storeUserReducer";
import { store } from "../store/store";

export const storeRegister = (name, lastName, email, password) => {
	return async () => {
		try {
			const response = await fetch(url + "StoreAuth/registration", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name,
					lastName,
					email,
					password,
				}),
			});

			if (!response.ok) {
				const message = await response.text();
				throw new Error(message);
			}

			const data = await response.json();

			if (data.error) {
				throw new Error(data.error);
			}

			return Promise.resolve("ok");
		} catch (error) {
			return Promise.reject(error.message);
		}
	};
};

export const storeLogin = (email, password) => {
	return async (dispatch) => {
		try {
			const response = await fetch(url + "StoreAuth/authentication", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email,
					password,
				}),
			});

			if (!response.ok) {
				const message = await response.text();
				throw new Error(message);
			}

			const data = await response.json();

			if (data.error) {
				throw new Error(data.error);
			}

			dispatch(setUserData(data));

			toast.success("Login successful");
			return Promise.resolve("ok");
		} catch (error) {
			return Promise.reject(error.message);
		}
	};
};

export const updatePassword = (oldPassword, newPassword) => {
	return async () => {
		const state = store.getState();
		const token = state.storeUser.userData.token;

		try {
			const response = await fetch(url + "StoreUser/changePassword", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + token,
				},
				body: JSON.stringify({
					OldPassword: oldPassword,
					NewPassword: newPassword,
				}),
			});

			const message = await response.text();

			if (!response.ok) {
				throw new Error(message);
			}

			return Promise.resolve(message);
		} catch (error) {
			return Promise.reject(error.message);
		}
	};
};
