import Navigation from "../shell/Navigation";
import Footer from "../shell/Footer";

import type { ChildrenOnly } from "../../types/util";


const Layout = ({ children }: ChildrenOnly) => {
	return (
		<div className="layout">
			<Navigation />

			<div className='content-wrapper'>
				{children}
			</div>
			
			<Footer />
		</div>
	);
}

export default Layout;