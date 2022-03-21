import type { ChildrenOnly } from "../../types/util";

import Footer from "../Footer";


const Layout = ({ children }: ChildrenOnly) => {
	return (
		<div className="layout">
			{children}
			
			<Footer />
		</div>
	);
}

export default Layout;