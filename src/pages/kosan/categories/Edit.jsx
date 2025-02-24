//import hook useState from react
import React, { useState, useEffect } from "react";

//import layout
import LayoutAdmin from "../../../layouts/Admin";

//import BASE URL API
import Api from "../../../api";

//import hook navigate dari react router dom
import { Link, useNavigate, useParams } from "react-router-dom";

//import js cookie
import Cookies from "js-cookie";

//import toats
import toast from "react-hot-toast";
import { Spinner } from "react-bootstrap";
import LayoutKosan from "../../../layouts/Kosan";

function CategoryEditKosan() {
	//title page
	document.title = "Edit Category - My Kost";

	//state
	const [name, setName] = useState("");
	const [image, setImage] = useState("");

	//state validation
	const [validation, setValidation] = useState({});
	const [loading, setLoading] = useState(false);

	//token
	const token = Cookies.get("token");

	//naviagte
	const navigate = useNavigate();

	//get ID from parameter URL
	const { id } = useParams();

	//function "getCategoryById"
	const getCategoryById = async () => {
		//get data from server
		setLoading(true);
		const response = await Api.get(`/api/admin/categories/${id}`, {
			//header
			headers: {
				//header Bearer + Token
				Authorization: `Bearer ${token}`,
			},
		});

		//get response data
		const data = await response.data.data;

		//assign data to state "name"
		setName(data.name);
		setLoading(false);
	};

	//hook useEffect
	useEffect(() => {
		//panggil function "getCategoryById"
		getCategoryById();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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

	//function "updateCategory"
	const updateCategory = async e => {
		e.preventDefault();
		setLoading(true);
		//define formData
		const formData = new FormData();

		//append data to "formData"
		formData.append("image", image);
		formData.append("name", name);
		formData.append("_method", "PATCH");

		await Api.post(`/api/admin/categories/${id}`, formData, {
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
				toast.success("Data Updated Successfully!", {
					duration: 4000,
					position: "top-right",
					style: {
						borderRadius: "10px",
						background: "#333",
						color: "#fff",
					},
				});

				//redirect dashboard page
				navigate("/admin/categories");
			})
			.catch(error => {
				//set state "validation"
				setValidation(error.response.data);
			});
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
										<i className="bi bi-tags-fill me-2"></i> Edit Kategori
									</span>
								</div>
							</div>
						</div>
						<div className="col-12 mt-3">
							<div className="card border-0 shadow-sm p-3">
								<form onSubmit={updateCategory}>
									<div className="mb-3">
										<label className="form-label" style={{ fontSize: "14px" }}>
											Image
										</label>
										<input
											type="file"
											className="form-control"
											onChange={handleFileChange}
											style={{ fontSize: "14px" }}
										/>
									</div>
									{validation.image && (
										<div className="alert alert-danger">
											{validation.image[0]}
										</div>
									)}
									<div className="mb-3">
										<label className="form-label" style={{ fontSize: "14px" }}>
											Category Name
										</label>
										<input
											type="text"
											className="form-control"
											value={name}
											onChange={e => setName(e.target.value)}
											placeholder="Enter Category Name"
											style={{ fontSize: "14px" }}
										/>
									</div>
									{validation.name && (
										<div className="alert alert-danger">
											{validation.name[0]}
										</div>
									)}
									<div className="d-flex gap-2 justify-content-end">
										<button className="btn btn-md btn-warning">
											<Link
												to="/admin/categories"
												className="text-white text-decoration-none"
											>
												<i className="fa fa-redo"></i> KEMBALI
											</Link>
										</button>
										<button type="submit" className="btn btn-md btn-success">
											<i className="fa fa-save"></i>{" "}
											{loading ? "Loading..." : "UPDATE"}
										</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				)}
			</LayoutKosan>
		</React.Fragment>
	);
}

export default CategoryEditKosan;
