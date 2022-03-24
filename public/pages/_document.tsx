import { Html, Head, Main, NextScript } from 'next/document';

import config from '../../config.json';

const Document = () => {
	return (
		<Html>
			<Head>
				<link rel="preconnect" href={config.api_domain} />
				<link
					rel="search"
					type="application/opensearchdescription+xml"
					title="Gofë Search"
					href={`${config.api_domain}/opensearch.xml`}/>
			</Head>

			<body>
				<Main />
				<NextScript />
			</body>

		</Html>
	);
}

export default Document;