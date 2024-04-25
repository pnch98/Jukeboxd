import PropTypes from "prop-types";
import { Col } from "react-bootstrap";
import { useState, useRef, useEffect } from "react";

let playingAudio = null; // Variable to store the audio element that is currently playing

function TrackCard({ track, currentPlayingId, setCurrentPlayingId, setPlayingRefs, playingRefs }) {
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
		<Col className="d-flex align-items-center rounded trackCard">
			<div className="h-100 p-1 me-1 position-relative" onClick={togglePlayPause}>
				<img
					src={track.album.images[0].url}
					alt={track.name}
					className="rounded h-100 trackimg"
					style={currentPlayingId === track.id && isPlayingRef.current ? { opacity: 0.6 } : {}}
				/>
				{currentPlayingId === track.id && isPlayingRef.current ? ( // Check if this track is the currently playing track
					<div className="pauseDiv">
						<div className="loader">
							<span className="bar"></span>
							<span className="bar"></span>
							<span className="bar"></span>
						</div>
					</div>
				) : (
					<div className="playDiv">
						<i className="bi bi-play-fill fs-2"></i>
					</div>
				)}
				<audio ref={audioRef} id="audio" className="d-none" controls src={track.preview_url}></audio>
			</div>
			<div className="d-flex flex-grow-1 justify-content-between p-1 ">
				<p id="trackName" className="mb-0">
					{track.name}
				</p>
				<div className="d-flex">
					{currentPlayingId === track.id &&
						isPlayingRef.current && ( // Check if this track is the currently playing track
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
					<p id="trackDuration" className="font-monospace text-white-50 mb-0">
						{Math.floor(track.duration_ms / 60000)}:{((track.duration_ms % 60000) / 1000).toFixed(0).padStart(2, "0")}
					</p>
				</div>
			</div>
		</Col>
	);
}

TrackCard.propTypes = {
	track: PropTypes.shape({
		id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		duration_ms: PropTypes.number.isRequired,
		album: PropTypes.shape({
			images: PropTypes.arrayOf(
				PropTypes.shape({
					url: PropTypes.string.isRequired,
				})
			).isRequired,
		}).isRequired,
		preview_url: PropTypes.string,
	}).isRequired,
	currentPlayingId: PropTypes.string,
	setCurrentPlayingId: PropTypes.func.isRequired,
	setPlayingRefs: PropTypes.func.isRequired,
	playingRefs: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default TrackCard;
