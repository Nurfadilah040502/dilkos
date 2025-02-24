import React, { useState, useEffect } from "react";
import Api from "../../api";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import ImgLogin from "../../assets/images/bg-login.jpg";
import ImgLogin2 from "../../assets/images/rumah.png";
import "../../assets/css/Login.css";

function Login() {
	// title page
	document.title = "Login - My Kost";

	// navigate
	const navigate = useNavigate();

	// state user
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	// state loading
	const [isLoading, setLoading] = useState(false);

	// state validation
	const [validation, setValidation] = useState({});

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const token = urlParams.get("token");
		const role = urlParams.get("role");
// console.log(role);
		if (token) {
			// Save token to Cookies
			Cookies.set("token", token);

			// Redirect based on role
			if (role == "pemilik") {
				navigate("/kosan/kosan/create");
			} else if (role === "pengguna") {
				navigate("/");
			} else {
				navigate("/");
			}

			// Show success toast
			toast.success("Login Successfully.", {
				duration: 4000,
				position: "top-right",
				style: {
					borderRadius: "10px",
					background: "#333",
					color: "#fff",
				},
			});
		}
	}, [navigate]);

	// function "loginHandler"
	const loginHandler = async (e) => {
		e.preventDefault();

		// set state isLoading to "true"
		setLoading(true);

		await Api.post("/api/admin/login", {
			email: email,
			password: password,
		})
			.then((response) => {
				// set state isLoading to "false"
				setLoading(false);

				// show toast
				toast.success("Login Successfully.", {
					duration: 4000,
					position: "top-right",
					style: {
						borderRadius: "10px",
						background: "#333",
						color: "#fff",
					},
				});

				// set cookie
				Cookies.set("token", response.data.token);

				// cek rute sebelumnya dari localStorage
				const redirectPath = localStorage.getItem("redirectAfterLogin");
				const housesData = localStorage.getItem("housesData");

				localStorage.removeItem("redirectAfterLogin"); // hapus rute setelah login
				localStorage.removeItem("housesData"); // hapus data setelah login

				// redirect ke rute yang sesuai
				if (response.data.user.roles === "admin") {
					navigate("/admin/dashboard");
				} else if (response.data.user.roles === "pemilik") {
					navigate("/kosan/kosan/create");
				} else if (redirectPath && housesData) {
					// Redirect back to previous page and trigger storePesan
					const parsedHouses = JSON.parse(housesData);
					navigate(redirectPath, { state: { houses: parsedHouses } });
				} else {
					navigate("/");
				}
			})
			.catch((error) => {
				// set state isLoading to "false"
				setLoading(false);

				// set error response validasi to state "validation"
				setValidation(error.response.data);
			});
	};

	const googleLogin = () => {
		window.location.href = 'http://giskos.my.id/api/auth/google';
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
						<div className="text-center">
							<h4 style={{ color: "#048853", margin: "0" }}>
								<strong>Halaman Login</strong>
							</h4>
							<p className="m-0">Selamat Datang di My Kost</p>
							<Link to="/">
								<img src={ImgLogin2} alt="img" className="img2" />
							</Link>
						</div>
			
						<div className="ps-md-2 pe-md-4 ps-3 pe-3">
							{validation.message && (
								<div className="alert alert-danger">{validation.message}</div>
							)}
							<form onSubmit={loginHandler}>
								<div className="mb-3">
									<label className="form-label">Email</label>
									<input
										type="email"
										className="form-control"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										placeholder="Masukkan Email"
									/>
								</div>

								{validation.email && (
									<div className="alert alert-danger">
										{validation.email[0]}
									</div>
								)}

								<div className="mb-3">
									<label className="form-label">Password</label>
									<input
										type="password"
										className="form-control"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										placeholder="Enter Password"
									/>
								</div>
								{validation.password && (
									<div className="alert alert-danger">
										{validation.password[0]}
									</div>
								)}
								<div className="d-flex gap-3">
									<Link to="/daftar" className="btn btn-outline-success w-100">
										Daftar
									</Link>
									<button
										className="btn btn-success shadow-sm rounded-sm w-100"
										type="submit"
										disabled={isLoading}
									>
										{isLoading ? "Loading..." : "Login"}
									</button>
								</div>
							</form>
						</div>

						<p className="text-center mt-5">Atau</p>

						<div onClick={googleLogin} style={{ cursor: "pointer" }}>
							<img className="mx-auto d-flex" src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png" alt="" style={{ width: "10%" }} />
							<p className="text-center text-muted">Login Dengan Google</p>
						</div>

					</div>
				</div>
			</div>
		</React.Fragment>
	);
}

export default Login;
