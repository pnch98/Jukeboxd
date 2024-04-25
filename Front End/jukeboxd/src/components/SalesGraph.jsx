import CanvasJSReact from "@canvasjs/react-charts";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

const { CanvasJSChart } = CanvasJSReact;

function Graph({ monthlyDatapoints, weeklyDatapoints, text }) {
	const [activeButton, setActiveButton] = useState("Monthly");
	const [graphOptions, setGraphOptions] = useState(null);

	useEffect(() => {
		const options = {
			animationEnabled: true,
			backgroundColor: "transparent",
			title: {
				text: { text },
				fontColor: "rgba(255, 255, 255, 0.5)",
				fontFamily: "Arial, sans-serif",
			},
			axisX: {
				valueFormatString: "MM/DD",
				labelFontColor: "rgba(255, 255, 255, 0.5)",
			},
			axisY: {
				gridThickness: 0,
				labelFontColor: "rgba(255, 255, 255, 0.5)",
			},
			data: [
				{
					yValueFormatString: "#",
					xValueFormatString: "MMMM",
					type: "splineArea",
					color: "white",
					dataPoints: activeButton === "Monthly" ? monthlyDatapoints : weeklyDatapoints,
				},
			],
		};
		setGraphOptions(options);
	}, [activeButton, monthlyDatapoints, weeklyDatapoints]);

	useEffect(() => {
		const observer = new MutationObserver(() => {
			const watermark = document.querySelector(".canvasjs-chart-credit");
			if (watermark) {
				watermark.style.display = "none";
			}
		});

		observer.observe(document, { childList: true, subtree: true });

		return () => observer.disconnect();
	}, []);

	return (
		<div className="mb-4 position-relative">
			{graphOptions && <CanvasJSChart options={graphOptions} />}
			<div className="position-absolute top-0 end-0 mt-2 me-4">
				<Button
					className={activeButton === "Monthly" ? "jukeBtnWhite me-2" : "jukeBtnWhiteOutline me-2"}
					onClick={() => {
						setActiveButton("Monthly");
					}}
				>
					Monthly
				</Button>
				<Button
					className={activeButton === "Weekly" ? "jukeBtnWhite" : "jukeBtnWhiteOutline"}
					onClick={() => setActiveButton("Weekly")}
				>
					Weekly
				</Button>
			</div>
		</div>
	);
}

Graph.propTypes = {
	monthlyDatapoints: PropTypes.arrayOf(
		PropTypes.shape({
			x: PropTypes.instanceOf(Date),
			y: PropTypes.number,
		})
	),
	weeklyDatapoints: PropTypes.arrayOf(
		PropTypes.shape({
			x: PropTypes.instanceOf(Date),
			y: PropTypes.number,
		})
	),
	text: PropTypes.string.isRequired,
};

export default Graph;
