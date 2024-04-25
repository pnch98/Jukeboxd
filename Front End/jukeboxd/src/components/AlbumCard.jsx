import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

function AlbumCard({ album, index, name }) {
	const navigate = useNavigate();

	const handleOver = (index) => {
		const openVinyl = document.querySelector(`#${index} .openVinyl`);

		openVinyl.style.transform = "translate(120%, -50%)";
	};

	const handleOut = (index) => {
		const openVinyl = document.querySelector(`#${index} .openVinyl`);

		openVinyl.style.transform = "translate(86.5%, -50%)";
	};

	return (
		<div
			className="d-flex flex-column justify-content-start align-items-start albumCardVinyl"
			onClick={() => {
				navigate("/album/" + album.id);
			}}
		>
			<div
				id={"div" + index}
				className="position-relative albumCardDiv"
				onMouseOver={() => handleOver("div" + index)}
				onMouseOut={() => handleOut("div" + index)}
			>
				<img src="/public/imgs/open2.png" className="h-100 openVinyl" />
				<img src="/public/imgs/cover1.png" className="position-absolute top-0 start-0 h-100" />
				<img src={album.images[0].url} className="vinylCover2" />
			</div>
			{name && (
				<h3 id="albumName2" className="ms-2">
					{album.name}
				</h3>
			)}
		</div>
	);
}

AlbumCard.propTypes = {
	album: PropTypes.shape({
		id: PropTypes.string.isRequired,
		images: PropTypes.arrayOf(
			PropTypes.shape({
				url: PropTypes.string.isRequired,
			})
		).isRequired,
		name: PropTypes.string.isRequired,
	}).isRequired,
	index: PropTypes.number.isRequired,
	name: PropTypes.bool,
};

export default AlbumCard;
