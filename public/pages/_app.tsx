import dynamic from 'next/dynamic';
import type { AppProps } from 'next/app';

import SettingsProvider from '../providers/SettingsProvider';

import type { ChildrenOnly } from '../types/util';

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
	// manually defining the view within each component.
	// The Component type comes from NextJS and obviously
	// doesn't have the .view value. We probably could
	// merge a type here, but that is overkill for this.
	//
	// @ts-ignore
	const RootView = Component.view || (({ children }: ChildrenOnly) => <>{children}</>);

	return (
		<SettingsProvider>
			<RootView>
				<View>
					<Component {...pageProps} />
				</View>
			</RootView>
		</SettingsProvider>
	)
}

export default App;
