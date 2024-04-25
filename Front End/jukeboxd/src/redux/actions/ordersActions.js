import { url } from "../../functions/config";
import { store } from "../store/store";

export const getOrders = async () => {
	const state = store.getState();
	const token = state.storeUser.userData.token;

	try {
		const response = await fetch(url + "Order/getOrders", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		if (!response.ok) {
			throw new Error(data.error);
		}

		const data = await response.json();

		return data;
	} catch (error) {
		return error.message;
	}
};
