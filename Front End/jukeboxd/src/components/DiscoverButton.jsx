import { Button } from "react-bootstrap";
import PropTypes from "prop-types";

function DiscoverButton({ discovered, onDiscover, onRemoveDiscover }) {
	return discovered ? (
		<Button variant="transparent" className="iconButtonArt" onClick={onRemoveDiscover}>
			<i className="bi bi-eye-slash"></i>
		</Button>
	) : (
		<Button variant="transparent" className="iconButtonArt" onClick={onDiscover}>
			<i className="bi bi-eye"></i>
		</Button>
	);
}

DiscoverButton.propTypes = {
	discovered: PropTypes.bool.isRequired,
	onDiscover: PropTypes.func.isRequired,
	onRemoveDiscover: PropTypes.func.isRequired,
};

export default DiscoverButton;
