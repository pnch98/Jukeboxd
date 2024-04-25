import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	userData: {},
	cart: [],
};

const storeUserReducer = createSlice({
	name: "storeUser",
	initialState,
	reducers: {
		setUserData: (state, action) => {
			state.userData = action.payload;
		},
		addToCart: (state, action) => {
			const { product, quantity } = action.payload;
			const existingProduct = state.cart.find((item) => item.product.id === product.id);

			if (existingProduct) {
				existingProduct.quantity += quantity;
			} else {
				state.cart.push({ product, quantity });
			}
		},
		updateQuantity: (state, action) => {
			const { productId, quant } = action.payload;
			const product = state.cart.find((item) => item.product.id === productId);

			product.quantity += quant;

			if (product.quantity === 0) {
				state.cart = state.cart.filter((item) => item.product.id !== productId);
			}
		},
		removeFromCart: (state, action) => {
			const { productId } = action.payload;
			state.cart = state.cart.filter((item) => item.product.id !== productId);
		},
		clearCart: (state) => {
			state.cart = [];
		},
	},
});

export const { setUserData, addToCart, updateQuantity, removeFromCart, clearCart } = storeUserReducer.actions;
export default storeUserReducer.reducer;
