import ExternalLink from './ExternalLink';

import { icons } from '../data/icons';

const SponsorLink = () => {
	return (
		<ExternalLink href='https://infinium.earth' className='link'>
			<p className='flex align-c justify-c flex-row lh-1 fs-sm mb-0'>
				Backed with{' '}
				<i className='j-icon sm mx-0-25r'>
					<span className='text-red-500'>{icons.heart}</span>
				</i>{' '}
				by Infinium
			</p>
		</ExternalLink>
	);
};

export default SponsorLink;
