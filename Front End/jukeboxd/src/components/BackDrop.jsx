import { useLocation } from "react-router-dom";

function BackDrop() {
	const location = useLocation();

	return (
		(location.pathname.startsWith("/album") || location.pathname.startsWith("/artist")) && <div id="backdrop"></div>
	);
}

export default BackDrop;
