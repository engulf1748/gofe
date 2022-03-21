import Head from "next/head";

import type { ChildrenOnly } from "../../types/util";

const PageTitle = ({ children }: ChildrenOnly) => (
	<Head>
		<title>{children}</title>
	</Head>
);

export default PageTitle;