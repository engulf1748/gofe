import ExternalLink from '../ExternalLink';
import InternalLink from '../InternalLink';
import Divider from '../Divider';

import { icons } from '../../data/icons';
import pkg from '../../package.json';
import SponsorLink from '../SponsorLink';

const Footer = () => {
	return (
		<div className='footer'>
			<div className='footer-container h-100p'>
				<div className='w-100p h-100p grid grid-12 tl-grid-1'>
					<div className='grid-block align-s grid-span-column-3 tl-grid-span-column-1 tl-align-c'>
						<ExternalLink
							href='https://codeberg.org/ar324/gofe/'
							className='link'
						>
							v{pkg.version}
						</ExternalLink>
					</div>
					<div className='grid-block align-c grid-span-column-6 tl-grid-span-column-1 tl-py-1r'>
						<div className='flex align-c justify-c flex-row tp-flex-c h-100p'>
							<InternalLink href='/privacy'>
								<a className='link'>Privacy Policy</a>
							</InternalLink>
							<Divider hideOnTP />
							<ExternalLink
								href='https://codeberg.org/ar324/gofe'
								className='link'
							>
								Source code
							</ExternalLink>
							<Divider hideOnTP />
							<ExternalLink
								href='https://codeberg.org/ar324/gofe/issues'
								className='link'
							>
								Report a bug
							</ExternalLink>
						</div>
					</div>
					<div className='grid-block align-e grid-span-column-3 tl-grid-span-column-1 tl-align-c'>
						<SponsorLink />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Footer;
