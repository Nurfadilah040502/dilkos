//import hook react
import React, { useState } from "react";

//import BASE URL API
import Api from "../../api";

//import toats
import toast from "react-hot-toast";

//import js cookie
import Cookies from "js-cookie";

//import react router dom
import { Link, useNavigate } from "react-router-dom";

import ImgLogin from "../../assets/images/bg-login.jpg";
import ImgLogin2 from "../../assets/images/rumah.png";

import "../../assets/css/Login.css";

function Daftar() {
	//title page
	document.title = "Daftar - My Kost";

	//navigate
	const navigate = useNavigate();

	//function "handleFileChangeKtp"
	const handleFileChangeKtp = e => {
		//define variable for get value image data
		const imageData = e.target.files[0];

		//check validation file
		if (!imageData.type.match("image.*")) {
			//set state "image" to null
			setFileKtp("");

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
		setFileKtp(imageData);
	};

	//state
	const [roles, setRoles] = useState("");
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [noWa, setNoWa] = useState("");
	const [fileKtp, setFileKtp] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");

	//state validation
	const [validation, setValidation] = useState({});

	//state loading
	const [isLoading, setLoading] = useState(false);

	//state validation

	//function "storeUsers"
	const storeUsers = async e => {
		e.preventDefault();

		//define formData
		const formData = new FormData();
		// console.log(roles);
		//append data to "formData"
		formData.append("roles", roles);
		formData.append("name", name);
		formData.append("email", email);
		formData.append("no_wa", noWa);
		formData.append("status", "diproses");
		formData.append("password", password);
		formData.append("file_ktp", fileKtp);
		formData.append("password_confirmation", passwordConfirmation);
		setLoading(true);

		await Api.post("/api/web/users", formData, {
			headers: {
				//header Bearer + Token
				"content-type": "multipart/form-data",
			},
		})
			.then(() => {
				//show toast
				setLoading(false);
				navigate("/login");
				toast.success("Berhasil Mendaftar, Tunggu Konfirmasi Email Dari Admin!", {
					duration: 4000,
					position: "top-right",
					style: {
						borderRadius: "10px",
						background: "#333",
						color: "#fff",
					},
				});
			})
			.catch(error => {
				//set state "validation"
				setValidation(error.response.data);
				setLoading(false);
			});
	};

	const googleLogin = (role) => {
		// Tambahkan role sebagai query parameter
		const googleUrl = `http://giskos.my.id/api/auth/google?role=${role}`;

		console.log("Redirecting to:", googleUrl); // Debugging: untuk memastikan URL terbentuk dengan benar

		window.location.href = googleUrl;

		toast.success("Tunggu....", {
			duration: 10000,
			position: "top-right",
			style: {
				borderRadius: "10px",
				background: "#333",
				color: "#fff",
			},
		});
	};


	return (
		<React.Fragment>
			<div id="login">
				<div className="row">
					<div className="col-md-6">
						<img src={ImgLogin} alt="img" className="img1" />
					</div>
					<div className="col-md-6 align-self-center" style={{ height: "90vh", overflowY: "auto" }}>
						<div className="text-center mb-4">
							<h4 style={{ color: "#048853", margin: "0" }}>
								<strong>Pendaftaran Akun</strong>
							</h4>
							<p className="m-0">Pendaftaran Akun, My Kost</p>
						</div>

						<div className="ps-md-2 pe-md-4 ps-3 pe-3">
							{validation.message && (
								<div className="alert alert-danger">{validation.message}</div>
							)}
							<form onSubmit={storeUsers}>
								<div className="mb-3">
									<label className="form-label">Daftar Sebagai</label>
									<select className="form-select" required onChange={e => setRoles(e.target.value)}>
										<option value="" selected disabled>Pilih Roles</option>
										<option value="pemilik">Pemilik</option>
										<option value="pengguna">Pengguna</option>
									</select>
								</div>
								{validation.roles && (
									<div className="alert alert-danger">{validation.roles[0]}</div>
								)}
								<div className="mb-3">
									<label className="form-label">Nama Lengkap</label>
									<input
										type="text"
										className="form-control"
										value={name}
										onChange={e => setName(e.target.value)}
										placeholder="Masukkan nama lengkap"
									/>
								</div>
								{validation.name && (
									<div className="alert alert-danger">{validation.name[0]}</div>
								)}
								<div className="mb-3">
									<label className="form-label">Email | <span className="text-danger" style={{ fontSize: "12px" }}>Email Aktif</span></label>
									<input
										type="email"
										className="form-control"
										value={email}
										onChange={e => setEmail(e.target.value)}
										placeholder="Masukkan Email"
									/>
								</div>
								{validation.email && (
									<div className="alert alert-danger">
										{validation.email[0]}
									</div>
								)}
								<div className="mb-3">
									<label className="form-label">Nomor WhatsApp</label>
									<div className="input-group">
										<span className="input-group-text">+62</span>
										<input
											type="number"
											className="form-control"
											value={noWa}
											onChange={e => setNoWa(e.target.value)}
											placeholder="Masukkan Nomor WhatsApp"
										/>
									</div>
								</div>
								{validation.no_wa && (
									<div className="alert alert-danger">
										{validation.no_wa[0]}
									</div>
								)}
								<div className="mb-3">
									{roles === 'pemilik' ? (
										<label className="form-label">Validasi Lokasi | <span className="text-danger" style={{ fontSize: "12px" }}>Format PNG</span></label>
									) : (
										<label className="form-label">Validasi Orang | <span className="text-danger" style={{ fontSize: "12px" }}>Format PNG</span></label>
									)}
									<input
										type="file"
										className="form-control"
										onChange={handleFileChangeKtp}
									/>
								</div>
								{validation.file_ktp && (
									<div className="alert alert-danger">
										{validation.file_ktp[0]}
									</div>
								)}
								<div className="mb-3">
									<label className="form-label">Password</label>
									<input
										type="password"
										className="form-control"
										value={password}
										onChange={e => setPassword(e.target.value)}
										placeholder="Masukkan Password"
									/>
								</div>
								{validation.password && (
									<div className="alert alert-danger">
										{validation.password[0]}
									</div>
								)}
								<div className="mb-3">
									<label className="form-label">Konfirmasi Password</label>
									<input
										type="password"
										className="form-control"
										value={passwordConfirmation}
										onChange={e => setPasswordConfirmation(e.target.value)}
										placeholder="Masukkan Konfirmasi Password"
									/>
								</div>
								<div className="d-flex gap-3">
									<Link to="/login" className="btn btn-outline-success w-100">
										Kembali
									</Link>
									<button
										className="btn btn-success shadow-sm rounded-sm w-100"
										type="submit"
										disabled={isLoading}
									>
										{" "}
										{isLoading ? "Loading..." : "Daftar Akun"}{" "}
									</button>
								</div>
							</form>
						</div>

						<p className="text-center mt-5">Atau</p>

						<div className="d-flex">
							<div onClick={() => googleLogin('pengguna')} style={{ cursor: "pointer" }}>
								<img className="mx-auto d-flex" src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png" alt="" style={{ width: "20%" }} />
								<p className="text-center text-muted">Daftar Sebagai Pengguna</p>
							</div>

							<div onClick={() => googleLogin('pemilik')} style={{ cursor: "pointer" }}>
								<img className="mx-auto d-flex" src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png" alt="" style={{ width: "20%" }} />
								<p className="text-center text-muted">Daftar Sebagai Pemilik</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
}

export default Daftar;
