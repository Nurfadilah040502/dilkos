//import hook from react
import React, { useState, useEffect, useRef } from "react";

//import layout
import LayoutAdmin from "../../../layouts/Admin";

//import BASE URL API
import Api from "../../../api";

//import hook navigate dari react router dom
import { useNavigate, Link } from "react-router-dom";

//import js cookie
import Cookies from "js-cookie";

//import toats
import toast from "react-hot-toast";

//import react Quill
import ReactQuill from "react-quill";

// quill CSS
import "react-quill/dist/quill.snow.css";

//mapbox gl
import mapboxgl from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

//mapbox gl geocoder
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import LayoutKosan from "../../../layouts/Kosan";

//api key mapbox
mapboxgl.accessToken = import.meta.env.VITE_APP_MAPBOX;

function KosanCreateKosan() {
	//name page
	document.name = "Tambah Kosan - My Kost";

	//state form
	const [name, setName] = useState("");
	const [hargaPerbulan, setHargaPerbulan] = useState("");
	const [hargaPertahun, setHargaPertahun] = useState("");
	const [metodePembayaran, setMetodePembayaran] = useState("");
	const [norek, setNorek] = useState("");
	const [sisaKamar, setSisaKamar] = useState("");
	const [categoryID, setCategoryID] = useState("");
	const [description, setDescription] = useState("");
	const [phone, setPhone] = useState("");
	const [address, setAddress] = useState("");
	const [latitude, setLatitude] = useState("");
	const [longitude, setLongitude] = useState("");

	//state image array / multiple
	const [images, setImages] = useState([]);

	//state categories
	const [categories, setCategories] = useState([]);

	//state validation
	const [validation, setValidation] = useState({});

	//token
	const token = Cookies.get("token");

	//navigate
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);

	//function "fetchCategories"
	const fetchCategories = async () => {
		//fetching data from Rest API
		await Api.get("/api/web/categories").then(response => {
			//set data response to state "catgeories"
			setCategories(response.data.data);
		});
	};

	//hook
	useEffect(() => {
		//call function "fetchCategories"
		fetchCategories();
	}, []);

	//function "handleFileChange"
	const handleFileChange = e => {
		//define variable for get value image data
		const imageData = e.target.files;

		Array.from(imageData).forEach(image => {
			//check validation file
			if (!image.type.match("image.*")) {
				setImages([]);

				//show toast
				toast.error("Format File not Supported!", {
					duration: 4000,
					position: "top-right",
					style: {
						borderRadius: "10px",
						background: "#333",
						color: "#fff",
					},
				});

				return;
			} else {
				setImages([...e.target.files]);
			}
		});
	};

	const handleMetodePembayaranChange = (e) => {
        setMetodePembayaran(e.target.value);
    };

	//function "storePlace"
	const storePlace = async e => {
		e.preventDefault();
		setLoading(true);
		//define formData
		const formData = new FormData();

		//append data to "formData"
		formData.append("name", name);
		formData.append("harga_perbulan", hargaPerbulan);
		formData.append("harga_pertahun", hargaPertahun);
		formData.append("metode_pembayaran", metodePembayaran);
		formData.append("norek", norek);
		formData.append("sisa_kamar", sisaKamar);
		formData.append("category_id", categoryID);
		formData.append("description", description);
		formData.append("phone", phone);
		formData.append("address", address);
		formData.append("latitude", latitude);
		formData.append("longitude", longitude);

		Array.from(images).forEach(image => {
			formData.append("image[]", image);
		});

		//send data to server
		await Api.post("/api/admin/houses", formData, {
			//header
			headers: {
				//header Bearer + Token
				Authorization: `Bearer ${token}`,
				"content-type": "multipart/form-data",
			},
		})
			.then(() => {
				setLoading(false);
				//show toast
				toast.success("Data Saved Successfully!", {
					duration: 4000,
					position: "top-right",
					style: {
						borderRadius: "10px",
						background: "#333",
						color: "#fff",
					},
				});

				//redirect dashboard page
				navigate("/kosan/kosan");
			})
			.catch(error => {
				//set state "validation"
				setValidation(error.response.data);
				setLoading(false);
			});
	};

	//=========================================================
	//MAPBOX
	//=========================================================

	//define state
	const mapContainer = useRef(null);

	useEffect(() => {
		// Set initial latitude and longitude for Samata, Kabupaten Gowa
		const initialLongitude = 119.48893666723313; // Replace with the desired longitude
		const initialLatitude = -5.20067410871232; // Replace with the desired latitude

		// Initialize map
		const map = new mapboxgl.Map({
			container: mapContainer.current,
			style: "mapbox://styles/mapbox/streets-v12",
			center: [initialLongitude, initialLatitude],
			zoom: 12,
		});

		// Initialize geocoder
		const geocoder = new MapboxGeocoder({
			accessToken: mapboxgl.accessToken,
			marker: {
				draggable: true,
				element: createCustomMarker(),
			},
			mapboxgl: mapboxgl,
		});

		// Add geocoder to map
		map.addControl(geocoder);

		// Initialize marker
		const marker = new mapboxgl.Marker({
			draggable: true,
			element: createCustomMarker(),
		})

			// Set initial longitude and latitude
			.setLngLat([initialLongitude, initialLatitude])
			// Add marker to map
			.addTo(map);

		// Geocoder result event

		function createCustomMarker() {
			const el = document.createElement("div");
			el.className = "custom-marker"; // Apply custom marker class
			el.innerHTML = '<i class="bi bi-house-check-fill icon-inside"></i>'; // Insert Bootstrap house icon
			return el;
		}
		geocoder.on("result", function (e) {
			// Remove existing marker
			marker.remove();

			// Set new longitude and latitude
			marker
				.setLngLat(e.result.center)
				// Add to map
				.addTo(map);

			// Marker dragend event
			marker.on("dragend", function (e) {
				// Assign new longitude and latitude to state
				setLongitude(e.target._lngLat.lng);
				setLatitude(e.target._lngLat.lat);
			});
		});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<React.Fragment>
			<LayoutKosan>
				<div className="row mt-4 mb-5">
					<div className="col-12">
						<div className="card border-0 rounded shadow-sm border-top-success">
							<div className="card-header bg-white">
								<span className="font-weight-bold text-success">
									<i className="bi bi-house-add-fill me-2"></i> Halaman Tambah
									Kosan
								</span>
							</div>
						</div>
					</div>
					<div className="col-12 mt-3">
						<div className="card border-0 rounded shadow-sm">
							<div className="card-body">
								<form onSubmit={storePlace}>
									<div className="row">
										<div className="col-md-6">
											<div className="mb-3">
												<label className="form-label fw-bold">
													Image (<i>select many file</i>)
												</label>
												<input
													type="file"
													className="form-control"
													onChange={handleFileChange}
													multiple
												/>
											</div>
										</div>
										<div className="col-md-6">
											<div className="mb-3">
												<label className="form-label fw-bold">Category</label>
												<select
													className="form-select"
													value={categoryID}
													onChange={e => setCategoryID(e.target.value)}
												>
													<option value="">-- Select Category --</option>
													{categories.map(category => (
														<option value={category.id} key={category.id}>
															{category.name}
														</option>
													))}
												</select>
											</div>
											{validation.category_id && (
												<div className="alert alert-danger">
													{validation.category_id[0]}
												</div>
											)}
										</div>
										<div className="col-md-6">
											<div className="mb-3">
												<label className="form-label fw-bold">Nama Kosan</label>
												<input
													type="text"
													className="form-control"
													value={name}
													onChange={e => setName(e.target.value)}
													placeholder="Masukkan Nama Kos anda"
												/>
											</div>
											{validation.name && (
												<div className="alert alert-danger">
													{validation.name[0]}
												</div>
											)}
										</div>
										<div className="col-md-6">
											<div className="mb-3">
												<label className="form-label fw-bold">Harga Perbulan</label>
												<input
													type="number"
													className="form-control"
													value={hargaPerbulan}
													onChange={e => setHargaPerbulan(e.target.value)}
													placeholder="Masukkan Harga Kos Per bulan"
												/>
											</div>
											{validation.harga_perbulan && (
												<div className="alert alert-danger">
													{validation.harga_perbulan[0]}
												</div>
											)}
										</div>
										<div className="col-md-6">
											<div className="mb-3">
												<label className="form-label fw-bold">Harga Pertahun</label>
												<input
													type="number"
													className="form-control"
													value={hargaPertahun}
													onChange={e => setHargaPertahun(e.target.value)}
													placeholder="Masukkan Harga Kos Per tahun"
												/>
											</div>
											{validation.harga_pertahun && (
												<div className="alert alert-danger">
													{validation.harga_pertahun[0]}
												</div>
											)}
										</div>
										<div className="col-md-6">
											<div className="mb-3">
												<label className="form-label fw-bold">
													Sisa Kamar Kosong
												</label>
												<input
													type="number"
													className="form-control"
													value={sisaKamar}
													onChange={e => setSisaKamar(e.target.value)}
													placeholder="Masukkan Sisa Kamar Kos Kosong"
												/>
											</div>
											{validation.sisa_kamar && (
												<div className="alert alert-danger">
													{validation.sisa_kamar[0]}
												</div>
											)}
										</div>
										<div className="col-md-6">
											<div className="mb-3">
												<label className="form-label fw-bold">Metode Pembayaran</label>
												<select
													className="form-control"
													value={metodePembayaran}
													onChange={handleMetodePembayaranChange}
												>
													<option value="" disabled>Pilih Metode Pembayaran</option>
													<option value="cod">COD</option>
													<option value="transfer">Transfer</option>
													<option value="keduanya">Keduanya</option>
												</select>
											</div>
											{validation.metode_pembayaran && (
												<div className="alert alert-danger">
													{validation.metode_pembayaran[0]}
												</div>
											)}
										</div>
										<div className="col-md-6">
											<div className="mb-3">
												<label className="form-label fw-bold">
													Nama- Nomor Rekening (Nama Bank)
												</label>
												<input
													type="text"
													className="form-control"
													value={norek}
													onChange={e => setNorek(e.target.value)}
													placeholder="Masukkan Nama- Nomor Rekening (Nama Bank)"
												/>
											</div>
											{validation.norek && (
												<div className="alert alert-danger">
													{validation.norek[0]}
												</div>
											)}
										</div>
										<div className="col-md-6">
											<div className="mb-3">
												<label className="form-label fw-bold">
													Nomor Whatsapp
												</label>
												<input
													type="number"
													className="form-control"
													value={phone}
													onChange={e => setPhone(e.target.value)}
													placeholder="Masukkan Nomor Whatsapp"
												/>
											</div>
											{validation.phone && (
												<div className="alert alert-danger">
													{validation.phone[0]}
												</div>
											)}
										</div>
									</div>
									<div className="mb-3">
										<label className="form-label fw-bold">
											Deskripsi/Fasilitas
										</label>
										<ReactQuill
											theme="snow"
											rows="5"
											value={description}
											onChange={content => setDescription(content)}
										/>
									</div>
									{validation.description && (
										<div className="alert alert-danger">
											{validation.description[0]}
										</div>
									)}
									<div className="mb-3">
										<label className="form-label fw-bold">Address</label>
										<textarea
											className="form-control"
											rows="3"
											value={address}
											onChange={e => setAddress(e.target.value)}
											placeholder="Enter Address Place"
										></textarea>
									</div>
									{validation.address && (
										<div className="alert alert-danger">
											{validation.address[0]}
										</div>
									)}
									<div className="row">
										<div className="col-md-6">
											<div className="mb-3">
												<label className="form-label fw-bold">Latitude</label>
												<input
													type="text"
													className="form-control"
													value={latitude}
													onChange={e => setLatitude(e.target.value)}
													placeholder="Latitude Place"
												/>
											</div>
											{validation.latitude && (
												<div className="alert alert-danger">
													{validation.latitude[0]}
												</div>
											)}
										</div>
										<div className="col-md-6">
											<div className="mb-3">
												<label className="form-label fw-bold">Longitude</label>
												<input
													type="text"
													className="form-control"
													value={longitude}
													onChange={e => setLongitude(e.target.value)}
													placeholder="Longitude Place"
												/>
											</div>
											{validation.longitude && (
												<div className="alert alert-danger">
													{validation.longitude[0]}
												</div>
											)}
										</div>
									</div>
									<div className="row mb-3">
										<div className="col-md-12">
											<div
												ref={mapContainer}
												className="map-container"
												style={{ height: "500px" }}
											/>
										</div>
									</div>
									<div className="d-flex gap-2 justify-content-end">
										<button className="btn btn-md btn-warning">
											<Link
												to="/admin/kosan"
												className="text-white text-decoration-none"
											>
												<i className="fa fa-redo"></i> Kembali
											</Link>
										</button>
										<button
											type="submit"
											className="btn btn-md btn-success me-2"
											disabled={loading}
										>
											<i className="fa fa-save"></i>{" "}
											{loading ? "Loading..." : "Save"}
										</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</LayoutKosan>
		</React.Fragment>
	);
}

export default KosanCreateKosan;
