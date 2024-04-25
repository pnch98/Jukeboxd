import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	loggedProfile: {
		id: null,
		displayName: null,
		email: null,
	},
	token: null,
	refreshToken: null,
	expiresAt: null,
	discoveries: [],
};

const profileReducer = createSlice({
	name: "profileReducer",
	initialState,
	reducers: {
		setLoggedProfile: (state, action) => {
			state.loggedProfile = action.payload;
		},
		setToken: (state, action) => {
			state.token = action.payload;
		},
		setRefreshToken: (state, action) => {
			state.refreshToken = action.payload;
		},
		setExpireAt: (state, action) => {
			state.expiresAt = action.payload;
		},
	},
});

export const { setLoggedProfile, setToken, setRefreshToken, setExpireAt } = profileReducer.actions;
export default profileReducer.reducer;
