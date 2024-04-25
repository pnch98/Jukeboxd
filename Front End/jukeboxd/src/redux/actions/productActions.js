import { url } from "../../functions/config";
import { setProducts } from "../reducers/storeReducer";

export const fetchAllProducts = () => {
	return async (dispatch) => {
		try {
			const response = await fetch(url + "store/products/getAllProducts", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await response.json();

			dispatch(setProducts(data));
		} catch (error) {
			console.error(error);
		}
	};
};
