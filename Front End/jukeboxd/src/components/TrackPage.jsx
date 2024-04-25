import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchTrackData } from "../redux/actions/trackActions";

function TrackPage() {
	const { trackId } = useParams();
	const navigate = useNavigate();
	const [track, setTrack] = useState(null);
	const [loading, setLoading] = useState(false);

	const fetchTrack = async () => {
		setLoading(true);
		try {
			const response = await fetchTrackData(trackId);

			if (!response) {
				console.error("Invalid response from fetchAlbumData");
				return;
			}

			setTrack(response);
		} catch (error) {
			console.error("Error fetching album data:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (!trackId) {
			navigate("/");
		}

		fetchTrack();
	}, [trackId, navigate]);

	if (loading) {
		return <div>Loading...</div>;
	}

	if (!track) {
		return <div>No album data</div>;
	}

	return (
		<div>
			<h1>{track.name}</h1>
			<p>{track.artists.map((artist) => artist.name).join(", ")}</p>
			<p>{track.album.name}</p>
			<img src={track.album.images[0].url} alt={track.album.name} />
			<audio controls>
				<source src={track.preview_url} type="audio/mpeg" />
				Your browser does not support the audio element.
			</audio>
		</div>
	);
}

export default TrackPage;
