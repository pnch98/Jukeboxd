import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	saved: [],
	loading: false,
};

const savedReducer = createSlice({
	name: "saved",
	initialState,
	reducers: {
		setSaved: (state, action) => {
			state.saved = action.payload;
		},
		setLoading: (state, action) => {
			state.loading = action.payload;
		},
	},
});

export const { setSaved, setLoading } = savedReducer.actions;
export default savedReducer.reducer;
