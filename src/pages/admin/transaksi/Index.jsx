//import react
import React, { useState, useEffect } from "react";

//import layout penjual
import LayoutAdmin from "../../../layouts/Admin";
import DataTable from "react-data-table-component";
import { Spinner } from "react-bootstrap";
import Cookies from "js-cookie";
import Api from "../../../api";

function TransaksiIndexAdmin() {
	const [data, setData] = useState([]);

	document.title = "Transaksi - My Kost";

	//token
	const token = Cookies.get("token");

	const [loading, setLoading] = useState(true);

	//function "fetchData"
	const fetchData = async () => {
		//fetching data from Rest API
		setLoading(true);
		await Api.get("/api/admin/transaksis", {
			headers: {
				//header Bearer + Token
				Authorization: `Bearer ${token}`,
			},
		}).then(response => {
			//set data response to state "categories"
			setData(response.data.data);
			console.log(response.data.data);
			setLoading(false);
		});
	};

	//hook
	useEffect(() => {
		//call function "fetchData"
		fetchData();
	}, []);

	const formattedPrice = price => {
		return new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(price);
	};
	// console.log(data);
	const columns = [
		{
			name: "No",
			selector: (row, index) => index + 1 + '.',
			sortable: true,
		},
		{
			name: "Nama Pemilik",
			selector: row => row.pemilik.name,
			sortable: true,
		},
		{
			name: "Waktu Pesan",
			selector: row => new Date(row.created_at).toLocaleDateString("id-ID", {
				weekday: "long",
				year: "numeric",
				month: "long",
				day: "numeric",
			}),
			sortable: true,
		},
		{
			name: "Nama Pemesan",
			selector: row => row.pembeli.name,
			sortable: true,
		},
		{
			name: "Nama Kos",
			selector: row => row.kos.name,
			sortable: true,
		},
		{
			name: "Harga Perbulan",
			selector: row => formattedPrice(row.kos.harga_perbulan),
			sortable: true,
		},
		{
			name: "Harga Pertahun",
			selector: row => formattedPrice(row.kos.harga_pertahun),
			sortable: true,
		},
		{
			name: "Status",
			selector: row => (
				<>
					{row.status == null ? '-' : row.status}
				</>
			),
			sortable: true,
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

	return (
		<React.Fragment>
			<LayoutAdmin>
				{loading ? (
					<div
						className="d-flex justify-content-center align-items-center"
						style={{ height: "100vh" }}
					>
						<Spinner animation="border" variant="primary" role="status">
							<span className="sr-only"></span>
						</Spinner>
					</div>
				) : (
					<div className="row mt-4">
						<div className="col-12">
							<div className="card border-0 rounded shadow-sm border-top-success">
								<div className="card-header bg-white">
									<span className="font-weight-bold text-success">
										<i className="bi bi-person-fill-check me-2"></i> HALAMAN
										TRANSAKSI
									</span>
								</div>
							</div>
						</div>
						<div className="col-12 mt-3">
							<div className="card border-0 shadow-sm p-3">
								<div className="d-flex pb-2 justify-content-end">
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
									data={data && data.length > 0 ? (searchTerm ? filteredData : data) : []}
									pagination
									paginationPerPage={10} // Number of rows per page
									paginationRowsPerPageOptions={[10, 25, 50, 100]} // Options for rows per page
									highlightOnHover
									striped
									paginationTotalRows={data ? data.length : 0} // Total rows for pagination
								/>
							</div>
						</div>
					</div>
				)}
			</LayoutAdmin>
		</React.Fragment>
	);
}

export default TransaksiIndexAdmin;
