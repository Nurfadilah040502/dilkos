//import React
import React, { useState, useEffect } from "react";

//import component bootstrap
import { NavDropdown } from "react-bootstrap";

//import Sidebar
import Sidebar from "../components/admin/Sidebar";

//import BASE URL API
import Api from "../api";

//import js cookie
import Cookies from "js-cookie";

//hook link
import { useNavigate, Link } from "react-router-dom";

//import toats
import toast from "react-hot-toast";

const LayoutAdmin = ({ children }) => {
	//state user
	const [user, setUser] = useState({});

	//state toggle
	const [sidebarToggle, setSidebarToggle] = useState(false);

	//navigate
	const navigate = useNavigate();

	//token
	const token = Cookies.get("token");

	//function toggle hanlder
	const sidebarToggleHandler = e => {
		e.preventDefault();

		if (!sidebarToggle) {
			//add class on body
			document.body.classList.add("sb-sidenav-toggled");

			//set state "sidebarToggle" to true
			setSidebarToggle(true);
		} else {
			//remove class on body
			document.body.classList.remove("sb-sidenav-toggled");

			//set state "sidebarToggle" to false
			setSidebarToggle(false);
		}
	};

	//fetchData
	const fetchData = async () => {
		//fetch on Rest API
		await Api.get("/api/admin/user", {
			headers: {
				//header Bearer + Token
				Authorization: `Bearer ${token}`,
			},
		}).then(response => {
			//set state "user"
			setUser(response.data);
		});
	};

	//hook useEffect
	useEffect(() => {
		//call function "fetchData"
		fetchData();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	//function logout
	const logoutHandler = async e => {
		e.preventDefault();

		await Api.post("/api/admin/logout", null, {
			headers: {
				//header Bearer + Token
				Authorization: `Bearer ${token}`,
			},
		}).then(() => {
			//remove token
			Cookies.remove("token");

			//show toast
			toast.success("Logout Successfully.", {
				duration: 4000,
				position: "top-right",
				style: {
					borderRadius: "10px",
					background: "#333",
					color: "#fff",
				},
			});

			//redirect login page
			navigate("/login");
		});
	};

	return (
		<React.Fragment>
			<div style={{ overflow: "hidden", height: "100vh" }}>
				<div className="d-flex sb-sidenav-toggled" id="wrapper">
					<div id="sidebar-wrapper" className="fixed">
						<div className="sidebar-heading bg-light text-center text-white">
							<i className="bi bi-house-check-fill fs-2"></i>
							<p className="mb-0">My Kost</p>
						</div>
						<Sidebar />
					</div>
					<div id="page-content-wrapper">
						<nav className="navbar navbar-expand-lg bg-white shadow">
							<div className="container-fluid">
								<button
									className="btn btn-success-dark"
									id="btn-togle"
									onClick={sidebarToggleHandler}
								>
									<i className="fa fa-list-ul"></i>
								</button>
								<div
									className="collapse navbar-collapse text-success"
									id="navbarSupportedContent"
								>
									<ul className="navbar-nav ms-auto mt-2 mt-lg-0">
										<NavDropdown
											title={user.name}
											className="fw-bold"
											id="basic-nav-dropdown"
										>
											{/* <NavDropdown.Divider /> */}
											<NavDropdown.Item onClick={logoutHandler}>
												<i className="fa fa-sign-out-alt me-2"></i> Logout
											</NavDropdown.Item>
											<NavDropdown.Divider />
										</NavDropdown>
									</ul>
								</div>
							</div>
						</nav>
						<div style={{ overflow: "auto", height: "100vh", paddingBottom:"80px" }}>
							<div className="container-fluid">{children}</div>
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default LayoutAdmin;
