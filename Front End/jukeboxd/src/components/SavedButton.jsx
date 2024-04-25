import { Button } from "react-bootstrap";
import PropTypes from "prop-types";

function SavedButton({ saved, onSave, onRemoveSave }) {
	return saved ? (
		<Button variant="transparent" className="iconButton" onClick={onRemoveSave}>
			<i className="bi bi-clock-fill"></i>
		</Button>
	) : (
		<Button variant="transparent" className="iconButton" onClick={onSave}>
			<i className="bi bi-clock"></i>
		</Button>
	);
}

SavedButton.propTypes = {
	saved: PropTypes.bool.isRequired,
	onSave: PropTypes.func.isRequired,
	onRemoveSave: PropTypes.func.isRequired,
};

export default SavedButton;
