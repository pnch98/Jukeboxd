// ArtistPage.jsx
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchArtistAlbums, fetchArtistData, fetchArtistTopTracks, saveArtist } from "../redux/actions/artistAction";
import withAuthCheck from "./withAuthCheck";
import DiscoverArtistButton from "./DiscoverArtistButton";
import TrackCard from "./TrackCard";
import { Row, Col } from "react-bootstrap";
import AlbumCardOpen from "./AlbumCardOpen";
import AlbumCard from "./AlbumCard";
import { saveVisited } from "../redux/actions/visitedActions";

function ArtistPage() {
	const { artistId } = useParams();
	const navigate = useNavigate();
	const [artist, setArtist] = useState(null);
	const [loading, setLoading] = useState(false);
	const [albums, setAlbums] = useState([]);
	const [topTracks, setTopTracks] = useState([]);
	const [currentPlayingId, setCurrentPlayingId] = useState(null);
	const [playingRefs, setPlayingRefs] = useState([]);
	const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

	useEffect(() => {
		const checkMobile = () => setIsMobile(window.innerWidth < 768);
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	const fetchArtist = useCallback(async () => {
		setLoading(true);
		try {
			const response = await fetchArtistData(artistId);
			if (response && response.name && response.images && response.genres && response.followers) {
				setArtist(response);
				const ArtistObj = {
					Id: response.id,
					Name: response.name,
					Href: response.href,
					Image: response.images[0].url,
					Popularity: response.popularity,
					Followers: response.followers.total,
					Genres: response.genres,
				};
				await saveArtist(ArtistObj);
				saveVisited(artistId);
				const albumsResponse = await fetchArtistAlbums(artistId);
				setAlbums(albumsResponse.items);
				const topTracksResponse = await fetchArtistTopTracks(artistId);
				setTopTracks(topTracksResponse.tracks);
			} else {
				console.error("Invalid response from fetchArtistData");
			}
		} catch (error) {
			console.error("Error fetching artist data:", error);
		} finally {
			setLoading(false);
		}
	}, [artistId]);

	useEffect(() => {
		if (!artistId) {
			navigate("/");
		} else {
			fetchArtist();
		}
	}, [artistId, fetchArtist, navigate]);

	useEffect(() => {
		const backdrop = document.getElementById("backdrop");
		if (artist && artist.images && artist.images[0]) {
			backdrop.style.backgroundImage = `url("/public/imgs/backgroundart2.avif")`;
			backdrop.style.width = "100%";
			backdrop.style.height = "100%";
		}
		return () => {
			backdrop.style.backgroundImage = "";
			backdrop.style.width = "0";
			backdrop.style.height = "0";
		};
	}, [artist]);

	if (loading) {
		return <div>Loading...</div>;
	}

	if (!artist) {
		return <div>No artist data</div>;
	}

	return (
		<div className="jukeContainer artistContent mb-5">
			<div id="mainArtistSection" className="">
				<div id="artistMaj" className="d-flex flex-column justify-content-start align-items-center flex-md-row mb-4">
					<div id="artistImg" className="rounded-circle overflow-hidden mb-2">
						<img src={artist.images[1].url} alt={artist.name} className="img-fluid" />
					</div>
					<div id="artistName" className="d-flex justify-content-center align-items-baseline">
						<h1 className="display-3 mb-0 ">{artist.name}</h1>
						<DiscoverArtistButton artistId={artistId} artist={artist} />
					</div>
				</div>
				<div
					id="artistProfInfo"
					className="d-flex flex-wrap justify-content-between flex-md-nowrap justify-content-md-start mb-4"
				>
					<div className="d-flex flex-column me-3 artistInfo">
						<h5 className="text-white-50 infoTitle">Followers</h5>
						<p className="font-monospace">{artist.followers.total} </p>
					</div>
					<div className="d-flex flex-column me-3 artistInfo">
						<h5 className="text-white-50 infoTitle">Popularity</h5>
						<p className="font-monospace">{artist.popularity}</p>
					</div>
					<div id="genresDiv" className="d-flex flex-column artistInfo">
						<h5 className="text-white-50 infoTitle">Genres</h5>
						<p className="">{artist.genres.join(", ")}</p>
					</div>
				</div>
			</div>
			<div id="topTracks" className="mb-4">
				<h3 className="artistSectionTitle mb-3">Top Tracks</h3>
				<Row xs={1}>
					{topTracks &&
						topTracks
							.slice(0, 5)
							.map((track) => (
								<TrackCard
									key={track.id}
									track={track}
									currentPlayingId={currentPlayingId}
									setCurrentPlayingId={setCurrentPlayingId}
									playingRefs={playingRefs}
									setPlayingRefs={setPlayingRefs}
								/>
							))}
				</Row>
			</div>
			<div id="artistAlbums" className="w-100 mb-5">
				<h3 className="artistSectionTitle mb-3">Albums</h3>
				<Row xs={2} xl={3} className="g-2 g-lg-4">
					{albums &&
						albums
							.slice(0, 6)
							.map((album, index) => (
								<Col key={album.id}>
									{isMobile ? (
										<AlbumCardOpen album={album} name={true} />
									) : (
										<AlbumCard index={index} album={album} name={true} />
									)}
								</Col>
							))}
				</Row>
			</div>
		</div>
	);
}

export default withAuthCheck(ArtistPage);
