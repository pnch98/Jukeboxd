import { url } from "../../functions/config";
import { store } from "../store/store";

export const buyTicket = async (ticket) => {
	const state = store.getState();
	const token = state.storeUser.userData.token;

	try {
		const response = await fetch(url + "Ticket/buyTicket", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(ticket),
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
	} catch (error) {
		console.error(error);
	}
};
