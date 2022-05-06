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
import Settings from '../components/Settings';
import { notices } from '../data/notices';
import Notice from '../components/Notice';

const Home = () => {
	const settings = useSettings();

	const didInteract = () => {
		settings.set('isNewUser', 'false');
	};

	return (
		<div
			className={classNames(
				styles.wrapper,
				'flex align-c dark-ui h-100p'
			)}
		>
			<PageTitle>Gofë - Home</PageTitle>

			<div className='w-100p h-screen grid grid-12 tp-grid-1'>
				<div className='h-100p grid-block flex align-c justify-s flex-column gsc-7 ds-gsc-6 tp-gsc-1 pb-10r relative'>
					<div className='w-100p flex align-e mt-3r pr-2r mb-6r tl-mb-4r home-page'>
						<Settings />
					</div>
					<div className='w-100p flex-c'>
						<h1 className={styles.header}>Gofë Search</h1>
						<div className='w-100p flex-c mw-30r px-2r'>
							<SearchBar />
						</div>
					</div>
					<div className="w-100p flex-c absolute bottom-30 z-1">
						{
							notices
								.filter(e => e.type === 'home')
								.map(e => <Notice key={e.id} {...e} />)
						}
					</div>
				</div>
				<div
					className={classNames(
						'grid-block flex-c p-2r gsc-5 ds-gsc-6 tp-gsc-1 border-left-ui-2 h-100p tp-py-10r',
						styles.homeSpecialBG,
					)}
					onClick={didInteract}
				>
					<div className='h-100p flex-sb flex-column'>
						<div></div>
						<div className='flex-c text-c mw-25r'>
							<h2 className='fs-2xl fw-400 mb-0-5r'>
								Search privately with Gofë
							</h2>
							<p className='opacity-07'>
								Gofë is a private front-end for Google. It sends
								your query to Google and delivers the results
								back, privately, to you.
							</p>
							<div className='w-100p flex justify-c align-c flex-row'>
								<InternalLink href='/privacy'>
									<a className='button'>Learn more</a>
								</InternalLink>
							</div>

							<img src='/search-promo.png' className='w-100p' />
						</div>
						<div className='w-100p flex justify-c align-c flex-row tl-flex-c'>
							<ExternalLink
								href='https://codeberg.org/ar324/gofe'
								className='link tl-mb-1r'
							>
								Source code (v{pkg.version})
							</ExternalLink>
							<div className="tl-hide"><Divider /></div>
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
