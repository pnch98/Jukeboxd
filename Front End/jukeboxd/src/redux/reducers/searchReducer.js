import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	searchResults: [],
	loading: false,
};

const searchReducer = createSlice({
	name: "searchReducer",
	initialState,
	reducers: {
		setSearchResults: (state, action) => {
			state.searchResults = action.payload;
		},
		setLoading: (state, action) => {
			state.loading = action.payload;
		},
	},
});

export const { setSearchResults, setLoading } = searchReducer.actions;
export default searchReducer.reducer;
