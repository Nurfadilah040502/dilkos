//import react router dom
import { Routes, Route } from "react-router-dom";

//=======================================================================
//ADMIN
//=======================================================================

//import view Login
import Login from "../pages/admin/Login.jsx";

//import component private routes
import PrivateRoute from "./PrivateRoutes";

//import view admin Dashboard
import Dashboard from "../pages/admin/dashboard/Index.jsx";
import Home from "../pages/web/home/Index.jsx";
import WebMapsIndex from "../pages/web/maps/Index.jsx";
import CategoriesIndex from "../pages/admin/categories/Index.jsx";
import KosanIndex from "../pages/admin/kosan/Index.jsx";
import PemilikKosIndex from "../pages/admin/pemilikKos/Index.jsx";
import WebKosanIndex from "../pages/web/kosan/Index.jsx";
import CategoryEdit from "../pages/admin/categories/Edit.jsx";
import PemilikKosEdit from "../pages/admin/pemilikKos/Edit.jsx";
import KosanCreate from "../pages/admin/kosan/Create.jsx";
import KosanEdit from "../pages/admin/kosan/Edit.jsx";
import WebKosanShow from "../pages/web/kosan/Show.jsx";
import WebKosanDirection from "../pages/web/kosan/Direction.jsx";
import WebCategoryShow from "../pages/web/category/Show.jsx";
import Daftar from "../pages/admin/Daftar.jsx";
import DashboardKosan from "../pages/kosan/dashboard/Index.jsx";
import CategoriesIndexKosan from "../pages/kosan/categories/Index.jsx";
import CategoryEditKosan from "../pages/kosan/categories/Edit.jsx";
import KosanEditKosan from "../pages/kosan/kosan/Edit.jsx";
import KosanCreateKosan from "../pages/kosan/kosan/Create.jsx";
import KosanIndexKosan from "../pages/kosan/kosan/Index.jsx";
import WebTransaksiIndex from "../pages/web/transaksi/Index.jsx";
import TransaksiIndexPemilik from "../pages/kosan/transaksi/Index.jsx";
import TransaksiIndexAdmin from "../pages/admin/transaksi/Index.jsx";
import PembayaranDiterima from "../pages/kosan/pembayaran_diterima/Index.jsx";

function RoutesIndex() {
	return (
		<Routes>
			{/* route "/admin/login" */}
			<Route path="/login" element={<Login />} />

			<Route path="/daftar" element={<Daftar />} />

			{/* private route "/admin/dashboard" */}
			<Route
				path="/admin/dashboard"
				element={
					<PrivateRoute>
						<Dashboard />
					</PrivateRoute>
				}
			/>
			<Route
				path="/kosan/dashboard"
				element={
					<PrivateRoute>
						<DashboardKosan />
					</PrivateRoute>
				}
			/>

			{/* private route "/admin/categories" */}
			<Route
				path="/admin/categories"
				element={
					<PrivateRoute>
						<CategoriesIndex />
					</PrivateRoute>
				}
			/>
			<Route
				path="/kosan/categories"
				element={
					<PrivateRoute>
						<CategoriesIndexKosan />
					</PrivateRoute>
				}
			/>

			{/* private route "/admin/categories/edit/:id" */}
			<Route
				path="/admin/categories/edit/:id"
				element={
					<PrivateRoute>
						<CategoryEdit />
					</PrivateRoute>
				}
			/>
			<Route
				path="/kosan/categories/edit/:id"
				element={
					<PrivateRoute>
						<CategoryEditKosan />
					</PrivateRoute>
				}
			/>

			{/* private route "/admin/kosan" */}
			<Route
				path="/admin/kosan"
				element={
					<PrivateRoute>
						<KosanIndex />
					</PrivateRoute>
				}
			/>
			<Route
				path="/kosan/kosan"
				element={
					<PrivateRoute>
						<KosanIndexKosan />
					</PrivateRoute>
				}
			/>


			{/* private route "/admin/kosan/create" */}
			<Route
				path="/admin/kosan/create"
				element={
					<PrivateRoute>
						<KosanCreate />
					</PrivateRoute>
				}
			/>
			<Route
				path="/kosan/kosan/create"
				element={
					<PrivateRoute>
						<KosanCreateKosan />
					</PrivateRoute>
				}
			/>


			{/* private route "/admin/kosan/edit/:id" */}
			<Route
				path="/admin/kosan/edit/:id"
				element={
					<PrivateRoute>
						<KosanEdit />
					</PrivateRoute>
				}
			/>
			<Route
				path="/kosan/kosan/edit/:id"
				element={
					<PrivateRoute>
						<KosanEditKosan />
					</PrivateRoute>
				}
			/>


			{/* private route "/admin/pemilik" */}
			<Route
				path="/admin/user"
				element={
					<PrivateRoute>
						<PemilikKosIndex />
					</PrivateRoute>
				}
			/>
			{/* private route "/admin/categories/edit/:id" */}
			<Route
				path="/admin/pemilik/edit/:id"
				element={
					<PrivateRoute>
						<PemilikKosEdit />
					</PrivateRoute>
				}
			/>

			<Route
				path="/admin/transaksi"
				element={
					<PrivateRoute>
						<TransaksiIndexAdmin />
					</PrivateRoute>
				}
			/>

			<Route
				path="/kosan/transaksi"
				element={
					<PrivateRoute>
						<TransaksiIndexPemilik />
					</PrivateRoute>
				}
			/>

			<Route
				path="/kosan/pembayaran-diterima"
				element={
					<PrivateRoute>
						<PembayaranDiterima />
					</PrivateRoute>
				}
			/>

			{/* route "/" */}
			<Route path="/" element={<Home />} />

			{/* route "/kategori/:slug" */}
			<Route path="/kategori/:slug" element={<WebCategoryShow />} />

			{/* route "/kosan" */}
			<Route path="/kosan" element={<WebKosanIndex />} />

			{/* route "/kosan/:slug" */}
			<Route path="/kosan/:slug" element={<WebKosanShow />} />

			{/* route "/kosan/:slug/direction" */}
			<Route path="/kosan/:slug/direction" element={<WebKosanDirection />} />

			{/* route "/maps" */}
			<Route path="/maps" element={<WebMapsIndex />} />

			<Route
				path="/transaksi"
				element={
					<PrivateRoute>
						<WebTransaksiIndex />
					</PrivateRoute>
				}
			/>
		</Routes>
	);
}

export default RoutesIndex;
