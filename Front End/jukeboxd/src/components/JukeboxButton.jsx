import { Button } from "react-bootstrap";
import PropTypes from "prop-types";

function JukeboxButton({ added, onAdd, onRemove }) {
	return added ? (
		<Button variant="transparent" className="iconButton me-2" onClick={onRemove}>
			<i className="bi bi-box2-heart-fill"></i>
		</Button>
	) : (
		<Button variant="transparent" className="iconButton me-2" onClick={onAdd}>
			<i className="bi bi-box2-heart"></i>
		</Button>
	);
}

JukeboxButton.propTypes = {
	added: PropTypes.bool.isRequired,
	onAdd: PropTypes.func.isRequired,
	onRemove: PropTypes.func.isRequired,
};

export default JukeboxButton;
