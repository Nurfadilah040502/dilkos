import React, { useState, useEffect } from "react";
import LayoutWeb from "../../../layouts/Web";
import { Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import Api from "../../../api";

function WebKosanIndex() {
	// title page
	document.title = "Kosan - My Kost";

	const [houses, setHouses] = useState([]);
	const [filteredHouses, setFilteredHouses] = useState([]);
	const [loading, setLoading] = useState(true);

	const [currentPage, setCurrentPage] = useState(1);
	const [perPage, setPerPage] = useState(0);
	const [total, setTotal] = useState(0);

	const [addressFilter, setAddressFilter] = useState("");
	const [priceFilter, setPriceFilter] = useState("");

	const fetchDataHouse = async (pageNumber) => {
		const page = pageNumber ? pageNumber : currentPage;
		setLoading(true);

		await Api.get(`/api/web/houses?page=${page}`).then((response) => {
			setHouses(response.data.data.data);
			setFilteredHouses(response.data.data.data);
			setCurrentPage(response.data.data.current_page);
			setPerPage(response.data.data.per_page);
			setTotal(response.data.data.total);
			setLoading(false);
		});
	};

	useEffect(() => {
		fetchDataHouse();
	}, []);

	useEffect(() => {
		handleFilterChange();
	}, [addressFilter, priceFilter]);

	const handleFilterChange = () => {
		let filtered = houses;

		if (addressFilter) {
			filtered = filtered.filter((house) => house.address === addressFilter);
		}
		
		if (priceFilter) {
			const selectedPrice = parseInt(priceFilter);
			filtered = filtered.filter((house) => house.price == selectedPrice);
		}
		
		if(priceFilter && addressFilter){
			const selectedPrice = parseInt(priceFilter);

			filtered = filtered.filter((house) => house.price == selectedPrice && house.address === addressFilter)
		}

		setFilteredHouses(filtered);
	};

	const formattedPrice = (price) => {
		return new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(price);
	};

	const uniqueAddresses = [...new Set(houses.map((house) => house.address))];
	const uniquePrices = [...new Set(houses.map((house) => house.price))];

	return (
		<React.Fragment>
			<LayoutWeb>
				<section id="hero-kosan" className="d-flex align-items-center">
					<div className="container">
						<div className="row">
							<div
								className="col-12 text-center"
								data-aos="fade-up"
								data-aos-duration="1000"
							>
								<h2>Temukan Kosan Impian</h2>
								<p>
									Sekarang Anda dapat menghemat biaya tempat tinggal dengan
									kosan rekomendasi terbaik dari My Kost
								</p>
								<a href="#kosan" className="btn btn-success mt-5">
									<i className="bi bi-arrow-down me-2 animated-icon"></i>
									Dapatkan Kosan
								</a>
							</div>
						</div>
					</div>
				</section>
				<section id="kosan">
					<div className="container">
						<div className="row mb-md-5 mb-4">
							<div className="col-12">
								<div className="card shadow p-md-4 p-3 border-0">
									<h2 className="text-success mb-3">Filter Kosan</h2>
									<div className="row">
										<div className="col-md-6 mb-md-0 mb-3">
											<label htmlFor="alamat" className="form-label">Alamat</label>
											<select
												name="alamat"
												id="alamat"
												className="form-select"
												value={addressFilter}
												onChange={(e) => setAddressFilter(e.target.value)}
											>
												<option value="">Pilih Lokasi</option>
												{uniqueAddresses.length > 0 ? (
													uniqueAddresses.map((address, index) => (
														<option key={index} value={address}>{address}</option>
													))
												) : (
													<option value="">Tidak Ada Pilihan</option>
												)}
											</select>
										</div>
										<div className="col-md-6">
											<label htmlFor="harga" className="form-label">Harga</label>
											<select
												name="harga"
												id="harga"
												className="form-select"
												value={priceFilter}
												onChange={(e) => setPriceFilter(e.target.value)}
											>
												<option value="">Pilih Harga</option>
												{uniquePrices.length > 0 ? (
													uniquePrices.map((price, index) => (
														<option key={index} value={price}>{formattedPrice(price)}</option>
													))
												) : (
													<option value="">Tidak Ada Pilihan</option>
												)}
											</select>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="row">
							{loading ? (
								<div
									className="d-flex justify-content-center align-items-center"
									style={{ height: "75vh" }}
								>
									<Spinner animation="border" variant="success" role="status">
										<span className="sr-only">Loading...</span>
									</Spinner>
								</div>
							) : (
								(filteredHouses.length > 0 ? filteredHouses : houses).map((house) => (
									<div className="col-md-4 mb-3" key={house.id}>
										<div className="card" style={{ borderRadius: "12px 12px 0px 0px", overflow: "hidden" }}>
											{house.images.slice(0, 1).map((placeImage) => (
												<img
													src={placeImage.image}
													key={placeImage.id}
													style={{ width: "100%", height: "300px", objectFit: "cover" }}
												/>
											))}
											<div className="card-body">
												<div className="d-flex">
													<span className="border px-3 py-1 rounded-2" style={{ fontSize: "12px" }}>
														{house.category.name}
													</span>
													<i className="text-danger" style={{ fontSize: "12px", alignSelf: "center", marginLeft: "auto" }}>
														Sisa {house.sisa_kamar} Kamar
													</i>
												</div>
												<div className="my-3">
													<p className="mt-2 mb-0" style={{ fontSize: "13px" }}>
														{house.name}
													</p>
													<p className="mb-2 fw-bold" style={{ fontSize: "13px" }}>
														{house.address}
													</p>
													<h4 className="m-0">{formattedPrice(house.price)}</h4>
												</div>
												<Link to={`/kosan/${house.slug}`}>
													<button className="btn btn-success w-100">
														Lihat Detail
													</button>
												</Link>
											</div>
										</div>
									</div>
								))
							)}
						</div>
					</div>
				</section>
			</LayoutWeb>
		</React.Fragment>
	);
}

export default WebKosanIndex;
