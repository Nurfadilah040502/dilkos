//import react and hook
import React, { useState, useEffect } from "react";

//import component react bootstrap
import { Navbar, Container, Nav, NavDropdown, Modal } from "react-bootstrap";

//import react router dom
import { Link, useNavigate } from "react-router-dom";

//import BASE URL API
import Api from "../../api";

//import js cookie
import Cookies from "js-cookie";

import Logo from "../../assets/images/Logo Icon.png";
import toast from "react-hot-toast";

function WebHeader() {
	//state categories
	const [categories, setCategories] = useState([]);
	const [user, setUser] = useState({});

	//token
	const token = Cookies.get("token");

	//function "fetchDataCategories"
	const fetchDataCategories = async () => {
		//fetching Rest API "categories"
		await Api.get("/api/web/categories").then(response => {
			//set data to state
			setCategories(response.data.data);
		});
	};

	//function "fetchDataUser"
	const fetchDataUser = async () => {
		//fetching Rest API "user"
		await Api.get("/api/admin/user", {
			headers: {
				//header Bearer + Token
				Authorization: `Bearer ${token}`,
			},
		}).then(response => {
			//set data to state
			setUser(response.data);
		});
	};

	//hook
	useEffect(() => {
		//call function "fetchDataCategories"
		fetchDataCategories();

		//if token already exists
		if (token) {
			//call function "fetchDataUser"
			fetchDataUser();
		}

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
			fetchDataUser()

			//redirect login page
			navigate("/");
		});
	};

	return (
		<React.Fragment>
			<Navbar
				collapseOnSelect
				expand="lg"
				className="navbar navbar-expand-lg navbar-dark position-fixed w-100 bg-success"
			>
				<Container>
					<Navbar.Brand as={Link} to="/" className="fw-bold text-white">
						<img src={Logo} className="mx-2" alt="" width="30" />
						My Kost
					</Navbar.Brand>
					<Navbar.Toggle aria-controls="responsive-navbar-nav" />
					<Navbar.Collapse id="responsive-navbar-nav">
						<Nav className="mx-auto" style={{ gap: "0px 14px" }}>
							<Nav.Link as={Link} to="/" className="text-white">
								<i className="bi bi-bar-chart-line-fill"></i> Beranda
							</Nav.Link>
							<NavDropdown
								title={
									<span>
										<i className="bi bi-tags-fill"></i> Kategori
									</span>
								}
								id="collasible-nav-dropdown"
								className="text-white"
							>
								{categories.map(category => (
									<NavDropdown.Item
										as={Link}
										to={`/kategori/${category.slug}`}
										key={category.id}
									>
										<img
											src={category.image}
											style={{ width: "35px" }}
											alt=""
										/>{" "}
										{category.name}
									</NavDropdown.Item>
								))}
								<NavDropdown.Divider />
							</NavDropdown>
							{/* <Nav.Link as={Link} to="/kosan" className="text-white">
								<i className="bi bi-house-check-fill"></i> Kosan
							</Nav.Link> */}
							<Nav.Link as={Link} to="/maps" className="text-white">
								<i className="fa fa-map"></i> Maps
							</Nav.Link>
							{token && (
								<Nav.Link as={Link} to="/transaksi" className="text-white">
									<i className="fa fa-check"></i> Transaksi
								</Nav.Link>
							)}
						</Nav>
						{token ? (
							<Nav>
									<button onClick={logoutHandler} className="button-secondary">LOGOUT</button>
							</Nav>
						) : (
							<Nav>
								<Link to="/login">
									<button className="button-secondary">LOGIN</button>
								</Link>
							</Nav>
						)}
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</React.Fragment>
	);
}

export default WebHeader;
