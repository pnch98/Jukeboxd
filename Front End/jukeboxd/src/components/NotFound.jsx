import { useEffect } from "react";
import { Link } from "react-router-dom";

function NotFound() {
	useEffect(() => {
		const root = document.querySelector("#root");
		root.style.backgroundColor = "white";
		root.style.backgroundImage = "none";

		return () => {
			root.style.backgroundColor = "";
			root.style.backgroundImage = "";
		};
	}, []);

	return (
		<div className="d-flex flex-column align-items-center justify-content-center mt-5">
			<p className="display-2 text-dark">Page not found.</p>
			<Link to="/">Go back to home</Link>
		</div>
	);
}

export default NotFound;
