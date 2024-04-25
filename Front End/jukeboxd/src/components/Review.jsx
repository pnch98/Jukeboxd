import PropTypes from "prop-types";
import { IoMusicalNotes, IoMusicalNotesOutline } from "react-icons/io5";

function Review({ review }) {
	return (
		<div className="reviewDiv mb-3 border border-secondary border-bottom-0 border-end-0 border-start-0 p-2 basicFs">
			<div className="d-flex ">
				<p className="text-white-50 mb-2 me-2">
					Reviewd by <span className="text-white">{review.username}</span>
				</p>
				<div>
					{Array.from({ length: Math.floor(review.rating) }, (_, i) => (
						<IoMusicalNotes key={i} />
					))}
					{Array.from({ length: 5 - Math.ceil(review.rating) }, (_, i) => (
						<IoMusicalNotesOutline key={i} />
					))}
				</div>
			</div>
			<p className="mb-0 ms-2">{review.comment}</p>
		</div>
	);
}

Review.propTypes = {
	review: PropTypes.shape({
		username: PropTypes.string.isRequired,
		rating: PropTypes.number.isRequired,
		comment: PropTypes.string.isRequired,
	}).isRequired,
};

export default Review;
