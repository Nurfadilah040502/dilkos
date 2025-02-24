//import hook react
import React, { useEffect, useState, useRef } from "react";

//import react router dom
import { Link, useNavigate, useParams } from "react-router-dom";

//import layout web
import LayoutWeb from "../../../layouts/Web";

//import BASE URL API
import Api from "../../../api";

//import imageGallery
import ImageGallery from "react-image-gallery";

//import imageGallery CSS
import "react-image-gallery/styles/css/image-gallery.css";

//import mapbox gl
import mapboxgl from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { Button, Modal, Spinner } from "react-bootstrap";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

//api key mapbox
mapboxgl.accessToken = import.meta.env.VITE_APP_MAPBOX;

function WebKosanShow() {
	//state houses
	const [houses, setHouse] = useState({});
	// console.log(houses);
	const [loading, setLoading] = useState(true);

	const token = Cookies.get("token");

	const navigate = useNavigate();


	const storePesan = async e => {
		e.preventDefault();
		setLoading(true);

		const token = Cookies.get('token');

		if (!token) {
			// Save current state/data to localStorage
			localStorage.setItem('redirectAfterLogin', window.location.pathname);
			localStorage.setItem('housesData', JSON.stringify(houses));

			// Navigate to login page
			navigate('/login');
			return;
		}

		const formData = new FormData();
		formData.append("pemilik_id", houses.user_id);
		formData.append("kos_id", houses.id);
		formData.append("status", "di komunikasikan");

		await Api.post("/api/admin/transaksis", formData, {
			headers: {
				Authorization: `Bearer ${token}`,
				"content-type": "multipart/form-data",
			},
		})
			.then(() => {
				setLoading(false);
				toast.success("Berhasil Pesan Kos!", {
					duration: 4000,
					position: "top-right",
					style: {
						borderRadius: "10px",
						background: "#333",
						color: "#fff",
					},
				});

				navigate("/transaksi");
			})
			.catch(error => {
				setLoading(false);
				console.log(error);
			});
	};

	//map container
	const mapContainer = useRef(null);

	//slug params
	const { slug } = useParams();

	//function "fetchDataPlace"
	const fetchDataPlace = async () => {
		//fetching Rest API
		setLoading(true);
		await Api.get(`/api/web/houses/${slug}`).then(response => {
			//set data to state "houses"
			setHouse(response.data.data);

			//set title from state "category"
			document.title = `${response.data.data.name} - My Kost`;
			setLoading(false);
		});
	};

	//hook
	useEffect(() => {
		//call function "fetchDataPlace"
		fetchDataPlace();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	//=================================================================
	// react image gallery
	//=================================================================

	//define image array
	const images = [];

	//function "placeImages"
	const placeImages = () => {
		//loop data from object "houses"
		for (let value in houses.images) {
			//push to image array
			images.push({
				original: houses.images[value].image,
				thumbnail: houses.images[value].image,
			});
		}
	};

	//=================================================================
	// mapbox
	//=================================================================

	//function "initMap"
	const initMap = () => {
		//init Map
		if (!loading && mapContainer.current) {
			const map = new mapboxgl.Map({
				container: mapContainer.current,
				style: "mapbox://styles/mapbox/streets-v12",
				center: [
					houses.longitude ? houses.longitude : "",
					houses.latitude ? houses.latitude : "",
				],
				zoom: 15,
			});

			//init popup
			new mapboxgl.Popup({
				closeOnClick: false,
			})
				.setLngLat([
					houses.longitude ? houses.longitude : "",
					houses.latitude ? houses.latitude : "",
				])
				.setHTML(
					`
					<div style="max-width: 200px;">
						<img src="${houses.images[0].image}" alt="${houses.name}" style="width: 100%; height: 120px; object-fit: cover; padding:0 8px 10px 0;" />
						<h6>${houses.name}</h6>
						<hr/>
						<p class="mb-2"><i class="bi bi-pin-map me-1"></i> <i>${houses.address}</i></p>
						<p class="mb-2"><i class="bi bi-cash me-1"></i> <i>${formattedPrice(
						houses.harga_perbulan
					)} /bulan</i></p>
						<p  class="mb-0"><i class="bi bi-house-check me-1"></i><i>Sisa ${houses.sisa_kamar} Kamar</i></p>
						<hr/>
						<div class="d-grid gap-2">
							<a href="/kosan/${houses.slug}" class="btn btn-sm btn-success btn-block text-white">Lihat Selengkapnya</a>
						</div>
					</div>
					`
				)
				.addTo(map);
		}
	};

	//hook
	useEffect(() => {
		//call function "placeImage"
		placeImages();

		//call function "initMap"
		initMap();
	});

	const formattedPrice = harga_perbulan => {
		return new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(harga_perbulan);
	};

	const directionLink = `https://www.google.com/maps?q=${houses.latitude},${houses.longitude}`;

	let whatsappUrl = ""; // Inisialisasi tautan WhatsApp
	let housePrice = ""; // Inisialisasi tautan WhatsApp

	if (houses && houses.phone) {
		// Jika houses dan nomor telepon ada
		const phoneNumber = houses.phone;

		// Menghilangkan tanda '+' jika ada di awal nomor
		let modifiedPhoneNumber = phoneNumber.replace(/^\+/, "");

		// Mengganti angka '0' di awal nomor dengan '62'
		if (modifiedPhoneNumber.startsWith("0")) {
			modifiedPhoneNumber = "62" + modifiedPhoneNumber.substr(1);
		}

		const name = houses.name;
		housePrice = formattedPrice(houses.harga_perbulan); // Harga houses (Anda dapat mengganti nilainya)

		const whatsappMessage = `Saya tertarik dengan kosan ${name} seharga ${housePrice} / bulan`;

		whatsappUrl = `https://wa.me/${modifiedPhoneNumber}?text=${encodeURIComponent(
			whatsappMessage
		)}`;
	}

	return (
		<React.Fragment>
			<LayoutWeb>
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
					<div className="container" style={{ paddingTop: "80px" }}>
						<div className="row">
							<div className="col-md-7 mb-4">
								<div className="card border-0 rounded shadow-sm">
									<div className="card-body">
										<h4>{houses.name}</h4>
										<div className="d-lg-flex justify-content-between">
											<h6 className="text-success">
												{formattedPrice(houses.harga_perbulan)} /bulan
											</h6>
											<h6 className="text-warning">
												{formattedPrice(houses.harga_pertahun)} /tahun
											</h6>
										</div>
										<span className="card-text">
											<i className="fa fa-map-marker"></i>{" "}
											<i>{houses.address}</i>
										</span>
										<Button
											variant="success"
											className="w-100 mt-2"
											onClick={storePesan}
											disabled={loading}
										>
											{loading ? 'Memproses...' : 'Pesan Kos'}
										</Button>
										<hr />
										<ImageGallery items={images} />
										<div
											dangerouslySetInnerHTML={{ __html: houses.description }}
										/>
									</div>
								</div>
							</div>
							<div className="col-md-5 mb-4">
								<div className="card border-0 rounded shadow-sm">
									<div className="card-body">
										<h5>
											<i className="fa fa-map-marked-alt"></i> MAPS
										</h5>
										<hr />
										<div
											ref={mapContainer}
											className="map-container"
											style={{ height: "400px" }}
										/>

										<div className="d-grid gap-2">
											<Link
												to={`/kosan/${houses.slug}/direction?longitude=${houses.longitude}&latitude=${houses.latitude}`}
												className="float-end btn btn-success btn-block btn-md mt-3"
											>
												<i className="fa fa-location-arrow"></i> Lihat Lokasi
												Kos (GIS)
											</Link>
											{/* <a
												href={directionLink}
												className="float-end btn btn-outline-success btn-block btn-md "
												target="_blank"
											>
												<i className="bi bi-map-fill"></i> Lokasi Kos (Google
												Maps)
											</a> */}
										</div>
									</div>
									<hr />
									<div className="card-body">
										<div className="row">
											<div className="col-md-2 col-2">
												<div className="icon-info-green">
													<i className="fa fa-map-marker-alt"></i>
												</div>
											</div>
											<div className="col-md-10 col-10">
												<div className="capt-info fw-bold">Alamat</div>
												<div className="sub-title-info">
													<i>{houses.address}</i>
												</div>
											</div>
											<div className="col-md-2 col-2">
												<div className="icon-info-green">
													<i className="fa fa-phone"></i>
												</div>
											</div>
											<div className="col-md-10 col-10">
												<div className="capt-info fw-bold">Nomor Whatsapp</div>
												<div className="sub-title-info">{houses.phone}</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</LayoutWeb>
		</React.Fragment>
	);
}

export default WebKosanShow;
