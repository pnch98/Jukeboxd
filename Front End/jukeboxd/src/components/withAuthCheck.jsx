import { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchRefreshToken } from "../redux/actions/auth";
import { setToken, setExpireAt } from "../redux/reducers/profileReducer";

function withAuthCheck(Component) {
	return function AuthenticatedComponent(props) {
		const dispatch = useDispatch();
		const navigate = useNavigate();
		const token = useSelector((state) => state.profile.token);
		const expiresAt = useSelector((state) => state.profile.expiresAt);
		const refreshToken = useSelector((state) => state.profile.refreshToken);

		const fetchRefresh = useCallback(async () => {
			if (!refreshToken) {
				console.error("Refresh token is missing");
				return;
			}
			try {
				const response = await fetchRefreshToken(refreshToken);

				if (!response || !response.access_token || !response.expires_in) {
					console.error("Invalid response from fetchRefreshToken");
					return;
				}

				dispatch(setToken(response.access_token));
				dispatch(setExpireAt(new Date().getTime() + response.expires_in * 1000));
			} catch (error) {
				console.error("Error fetching refresh token:", error);
			}
		}, [dispatch, refreshToken]);

		useEffect(() => {
			if (!token && location.pathname !== "/login") {
				console.log("No token, redirecting to login");
				navigate("/login");
			}

			if (expiresAt && expiresAt < new Date().getTime()) {
				if (refreshToken) {
					console.log("Fetching refresh token");
					fetchRefresh();
				} else if (!refreshToken && location.pathname !== "/login") {
					console.log("No refresh token, redirecting to login");
					navigate("/login");
				}
			}
		}, [expiresAt, fetchRefresh, navigate, refreshToken, token]);

		return <Component {...props} />;
	};
}

export default withAuthCheck;
