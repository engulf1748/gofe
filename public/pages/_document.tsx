import { Html, Head, Main, NextScript } from 'next/document';

import config from '../../config.json';

const Document = () => {
	return (
		<Html>
			<Head>
				{/*
					user-scalable=no prevents automatic zooming on mobile
					devices after focusing the input.
				*/}
				<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />

				<link rel="preconnect" href={config.api_domain} />
				<link
					rel="search"
					type="application/opensearchdescription+xml"
					title="Gofë Search"
					href={`${config.api_domain}/opensearch.xml`}
				/>
			</Head>

			<body>
				<Main />
				<NextScript />
			</body>

		</Html>
	);
}

export default Document;