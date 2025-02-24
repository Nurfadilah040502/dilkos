//import react
import React, { useState, useEffect } from "react";

//import layout admin
import LayoutAdmin from "../../../layouts/Admin";
import DataTable from "react-data-table-component";
import { Button, Modal, Spinner } from "react-bootstrap";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import Api from "../../../api";
import toast from "react-hot-toast";

function PemilikKosIndex() {
	const [show, setShow] = useState(false);
	const [data, setData] = useState([]);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	//state
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");

	//state validation
	const [validation, setValidation] = useState({});

	//token
	const token = Cookies.get("token");

	//navigate
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);

	//function "storeUsers"
	const storeUsers = async e => {
		e.preventDefault();

		//define formData
		const formData = new FormData();

		//append data to "formData"
		formData.append("name", name);
		formData.append("email", email);
		formData.append("password", password);
		formData.append("password_confirmation", passwordConfirmation);

		await Api.post("/api/admin/users", formData, {
			//header
			headers: {
				//header Bearer + Token
				Authorization: `Bearer ${token}`,
			},
		})
			.then(() => {
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
				fetchData();
				handleClose();
			})
			.catch(error => {
				//set state "validation"
				setValidation(error.response.data);
			});
	};

	//function "fetchData"
	const fetchData = async () => {
		setLoading(true);
		try {
			const response = await Api.get("/api/admin/users", {
				headers: {
					// header Bearer + Token
					Authorization: `Bearer ${token}`,
				},
			});

			// Pastikan struktur data sesuai dengan yang diharapkan
			setData(response.data.data);
		} catch (error) {
			console.error("Error fetching data:", error);
			// Tangani kesalahan sesuai kebutuhan
		} finally {
			setLoading(false);
		}
	};


	//hook
	useEffect(() => {
		//call function "fetchData"
		fetchData();
	}, []);

	const formatWhatsAppNumber = (noWa) => {
		if (!noWa) {
			return ''; // Mengembalikan string kosong atau nilai default jika noWa null atau undefined
		}
	
		if (noWa.startsWith('62')) {
			return noWa.startsWith('+') ? noWa : `+${noWa}`;
		}
		// Jika nomor dimulai dengan '0', ubah menjadi '62' dan tambahkan '+' di depannya.
		else if (noWa.startsWith('0')) {
			return `+62${noWa.slice(1)}`;
		}
		// Jika nomor tidak dimulai dengan '62' atau '0', tambahkan '+62' di depannya.
		else {
			return `+62${noWa}`;
		}
	};
	

	const columns = [
		{
			name: "No",
			selector: (row, index) => index + 1,
		},
		{
			name: "Roles",
			selector: row => row.roles,
			sortable: true,
		},
		{
			name: "Nama",
			selector: row => row.name,
			sortable: true,
		},
		{
			name: "Email",
			selector: row => row.email,
			sortable: true,
		},
		{
			name: "Nomor Whatsapp",
			selector: row => formatWhatsAppNumber(row.no_wa),
			sortable: true,
		},
		{
			name: "Status",
			selector: row => (
				<p className={row.status === '1' ? 'text-success mb-0' : 'text-danger mb-0'}>
					{row.status === '3' && 'Belum Verifikasi'}
					{row.status === '1' && 'Diterima'}
					{row.status === '0' && 'Ditolak'}
				</p>
			),
			sortable: true,
		},
		{
			name: "Foto",
			cell: row => (
				<img
					src={`https://giskos.my.id/storage/file_ktp/` + row.file_ktp}
					alt={row.name}
					style={{ width: "50px", padding: "4px 0px" }}
				/>
			),
			grow: 1,
		},
		{
			name: "Aksi",
			cell: row => (
				<div className="gap-2 d-flex">
					<button className="btn btn-sm btn-success">
						<Link to={`/admin/pemilik/edit/${row.id}`} style={{ textDecoration: "none" }}>
							<i className="bi bi-pencil-square text-white">Verifikasi</i>
						</Link>
					</button>
				</div>
			),
		},
	];

	const [searchTerm, setSearchTerm] = useState("");
	const [filteredData, setFilteredData] = useState(data);

	const handleSearch = e => {
		const keyword = e.target.value.toLowerCase();
		setSearchTerm(keyword);

		const filtered = data.filter(item =>
			Object.values(item).some(value =>
				String(value).toLowerCase().includes(keyword)
			)
		);
		setFilteredData(filtered);
	};

	//function "deleteUsers"
	const deleteUsers = row => {
		const confirmed = window.confirm("Yakin ingin menghapus item ini?");

		if (confirmed) {
			Api.delete(`/api/admin/users/${row.id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
				.then(() => {
					toast.success("Data Deleted Successfully!", {
						duration: 4000,
						position: "top-right",
						style: {
							borderRadius: "10px",
							background: "#333",
							color: "#fff",
						},
					});

					// Call function "fetchData" to refresh the data
					fetchData();
				})
				.catch(error => {
					console.error("Error deleting data:", error);
					// Handle error, show an error message, or log it
				});
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
									<span className="font-weight-bold text-success">
										<i className="bi bi-person-fill-check me-2"></i> Halaman
										Pemilik Kos
									</span>
								</div>
							</div>
						</div>
						<div className="col-12 mt-3">
							<div className="card border-0 shadow-sm p-3">
								<div className="d-flex pb-2">
									{/* <Button
										variant="success"
										style={{ fontSize: "14px" }}
										onClick={handleShow}
									>
										<i className="bi bi-plus"></i>Tambah Data
									</Button>

									<Modal centered show={show} onHide={handleClose}>
										<Modal.Header closeButton>
											<Modal.Title style={{ fontSize: "16px" }}>
												Tambah Akun Pemilik Kos
											</Modal.Title>
										</Modal.Header>
										<Modal.Body>
											<form onSubmit={storeUsers}>
												<div className="mb-3">
													<label
														className="form-label"
														style={{ fontSize: "14px" }}
													>
														Nama Lengkap
													</label>
													<input
														style={{ fontSize: "14px" }}
														type="text"
														className="form-control"
														value={name}
														onChange={e => setName(e.target.value)}
														placeholder="Masukkan nama lengkap"
													/>
												</div>
												{validation.name && (
													<div className="alert alert-danger">
														{validation.name[0]}
													</div>
												)}
												<div className="mb-3">
													<label
														className="form-label"
														style={{ fontSize: "14px" }}
													>
														Email
													</label>
													<input
														style={{ fontSize: "14px" }}
														type="email"
														className="form-control"
														value={email}
														onChange={e => setEmail(e.target.value)}
														placeholder="Masukkan Pemilik Kos"
													/>
												</div>
												{validation.email && (
													<div className="alert alert-danger">
														{validation.email[0]}
													</div>
												)}
												<div className="mb-3">
													<label
														style={{ fontSize: "14px" }}
														className="form-label"
													>
														Password
													</label>
													<input
														style={{ fontSize: "14px" }}
														type="password"
														className="form-control"
														value={password}
														onChange={e => setPassword(e.target.value)}
														placeholder="Enter Password"
													/>
												</div>
												{validation.password && (
													<div className="alert alert-danger">
														{validation.password[0]}
													</div>
												)}
												<div className="mb-3">
													<label
														style={{ fontSize: "14px" }}
														className="form-label"
													>
														Password Confirmation
													</label>
													<input
														style={{ fontSize: "14px" }}
														type="password"
														className="form-control"
														value={passwordConfirmation}
														onChange={e =>
															setPasswordConfirmation(e.target.value)
														}
														placeholder="Enter Password Confirmation"
													/>
												</div>
												<div className="justify-content-center d-flex gap-2">
													<button
														onClick={handleClose}
														className="btn btn-md btn-warning"
													>
														<i className="fa fa-redo"></i> Batal
													</button>
													<button
														type="submit"
														className="btn btn-md btn-success"
													>
														<i className="fa fa-save"></i> SAVE
													</button>
												</div>
											</form>
										</Modal.Body>
									</Modal> */}
									<div className="ms-auto">
										<input
											type="text"
											className="form-control"
											style={{ fontSize: "14px" }}
											placeholder="Search"
											onChange={handleSearch}
										/>
									</div>
								</div>
								<DataTable
									columns={columns}
									data={searchTerm ? filteredData : data}
									pagination
									paginationPerPage={10} // Number of rows per page
									paginationRowsPerPageOptions={[10, 25, 50, 100]} // Options for rows per page
									highlightOnHover
									striped
								/>
							</div>
						</div>
					</div>
				)}
			</LayoutAdmin>
		</React.Fragment>
	);
}

export default PemilikKosIndex;
