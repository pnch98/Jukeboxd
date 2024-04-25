import { createSelector } from "reselect";

const selectProfile = (state) => state.profile;

export const selectExpiresAt = createSelector([selectProfile], (profile) => profile.expiresAt);
export const selectToken = createSelector([selectProfile], (profile) => profile.token);
export const selectRefreshToken = createSelector([selectProfile], (profile) => profile.refreshToken);
export const selectLoggedProfile = createSelector([selectProfile], (profile) => profile.loggedProfile);
