import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import profileReducer from "../reducers/profileReducer";
import expireReducer from "redux-persist-expire";
import searchReducer from "../reducers/searchReducer";
import discoveriesReducer from "../reducers/discoveriesReducer";
import savedReducer from "../reducers/savedReducer";
import jukeboxReducer from "../reducers/jukeboxReducer";
import storeReducer from "../reducers/storeReducer";
import storeUserReducer from "../reducers/storeUserReducer";
import eventReducer from "../reducers/eventReducer";

const persistConfig = {
	key: "root",
	storage,
	whitelist: ["profile", "discoveries", "saved", "jukebox", "search", "store", "storeUser"],

	transforms: [
		expireReducer("storeUser", {
			expireSeconds: 7 * 24 * 60 * 60, // 7 days
			expiredState: { userData: null },
			autoExpire: true,
		}),
	],
};

const rootReducer = combineReducers({
	profile: profileReducer,
	search: searchReducer,
	discoveries: discoveriesReducer,
	saved: savedReducer,
	jukebox: jukeboxReducer,
	store: storeReducer,
	storeUser: storeUserReducer,
	event: eventReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
