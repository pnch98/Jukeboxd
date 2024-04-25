// DiscoverArtistButton.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToDiscover, removeFromDiscover, saveArtist } from "../redux/actions/artistAction";
import DiscoverButton from "./DiscoverButton";
import PropTypes from "prop-types";
import { fetchDiscoveries } from "../redux/actions/discoveriesActions";

function DiscoverArtistButton({ artistId, artist }) {
	const [discovered, setDiscovered] = useState(false);
	const discoveries = useSelector((state) => state.discoveries.discoveries);
	const dispatch = useDispatch();

	useEffect(() => {
		if (discoveries) {
			const discoveredArtist = discoveries.find((discovery) => discovery.artistId === artistId);
			setDiscovered(!!discoveredArtist);
		}
	}, [artistId, discoveries]);

	const handleDiscover = async () => {
		const ArtistObj = {
			Id: artist.id,
			Name: artist.name,
			Href: artist.href,
			Image: artist.images[0].url,
			Popularity: artist.popularity,
			Followers: artist.followers.total,
			Genres: artist.genres,
		};
		saveArtist(ArtistObj);
		const response = await addToDiscover(artist.id);
		if (response) {
			setDiscovered(true);
			dispatch(fetchDiscoveries);
		}
	};

	const handleRemoveDiscover = async () => {
		const response = await removeFromDiscover(artist.id);
		if (response) {
			setDiscovered(false);
			dispatch(fetchDiscoveries);
		}
	};

	return <DiscoverButton discovered={discovered} onDiscover={handleDiscover} onRemoveDiscover={handleRemoveDiscover} />;
}

DiscoverArtistButton.propTypes = {
	artistId: PropTypes.string.isRequired,
	artist: PropTypes.shape({
		id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		href: PropTypes.string.isRequired,
		images: PropTypes.arrayOf(
			PropTypes.shape({
				url: PropTypes.string.isRequired,
			})
		).isRequired,
		popularity: PropTypes.number.isRequired,
		followers: PropTypes.shape({
			total: PropTypes.number.isRequired,
		}).isRequired,
		genres: PropTypes.arrayOf(PropTypes.string).isRequired,
	}).isRequired,
};

export default DiscoverArtistButton;
