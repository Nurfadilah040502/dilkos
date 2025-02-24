import React, { useState, useEffect } from "react";
import LayoutWeb from "../../../layouts/Web";
import Api from "../../../api";
import { Link, useNavigate } from "react-router-dom";
import ImgBeranda from "../../../assets/images/Hero Image.png";
import ImgAccent from "../../../assets/images/Accsent 1.png";
import { Modal, Spinner } from "react-bootstrap";
import Select from 'react-select';


function Home() {
	document.title = "Beranda - My Kost";

	const [modal, setModal] = useState(false);
	const [keyword, setKeyword] = useState("");
	const navigate = useNavigate();
	const searchHandler = () => {
		navigate(`/search?q=${keyword}`);
		setModal(false);
	};

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

		await Api.get(`/api/web/houses`).then((response) => {
			setHouses(response.data.data);
			setFilteredHouses(response.data.data);
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
			const priceRange = {
				"range1": [200000, 399000],
				"range2": [400000, 599000],
				"range3": [600000, 799000],
				"range4": [800000, 1000000],
				"range5": [2000000, 3990000], // assuming these ranges for yearly price
				"range6": [4000000, 5990000], // assuming these ranges for yearly price
				"range7": [6000000, 7990000],
				"range8": [8000000, 10000000]
			};

			const [minPrice, maxPrice] = priceRange[priceFilter] || [0, Infinity];

			// Check both harga_perbulan and harga_pertahun
			filtered = filtered.filter((house) => {
				return (
					(house.harga_perbulan >= minPrice && house.harga_perbulan <= maxPrice) ||
					(house.harga_pertahun >= minPrice && house.harga_pertahun <= maxPrice)
				);
			});
		}

		setFilteredHouses(filtered);
	};

	const formattedPrice = (harga) => {
		return new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(harga);
	};

	const uniqueAddresses = [...new Set(houses.map((house) => house.address))];
	const priceRanges = {
		"range1": "Rp. 200,000 - 399,000 per bulan",
		"range2": "Rp. 400,000 - 599,000 per bulan",
		"range3": "Rp. 600,000 - 799,000 per bulan",
		"range4": "Rp. 800,000 - 1,000,000 per bulan",
		"range5": "Rp. 2,000,000 - 3,990,000 per tahun",
		"range6": "Rp. 4,000,000 - 5,990,000 per tahun",
		"range7": "Rp. 6,000,000 - 7,990,000 per tahun",
		"range8": "Rp. 8,000,000 - 10,000,000 per tahun"
	};

	const customStyles = {
        menu: (provided) => ({
            ...provided,
            height: 120,  // Set the height of the dropdown
            overflowY: 'auto'  // Ensure scroll if content exceeds height
        }),
        menuList: (provided) => ({
            ...provided,
            height: 120,  // Ensure the list inside the dropdown has the same height
            overflowY: 'auto'  // Ensure scroll if content exceeds height
        }),
    };

	return (
		<React.Fragment>
			<LayoutWeb>
				<div id="hero">
					<div className="container h-100">
						<div className="row h-100">
							<div className="col-md-6 hero-tagline my-auto">
								<h1>Membantu Temukan Kosan Impian.</h1>
								<p>
									<b>My Kost</b> hadir untuk temukan Kos & Kontrakan terbaik
									untukmu, untuk disewa dengan sumber terpercaya
								</p>
							</div>
						</div>

						<img
							src={ImgBeranda}
							className="position-absolute end-0 bottom-0 img-hero"
						/>
						<img
							src={ImgAccent}
							className="accsent-img h-100 position-absolute top-0 start-0"
						/>
					</div>
				</div>

				<section id="kosan">
					<div className="container">
						<div className="row mb-md-5 mb-4">
							<div className="col-12">
								<div className="card shadow p-md-4 p-3 border-0">
									<h2 className="text-success mb-3">Filter Kosan</h2>
									<div className="row" style={{marginBottom:"64px"}}>
										<div className="col-md-6 mb-md-0 mb-3">
											<label htmlFor="alamat" className="form-label">Alamat</label>
											<Select
												id="alamat"
												options={uniqueAddresses.map(address => ({ value: address, label: address }))}
												onChange={option => setAddressFilter(option ? option.value : '')}
												styles={customStyles}  // Apply custom styles here

											/>
										</div>
										<div className="col-md-6">
											<label htmlFor="harga" className="form-label">Harga</label>
											<Select
												id="harga"
												options={Object.entries(priceRanges).map(([key, range]) => ({ value: key, label: range }))}
												onChange={option => setPriceFilter(option ? option.value : '')}
												styles={customStyles}  // Apply custom styles here

											/>
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
									<div className="col-md-4 mb-md-4 mb-3 d-flex" key={house.id} style={{ position: "relative" }}>
										<div
											className="card"
											style={{
												borderRadius: "12px 12px 0px 0px",
												overflow: "hidden",
												zIndex: -100000          // Higher z-index to ensure it's on top
											}}
										>
											{house.images.slice(0, 1).map((placeImage) => (
												<img
													src={placeImage.image}
													key={placeImage.id}
													style={{
														width: "100%",
														height: "300px",
														objectFit: "cover",
														zIndex: 1,  // Optional, if needed
														position: "relative" // Optional, if needed
													}}
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
													<h4 className="m-0 text-success">{formattedPrice(house.harga_perbulan)} <span style={{ fontSize: "13px" }}>/Bulan</span></h4>
													<h4 className="m-0 text-warning">{formattedPrice(house.harga_pertahun)} <span style={{ fontSize: "13px" }}>/Tahun</span></h4>
												</div>
												<div className="d-grid">
													{house.sisa_kamar == 0 ? (
														<button disabled className="btn btn-danger w-100">
															Kamar Kos Tidak Tersedia
														</button>
													) : (
														<Link to={`/kosan/${house.slug}`}>
															<button className="btn btn-success w-100">
																Lihat Detail
															</button>
														</Link>
													)}
												</div>
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

export default Home;
