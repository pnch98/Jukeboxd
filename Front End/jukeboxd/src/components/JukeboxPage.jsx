// JukeboxPage.jsx
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import withAuthCheck from "./withAuthCheck";
import {
	fetchJukebox,
	getJukeboxAlbums,
	getMonthlyJukeboxData,
	getTotalHoursListened,
	getWeeklyHoursListened,
	getWeeklyJukeboxCount,
	getWeeklyJukeboxData,
} from "../redux/actions/jukeboxActions";
import Graph from "./Graph";
import { Row, Col } from "react-bootstrap";

function JukeboxPage() {
	const jukebox = useSelector((state) => state.jukebox.jukebox);
	const [albums, setAlbums] = useState([]);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [monthlyDatapoints, setMonthlyDatapoints] = useState(null);
	const [weeklyDatapoints, setWeeklyDatapoints] = useState(null);
	const [weeklyCount, setWeeklyCount] = useState(null);
	const [weeklyHours, setWeeklyHours] = useState(null);
	const [totalHours, setTotalHours] = useState(null);

	const fetchJukeboxData = useCallback(async () => {
		fetchJukebox(dispatch);

		const monthlyData = await getMonthlyJukeboxData();
		const weeklyData = await getWeeklyJukeboxData();
		const weeklyCount = await getWeeklyJukeboxCount();
		const weeklyHours = await getWeeklyHoursListened();
		const totalHours = await getTotalHoursListened();

		const monthlyDatapoints = [];
		const weeklyDatapoints = [];

		monthlyData.forEach((data) => {
			monthlyDatapoints.push({ x: new Date(data.date), y: data.count });
		});

		weeklyData.forEach((data) => {
			weeklyDatapoints.push({ x: new Date(data.date), y: data.count });
		});

		setMonthlyDatapoints(monthlyDatapoints);
		setWeeklyDatapoints(weeklyDatapoints);
		setWeeklyCount(weeklyCount);
		setWeeklyHours((weeklyHours / (60 * 60 * 1000)).toFixed(1));
		setTotalHours((totalHours / (60 * 60 * 1000)).toFixed(1));
	}, [dispatch]);

	useEffect(() => {
		fetchJukeboxData();
	}, [fetchJukeboxData]);

	useEffect(() => {
		if (jukebox && jukebox.length > 0) {
			fetchJukeboxAlbums();
		}
	}, [jukebox]);

	const fetchJukeboxAlbums = async () => {
		const response = await getJukeboxAlbums();
		setAlbums(response);
	};

	const scaleUp = (e) => {
		e.target.style["z-index"] = 9999;
		e.target.style.transform = "scale(1.2)";
		e.target.style.cursor = "pointer";
	};

	const scaleDown = (e) => {
		e.target.style.transform = "scale(1)";
		e.target.style["z-index"] = "unset";
	};

	return (
		<div className="jukeContainer mt-3 mb-5">
			<h2 className="text-white-50 mb-5">Jukebox</h2>
			{monthlyDatapoints && weeklyDatapoints && (
				<div id="graphDiv" className="mx-auto">
					<Graph monthlyDatapoints={monthlyDatapoints} weeklyDatapoints={weeklyDatapoints} text="Album Listened" />
				</div>
			)}
			{weeklyCount && weeklyHours && totalHours && (
				<Row className="mb-5">
					<Col>
						<div className="statCard">
							<i className="bi bi-headphones"></i>
							<p className="mb-0">{weeklyCount} albums</p>
							<span>Weekly Listens</span>
						</div>
					</Col>
					<Col>
						<div className="statCard">
							<i className="bi bi-clock"></i>
							<p className="mb-0">{weeklyHours} hrs.</p>
							<span>Weekly Hours</span>
						</div>
					</Col>
					<Col>
						<div className="statCard">
							<i className="bi bi-clock"></i>
							<p className="mb-0">{totalHours} hrs.</p>
							<span>Total Hours</span>
						</div>
					</Col>
				</Row>
			)}
			<div className="grid mb-5">
				{albums.length > 0 &&
					albums.map((album, index) => {
						let className = "grid-item";
						if ((index + 1) % 3 === 0) className += " wide";
						if ((index + 1) % 9 === 0) className += " tall";
						return (
							<div
								key={album.id}
								className={className}
								style={{ backgroundImage: `url(${album.image})`, transition: "transform 0.2s ease-in-out" }}
								onMouseOver={scaleUp}
								onMouseOut={scaleDown}
								onClick={() => navigate("/album/" + album.id)}
							/>
						);
					})}
			</div>
		</div>
	);
}

export default withAuthCheck(JukeboxPage);
