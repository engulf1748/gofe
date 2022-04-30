import classNames from 'classnames';

import { useSettings } from '../providers/SettingsProvider';

import PageTitle from '../components/util/PageTitle';
import SearchBar from '../components/search/SearchBar';
import Divider from '../components/Divider';
import SponsorLink from '../components/SponsorLink';
import ExternalLink from '../components/ExternalLink';
import InternalLink from '../components/InternalLink';

import styles from '../styles/modules/Home.module.scss';
import pkg from '../package.json';

import type { ChildrenOnly } from '../types/util';

const Home = () => {
	const settings = useSettings();	

	const didInteract = () => {
		settings.set('isNewUser', 'false');
	}

	return (
		<div
			className={classNames(
				styles.wrapper,
				'flex align-c dark-ui h-100p'
			)}
		>
			<PageTitle>Gofë - Home</PageTitle>

			<div className='w-100p h-screen grid grid-12 tp-grid-1'>
				<div className='h-100p grid-block align-c justify-s grid-span-column-7 tp-grid-span-column-1 py-10r'>
					<h1 className={styles.header}>Gofë Search</h1>
					<div className='w-100p flex-c mw-30r px-2r'>
						<SearchBar />
					</div>
				</div>
				<div className='grid-block flex-c p-2r grid-span-column-5 tp-grid-span-column-1 border-left-ui-2 bg-1 h-100p tp-py-10r' onClick={didInteract}>
					<div className='h-100p flex-sb flex-column'>
						<div></div>
						<div className='flex-c text-c mw-25r'>
							<h2 className='fs-2xl fw-400'>
								Search privately with Gofë
							</h2>
							<p className='opacity-07'>
								Gofë is a private front-end for Google. It sends
								your query to Google and delivers the results
								back, privately, to you.
							</p>
							<div className='w-100p flex justify-c align-c flex-row'>
								<InternalLink href='/privacy'>
									<a className='link fs-base'>Learn more</a>
								</InternalLink>
								<Divider />
								<ExternalLink
									href='https://codeberg.org/ar324/gofe'
									className='link fs-base'
								>
									Source code
								</ExternalLink>
							</div>

							<img src='/search-promo.png' className='w-100p' />
						</div>
						<div className='w-100p flex justify-c align-c flex-row'>
							<ExternalLink
								href='https://codeberg.org/ar324/gofe'
								className='link'
							>
								{pkg.version}
							</ExternalLink>
							<Divider />
							<SponsorLink />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

// The <Navigation /> component is in the Layout
// component. Since we don't want the primary nav
// to show up on the home page, we'll mock the
// Layout object here, on this one page.
Home.layout = ({ children }: ChildrenOnly) => (
	<div className='layout'>
		<div className='content-wrapper'>{children}</div>
	</div>
);

export default Home;
