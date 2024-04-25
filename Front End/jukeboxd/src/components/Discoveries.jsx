import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDiscoveredArtists } from "../redux/actions/discoveriesActions";
import withAuthCheck from "./withAuthCheck";
import { getSavedAlbums } from "../redux/actions/savedActions";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";

function Discoveries() {
	const discoveries = useSelector((state) => state.discoveries.discoveries);
	const saved = useSelector((state) => state.saved.saved);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		dispatch(getDiscoveredArtists());
		dispatch(getSavedAlbums());
	}, []);

	return (
		<div className="jukeContainer">
			<div id="discoveriesContainer" className="mt-3 mb-5">
				<h2 className="text-white-50">Discoveries</h2>
				<Row xs={2} sm={3} md={4} lg={5} xl={6} className="discoveries">
					{discoveries.length > 0 &&
						discoveries.map((artist) => (
							<Col
								key={artist.id}
								className="navCard rounded text-center"
								onClick={() => navigate("/artist/" + artist.id)}
							>
								<div>
									<img src={artist.image} alt={artist.name} width={140} height={140} className="rounded-circle" />
								</div>
								{artist.name}
							</Col>
						))}
				</Row>
			</div>
			<div id="savedAlbumsContainer">
				<h2 className="text-white-50">Saved Albums</h2>
				<Row xs={2} sm={3} md={4} lg={5} xl={6} className="savedAlbums">
					{saved.length > 0 &&
						saved.map((album) => (
							<Col key={album.id} className="text-center">
								<div className="navCard text-center" onClick={() => navigate("/album/" + album.id)}>
									<div>
										<img src={album.image} alt={album.name} width={140} height={140} />
									</div>
									<p className="mb-0">{album.name}</p>
								</div>
							</Col>
						))}
				</Row>
			</div>
		</div>
	);
}

export default withAuthCheck(Discoveries);
