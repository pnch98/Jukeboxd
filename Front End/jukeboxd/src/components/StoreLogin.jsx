import { useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { storeLogin } from "../redux/actions/storeAuthActions";
import { toast } from "react-toastify";

function StoreLogin() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const userData = useSelector((state) => state.storeUser.userData);

	useEffect(() => {
		if (userData && userData.token) {
			navigate("/store");
		}
	}, [navigate, userData]);

	useEffect(() => {
		const root = document.querySelector("#root");
		root.style.backgroundColor = "rgba(230, 230, 230, 0.7)";
		root.style.backgroundImage = "none";
	}, []);

	const handleLogin = (e) => {
		e.preventDefault();
		dispatch(storeLogin(e.target[0].value, e.target[1].value))
			.then(() => navigate("/store"))
			.catch((error) => {
				toast.error("Error during login. " + error);
			});
	};

	return (
		<div className="jukeContainer mb-5">
			<div id="mainLogDiv">
				<div id="log" className="w-100">
					<div id="activeLogDiv" className="text-dark py-3 px-5 bg-white">
						<h4 className="display-5 text-center ">Sign in</h4>
						<Form onSubmit={handleLogin}>
							<div className="d-flex flex-column justify-content-between">
								<div className="mb-4">
									<Form.Group className="mb-3" controlId="formBasicEmail">
										<Form.Label>Email address</Form.Label>
										<Form.Control type="email" placeholder="Enter email" />
									</Form.Group>
									<Form.Group controlId="formBasicPassword">
										<Form.Label>Password</Form.Label>
										<Form.Control type="password" placeholder="Password" />
									</Form.Group>
								</div>
								<div className="d-flex justify-content-center">
									<Button variant="outline-dark" type="submit">
										Login
									</Button>
								</div>
							</div>
						</Form>
					</div>
					<div
						id="inactiveLogDiv"
						className="d-flex align-items-center justify-content-center storeBgGradient py-3 px-3"
					>
						<div className="d-flex flex-column align-items-center">
							<h4 className="display-5 text-center mb-3">No account yet?</h4>
							<Button variant="outline-light" onClick={() => navigate("/store/register")}>
								Register
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default StoreLogin;
