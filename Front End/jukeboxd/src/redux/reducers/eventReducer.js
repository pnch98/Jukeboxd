import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	upcomingEvents: [],
	artistSearched: "",
	citySearched: "",
	searchEvents: [],
	eventError: null,
};

const eventReducer = createSlice({
	name: "eventReducer",
	initialState,
	reducers: {
		setUpcomingEvents: (state, action) => {
			state.upcomingEvents = action.payload;
		},
		setArtistSearched: (state, action) => {
			state.artistSearched = action.payload;
		},
		setCitySearched: (state, action) => {
			state.citySearched = action.payload;
		},
		setSearchEvents: (state, action) => {
			state.searchEvents = action.payload;
		},
		setEventError: (state, action) => {
			state.eventError = action.payload;
		},
	},
});

export const { setUpcomingEvents, setArtistSearched, setCitySearched, setSearchEvents, setEventError } =
	eventReducer.actions;
export default eventReducer.reducer;
