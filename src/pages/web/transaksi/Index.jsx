//import hook from react
import React, { useEffect, useState } from "react";

//import BASE URL API
import Api from "../../../api";

import { Button, Modal, Spinner } from "react-bootstrap";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import LayoutWeb from "../../../layouts/Web";

function WebTransaksiIndex() {
	const [data, setData] = useState([]);
	//title page
	document.title = 'Transaksi - My Kost';

	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const [show2, setShow2] = useState(false);
	const handleClose2 = () => setShow2(false);
	const handleShow2 = () => setShow2(true);

	//token
	const token = Cookies.get("token");
	const navigate = useNavigate();

	const [loading, setLoading] = useState(true);

	const [statusOrder, setStatusOrder] = useState("");
	const updatePesan = async (e, item) => {
		e.preventDefault(); // Mencegah refresh halaman saat formulir disubmit
		setLoading(true);
		console.log(item);
		const formData = new FormData();
		formData.append("pembeli_id", item.pembeli_id);
		formData.append("pemilik_id", item.pemilik_id);
		formData.append("kos_id", item.kos_id);
		formData.append("metode_pembayaran", statusOrder);
		formData.append("_method", "PATCH");

		await Api.post(`/api/admin/transaksis/${item.id}`, formData, {
			//header
			headers: {
				//header Bearer + Token
				Authorization: `Bearer ${token}`,
				"content-type": "multipart/form-data",
			},
		})
			.then((response) => {
				console.log(response);
				setLoading(false);
				//show toast
				toast.success("Berhasil Konfirmasi Pesanan!", {
					duration: 4000,
					position: "top-right",
					style: {
						borderRadius: "10px",
						background: "#333",
						color: "#fff",
					},
				});
				handleClose();
				fetchData();
				//redirect dashboard page
				navigate("/transaksi");
			})
			.catch(error => {
				//set state "validation"
				console.log(error);
				setLoading(false);
			});
	};

	const [validation, setValidation] = useState({});
	const [image, setImage] = useState("");
	const handleFileChange = e => {
		//define variable for get value image data
		const imageData = e.target.files[0];

		//check validation file
		if (!imageData.type.match("image.*")) {
			//set state "image" to null
			setImage("");

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
		}

		setImage(imageData);
	};
	const handleBuktiTf = async (e, item) => {
		e.preventDefault(); // Mencegah refresh halaman saat formulir disubmit
		setLoading(true);
		console.log(item);
		const formData = new FormData();
		formData.append("pembeli_id", item.pembeli_id);
		formData.append("pemilik_id", item.pemilik_id);
		formData.append("kos_id", item.kos_id);
		formData.append("metode_pembayaran", item.metode_pembayaran);
		formData.append("bukti_tf", image);
		formData.append("_method", "PATCH");

		await Api.post(`/api/admin/transaksis/${item.id}`, formData, {
			//header
			headers: {
				//header Bearer + Token
				Authorization: `Bearer ${token}`,
				"content-type": "multipart/form-data",
			},
		})
			.then((response) => {
				console.log(response);
				setLoading(false);
				//show toast
				toast.success("Berhasil Kirim Bukti TF!", {
					duration: 4000,
					position: "top-right",
					style: {
						borderRadius: "10px",
						background: "#333",
						color: "#fff",
					},
				});
				handleClose2();
				fetchData();
				//redirect dashboard page
				navigate("/transaksi");
			})
			.catch(error => {
				//set state "validation"
				console.log(error);
				setLoading(false);
			});
	};

	//function "fetchData"
	const fetchData = async () => {
		//fetching data from Rest API
		setLoading(true);
		await Api.get("/api/admin/transaksi_pembeli", {
			headers: {
				//header Bearer + Token
				Authorization: `Bearer ${token}`,
			},
		}).then(response => {
			//set data response to state "categories"
			setData(response.data.data);
			console.log("tess", response.data.data);
			setLoading(false);
		}).catch(error => {
			//set state "validation"
			console.log(error);
			setLoading(false);
		});
	};

	//hook
	useEffect(() => {
		//call function "fetchData"
		fetchData();
	}, []);

	const formattedPrice = harga => {
		return new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(harga);
	};

	const redirectToWhatsApp = item => {
		console.log(item);
		const message = `Halo saya pengguna My Kost, Saya tertarik dengan kos ${item.kos.name
			} dengan harga ${formattedPrice(
				item.kos.harga_perbulan
			)}`;

		// Konversi nomor telepon ke format yang diharapkan oleh WhatsApp
		let phoneNumber = item.kos.phone.replace(/\D/g, "");

		// Cek apakah nomor telepon dimulai dengan '628'
		if (phoneNumber.startsWith("628")) {
			// Jika ya, tambahkan '+' di depan nomor telepon
			phoneNumber = "+" + phoneNumber;
		}

		// Cek apakah nomor telepon dimulai dengan '08'
		if (phoneNumber.startsWith("08")) {
			// Jika ya, ganti '08' menjadi '+628'
			phoneNumber = "+628" + phoneNumber.substring(2);
		}

		// Membuka tautan WhatsApp di tab atau jendela baru
		window.open(
			`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
			"_blank"
		);
	};


	return (
		<React.Fragment>
			<LayoutWeb>
				<div className="container" style={{ paddingTop: "80px", marginBottom: "400px" }}>
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
						<div className="row">
							{data &&
								data.map(item => (
									<div className="col-md-4 mt-3 mb-md-5 mb-0" key={item.id}>
										<div className="card border-0 shadow-sm p-3">
											<div className="d-flex">
												<div>
													<p className="fw-bold mb-0">
														{item.kos.name}
													</p>
													<p
														className="text-muted mb-0"
														style={{ fontSize: "13px" }}
													>
														{item.pemilik.name}
													</p>
												</div>
												<div className="ms-auto text-end">
													<p className="fw-bold text-success mb-0">
														{formattedPrice(item.kos.harga_perbulan)} /bulan
													</p>
													<hr className="m-0" />
												</div>
											</div>
											<p
												className="text-muted mb-2"
												style={{ fontSize: "13px" }}
											>
												{new Date(item.created_at).toLocaleDateString("id-ID", {
													weekday: "long",
													year: "numeric",
													month: "long",
													day: "numeric",
												})}
											</p>
											{item.status == 'Berhasil' && (
												<i
													className="text-success text-end mb-2"
													style={{ cursor: "default" }}
												>
													Status {item.status}
												</i>
											)}
											{item.status == 'dikomunikasikan' && (
												<i
													className="text-warning text-end mb-2"
													style={{ cursor: "default" }}
												>
													Status {item.status}
												</i>
											)}
											{item.status == 'Gagal' && (
												<i
													className="text-danger text-end mb-2"
													style={{ cursor: "default" }}
												>
													Status {item.status}
												</i>
											)}
											<button
												className="btn btn-sm btn-success"
												onClick={() => redirectToWhatsApp(item)}
											>
												Hubungi pemilik
											</button>
											{item.tanggal_keluar == null ? (
												<>
													{item.metode_pembayaran == 'null' || item.metode_pembayaran == null ? (
														<Button
															size="sm"
															variant="warning"
															className="w-100 mt-2 text-white"
															onClick={handleShow}
														>
															Metode Pembayaran
														</Button>
													) : (
														<div className="text-center" style={{ fontSize: "13px" }}>
															<p className="mb-0 mt-2">
																Metode Pembayaran <span className="fw-bolder"> {item.metode_pembayaran}</span>
															</p>
															{item.metode_pembayaran == 'cod' && (
																<i>Silahkan Hubungi Pemilik</i>
															)}
															{item.metode_pembayaran == 'transfer' && (
																<>
																	<i>Silahkan Lakukan Pembayaran di <br /></i>
																	<span className="fw-bolder">{item.kos.norek}, <br /> setelah itu kirim bukti pembayaran ke pemilik kos</span>
																	<Button
																		size="sm"
																		variant="warning"
																		className="w-100 mt-2 text-white"
																		onClick={handleShow2}
																	>
																		Upload Bukti Transfer
																	</Button>
																</>
															)}
														</div>
													)}
												</>
											) : (
												<>
													<div className="mt-3">
														<p className="text-center form-control fw-bold">{item.status}</p>
													</div>
													<div className="d-flex gap-3">
														<div className="mb-3 w-100">
															<label>Tanggal Masuk</label>
															<p className="form-control text-center mb-0">{item.tanggal_masuk}</p>
														</div>
														<div className="w-100">
															<label>Tanggal Keluar</label>
															<p className="form-control text-center mb-0">{item.tanggal_keluar}</p>
														</div>
													</div>
												</>
											)}

											{/* metode pembayaran */}
											<Modal show={show} onHide={handleClose}>
												<Modal.Header closeButton>
													<Modal.Title>Metode Pembayaran</Modal.Title>
												</Modal.Header>
												<Modal.Body>
													<form onSubmit={e => updatePesan(e, item)}>
														<div className="mb-3">
															<label className="form-label fw-bold">Metode Pembayaran</label>
															<select
																className="form-select"
																value={statusOrder}
																onChange={e => setStatusOrder(e.target.value)}
															>
																<option value="" disabled>Pilih Metode Pembayaran</option>
																{item.kos.metode_pembayaran == 'keduanya' && (
																	<>
																		<option value="cod">cod</option>
																		<option value="transfer">transfer</option>
																	</>
																)}
																{item.kos.metode_pembayaran == 'cod' && (
																	<>
																		<option value="cod">cod</option>
																	</>
																)}
																{item.kos.metode_pembayaran == 'transfer' && (
																	<>
																		<option value="transfer">transfer</option>
																	</>
																)}
															</select>
														</div>
														{token ? (
															<button
																type="submit"
																className="btn btn-md btn-success w-100"
																disabled={loading}
															>
																<i className="fa fa-save"></i>{" "}
																{loading ? "Loading..." : "Submit"}
															</button>
														) : (
															<Link
																className="btn btn-md btn-success w-100"
																to="/transaksi"
															>
																<i className="fa fa-save"></i>{" "}
																{loading ? "Loading..." : "Submit"}
															</Link>
														)}
													</form>
												</Modal.Body>
											</Modal>

											{/* bukti tf */}
											<Modal show={show2} onHide={handleClose2}>
												<Modal.Header closeButton>
													<Modal.Title>Bukti Transfer</Modal.Title>
												</Modal.Header>
												<Modal.Body>
													<form onSubmit={e => handleBuktiTf(e, item)}>
														<div className="mb-3">
															<label
																className="form-label"
																style={{ fontSize: "14px" }}
															>
																Bukti Transfer
															</label>
															<input
																type="file"
																className="form-control"
																style={{ fontSize: "14px" }}
																onChange={handleFileChange}
															/>
														</div>
														{validation.image && (
															<div className="alert alert-danger">
																{validation.image[0]}
															</div>
														)}
														{token ? (
															<button
																type="submit"
																className="btn btn-md btn-success w-100"
																disabled={loading}
															>
																<i className="fa fa-save"></i>{" "}
																{loading ? "Loading..." : "Submit"}
															</button>
														) : (
															<Link
																className="btn btn-md btn-success w-100"
																to="/transaksi"
															>
																<i className="fa fa-save"></i>{" "}
																{loading ? "Loading..." : "Submit"}
															</Link>
														)}
													</form>
												</Modal.Body>
											</Modal>
										</div>
									</div>
								))}
						</div>
					)}
				</div>
			</LayoutWeb>
		</React.Fragment>
	);
}

export default WebTransaksiIndex;
