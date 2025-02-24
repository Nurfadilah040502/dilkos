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

function CategoriesIndex() {
	const [show, setShow] = useState(false);
	const [data, setData] = useState([]);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	//state
	const [name, setName] = useState("");
	const [image, setImage] = useState("");

	//state validation
	const [validation, setValidation] = useState({});

	//token
	const token = Cookies.get("token");

	//navigate
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);

	//function "handleFileChange"
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

		//assign file to state "image"
		setImage(imageData);
	};

	//function "storeCategory"
	const storeCategory = async e => {
		e.preventDefault();

		setLoading(true);
		//define formData
		const formData = new FormData();

		//append data to "formData"
		formData.append("image", image);
		formData.append("name", name);

		await Api.post("/api/admin/categories", formData, {
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
		//fetching data from Rest API
		setLoading(true);
		await Api.get("/api/admin/categories", {
			headers: {
				//header Bearer + Token
				Authorization: `Bearer ${token}`,
			},
		}).then(response => {
			//set data response to state "categories"
			setData(response.data.data);
			setLoading(false);
		});
	};

	//hook
	useEffect(() => {
		//call function "fetchData"
		fetchData();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const columns = [
		{
			name: "No",
			selector: (row, index) => index + 1,
		},
		{
			name: "Gambar",
			cell: row => (
				<img
					src={row.image}
					alt={row.name}
					style={{ width: "50px", padding: "4px 0px" }}
				/>
			),
			grow: 1,
		},
		{
			name: "Nama Kategori",
			selector: row => row.name,
			sortable: true,
		},
		{
			name: "Aksi",
			cell: row => (
				<div className="gap-2 d-flex">
					<button className="btn btn-sm btn-success">
						<Link to={`/admin/categories/edit/${row.id}`}>
							<i className="bi bi-pencil-square text-white"></i>
						</Link>
					</button>
					<button
						className="btn btn-sm btn-danger"
						onClick={() => deleteCategory(row)}
					>
						<i className="bi bi-trash"></i>
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

	//function "deleteCategory"
	const deleteCategory = row => {
		const confirmed = window.confirm("Yakin ingin menghapus item ini?");

		if (confirmed) {
			Api.delete(`/api/admin/categories/${row.id}`, {
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
										<i className="bi bi-tags-fill me-2"></i> Halaman Kategori
									</span>
								</div>
							</div>
						</div>
						<div className="col-12 mt-3">
							<div className="card border-0 shadow-sm p-3">
								<div className="d-flex pb-2 justify-content-between">
									<Button
										variant="success"
										style={{ fontSize: "14px" }}
										onClick={handleShow}
									>
										<i className="bi bi-plus"></i>Tambah Data
									</Button>

									<Modal centered show={show} onHide={handleClose}>
										<Modal.Header closeButton>
											<Modal.Title style={{ fontSize: "16px" }}>
												Tambah Kategori
											</Modal.Title>
										</Modal.Header>
										<Modal.Body>
											<form onSubmit={storeCategory}>
												<div className="mb-3">
													<label
														className="form-label"
														style={{ fontSize: "14px" }}
													>
														Gambar/Icon
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
												<div className="mb-3">
													<label
														className="form-label"
														style={{ fontSize: "14px" }}
													>
														Nama Kategori
													</label>
													<input
														style={{ fontSize: "14px" }}
														type="text"
														className="form-control"
														value={name}
														onChange={e => setName(e.target.value)}
														placeholder="Enter Category Name"
													/>
												</div>
												{validation.name && (
													<div className="alert alert-danger">
														{validation.name[0]}
													</div>
												)}
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
														disabled={loading}
													>
														<i className="fa fa-save"></i>{" "}
														{loading ? "Loading..." : "Save"}
													</button>
												</div>
											</form>
										</Modal.Body>
									</Modal>
									<div>
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

export default CategoriesIndex;
