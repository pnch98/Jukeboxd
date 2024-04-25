import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	discoveries: [],
};

const discoveriesReducer = createSlice({
	name: "discoveriesReducer",
	initialState,
	reducers: {
		setDiscoveries: (state, action) => {
			state.discoveries = action.payload;
		},
	},
});

export const { setDiscoveries } = discoveriesReducer.actions;
export default discoveriesReducer.reducer;
