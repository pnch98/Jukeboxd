import { useEffect, useState } from "react";
import { getSalesStats } from "../redux/actions/adminActions";
import Graph from "./Graph";
import { Col, Row } from "react-bootstrap";

function GeneralBackoffice() {
	const [stats, setStats] = useState({});
	const [monthlyDatapoints, setMonthlyDatapoints] = useState(null);
	const [weeklyDatapoints, setWeeklyDatapoints] = useState(null);

	function areSameDay(d1, d2) {
		return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
	}

	const fetchStats = async () => {
		const response = await getSalesStats();

		const monthlyDatapoints = [];
		const weeklyDatapoints = [];

		const datesOfMonth = Array.from({ length: 30 }, (_, i) => {
			const date = new Date();
			date.setDate(date.getDate() - i);
			return date;
		}).reverse();

		response.monthlyPSD.forEach((data) => {
			const date = new Date(data.dateSells);
			monthlyDatapoints.push({ x: date, y: data.count });
		});

		const monthlyDataWithFullMonth = datesOfMonth.map((date) => {
			const datapoint = monthlyDatapoints.find((dp) => areSameDay(dp.x, date));
			return datapoint ? datapoint : { x: date, y: 0 };
		});

		// Create an array of dates for the past week
		const datesOfWeek = Array.from({ length: 7 }, (_, i) => {
			const date = new Date();
			date.setDate(date.getDate() - i);
			return date;
		}).reverse();

		response.weeklyPSD.forEach((data) => {
			const date = new Date(data.dateSells);
			weeklyDatapoints.push({ x: date, y: data.count });
		});

		// Merge it with your data
		const weeklyDataWithFullWeek = datesOfWeek.map((date) => {
			const datapoint = weeklyDatapoints.find((dp) => areSameDay(dp.x, date));
			return datapoint ? datapoint : { x: date, y: 0 };
		});

		setStats(response);
		setMonthlyDatapoints(monthlyDataWithFullMonth);
		setWeeklyDatapoints(weeklyDataWithFullWeek);
	};

	useEffect(() => {
		fetchStats();
	}, []);

	return (
		<div className="d-flex flex-column mb-5">
			{stats && (
				<>
					<div className="bg-dark mb-5">
						{monthlyDatapoints && weeklyDatapoints && (
							<Graph monthlyDatapoints={monthlyDatapoints} weeklyDatapoints={weeklyDatapoints} text="Products sales" />
						)}
					</div>
					<div>
						{stats.totalRevenue && stats.totalSales && stats.peakDay && (
							<Row xs={1} sm={2} md={3} className="gy-3 mb-5">
								<Col>
									<div className="statCard bg-dark ">
										<i className="bi bi-bank"></i>
										<p className="text-white-50 mb-0">${stats.totalRevenue.toFixed(2)}</p>
										<span>Monthly Revenue</span>
									</div>
								</Col>
								<Col>
									<div className="statCard bg-dark ">
										<i className="bi bi-vinyl-fill"></i>
										<p className="text-white-50 mb-0">{stats.totalSales} prod.</p>
										<span>Monthly Sales</span>
									</div>
								</Col>
								<Col>
									<div className="statCard bg-dark">
										<i className="bi bi-clock"></i>
										<p className="text-white-50 mb-0">{stats.peakDay.date.toString().split("T")[0]}</p>
										<span>Peak Day</span>
									</div>
								</Col>
							</Row>
						)}
					</div>
					<div className="mb-5">
						{stats.topProduct && stats.bottomProduct && (
							<Row xs={1} md={2} className="gy-3">
								<Col>
									<div className="statCard bg-dark py-2">
										<div className="d-flex align-items-center mb-3">
											<i className="bi bi-star me-2"></i>
											<p className="text-white-50 mb-0">Top Product</p>
										</div>
										<div className="d-flex">
											<div className="d-flex justify-content-center align-items-center me-3">
												<img
													src={"/public/store/products/" + stats.topProduct.productImage}
													alt={stats.topProduct.productName}
													width="100"
													height="100"
												/>
											</div>
											<div className="d-flex flex-column justify-content-center">
												<p className="text-white-50 mb-0">{stats.topProduct.productName}</p>
												<p className="text-white-50 mb-0">{stats.topProduct.quantity} sold</p>
											</div>
										</div>
									</div>
								</Col>
								<Col>
									<div className="statCard bg-dark py-2">
										<div className="d-flex align-items-center mb-3">
											<i className="bi bi-arrow-down-circle me-2"></i>
											<p className="text-white-50 mb-0">Bottom Product</p>
										</div>
										<div className="d-flex">
											<div className="d-flex justify-content-center align-items-center me-3">
												<img
													src={"/public/store/products/" + stats.bottomProduct.productImage}
													alt={stats.bottomProduct.productName}
													width="100"
													height="100"
												/>
											</div>
											<div className="d-flex flex-column justify-content-center">
												<p className="text-white-50 mb-0">{stats.bottomProduct.productName}</p>
												<p className="text-white-50 mb-0">{stats.bottomProduct.quantity} sold</p>
											</div>
										</div>
									</div>
								</Col>
							</Row>
						)}
					</div>
				</>
			)}
		</div>
	);
}

export default GeneralBackoffice;
