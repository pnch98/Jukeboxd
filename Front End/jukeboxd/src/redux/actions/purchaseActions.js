import { url } from "../../functions/config";
import { store } from "../store/store";

export const sendOrder = async (order) => {
	const state = store.getState();
	const token = state.storeUser.userData.token;

	const response = await fetch(url + "Order/submitOrder", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer " + token,
		},
		body: JSON.stringify(order),
	});

	if (!response.ok) {
		const message = await response.text();
		throw new Error(message);
	}

	const data = await response.json();

	if (data.error) {
		throw new Error(data.error);
	}

	return data;
};
