import dynamic from 'next/dynamic';
import { Notifications } from '@infinium/hydro';
import type { AppProps } from 'next/app';

import SettingsProvider from '../providers/SettingsProvider';
import QueryProvider from '../providers/QueryProvider';

import type { ChildrenOnly } from '../types/util';

import '../styles/jupiterui.css';
import '../styles/global.scss';
import '../assets/fonts/inter.css';
import '@infinium/hydro/dist/style.css';

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
		<SettingsProvider>
			<QueryProvider>
				<RootLayout>
					<Notifications />

					<View>
						<Component {...pageProps} />
					</View>
					
				</RootLayout>
			</QueryProvider>
		</SettingsProvider>
	)
}

export default App;
