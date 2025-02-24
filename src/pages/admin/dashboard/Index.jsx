import React, { useState, useEffect, useRef } from "react";
import LayoutAdmin from "../../../layouts/Admin";
import Api from "../../../api";
import Cookies from "js-cookie";
import Chart from "chart.js/auto";
import { Spinner } from "react-bootstrap";

function Dashboard() {
	// title page
	document.title = "Dashboard - My Kost";

	// set state
	const [categories, setCategories] = useState(0);
	const [houses, setHouses] = useState(0);
	const [pemilik, setPemilik] = useState(0);
	const [kamarTersedia, setKamarTersedia] = useState(0);
	const [loading, setLoading] = useState(true);

	// token
	const token = Cookies.get("token");

	// function fetchData
	const fetchData = async () => {
		try {
			// fetching data from Rest API
			setLoading(true);
			const response = await Api.get("api/admin/dashboard", {
				headers: {
					// header Bearer + Token
					Authorization: `Bearer ${token}`,
				},
			});

			// get response data
			const data = await response.data.data;

			// assign response data to state
			setCategories(data.categories);
			setHouses(data.houses);
			setPemilik(data.pemilik);
			setKamarTersedia(data.kamarTersedia);
			setLoading(false);
		} catch (error) {
			console.error(error);
		}
	};

	// hook useEffect
	useEffect(() => {
		// call method "fetchData"
		fetchData();
	}, []);

	const chartRef = useRef(null);

	useEffect(() => {
		if (chartRef.current) {
			// Hancurkan grafik sebelumnya jika ada
			if (chartRef.current.chartInstance) {
				chartRef.current.chartInstance.destroy();
			}

			// Get the canvas element and its 2d context
			const ctx = chartRef.current.getContext("2d");

			// Buat grafik baru dengan data yang diperbarui
			const newChartInstance = new Chart(ctx, {
				type: "bar",
				data: {
					labels: [
						"Kategori",
						"Jumlah Kosan",
						"Pemilik Kos",
						"Kamar Kos Tersedia",
					],
					datasets: [
						{
							label: "Jumlah",
							data: [categories, houses, pemilik, kamarTersedia],
							backgroundColor: [
								"rgba(0, 0, 255, 0.2)", // Biru
								"rgba(255, 255, 0, 0.2)", // Kuning
								"rgba(255, 0, 0, 0.2)", // Merah
								"rgba(0, 128, 0, 0.2)", // Hijau
								"rgba(255, 255, 0, 0.2)", // Kuning
							],
							borderColor: [
								"rgba(0, 0, 255, 1)", // Biru
								"rgba(255, 255, 0, 1)", // Kuning
								"rgba(255, 0, 0, 1)", // Merah
								"rgba(0, 128, 0, 1)", // Hijau
								"rgba(255, 255, 0, 1)", // Kuning
							],
							borderWidth: 1,
						},
					],
				},
				options: {
					scales: {
						y: {
							beginAtZero: true,
						},
					},
				},
			});

			chartRef.current.chartInstance = newChartInstance;
			console.log(newChartInstance);
		}
	}, [categories, houses, pemilik, kamarTersedia]);

	return (
		<React.Fragment>
			<LayoutAdmin>
				{loading ? (
					<div
						className="d-flex justify-content-center align-items-center"
						style={{ height: "100vh" }}
					>
						<Spinner animation="border" variant="success" role="status">
							<span className="sr-only">Loading...</span>
						</Spinner>
					</div>
				) : (
					<div className="row mt-4">
						<div className="col-12 mb-3">
							<div className="card border-0 rounded shadow-sm border-top-success">
								<div className="card-header bg-white">
									<span className="font-weight-bold text-success">
										<i className="bi bi-bar-chart-line-fill me-2"></i>Halaman
										Dashboard
									</span>
								</div>
							</div>
						</div>
						<div className="col-12">
							<div className="card border-0 p-3 shadow">
								<div className="card-header">Grafik Jumlah Data</div>
								<div className="card-body">
									<canvas ref={chartRef}></canvas>
								</div>
							</div>
						</div>
					</div>
				)}
			</LayoutAdmin>
		</React.Fragment>
	);
}

export default Dashboard;
