import React from "react";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

const OPTIONS = {
	responsive: true,
	plugins: {
		legend: {
			display: false,
		},
	},
	scales: {
		y: {
			ticks: {
				color: "rgb(255,255,255)",
				font: {
					size: 14,
				},
			},
			grid: {
				display: false,
			},
		},
		x: {
			ticks: {
				color: "rgb(255,255,255)",
				font: {
					size: 14,
				},
			},
			grid: {
				display: false,
			},
		},
	},
};

function LineChart({
	data,
	labels,
	selectedCurrency,
}) {
	if (!selectedCurrency) {
		return null;
	}
	const chartData = {
		labels: labels,
		datasets: [
			{
				label: selectedCurrency,
				data: data,
				borderColor: "rgba(255,255,255)",
			},
		],
	};

	return (
		<div className="lineChart">
			<Line
				options={OPTIONS}
				data={chartData}
			/>
		</div>
	);
}

export default LineChart;