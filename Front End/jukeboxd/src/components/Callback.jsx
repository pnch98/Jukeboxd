import { useEffect, useCallback, useState } from "react";
import { fetchAndSetUser, fetchToken } from "../redux/actions/auth";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setToken, setRefreshToken, setExpireAt } from "../redux/reducers/profileReducer";
import { selectExpiresAt } from "../redux/selectors";

function Callback() {
	const [loading, setLoading] = useState(true);
	const dispatch = useDispatch();
	const expiresAt = useSelector(selectExpiresAt);
	const navigate = useNavigate();

	// Define sendFetch inside a useCallback to prevent unnecessary re-renders
	const sendFetch = useCallback(
		async (code, state) => {
			const response = await fetchToken(code, state);

			const expiresAt = new Date().getTime() + response.expires_in * 1000;

			dispatch(setToken(response.access_token));
			dispatch(setRefreshToken(response.refresh_token));
			dispatch(setExpireAt(expiresAt));

			dispatch(fetchAndSetUser());

			navigate("/");
			setLoading(false); // Set loading back to false after the fetch is complete
		},
		[dispatch, navigate]
	);

	useEffect(() => {
		const url = new URL(window.location.href);
		const code = url.searchParams.get("code");
		const state = url.searchParams.get("state");

		if (code && state) {
			setLoading(true); // Set loading to true before starting the fetch
			sendFetch(code, state);
		}
		if (!loading) {
			if (expiresAt && expiresAt > new Date().getTime()) {
				navigate("/home");
			}
			if (expiresAt && expiresAt < new Date().getTime()) {
				navigate("/login");
			}
		}
	}, [expiresAt, sendFetch, navigate, loading]);

	return <div>Callback</div>;
}

export default Callback;
