import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearCart } from "../redux/reducers/storeUserReducer";

function PurchaseSuccess() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		const root = document.querySelector("#root");
		root.style.backgroundColor = "rgba(230, 230, 230, 0.7)";
		root.style.backgroundImage = "none";
	}, []);

	useEffect(() => {
		dispatch(clearCart());

		setTimeout(() => {
			navigate("/store");
		}, 2000);
	}, [dispatch, navigate]);

	return (
		<div className="jukeContainer text-dark text-center">
			<h1 className="display-3 mt-3">
				<i className="bi bi-bag-check text-success"></i> Purchase completed!
			</h1>
			<h2 className="display-5">
				Redirecting you to <Link to={"/store"}>Store</Link>
			</h2>
		</div>
	);
}

export default PurchaseSuccess;
