// SavedAlbumButton.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToSaved, removeFromSaved, saveAlbum } from "../redux/actions/albumActions";
import SavedButton from "./SavedButton";
import PropTypes from "prop-types";
import { fetchSaved } from "../redux/actions/savedActions";

function SavedAlbumButton({ albumId, album }) {
	const [saved, setSaved] = useState(false);
	const savedList = useSelector((state) => state.saved.saved);
	const dispatch = useDispatch();

	useEffect(() => {
		const savedAlbum = savedList.find((saved) => saved.albumId === albumId);
		setSaved(!!savedAlbum);
	}, [albumId, savedList]);

	const handleSave = async () => {
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

		const response = await addToSaved(album.id);
		if (response) {
			setSaved(true);
			dispatch(fetchSaved);
		}
	};

	const handleRemoveSave = async () => {
		const response = await removeFromSaved(album.id);
		if (response) {
			setSaved(false);
			dispatch(fetchSaved);
		}
	};

	return <SavedButton saved={saved} onSave={handleSave} onRemoveSave={handleRemoveSave} />;
}

SavedAlbumButton.propTypes = {
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

export default SavedAlbumButton;
