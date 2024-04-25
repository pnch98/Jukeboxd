import { baseUrl } from "../../functions/config";
import { fetchWithAuth } from "../../functions/interceptor";
import { setLoading, setSearchResults } from "../reducers/searchReducer";

export const searchFetch = (query) => {
	return async (dispatch) => {
		try {
			dispatch(setLoading(true));

			const response = await fetchWithAuth(`${baseUrl}search?q=${query}&type=album,artist,track`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await response.json();

			dispatch(setSearchResults(data));
		} catch (error) {
			console.error(error);
		} finally {
			dispatch(setLoading(false));
		}
	};
};
