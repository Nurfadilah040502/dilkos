//import react
import React, { useState, useEffect } from "react";

//import layout penjual
import LayoutPemilik from "../../../layouts/Kosan";
import DataTable from "react-data-table-component";
import { Button, Modal, Spinner } from "react-bootstrap";
import Cookies from "js-cookie";
import Api from "../../../api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function TransaksiIndexPemilik() {
	const [data, setData] = useState([]);

	document.title = "Transaksi - My Kost";

	//token
	const token = Cookies.get("token");

	const [loading, setLoading] = useState(true);
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = (item) => {
		setSelectedItem(item);
		// console.log(item);
		setStatus(item.status || '');
		setTanggalMasuk(item.tanggal_masuk || '');
		setTanggalKeluar(item.tanggal_keluar || '');
		setShow(true);
	}; const navigate = useNavigate();

	const [status, setStatus] = useState("");
	const [tanggalMasuk, setTanggalMasuk] = useState("");
	const [tanggalKeluar, setTanggalKeluar] = useState("");
	const [selectedItem, setSelectedItem] = useState(null);


	//function "fetchData"
	const fetchData = async () => {
		setLoading(true);
		try {
			const response = await Api.get("/api/admin/transaksi_pemilik", {
				headers: {
					Authorization: `Bearer ${token}`,
				}
			});
			setData(response.data.data);
			console.log(response.data.data);
			setLoading(false);
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	};	

	const updatePesan = async (e) => {
		e.preventDefault();
		setLoading(true);

		const formData = new FormData();
		formData.append('pembeli_id', selectedItem.pembeli_id);
		formData.append('pemilik_id', selectedItem.pemilik_id);
		formData.append('kos_id', selectedItem.kos_id);
		formData.append('status', status);
		formData.append('tanggal_masuk', tanggalMasuk);
		formData.append('tanggal_keluar', tanggalKeluar);
		formData.append('metode_pembayaran', selectedItem.metode_pembayaran);
		formData.append('_method', 'PATCH');

		try {
			const response = await Api.post(`/api/admin/transaksis/${selectedItem.id}`, formData, {
				headers: {
					Authorization: `Bearer ${token}`,
					'content-type': 'multipart/form-data',
				},
			});
			console.log(response);
			setLoading(false);
			toast.success('Berhasil Konfirmasi Pesanan!', {
				duration: 4000,
				position: 'top-right',
				style: {
					borderRadius: '10px',
					background: '#333',
					color: '#fff',
				},
			});
			handleClose();
			fetchData();
			navigate('/kosan/transaksi');
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
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
			name: "Tanggal Masuk",
			selector: row => row.tanggal_masuk,
			sortable: true,
		},
		{
			name: "Harga Pertahun",
			selector: row => row.tanggal_keluar,
			sortable: true,
		},
		{
			name: "Metode Pembayaran/Bukti Transfer",
			selector: row => (
				row.metode_pembayaran === "transfer" ? (
					<>
						<img
							src={`https://giskos.my.id/storage/transaksi/` + row.bukti_tf}
							alt={row.name}
							style={{ width: "50px", padding: "4px 0px" }}
						/>
						<p>Transfer</p>
					</>
				) : <p>cod</p>
			),
			sortable: true,
		},
		{
			name: "Keterangan",
			selector: row => (
				<>
					{row.status === null && <p className="mb-0 text-warning">Proses</p>}
					{row.status !== null && <p className="mb-0">{row.status}</p>}
				</>
			),
			sortable: true,
		},
		{
			name: "Aksi",
			selector: row => (
				<>
					<Button
						size="sm"
						variant="warning"
						className="w-100 text-white"
						onClick={() => handleShow(row)}
					>
						Konfirmasi
					</Button>

					<Modal show={show} onHide={handleClose}>
						<Modal.Header closeButton>
							<Modal.Title>Metode Pembayaran</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<form onSubmit={updatePesan}>
								<div className="mb-3">
									<label className="form-label fw-bold">Status</label>
									<input
										type="text"
										className="form-control"
										value={status}
										onChange={e => setStatus(e.target.value)}
									/>
								</div>
								<div className="mb-3">
									<label className="form-label fw-bold">Tanggal Masuk</label>
									<input
										type="date"
										className="form-control"
										value={tanggalMasuk}
										onChange={e => setTanggalMasuk(e.target.value)}
									/>
								</div>
								<div className="mb-3">
									<label className="form-label fw-bold">Tanggal Keluar</label>
									<input
										type="date"
										className="form-control"
										value={tanggalKeluar}
										onChange={e => setTanggalKeluar(e.target.value)}
									/>
								</div>
								<Button variant="primary" type="submit">
									Update
								</Button>
							</form>
						</Modal.Body>
					</Modal>
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
			<LayoutPemilik>
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
			</LayoutPemilik>
		</React.Fragment>
	);
}

export default TransaksiIndexPemilik;
