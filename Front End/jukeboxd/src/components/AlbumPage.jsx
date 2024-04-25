// AlbumPage.jsx
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchAlbumData, saveAlbum } from "../redux/actions/albumActions";
import withAuthCheck from "./withAuthCheck";
import SavedAlbumButton from "./SavedAlbumButton";
import JukeboxAlbumButton from "./JukeboxAlbumButton";
import AlbumCardOpen from "./AlbumCardOpen";
import Review from "./Review";
import { getAlbumRating, getAlbumReviews } from "../redux/actions/reviewActions";
import { IoMusicalNote, IoMusicalNotes, IoMusicalNotesOutline } from "react-icons/io5";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ReviewModal from "./ReviewModal";
import AlbumTrackCard from "./AlbumTrackCard";
import { Row, Col } from "react-bootstrap";

function AlbumPage() {
	const { albumId } = useParams();
	const navigate = useNavigate();
	const [album, setAlbum] = useState(null);
	const [loading, setLoading] = useState(false);
	const [rating, setRating] = useState(null);
	const [reviews, setReviews] = useState([]);
	const [show, setShow] = useState(false);
	const [currentPlayingId, setCurrentPlayingId] = useState(null);
	const [playingRefs, setPlayingRefs] = useState([]);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const fetchAlbum = useCallback(async () => {
		setLoading(true);
		try {
			const response = await fetchAlbumData(albumId);
			if (
				response &&
				response.name &&
				response.images &&
				response.artists &&
				response.release_date &&
				response.popularity &&
				response.href &&
				response.tracks
			) {
				setAlbum(response);
				const albumObj = {
					Id: response.id,
					Name: response.name,
					Image: response.images[0].url,
					Artist: response.artists[0].name,
					ReleaseDate: response.release_date,
					Popularity: response.popularity,
					Href: response.href,
					Duration: response.tracks.items.reduce((total, track) => total + track.duration_ms, 0),
				};
				await saveAlbum(albumObj);
				const ratingResponse = await getAlbumRating(albumId);
				setRating(ratingResponse);
				const reviewsResposne = await getAlbumReviews(albumId);
				setReviews(reviewsResposne);
			} else {
				console.error("Invalid response from fetchAlbumData");
			}
		} catch (error) {
			console.error("Error fetching album data:", error);
		} finally {
			setLoading(false);
		}
	}, [albumId]);

	useEffect(() => {
		if (!albumId) {
			navigate("/");
		} else {
			fetchAlbum();
		}
	}, [albumId, fetchAlbum, navigate]);

	useEffect(() => {
		const backdrop = document.getElementById("backdrop");
		if (album && album.images && album.images[0]) {
			backdrop.style.backgroundImage = `url("/public/imgs/backgroundbd.webp")`;
			backdrop.style.width = "100%";
			backdrop.style.height = "100%";
		}
		return () => {
			backdrop.style.backgroundImage = "";
			backdrop.style.width = "0";
			backdrop.style.height = "0";
		};
	}, [album]);

	if (loading) {
		return <div>Loading...</div>;
	}

	if (!album) {
		return <div>No album data</div>;
	}

	return (
		<div className="jukeContainer albumContent mb-5">
			<div className="d-flex flex-column d-md-block">
				<div className="d-flex flex-row-reverse justify-content-center d-md-block">
					<div id="albumTitle" className="d-flex flex-column align-items-center justify-content-center mb-4">
						<h1 className="display-2 text-center">{album.name}</h1>
						<Link to={"/artist/" + album.artists[0].id} className="h2 jukeLink">
							{album.artists[0].name}
						</Link>
					</div>
					<AlbumCardOpen album={album} />
				</div>
				<div id="copyright">
					<p className="text-center mb-0">{album.copyrights[0].text}</p>
				</div>
			</div>
			<Row xs={1} lg={2} className="px-0 mb-3 mb-md-4">
				<Col id="albumProfInfo" className="d-flex col-12 col-lg-4 px-0">
					<div className="d-flex flex-grow-1 justify-content-around ">
						<div className="d-flex flex-column me-3 artistInfo">
							<h5 className="text-white-50 infoTitle">Release Date</h5>
							<p className="font-monospace">{album.release_date} </p>
						</div>
						<div id="genresDiv" className="d-flex flex-column artistInfo me-3">
							<h5 className="text-white-50 infoTitle">Tracks</h5>
							<p className="">{album.tracks.total}</p>
						</div>
						<div className="d-flex flex-column  artistInfo">
							<h5 className="text-white-50 infoTitle">Popularity</h5>
							<p className="font-monospace">{album.popularity}</p>
						</div>
					</div>
				</Col>
				<Col className="col-12 col-lg-7 align-items-center ms-lg-auto px-0">
					<div className="d-flex flex-grow-1 justify-content-around justify-content-lg-between">
						<div id="rating" className="d-flex flex-column align-items-center mb-4">
							<h4 className="text-white-50 infoTitle">Rating</h4>
							<div className="d-flex align-items-center">
								<div className="me-2">
									{Array.from({ length: Math.floor(rating) }, (_, i) => (
										<IoMusicalNotes className="infoTitle" key={i} />
									))}
									{rating % 1 !== 0 && <IoMusicalNote className="infoTitle" />}
									{Array.from({ length: 5 - Math.ceil(rating) }, (_, i) => (
										<IoMusicalNotesOutline className="infoTitle" key={i} />
									))}
								</div>
								<p className="font-monospace infoTitle text-white-50 mb-0">{rating.toFixed(1)}</p>
							</div>
						</div>

						<div className="d-flex justify-content-center align-items-center mb-4">
							<SavedAlbumButton className="infoTitle iconButton" albumId={albumId} album={album} />
							<JukeboxAlbumButton className="infoTitle" albumId={albumId} album={album} />
							<Button className="jukeBtnWhiteOutline infoTitle" onClick={handleShow}>
								Leave a Review
							</Button>
						</div>
					</div>
				</Col>
			</Row>
			<div id="albumTracks" className="mb-5">
				<div>
					<div>
						<h3 className="text-white-50">Tracks</h3>
						{album.tracks.items.map((track) => (
							<AlbumTrackCard
								key={track.id}
								track={track}
								currentPlayingId={currentPlayingId}
								setCurrentPlayingId={setCurrentPlayingId}
								playingRefs={playingRefs}
								setPlayingRefs={setPlayingRefs}
							/>
						))}
					</div>
				</div>
			</div>
			<div id="reviewsDiv" className="mb-5">
				{reviews.length > 0 && (
					<div>
						<h3 className="text-white-50 text-center mb-3">Reviews</h3>
						{[...reviews].reverse().map((review) => (
							<Review key={review.reviewId} review={review} />
						))}
					</div>
				)}
			</div>
			<Modal className="mt-5" show={show} onHide={handleClose}>
				<ReviewModal album={album} handleClose={handleClose} />
			</Modal>
		</div>
	);
}

export default withAuthCheck(AlbumPage);
