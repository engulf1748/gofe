import dynamic from 'next/dynamic';
import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';

import SettingsProvider from '../providers/SettingsProvider';

import type { ChildrenOnly } from '../types/util';

import '../styles/jupiterui.css';
import '../styles/global.scss';

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
			<ThemeProvider attribute='class'>
				<RootLayout>
					<View>
						<Component {...pageProps} />
					</View>
				</RootLayout>
			</ThemeProvider>
		</SettingsProvider>
	)
}

export default App;
