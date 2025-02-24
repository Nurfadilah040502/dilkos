import React from "react";

//import Link
import { Link, useLocation, useNavigate } from "react-router-dom";
import Api from "../../api";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

function Sidebar() {
	//assigning location variable
	const location = useLocation();

	//destructuring pathname from location
	const { pathname } = location;

	//Javascript split method to get the name of the path in array
	const splitLocation = pathname.split("/");

	//navigate
	const navigate = useNavigate();

	//token
	const token = Cookies.get("token");

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
			<div id="menu-sidebar" className="list-group list-group-flush">
				<Link
					className={
						splitLocation[2] === "dashboard"
							? "list-group-item list-group-item-action list-group-item-light p-3 active"
							: "list-group-item list-group-item-action list-group-item-light p-3"
					}
					to="/admin/dashboard"
				>
					<i className="bi bi-bar-chart-line-fill me-2"></i> Dashboard
				</Link>
				<Link
					className={
						splitLocation[2] === "categories"
							? "list-group-item list-group-item-action list-group-item-light p-3 active"
							: "list-group-item list-group-item-action list-group-item-light p-3"
					}
					to="/admin/categories"
				>
					<i className="bi bi-tags-fill me-2"></i> Kategori
				</Link>
				<Link
					className={
						splitLocation[2] === "kosan"
							? "list-group-item list-group-item-action list-group-item-light p-3 active"
							: "list-group-item list-group-item-action list-group-item-light p-3"
					}
					to="/admin/kosan"
				>
					<i className="bi bi-house-add-fill me-2"></i>Kosan
				</Link>
				<Link
					className={
						splitLocation[2] === "user"
							? "list-group-item list-group-item-action list-group-item-light p-3 active"
							: "list-group-item list-group-item-action list-group-item-light p-3"
					}
					to="/admin/user"
				>
					<i className="bi bi-person-fill-check me-2"></i> User
				</Link>
				<Link
					className={
						splitLocation[2] === "transaksi"
							? "list-group-item list-group-item-action list-group-item-light p-3 active"
							: "list-group-item list-group-item-action list-group-item-light p-3"
					}
					to="/admin/transaksi"
				>
					<i className="bi bi-person-fill-check me-2"></i> Transaksi
				</Link>
				<div
					onClick={logoutHandler}
					className="list-group-item list-group-item-action list-group-item-light p-3"
					style={{ cursor: "pointer" }}
				>
					<i className="fa fa-sign-out-alt me-2"></i> Logout
				</div>
			</div>
		</React.Fragment>
	);
}

export default Sidebar;
