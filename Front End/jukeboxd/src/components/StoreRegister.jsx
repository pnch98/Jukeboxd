import { useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { storeRegister } from "../redux/actions/storeAuthActions";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

function StoreRegister() {
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

	const handleRegister = (e) => {
		e.preventDefault();
		const name = e.target[0].value;
		const lastName = e.target[1].value;
		const email = e.target[2].value;
		const password = e.target[3].value;

		dispatch(storeRegister(name, lastName, email, password))
			.then(() => {
				toast.success("Account created successfully. Please log in.");
				navigate("/store/login");
			})
			.catch((error) => {
				toast.error("Error during registration. " + error);
				console.error(error);
			});
	};

	return (
		<div className="jukeContainer mb-5">
			<div id="mainLogDiv" className="mb-5">
				<div id="reg">
					<div id="activeLogDiv" className="text-dark py-3 px-5 bg-white">
						<h4 className="display-5 text-center">Create account</h4>
						<Form onSubmit={handleRegister}>
							<div className="d-flex flex-column justify-content-between align-items-center">
								<div>
									<div className="d-flex justify-content-between">
										<div className="me-2">
											<Form.Group className="mb-2" controlId="formBasicName">
												<Form.Label>Name</Form.Label>
												<Form.Control type="text" placeholder="Enter name" required />
											</Form.Group>
										</div>
										<div>
											<Form.Group className="mb-2" controlId="formBasicLastName">
												<Form.Label>Last Name</Form.Label>
												<Form.Control type="text" placeholder="Enter last name" required />
											</Form.Group>
										</div>
									</div>
									<Form.Group className="mb-2" controlId="formBasicEmail">
										<Form.Label>Email address</Form.Label>
										<Form.Control type="email" placeholder="Enter email" required />
									</Form.Group>
									<Form.Group className="mb-2" controlId="formBasicPassword">
										<Form.Label>Password</Form.Label>
										<Form.Control type="password" placeholder="Password" required />
									</Form.Group>
								</div>
								<Button variant="outline-dark" type="submit">
									Register
								</Button>
							</div>
						</Form>
					</div>
					<div
						id="inactiveLogDiv"
						className="d-flex align-items-center justify-content-center storeBgGradient py-3 px-3"
					>
						<div className="d-flex flex-column align-items-center">
							<h4 className="display-5 text-center mb-3">Already registered?</h4>
							<Button variant="outline-light" onClick={() => navigate("/store/login")}>
								Sign In
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default StoreRegister;
