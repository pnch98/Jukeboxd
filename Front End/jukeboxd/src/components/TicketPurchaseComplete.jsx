import { useEffect } from "react";
import { Link } from "react-router-dom";

function TicketPurchaseComplete() {
	useEffect(() => {
		const root = document.querySelector("#root");
		root.style.backgroundColor = "rgba(230, 230, 230, 0.7)";
		root.style.backgroundImage = "none";

		return () => {
			root.style.backgroundColor = "";
			root.style.backgroundImage = "";
		};
	});
	useEffect(() => {
		setTimeout(() => {
			window.location.href = "/events";
		}, 3000);
	});
	return (
		<div className="jukeContainer text-dark text-center">
			<h1 className="display-3 mt-3">
				<i className="bi bi-bag-check text-success"></i> Purchase completed!
			</h1>
			<h2 className="display-5">We sent you an email with the ticket details.</h2>
			<h2 className="display-5">
				Redirecting you to the <Link to={"/events"}>Event Page</Link>
			</h2>
		</div>
	);
}

export default TicketPurchaseComplete;
