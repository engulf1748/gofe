import { Html, Head, Main, NextScript } from 'next/document';

import config from '../data/config';

const Document = () => {
	return (
		<Html>
			<Head>
				<link rel="preconnect" href={config.apiURL} />
			</Head>

			<body>
				<Main />
				<NextScript />
			</body>

		</Html>
	);
}

export default Document;