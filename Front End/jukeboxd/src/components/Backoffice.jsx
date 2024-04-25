import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import ProductsBackoffice from "./ProductsBackoffice";
import AdminsBackoffice from "./AdminsBackoffice";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import GeneralBackoffice from "./GeneralBackoffice";

function Backoffice() {
	const [active, setActive] = useState("General");
	const token = useSelector((state) => state.storeUser.userData.token);
	const navigate = useNavigate();

	useEffect(() => {
		if (!token) {
			navigate("/store");
		}
	}, [token, navigate]);

	useEffect(() => {
		const root = document.querySelector("#root");
		root.style.backgroundColor = "rgba(230, 230, 230, 0.7)";
		root.style.backgroundImage = "none";

		return () => {
			root.style.backgroundColor = "";
			root.style.backgroundImage = "";
		};
	}, []);

	const handleClick = (e) => {
		const option = e.target.tagName === "P" ? e.target.innerText : e.target.querySelector("p").innerText;
		setActive(option);
	};

	useEffect(() => {}, [active]);

	return (
		<div className="jukeContainer text-dark">
			<div>
				<h1 className="display-3 text-center">Backoffice</h1>
				<Row className="g-5">
					<Col xs={12}>
						<Row id="options" xs={3} className="gy-1">
							<Col
								className={active == "General" ? "activeOption py-2 mt-0" : "option py-2 mt-0"}
								onClick={handleClick}
							>
								<div className="text-white-50 d-flex align-items-center justify-content-center py-2">
									<p className="mb-0">General</p>
								</div>
							</Col>
							<Col
								className={active == "Products" ? "activeOption py-2 mt-0" : "option py-2 mt-0"}
								onClick={handleClick}
							>
								<div className="text-white-50 d-flex align-items-center justify-content-center py-2">
									<p className="mb-0">Products</p>
								</div>
							</Col>
							<Col className={active == "Admins" ? "activeOption py-2 mt-0" : "option py-2 mt-0"} onClick={handleClick}>
								<div className="text-white-50 d-flex align-items-center justify-content-center py-2">
									<p className="mb-0">Admins</p>
								</div>
							</Col>
						</Row>
					</Col>
					<Col>
						{active == "Products" && <ProductsBackoffice />}
						{active == "Admins" && <AdminsBackoffice />}
						{active == "General" && <GeneralBackoffice />}
					</Col>
				</Row>
			</div>
		</div>
	);
}

export default Backoffice;
