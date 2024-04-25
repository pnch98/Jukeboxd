import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import AlbumCardOpen from "./AlbumCardOpen";
import { IoMusicalNotesOutline, IoMusicalNotes } from "react-icons/io5";
import PropTypes from "prop-types";
import { addReview } from "../redux/actions/reviewActions";

function ReviewModal({ album, handleClose }) {
	const [hoverRating, setHoverRating] = useState(0);
	const [rating, setRating] = useState(0);

	const handleMouseOver = (index) => {
		setHoverRating(index + 1);
	};

	const handleMouseOut = () => {
		setHoverRating(0);
	};

	const handleClick = (index) => {
		setRating(index + 1);
	};

	const handleSubmit = () => {
		const reviewObj = {
			AlbumId: album.id,
			Rating: rating,
			Comment: document.querySelector("textarea").value,
		};

		addReview(reviewObj);
		handleClose();
	};

	return (
		<>
			<Modal.Body>
				<div>
					<div>
						<AlbumCardOpen album={album} />
					</div>
					<div className="text-center mb-3">
						<h3>Leave a Review</h3>
						<div className="mb-3">
							{Array.from({ length: 5 }, (_, i) => (
								<span
									key={i}
									onMouseOver={() => handleMouseOver(i)}
									onMouseOut={handleMouseOut}
									onClick={() => handleClick(i)}
								>
									{hoverRating > i || rating > i ? <IoMusicalNotes /> : <IoMusicalNotesOutline />}
								</span>
							))}
						</div>
						<textarea className="form-control mb-3" rows="3" placeholder="Write your review here..."></textarea>
					</div>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={handleClose}>
					Close
				</Button>
				<Button className="jukeBtnPrime" onClick={handleSubmit}>
					Submit
				</Button>
			</Modal.Footer>
		</>
	);
}

ReviewModal.propTypes = {
	album: PropTypes.shape({
		id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
	}).isRequired,
	handleClose: PropTypes.func.isRequired,
};

export default ReviewModal;
