//import hook react
import React, { useEffect, useState } from "react";

//import hook useParams react router dom
import { Link, useParams } from "react-router-dom";

//import layout web
import LayoutWeb from "../../../layouts/Web";

//import BASE URL API
import Api from "../../../api";
import { Spinner } from "react-bootstrap";

function WebCategoryShow() {
	const [category, setCategory] = useState({});
	const [houses, setHouses] = useState([]);

	const [loading, setLoading] = useState(true);

	//get params from url
	const { slug } = useParams();

	//function "fetchDataCategory"
	const fetchDataCategory = async () => {
		//fetching Rest API
		setLoading(true);
		await Api.get(`/api/web/categories/${slug}`).then(response => {
			//set data to state "category"
			setCategory(response.data.data);

			//set data to state "houses"
			setHouses(response.data.data.houses);

			//set title from state "category"
			document.title = `Kategori : ${response.data.data.name} - My Kost`;
			setLoading(false);
		});
	};

	//hook
	useEffect(() => {
		//call function "fetchDataCategory"
		fetchDataCategory();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [slug]);


	const formattedPrice = (harga_perbulan) => {
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
						<div className="col-md-12">
							<h4>
								Kategori :{" "}
								<strong className="text-uppercase">{category.name}</strong>
							</h4>
							<hr />
						</div>
					</div>
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
						<div className="row">
							{houses.length > 0 ? (
								houses.map(house => (
									<div className="col-md-4 mb-md-4 mb-3 d-flex" key={house.id}>
										<div
											className="card"
											style={{
												borderRadius: "12px 12px 0px 0px",
												overflow: "hidden",
											}}
										>
											{house.images.slice(0, 1).map(placeImage => (
												<img
													src={placeImage.image}
													key={placeImage.id}
													style={{
														width: "100%",
														height: "300px",
														objectFit: "cover",
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
													<h4 className="m-0 text-success">{formattedPrice(house.harga_perbulan)} <span style={{ fontSize: "13px" }}>/Bulan</span> </h4>
													<h4 className="m-0 text-warning">{formattedPrice(house.harga_pertahun)} <span style={{ fontSize: "13px" }}>/Tahun</span> </h4>
												</div>
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
								))
							) : (
								<div
									className="alert alert-danger border-0 rounded shadow-sm"
									role="alert"
								>
									<strong>Opps.....!</strong> Data Masih Kosong!.
								</div>
							)}
						</div>
					)}
				</div>
			</LayoutWeb>
		</React.Fragment>
	);
}

export default WebCategoryShow;
