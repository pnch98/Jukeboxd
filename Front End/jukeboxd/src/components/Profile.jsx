import { useEffect } from "react";
import { Button, Form, FormControl, FormLabel } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { updatePassword } from "../redux/actions/storeAuthActions";

function Profile() {
	const userData = useSelector((state) => state.storeUser.userData);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		const root = document.querySelector("#root");
		root.style.backgroundColor = "rgba(230, 230, 230, 0.7)";
		root.style.backgroundImage = "none";

		return () => {
			root.style.backgroundColor = "";
			root.style.backgroundImage = "";
		};
	}, []);

	useEffect(() => {
		if (!userData || !userData.token) {
			navigate("/store/login");
		}
	}, [navigate, userData]);

	const handleChangePassword = (e) => {
		e.preventDefault();
		const oldPassword = e.target[0].value;
		const newPassword = e.target[1].value;

		if (oldPassword == newPassword) {
			toast.error("Passwords can't match.");
			e.target[0].value = "";
			e.target[1].value = "";
			return;
		}

		dispatch(updatePassword(oldPassword, newPassword))
			.then(() => {
				toast.success("Password updated successfully.");
				e.target[0].value = "";
				e.target[1].value = "";
			})
			.catch((error) => {
				toast.error("Error updating password. " + error);
				e.target[0].value = "";
				e.target[1].value = "";
			});
	};

	return (
		userData &&
		userData.token && (
			<div className="jukeContainer text-dark">
				<div className="d-flex justify-content-center">
					<div className="d-flex flex-column">
						<h1 className="display-3 text-center mb-5">Profile</h1>
						<div id="profileInfo" className="border border-1 border-dark rounded p-3">
							<div className="d-flex mb-3">
								<div className="d-flex justify-content-between align-items-center me-4">
									<span className="me-3">Name:</span>
									<span className="rounded text-end">{userData.name}</span>
								</div>
								<div className="d-flex justify-content-between align-items-center">
									<span className="text-nowrap me-4">Last name:</span>
									<span className="rounded text-end">{userData.lastName}</span>
								</div>
							</div>
							<div className="d-flex align-items-center mb-3">
								<span className="me-3">Email:</span>
								<span className="rounded text-end">{userData.email}</span>
							</div>
							<div className="">
								<Form onSubmit={handleChangePassword}>
									<FormLabel>Change password:</FormLabel>
									<FormControl type="password" placeholder="Old password" className="mb-2" required />
									<FormControl type="password" placeholder="New password" className="mb-2" required />
									<div className="d-flex justify-content-center">
										<Button variant="outline-dark" type="submit" className="mt-3">
											Submit
										</Button>
									</div>
								</Form>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	);
}

export default Profile;
