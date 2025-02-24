import React, { useState, useEffect } from "react";
import LayoutAdmin from "../../../layouts/Admin";
import Api from "../../../api";
import { Link, useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { Spinner } from "react-bootstrap";
import MyImagePreview from "../../../components/admin/MyImagePreview";

function PemilikKosEdit() {
	document.title = "Edit Category - My Kost";

	const [ktp, setKtp] = useState("");
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [status, setStatus] = useState("");
	const [keterangan, setKeterangan] = useState("");
	const [validation, setValidation] = useState({});
	const [loading, setLoading] = useState(true);

	const token = Cookies.get("token");
	const navigate = useNavigate();
	const { id } = useParams();

	const getUserById = async () => {
		setLoading(true);
		const response = await Api.get(`/api/admin/users/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const data = response.data.data;
		setKtp(data.file_ktp);
		setName(data.name);
		setEmail(data.email);
		setLoading(false);
	};

	useEffect(() => {
		getUserById();
	}, []);

	const updateUser = async e => {
		e.preventDefault();
		setLoading(true);
		const formData = new FormData();
		formData.append("status", status);
		formData.append("keterangan", keterangan);
		formData.append("_method", "PATCH");

		try {
			await Api.post(`/api/admin/users/${id}`, formData, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			toast.success("Berhasil Verifikasi Successfully!", {
				duration: 4000,
				position: "top-right",
				style: {
					borderRadius: "10px",
					background: "#333",
					color: "#fff",
				},
			});
			setLoading(false)
			navigate("/admin/user");
		} catch (error) {
			setValidation(error.response.data);
		}
	};

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
						<div className="col-12">
							<div className="card border-0 rounded shadow-sm border-top-success">
								<div className="card-header bg-white">
									<span className="text-success">
										<i className="bi bi-tags-fill me-2"></i> Verifikasi Data Pengguna
									</span>
								</div>
							</div>
						</div>
						<div className="col-12 mt-3">
							<div className="card border-0 shadow-sm p-3">
								<form onSubmit={updateUser}>
									<div className="row">
										<div className="col-md-4">
											<div style={{ zIndex: "9999" }}>
												<MyImagePreview
													imageUrl={`https://giskos.my.id/storage/file_ktp/` + ktp}
													keterangan={name}
												/>
											</div>
										</div>
										<div className="col-md-8">
											<div className="mb-3">
												<label className="form-label" style={{ fontSize: "14px" }}>
													Full Name
												</label>
												<input
													type="text"
													disabled
													className="form-control"
													value={name}
													style={{ fontSize: "14px" }}
													onChange={e => setName(e.target.value)}
													placeholder="Enter Full Name"
												/>
											</div>
											<div className="mb-3">
												<label className="form-label" style={{ fontSize: "14px" }}>
													Email Address
												</label>
												<input
													disabled
													type="text"
													className="form-control"
													value={email}
													style={{ fontSize: "14px" }}
													onChange={e => setEmail(e.target.value)}
													placeholder="Enter Email Address"
												/>
											</div>
											<div className="mb-3">
												<label className="form-label" style={{ fontSize: "14px" }}>
													Pilih Verifikasi
												</label>
												<div>
													<button
														type="button"
														className={`btn ${status === '1' ? 'btn-success' : 'btn-outline-success'}`}
														onClick={() => setStatus('1')}
														style={{ fontSize: "14px", marginRight: "10px" }}
													>
														Diterima
													</button>
													<button
														type="button"
														className={`btn ${status === '0' ? 'btn-danger' : 'btn-outline-danger'}`}
														onClick={() => setStatus('0')}
														style={{ fontSize: "14px" }}
													>
														Tidak Diterima
													</button>
												</div>
												{validation.status && (
													<div className="alert alert-danger" style={{ marginTop: "10px" }}>
														{validation.status[0]}
													</div>
												)}
											</div>

											<div className="mb-3">
												<label className="form-label" style={{ fontSize: "14px" }}>
													Keterangan
												</label>
												<textarea
													className="form-control"
													value={keterangan}
													onChange={e => setKeterangan(e.target.value)}
													placeholder="Enter Keterangan"
													style={{ fontSize: "14px", height: "100px" }}
													required
												/>
												{validation.keterangan && (
													<div className="alert alert-danger">
														{validation.keterangan[0]}
													</div>
												)}
											</div>
										</div>
									</div>
									<div className="d-flex justify-content-end gap-2">
										<button type="reset" className="btn btn-md btn-warning">
											<Link
												to="/admin/user"
												className="text-white text-decoration-none"
											>
												<i className="fa fa-redo"></i> KEMBALI
											</Link>
										</button>
										<button type="submit" className="btn btn-md btn-success">
											<i className="fa fa-save"></i> VERIFIKASI
										</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				)}
			</LayoutAdmin>
		</React.Fragment>
	);
}

export default PemilikKosEdit;
