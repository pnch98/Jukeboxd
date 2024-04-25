import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

function AlbumCardOpen({ album, name }) {
	const navigate = useNavigate();

	return (
		<div
			className="d-flex flex-column align-items-center justify-content-center albumCardVinyl"
			onClick={() => {
				navigate("/album/" + album.id);
			}}
		>
			<div className="position-relative">
				<img className="vinylCard" src="/public/imgs/open.webp" alt={album.name} width={400} />
				<img src={album.images[0].url} alt={album.name} className="vinylCover" />
			</div>
			{name && <h3 id="albumName2">{album.name}</h3>}
		</div>
	);
}

AlbumCardOpen.propTypes = {
	album: PropTypes.shape({
		id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		images: PropTypes.arrayOf(
			PropTypes.shape({
				url: PropTypes.string.isRequired,
			})
		).isRequired,
	}).isRequired,
	name: PropTypes.bool,
};

export default AlbumCardOpen;
