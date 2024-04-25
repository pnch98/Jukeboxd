// JukeboxAlbumButton.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToJukebox, removeFromJukebox, saveAlbum } from "../redux/actions/albumActions";
import JukeboxButton from "./JukeboxButton";
import PropTypes from "prop-types";
import { fetchJukebox } from "../redux/actions/jukeboxActions";

function JukeboxAlbumButton({ albumId, album }) {
	const [inJukebox, setInJukebox] = useState(false);
	const jukebox = useSelector((state) => state.jukebox.jukebox);
	const dispatch = useDispatch();

	useEffect(() => {
		const jukeboxAlbum = jukebox.find((item) => item.albumId === albumId);
		setInJukebox(!!jukeboxAlbum);
	}, [albumId, jukebox]);

	const handleAddToJukebox = async () => {
		const albumObj = {
			Id: album.id,
			Name: album.name,
			Image: album.images[0].url,
			Artist: album.artists[0].name,
			ReleaseDate: album.release_date,
			Popularity: album.popularity,
			Href: album.href,
			Duration: album.tracks.items.reduce((total, track) => total + track.duration_ms, 0),
		};
		await saveAlbum(albumObj);

		const response = await addToJukebox(album.id);
		if (response) {
			setInJukebox(true);
			dispatch(fetchJukebox);
		}
	};

	const handleRemoveFromJukebox = async () => {
		const response = await removeFromJukebox(album.id);
		if (response) {
			setInJukebox(false);
			dispatch(fetchJukebox);
		}
	};

	return <JukeboxButton added={inJukebox} onAdd={handleAddToJukebox} onRemove={handleRemoveFromJukebox} />;
}

JukeboxAlbumButton.propTypes = {
	albumId: PropTypes.string.isRequired,
	album: PropTypes.shape({
		id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		images: PropTypes.arrayOf(
			PropTypes.shape({
				url: PropTypes.string.isRequired,
			})
		).isRequired,
		artists: PropTypes.arrayOf(
			PropTypes.shape({
				name: PropTypes.string.isRequired,
			})
		).isRequired,
		release_date: PropTypes.string.isRequired,
		popularity: PropTypes.number.isRequired,
		href: PropTypes.string.isRequired,
		tracks: PropTypes.shape({
			items: PropTypes.arrayOf(
				PropTypes.shape({
					duration_ms: PropTypes.number.isRequired,
				})
			).isRequired,
		}).isRequired,
	}).isRequired,
};

export default JukeboxAlbumButton;
