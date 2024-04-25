import { url } from "../../functions/config";
import { store } from "../store/store";
import { fetchAllProducts } from "./productActions";

export const addProduct = (product) => {
	return async (dispatch) => {
		const state = store.getState();
		const token = state.storeUser.userData.token;

		try {
			const response = await fetch(url + "Admin/products/addProduct", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + token,
				},
				body: JSON.stringify(product),
			});

			if (!response.ok) {
				const responseBody = await response.json();
				throw new Error(responseBody.message);
			}

			if (response.ok) {
				dispatch(fetchAllProducts());
			}

			return response.ok;
		} catch (error) {
			console.log(error);
		}
	};
};

export const editProduct = (product) => {
	return async (dispatch) => {
		const state = store.getState();
		const token = state.storeUser.userData.token;

		try {
			const response = await fetch(url + "Admin/products/editProduct/" + product.Id, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + token,
				},
				body: JSON.stringify(product),
			});

			if (!response.ok) {
				const responseBody = await response.json();
				throw new Error(responseBody.message);
			}

			if (response.ok) {
				dispatch(fetchAllProducts());
			}

			return response.ok;
		} catch (error) {
			console.log(error);
		}
	};
};

export const deleteProduct = (productId) => {
	return async (dispatch) => {
		const state = store.getState();
		const token = state.storeUser.userData.token;

		try {
			const response = await fetch(url + "Admin/products/deleteProduct/" + productId, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + token,
				},
			});

			if (!response.ok) {
				const responseBody = await response.json();
				throw new Error(responseBody.message);
			}

			if (response.ok) {
				dispatch(fetchAllProducts());
			}

			return response.ok;
		} catch (error) {
			console.log(error);
		}
	};
};

export const getAllAdmins = async () => {
	const state = store.getState();
	const token = state.storeUser.userData.token;

	try {
		const response = await fetch(url + "Admin/admins/getAllAdmins", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + token,
			},
		});

		if (!response.ok) {
			const responseBody = await response.json();
			throw new Error(responseBody.message);
		}

		const data = await response.json();

		return data;
	} catch (error) {
		console.log(error);
	}
};

export const getUsersByEmail = async (email) => {
	const state = store.getState();
	const token = state.storeUser.userData.token;

	try {
		const response = await fetch(url + "Admin/users/getUsersByEmail/" + email, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + token,
			},
		});

		if (!response.ok) {
			const responseBody = await response.json();
			throw new Error(responseBody.message);
		}

		const data = await response.json();

		return data;
	} catch (error) {
		console.log(error);
	}
};

export const makeAdmin = async (userId) => {
	const state = store.getState();
	const token = state.storeUser.userData.token;

	try {
		const response = await fetch(url + "Admin/users/makeAdmin/" + userId, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + token,
			},
		});

		if (!response.ok) {
			const responseBody = await response.json();
			throw new Error(responseBody.message);
		}

		return response.ok;
	} catch (error) {
		console.log(error);
	}
};

export const removeAdmin = async (userId) => {
	const state = store.getState();
	const token = state.storeUser.userData.token;

	try {
		const response = await fetch(url + "Admin/users/removeAdmin/" + userId, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + token,
			},
		});

		if (!response.ok) {
			const responseBody = await response.json();
			throw new Error(responseBody.message);
		}

		return response.ok;
	} catch (error) {
		console.log(error);
	}
};

export const getSalesStats = async () => {
	const state = store.getState();
	const token = state.storeUser.userData.token;

	try {
		const response = await fetch(url + "Admin/stats/getSalesStats", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + token,
			},
		});

		if (!response.ok) {
			const responseBody = await response.json();
			throw new Error(responseBody.message);
		}

		const data = await response.json();

		return data;
	} catch (error) {
		console.log(error);
	}
};
