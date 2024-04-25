import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchHomeData } from "../redux/actions/homeActions";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import withAuthCheck from "./withAuthCheck";
import { useDispatch, useSelector } from "react-redux";
import { selectLoggedProfile, selectToken } from "../redux/selectors";
import { fetchDiscoveries } from "../redux/actions/discoveriesActions";
import { getVisitedArtists } from "../redux/actions/visitedActions";
import { Row, Col } from "react-bootstrap";
import { getRandomAlbums } from "../redux/actions/albumActions";

function Home() {
	const [newReleases, setNewReleases] = useState([]);
	const [visited, setVisited] = useState([]);
	const [randomAlbums, setRandomAlbums] = useState([]);
	const token = useSelector(selectToken);
	const discoveries = useSelector((state) => state.discoveries.discoveries);
	const navigate = useNavigate();
	const loggedProfile = useSelector(selectLoggedProfile);
	const dispatch = useDispatch();

	const fetchData = async () => {
		const response = await fetchHomeData();
		if (response && response.albums && response.albums.items) {
			setNewReleases(response.albums.items);
		}

		const visits = await getVisitedArtists();
		if (visits && visits.length > 0) {
			setVisited(visits);
		}

		const albums = await getRandomAlbums();
		if (albums && albums.length > 0) {
			setRandomAlbums(albums);
		}
	};

	const fetchDiscoveriesCallback = useCallback(() => {
		fetchDiscoveries(dispatch);
	}, [dispatch]);

	useEffect(() => {
		fetchData();
		if (loggedProfile && loggedProfile.id && discoveries && discoveries.length === 0) {
			fetchDiscoveriesCallback();
		}
	}, [token, loggedProfile, fetchDiscoveriesCallback, discoveries]);

	const spin = (id) => {
		const container = document.querySelector(`#slide-${id} .circle-container`);
		const infoContainer = document.querySelector(`#info-${id}`);

		infoContainer.classList.remove("d-none");
		container.style.animation = "spin 1s linear infinite both";
	};

	const stopSpin = (id) => {
		const container = document.querySelector(`#slide-${id} .circle-container`);
		const infoContainer = document.querySelector(`#info-${id}`);

		infoContainer.classList.add("d-none");
		container.style.animation = "none";
	};

	const goToAlbum = (id) => {
		navigate(`/album/${id}`);
	};

	return (
		<div id="mainComponent" className="overflow-hidden mb-5">
			<div className="jukeContainer pb-0 mb-0 mt-3">
				<h2 className="text-start text-white-50 mb-0">New Releases</h2>
			</div>
			<div className="jukeHomeContainer mt-0">
				<div className="swiper mb-4">
					<Swiper
						key={newReleases.length} // Add this line
						effect={"coverflow"}
						grabCursor={true}
						centeredSlides={true}
						loop={true}
						slidesPerView={"auto"}
						coverflowEffect={{
							rotate: 0,
							stretch: 0,
							depth: 100,
							modifier: 2.5,
						}}
						pagination={{ el: ".swiper-pagination", clickable: true }}
						navigation={{
							nextEl: ".swiper-button-next",
							prevEl: ".swiper-button-prev",
							clickable: true,
						}}
						modules={[EffectCoverflow, Pagination, Navigation]}
						className="swiper_container navBg pt-3 rounded overflow-hidden"
						onSlideChange={(swiper) => {
							// Get all slides
							const slides = document.querySelectorAll(".swiper-slide");

							// Remove the spin animation from all slides
							slides.forEach((slide) => {
								stopSpin(slide.id.replace("slide-", ""));
							});

							// Add the spin animation to the active slide
							if (swiper.slides[swiper.activeIndex]) {
								spin(swiper.slides[swiper.activeIndex].id.replace("slide-", ""));
							}
						}}
					>
						{newReleases.map((release) => (
							<SwiperSlide key={release.id} id={`slide-${release.id}`} onClick={() => goToAlbum(release.id)}>
								<img src={release.images[0].url} alt="slide_image" />
								<div className="circle-container">
									<div className="innerCircle"></div>
									<div className="outside-circle"></div>
									<div className="scratch"></div>
								</div>
								<div
									id={`info-${release.id}`}
									className="mt-2 d-none info basicFs text-white-50 text-center text-truncate"
								>
									<h3 className="basicTitleFs mb-0">{release.name}</h3>
									<p>{release.artists[0].name}</p>
								</div>
							</SwiperSlide>
						))}

						<div className="slider-controler d-xs-none d-md-unset">
							<div className="swiper-button-prev slider-arrow">
								<i className="bi bi-arrow-left-short text-white-50 fs-2"></i>
							</div>
							<div className="swiper-button-next slider-arrow">
								<i className="bi bi-arrow-right-short text-white-50 fs-2"></i>
							</div>
							<div className="swiper-pagination"></div>
						</div>
					</Swiper>
				</div>
			</div>
			{randomAlbums.length > 0 && (
				<div className="jukeContainer mb-4">
					<h2 className="text-start mb-3 text-white-50">You might also like</h2>
					<Row xs={1} md={2} xl={4} id="randomDiv" className="g-2">
						{randomAlbums.map((album) => (
							<Col key={album.id}>
								<div
									key={album.id}
									className="d-flex align-items-center albumSuggest navCard"
									onClick={() => navigate("/album/" + album.id)}
								>
									<div
										className="overflow-hidden d-flex align-items-center justify-content-center me-3 rounded"
										style={{ width: "150px", height: "150px" }}
									>
										<img src={album.image} alt={album.name} className="img-fluid" />
									</div>
									<div>
										<p className="text-white mb-0">{album.artist}</p>
										<p className="text-white-50 mb-0">{album.name}</p>
									</div>
								</div>
							</Col>
						))}
					</Row>
				</div>
			)}
			{visited.length > 0 && (
				<div className="jukeContainer mb-5">
					<h2 className="text-start mb-3 text-white-50">Last visited</h2>
					<Row xs={2} md={3} xl={5} id="visitedDiv">
						{visited.map((artist) => (
							<Col key={artist.id}>
								<div
									key={artist.id}
									className="d-flex flex-column justify-content-center align-items-center navCard"
									onClick={() => navigate("/artist/" + artist.id)}
								>
									<div className="rounded-circle overflow-hidden" style={{ width: "150px", height: "150px" }}>
										<img src={artist.image} alt={artist.name} className="img-fluid" />
									</div>
									<h4 className="text-white-50 text-wrap">{artist.name}</h4>
								</div>
							</Col>
						))}
					</Row>
				</div>
			)}
		</div>
	);
}

export default withAuthCheck(Home);
