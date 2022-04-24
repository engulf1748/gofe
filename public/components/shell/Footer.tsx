import ExternalLink from "../ExternalLink";
import InternalLink from "../InternalLink";

import { icons } from '../../data/icons';


const Divider = () => <p className="mb-0 mx-1r opacity-4 tp-hide">|</p>;

const Footer = () => {
	return (
		<div className='footer'>
			<div className="container h-100p">
				<div className="flex align-c justify-c flex-row tp-flex-c h-100p">
					<InternalLink href='/privacy'><a className='link'>Privacy Policy</a></InternalLink>
					<Divider />
					<ExternalLink href='https://codeberg.org/ar324/gofe' className='link'>Source code</ExternalLink>
					<Divider />
					<ExternalLink href='https://codeberg.org/ar324/gofe/issues' className='link'>Report a bug</ExternalLink>
					<Divider />
					<ExternalLink href='https://infinium.earth' className='link'>
						<p className='flex align-c justify-c flex-row lh-1 fs-sm mb-0'>
							Backed with <i className="j-icon sm mx-0-25r"><span className="text-red-500">{icons.heart}</span></i> by Infinium
						</p>
					</ExternalLink>
				</div>
			</div>
		</div>
	);
}

export default Footer;