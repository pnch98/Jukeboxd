import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import TrackCard from "./TrackCard";
import { useState } from "react";
import withAuthCheck from "./withAuthCheck";

function SearchPage() {
	const searchResult = useSelector((state) => state.search.searchResults);
	const loading = useSelector((state) => state.search.loading);
	const [currentPlayingId, setCurrentPlayingId] = useState(null);
	const [playingRefs, setPlayingRefs] = useState([]);
	const navigate = useNavigate();

	return (
		<div className="jukeContainer mb-5">
			{loading ? (
				<div>Loading...</div>
			) : searchResult.albums ? (
				<>
					<Row xs={1} md={2} className="gx-4 mb-4">
						<Col>
							<div className=" p-3">
								<h3 className="text-white-50 mb-4">Artists</h3>
								<Row xs={2} sm={3} md={2} lg={3} className="gy-3">
									{searchResult.artists.items.map((result, index) => {
										if (index < 5) {
											return (
												<div
													key={result.id}
													className="navCard rounded text-center"
													onClick={() => navigate("/artist/" + result.id)}
												>
													<div>
														<img
															src={result.images[1].url ? result.images[1].url : result.images[0].url}
															alt={result.name}
															style={{ width: "140px", height: "140px" }}
															className="rounded-circle object-fit-cover img-fluid"
														/>
													</div>
													{result.name}
												</div>
											);
										}
										return null;
									})}
								</Row>
							</div>
						</Col>
						<Col>
							<div className="p-3">
								<h3 className="text-white-50 mb-4">Albums</h3>
								<Row xs={2} sm={3} md={2} lg={3} className="gy-3">
									{searchResult.albums.items.map((result, index) => {
										if (index < 5) {
											return (
												<div
													key={result.id}
													className="navCard rounded text-center"
													onClick={() => navigate("/album/" + result.id)}
												>
													<div>
														<img
															src={result.images[1].url}
															alt={result.name}
															className="img-fluid"
															width={140}
															height={140}
														/>
													</div>
													<p className="mb-0">{result.name}</p>
												</div>
											);
										}
										return null;
									})}
								</Row>
							</div>
						</Col>
					</Row>
					<div className="mb-5">
						<h3 className="text-white-50">Tracks</h3>
						{searchResult.tracks.items.slice(0, 10).map((track) => (
							<TrackCard
								key={track.id}
								track={track}
								currentPlayingId={currentPlayingId}
								setCurrentPlayingId={setCurrentPlayingId}
								playingRefs={playingRefs}
								setPlayingRefs={setPlayingRefs}
							/>
						))}
					</div>
				</>
			) : (
				<div>No results found</div>
			)}
		</div>
	);
}

export default withAuthCheck(SearchPage);
