import { baseUrl } from "../../functions/config";
import { fetchWithAuth } from "../../functions/interceptor";

export const fetchHomeData = async () => {
	try {
		const response = await fetchWithAuth(baseUrl + "browse/new-releases", {
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
