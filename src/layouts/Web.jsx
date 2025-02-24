import React from "react";

//import component Header
import Header from "../components/web/Header";

import "./Web.css";
import Footer from "../components/web/Footer";

const LayoutWeb = ({ children }) => {
	return (
		<React.Fragment>
			<Header />
			{children}
			<Footer />
		</React.Fragment>
	);
};

export default LayoutWeb;
