import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	products: [],
};

const storeReducer = createSlice({
	name: "store",
	initialState,
	reducers: {
		setProducts: (state, action) => {
			state.products = action.payload;
		},
	},
});

export const { setProducts } = storeReducer.actions;
export default storeReducer.reducer;
