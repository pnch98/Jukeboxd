import { baseUrl } from "../../functions/config";
import { fetchWithAuth } from "../../functions/interceptor";

export const fetchTrackData = async (trackId) => {
	try {
		const response = await fetchWithAuth(`${baseUrl}tracks/${trackId}`, {
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