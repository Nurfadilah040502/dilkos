//import layout
import React, { useEffect, useState, useRef } from "react";

//import react router dom
import { Link, useParams, useLocation } from "react-router-dom";

//import layout web
import LayoutWeb from "../../../layouts/Web";

//import mapbox gl
import mapboxgl from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

//import mapbox gl direction
import Directions from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";

//api key mapbox
mapboxgl.accessToken = import.meta.env.VITE_APP_MAPBOX;

function WebKosanDirection() {
	//title page
	document.title = "Map Direction - My Kost";

	//map container
	const mapContainer = useRef(null);

	//state for user location coordinate
	const [longitude, setLongitude] = useState(110.7241664);
	const [latitude, setLatitude] = useState(-6.9515962);

	//slug params
	const { slug } = useParams();

	//get query params
	const query = new URLSearchParams(useLocation().search);

	//hook
	useEffect(() => {
		//init Map
		const map = new mapboxgl.Map({
			container: mapContainer.current,
			style: "mapbox://styles/mapbox/streets-v12",
			center: [query.get("longitude"), query.get("latitude")],
			zoom: 15,
		});

		//init geolocate
		const geolocate = new mapboxgl.GeolocateControl({
			positionOptions: {
				enableHighAccuracy: true,
			},
			// When active the map will receive updates to the device's location as it changes.
			trackUserLocation: true,
			// Draw an arrow next to the location dot to indicate which direction the device is heading.
			showUserHeading: true,
		});

		// Add geolocate control to the map.
		map.addControl(geolocate);

		//init directions
		const directions = new Directions({
			accessToken: mapboxgl.accessToken,
			unit: "metric",
			profile: "mapbox/driving",
			// UI controls
			controls: {
				inputs: false,
				instructions: true,
			},
		});

		// Add directions to the map.
		map.on("load", function () {
			geolocate.trigger(); //<- Automatically activates geolocation

			geolocate.on("geolocate", function (position) {
				setLongitude(position.coords.longitude);
				setLatitude(position.coords.latitude);

				//direction
				directions.setOrigin([
					position.coords.longitude,
					position.coords.latitude,
				]);
			});

			directions.setDestination([
				query.get("longitude"),
				query.get("latitude"),
			]);

			map.addControl(directions);
		});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<React.Fragment>
			<LayoutWeb>
				<div className="container" style={{ paddingTop: "80px" }}>
					<div className="row">
						<div className="col-md-12 mb-5">
							<div className="card border-0 rounded shadow-sm">
								<div className="card-body">
									<div className="d-md-flex justify-content-between d-block">
										<div>
											<h5>
												<i className="fa fa-location-arrow"></i> DIRECTION FROM
												USER LOCATION
											</h5>
										</div>
										<div>
											<Link
												to={`/kosan/${slug}`}
												className="btn btn-success btn-sm mb-2"
											>
												<i className="fa fa-long-arrow-alt-left"></i> KEMBALI KE
												DETAIL KOS
											</Link>
										</div>
									</div>
									<div>
										<hr />
									</div>
									<div
										ref={mapContainer}
										className="map-container"
										style={{ height: "500px" }}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</LayoutWeb>
		</React.Fragment>
	);
}

export default WebKosanDirection;
