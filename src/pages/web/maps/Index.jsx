//import hook from react
import React, { useEffect, useState, useRef } from "react";

//import layout web
import LayoutWeb from "../../../layouts/Web";

//import BASE URL API
import Api from "../../../api";

//import mapbox gl
import mapboxgl from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { Spinner } from "react-bootstrap";

//api key mapbox
mapboxgl.accessToken = import.meta.env.VITE_APP_MAPBOX;

function WebMapsIndex() {
	//title page
	document.title =
		"Maps - My Kost";

	const [loading, setLoading] = useState(true);

	//map container
	const mapContainer = useRef(null);

	//state coordinate
	const [coordinates, setCoordinates] = useState([]);

	//function "fetchDataPlaces"
	const fetchDataPlaces = async () => {
		//fetching Rest API
		setLoading(true);
		await Api.get("/api/web/all_houses").then(response => {
			//set data to state
			setCoordinates(response.data.data);
			setLoading(false);
		});
	};

	//hook
	useEffect(() => {
		//call function "fetchDataPlaces"
		fetchDataPlaces();
	}, []);

	//hook
	useEffect(() => {
		if (!loading && mapContainer.current) {
			// Set initial latitude and longitude for Samata, Kabupaten Gowa
			const initialLongitude = 119.48893666723313; // Replace with the desired longitude
			const initialLatitude = -5.20067410871232; // Replace with the desired latitude

			//init Map
			const map = new mapboxgl.Map({
				container: mapContainer.current,
				style: "mapbox://styles/mapbox/streets-v12",
				center: [initialLongitude, initialLatitude],
				zoom: 12,
			});

			// Create a default Marker and add it to the map.
			coordinates.forEach(location => {
				// Add popup
				const popup = new mapboxgl.Popup()
					.setHTML(
						`
						<div style="max-width: 300px;">
							<img src="${location.images[0].image}" alt="${location.name}" style="width: 100%; height: 120px; object-fit: cover; padding:0 8px 10px 0;" />
							<h6>${location.name}</h6>
							<hr/>
							<p class="mb-2"><i class="bi bi-pin-map me-1"></i> <i>${location.address}</i></p>
							<p class="mb-2"><i class="bi bi-cash me-1"></i> <i>${formattedPrice(
								location.harga_perbulan
							)} /bulan</i></p>
							<p  class="mb-0"><i class="bi bi-house-check me-1"></i><i>Sisa ${location.sisa_kamar} Kamar</i></p>
							<hr/>
							<div class="d-grid gap-2">
								<a href="/kosan/${location.slug}" class="btn btn-sm btn-success btn-block text-white">Lihat Selengkapnya</a>
							</div>
						</div>
						`
					)
					.addTo(map);


				// Add custom marker
				const customMarker = new mapboxgl.Marker({
					element: createCustomMarker(),
				})
					.setLngLat([location.longitude, location.latitude])
					.setPopup(popup)
					.addTo(map);
			});

			// Custom marker creation function
			function createCustomMarker() {
				const el = document.createElement("div");
				el.className = "custom-marker"; // Apply custom marker class
				el.innerHTML = '<i class="bi bi-house-check-fill icon-inside"></i>'; // Insert Bootstrap house icon
				return el;
			}
		}
	});

	const formattedPrice = harga_perbulan => {
		return new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(harga_perbulan);
	};

	return (
		<React.Fragment>
			<LayoutWeb>
				<div className="container" style={{ paddingTop: "80px" }}>
					<div className="row">
						<div className="col-md-12 mb-5">
							<div className="card border-0 rounded shadow-sm">
								<div className="card-body">
									<h5>
										<i className="fa fa-map-marked-alt"></i> SISTEM INFORMASI
										GEOGRAFIS KOS
									</h5>
									<hr />
									{loading ? (
										<div
											className="d-flex justify-content-center align-items-center"
											style={{ height: "500px" }}
										>
											<Spinner
												animation="border"
												variant="success"
												role="status"
											>
												<span className="sr-only">Loading...</span>
											</Spinner>
										</div>
									) : (
										<div
											ref={mapContainer}
											className="map-container"
											style={{ height: "500px" }}
										/>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</LayoutWeb>
		</React.Fragment>
	);
}

export default WebMapsIndex;
