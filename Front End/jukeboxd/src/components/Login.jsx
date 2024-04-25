import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchAuth } from "../redux/actions/auth";
import { Button } from "react-bootstrap";

function Login() {
	const token = useSelector((state) => state.profile.token);
	const expiresAt = useSelector((state) => state.profile.expiresAt);
	const navigate = useNavigate();

	useEffect(() => {
		if (token && token !== "" && expiresAt && expiresAt > new Date().getTime()) {
			navigate("/");
		}
	}, [token, navigate, expiresAt]);

	const fetchData = () => {
		let state = "";
		while (state.length < 16) {
			state += Math.random().toString(36).slice(2);
		}
		state = state.slice(0, 16);

		fetchAuth(state);
	};

	return (
		<div id="loginPage" className="d-flex justify-content-center align-items-center">
			<div
				className="d-flex justify-content-center align-items-center py-4 px-2 rounded w-50"
				style={{ backgroundColor: "#0C1222", minHeight: "50%" }}
			>
				<div className="d-flex flex-column flex-md-row">
					<div className="d-flex align-items-center justify-content-center h-100">
						<img id="jukeLogo" src="/public/imgs/jukeLogoWhite.png" alt="Logo" />
					</div>

					<div className="d-flex flex-column align-items-center justify-content-center">
						<h2 id="login-h2" className="display-4 text-center fst-italic text-white mb-4">
							Listen. Save. Discover.
						</h2>

						<div className="d-flex justify-content-center align-items-center">
							<Button
								id="loginButton"
								onClick={fetchData}
								style={{ backgroundColor: "#1FDF64", color: "white" }}
								className="d-flex flex-column flex-md-row align-items-center"
							>
								<i className="bi bi-spotify basicTitleFs"></i>
								<p className="basicTitleFs mb-0">Login with Spotify</p>
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Login;
