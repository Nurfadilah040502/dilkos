//import react
import React, { useState, useEffect } from "react";

//import layout admin
import LayoutKosan from "../../../layouts/Kosan";
import DataTable from "react-data-table-component";
import { Button, Modal, Spinner } from "react-bootstrap";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import Api from "../../../api";
import toast from "react-hot-toast";

function KosanIndexKosan() {
	const [data, setData] = useState([]);

	//token
	const token = Cookies.get("token");

	//navigate
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);

	//function "fetchData"
	const fetchData = async () => {
		//fetching data from Rest API
		setLoading(true);
		await Api.get("/api/admin/housesPemilik", {
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
			name: "Nama Kos",
			selector: row => row.name,
			sortable: true,
		},
		{
			name: "Kategori",
			selector: row => row.category.name,
			sortable: true,
		},
		{
			name: "Nomor WA",
			selector: row => row.phone,
			sortable: true,
		},
		{
			name: "Alamat",
			selector: row => row.address,
			sortable: true,
		},
		{
			name: "Aksi",
			cell: row => (
				<div className="gap-2 d-flex">
					<button className="btn btn-sm btn-success">
						<Link to={`/kosan/kosan/edit/${row.id}`}>
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
			Api.delete(`/api/admin/houses/${row.id}`, {
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
					<div className="row mt-4">
						<div className="col-12">
							<div className="card border-0 rounded shadow-sm border-top-success">
								<div className="card-header bg-white">
									<span className="font-weight-bold text-success">
										<i className="bi bi-house-add-fill me-2"></i> Halaman Kosan
									</span>
								</div>
							</div>
						</div>
						<div className="col-12 mt-3">
							<div className="card border-0 shadow-sm p-3">
								<div className="d-flex pb-2 justify-content-between">
									<Button variant="success" style={{ fontSize: "14px" }}>
										<Link
											to="/kosan/kosan/create"
											className="text-white text-decoration-none"
										>
											<i className="bi bi-plus"></i>Tambah Data
										</Link>
									</Button>
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
			</LayoutKosan>
		</React.Fragment>
	);
}

export default KosanIndexKosan;
