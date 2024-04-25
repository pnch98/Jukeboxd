import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	jukebox: [],
	loading: false,
};

const jukeboxReducer = createSlice({
	name: "jukebox",
	initialState,
	reducers: {
		setJukebox: (state, action) => {
			state.jukebox = action.payload;
		},
		setLoading: (state, action) => {
			state.loading = action.payload;
		},
	},
});

export const { setJukebox, setLoading } = jukeboxReducer.actions;
export default jukeboxReducer.reducer;
