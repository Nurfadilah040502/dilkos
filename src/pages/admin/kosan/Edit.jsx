//import hook from react
import React, { useState, useEffect, useRef } from "react";

//import layout
import LayoutAdmin from "../../../layouts/Admin";

//import BASE URL API
import Api from "../../../api";

//import hook navigate dari react router dom
import { Link, useNavigate, useParams } from "react-router-dom";

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
import { Spinner } from "react-bootstrap";
import LayoutKosan from "../../../layouts/Kosan";

//api key mapbox
mapboxgl.accessToken = import.meta.env.VITE_APP_MAPBOX;

function KosanEdit() {
	//name page
	document.name = "Edit Kosan - My Kost";

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

	const [loading, setLoading] = useState(true);
	const [loading2, setLoading2] = useState(false);

	//token
	const token = Cookies.get("token");

	//navigate
	const navigate = useNavigate();

	//get ID from parameter URL
	const { id } = useParams();

	//function "fetchCategories"
	const fetchCategories = async () => {
		//fetching data from Rest API
		setLoading(true);
		await Api.get("/api/web/categories").then(response => {
			//set data response to state "catgeories"
			setCategories(response.data.data);
			setLoading(false);
		});
	};

	const handleMetodePembayaranChange = (e) => {
        setMetodePembayaran(e.target.value);
    };


	//function "getPlaceById"
	const getPlaceById = async () => {
		//fetching data from Rest API
		setLoading(true);
		await Api.get(`/api/admin/houses/${id}`, {
			headers: {
				//header Bearer + Token
				Authorization: `Bearer ${token}`,
			},
		}).then(response => {
			//set data response to state
			setName(response.data.data.name);
			setHargaPerbulan(response.data.data.harga_perbulan);
			setHargaPertahun(response.data.data.harga_pertahun);
			setMetodePembayaran(response.data.data.metode_pembayaran);
			setNorek(response.data.data.norek);
			setSisaKamar(response.data.data.sisa_kamar);
			setCategoryID(response.data.data.category_id);
			setDescription(response.data.data.description);
			setPhone(response.data.data.phone);
			setAddress(response.data.data.address);
			setLatitude(response.data.data.latitude);
			setLongitude(response.data.data.longitude);
			setLoading(false);
		});
	};

	//hook
	useEffect(() => {
		//call function "fetchCategories"
		fetchCategories();

		//fetch function "getPlaceById"
		getPlaceById();

		// eslint-disable-next-line react-hooks/exhaustive-deps
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

	//function "updatePlace"
	const updatePlace = async e => {
		e.preventDefault();
		setLoading2(true);
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
		formData.append("_method", "PATCH");

		Array.from(images).forEach(image => {
			formData.append("image[]", image);
		});

		await Api.post(`/api/admin/houses/${id}`, formData, {
			//header
			headers: {
				//header Bearer + Token
				Authorization: `Bearer ${token}`,
				"content-type": "multipart/form-data",
			},
		})
			.then(() => {
				//show toast
				setLoading2(false);
				toast.success("Data Updated Successfully!", {
					duration: 4000,
					position: "top-right",
					style: {
						borderRadius: "10px",
						background: "#333",
						color: "#fff",
					},
				});

				//redirect place index page
				navigate("/kosan/kosan");
			})
			.catch(error => {
				//set state "validation"
				setValidation(error.response.data);
			});
	};

	//=========================================================
	//MAPBOX
	//=========================================================

	//define state
	const mapContainer = useRef(null);

	useEffect(() => {
		//init map
		if (!loading && mapContainer.current) {
			const map = new mapboxgl.Map({
				container: mapContainer.current,
				style: "mapbox://styles/mapbox/streets-v12",
				center: [longitude, latitude],
				zoom: 15,
			});

			//init geocoder
			const geocoder = new MapboxGeocoder({
				accessToken: mapboxgl.accessToken,

				marker: {
					draggable: true,
				},

				mapboxgl: mapboxgl,
			});

			map.addControl(geocoder);

			//init marker
			const marker = new mapboxgl.Marker({
				draggable: true,
				color: "rgb(47 128 237)",
			})
				.setLngLat([longitude, latitude])
				.addTo(map);

			//geocoder result
			geocoder.on("result", function (e) {
				marker.remove();

				marker.setLngLat(e.result.center).addTo(map);

				marker.on("dragend", function (e) {
					setLatitude(e.target._lngLat.lat);
					setLongitude(e.target._lngLat.lng);
				});
			});
		}
	});

	return (
		<React.Fragment>
			<LayoutKosan>
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
					<div className="row mt-4 mb-4">
						<div className="col-12">
							<div className="card border-0 rounded shadow-sm border-top-success">
								<div className="card-header">
									<span className="font-weight-bold">
										<i className="fa fa-map-marked-alt"></i> EDIT PLACE
									</span>
								</div>
								<div className="card-body">
									<form onSubmit={updatePlace}>
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
													<label className="form-label fw-bold">Nama Kos</label>
													<input
														type="text"
														className="form-control"
														value={name}
														onChange={e => setName(e.target.value)}
														placeholder="Enter Title Place"
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
													<label className="form-label fw-bold">
														Harga Kos
													</label>
													<input
														type="number"
														className="form-control"
														value={hargaPerbulan}
														onChange={e => setHargaPerbulan(e.target.value)}
														placeholder="Enter Title Place"
													/>
												</div>
												{validation.hargaPerbulan && (
													<div className="alert alert-danger">
														{validation.hargaPerbulan[0]}
													</div>
												)}
											</div>
											<div className="col-md-6">
												<div className="mb-3">
													<label className="form-label fw-bold">
														Harga Kos
													</label>
													<input
														type="number"
														className="form-control"
														value={hargaPertahun}
														onChange={e => setHargaPertahun(e.target.value)}
														placeholder="Enter Title Place"
													/>
												</div>
												{validation.hargaPertahun && (
													<div className="alert alert-danger">
														{validation.hargaPertahun[0]}
													</div>
												)}
											</div>
											<div className="col-md-6">
												<div className="mb-3">
													<label className="form-label fw-bold">
														Sisa Kamar Kos
													</label>
													<input
														type="number"
														className="form-control"
														value={sisaKamar}
														onChange={e => setSisaKamar(e.target.value)}
														placeholder="Enter Title Place"
													/>
												</div>
												{validation.sisaKamar && (
													<div className="alert alert-danger">
														{validation.sisaKamar[0]}
													</div>
												)}
											</div>
										<div className="col-md-6">
											<div className="mb-3">
												<label className="form-label fw-bold">Category</label>
												<select
													class="form-select"
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
												<label className="form-label fw-bold">Phone</label>
												<input
													type="text"
													className="form-control"
													value={phone}
													onChange={e => setPhone(e.target.value)}
													placeholder="Enter Phone"
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
											<label className="form-label fw-bold">Description</label>
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
												class="form-control"
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
														placeholder="Enter Latitude Place"
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
													<label className="form-label fw-bold">
														Longitude
													</label>
													<input
														type="text"
														className="form-control"
														value={longitude}
														onChange={e => setLongitude(e.target.value)}
														placeholder="Enter Longitude Place"
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
												<div ref={mapContainer} className="map-container" />
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
												disabled={loading2}
											>
												<i className="fa fa-save"></i>{" "}
												{loading2 ? "Loading..." : "Update"}
											</button>
										</div>
									</form>
								</div>
							</div>
						</div>
					</div>
				)}
			</LayoutKosan>
		</React.Fragment>
	);
}

export default KosanEdit;
