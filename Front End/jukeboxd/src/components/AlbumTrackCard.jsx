import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

let playingAudio = null;

function AlbumTrackCard({ track, currentPlayingId, setCurrentPlayingId, setPlayingRefs, playingRefs }) {
	const isPlayingRef = useRef(false);
	const [volume, setVolume] = useState(0.2);
	const audioRef = useRef(null);

	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.volume = volume;
		}
	}, []);

	useEffect(() => {
		// Add the isPlayingRef to the list of refs when the component mounts
		setPlayingRefs((prevRefs) => [...prevRefs, isPlayingRef]);
		// Remove the isPlayingRef from the list of refs when the component unmounts
		return () => {
			setPlayingRefs((prevRefs) => prevRefs.filter((ref) => ref !== isPlayingRef));
		};
	}, []);

	const togglePlayPause = () => {
		const audio = audioRef.current;
		if (audio) {
			if (isPlayingRef.current) {
				audio.pause();
				isPlayingRef.current = false;
				setCurrentPlayingId(null); // Update the currently playing track id to null
			} else {
				if (playingAudio) {
					playingAudio.pause();
				}
				// Update all isPlayingRef.current values to false
				playingRefs.forEach((ref) => {
					ref.current = false;
				});
				audio.play();
				isPlayingRef.current = true;
				playingAudio = audio;
				setCurrentPlayingId(track.id); // Update the currently playing track id
			}
		}
	};

	const handleVolumeChange = (event) => {
		setVolume(event.target.value);
		if (audioRef.current) {
			audioRef.current.volume = volume;
		}
	};

	return (
		<div key={track.id} className="trackDiv basicFs py-2 py-sm-3" onClick={togglePlayPause}>
			<div className="d-flex align-items-center">
				<p className="mb-0">{track.name}</p>
				{currentPlayingId === track.id && isPlayingRef.current && (
					<div className="loader ms-3">
						<span className="bar"></span>
						<span className="bar"></span>
						<span className="bar"></span>
					</div>
				)}
			</div>
			<audio ref={audioRef} id="audio" className="d-none" controls src={track.preview_url}></audio>
			<div className="d-flex">
				{currentPlayingId === track.id && isPlayingRef.current && (
					<input
						type="range"
						min="0"
						max="1"
						step="0.01"
						value={volume}
						onChange={handleVolumeChange}
						className="me-3"
					/>
				)}
				<p className="mb-0">
					{Math.floor(track.duration_ms / 60000)}:{((track.duration_ms % 60000) / 1000).toFixed(0).padStart(2, "0")}
				</p>
			</div>
		</div>
	);
}

AlbumTrackCard.propTypes = {
	track: PropTypes.shape({
		id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		duration_ms: PropTypes.number.isRequired,
		preview_url: PropTypes.string,
	}).isRequired,
	currentPlayingId: PropTypes.string,
	setCurrentPlayingId: PropTypes.func.isRequired,
	setPlayingRefs: PropTypes.func.isRequired,
	playingRefs: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default AlbumTrackCard;
