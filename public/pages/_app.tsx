import dynamic from 'next/dynamic';
import Head from 'next/head';
import { Notifications } from '@infinium/hydro';

import SettingsProvider from '../providers/SettingsProvider';
import SearchProvider from '../providers/SearchProvider';

import '../styles/jupiterui.css';
import '../styles/global.scss';
import '../assets/fonts/inter.css';
import '@infinium/hydro/dist/style.css';

import type { AppProps } from 'next/app';
import type { ChildrenOnly } from '../types/util';

//////////

// Since the <View /> component will contain all
// of our client-only JS code, we must import it
// dynamically with SSR explicitly disabled.

const View = dynamic(
	() => import('../components/layout/View'),
	{ ssr: false }
);

//////////

const App = ({ Component, pageProps }: AppProps) => {
	// We can ignore this error here because we are
	// manually defining the layout within each component.
	// The Component type comes from NextJS and obviously
	// doesn't have the .view value. We probably could
	// merge a type here, but that is overkill for this.
	//
	// @ts-ignore
	const RootLayout = Component.layout || (({ children }: ChildrenOnly) => <>{children}</>);

	return (
		<>
			<Head>
				{/*
					user-scalable=no prevents automatic zooming on mobile
					devices after focusing the input.
				*/}
				<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
				<meta name="description" content="Gofë is a front-end for Google Search. We act as a middleperson between you and Google to deliver the best results privately to you." />
			</Head>

			<SettingsProvider>
				<SearchProvider>
					<RootLayout>
						<Notifications />

						<View>
							<Component {...pageProps} />
						</View>
					</RootLayout>
				</SearchProvider>
			</SettingsProvider>
		</>
	);
};

export default App;
