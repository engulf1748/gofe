import ExternalLink from "./ExternalLink";
import InternalLink from "./InternalLink";

import { icons } from '../data/icons';


interface Link {
	label: string | React.ReactNode;
	href?: string;
	to?: string;
}

// href is for external links,
// to is for internal links.
const links: Link[] = [
	{
		label: 'Privacy Policy',
		to: '/privacy',
	},
	{
		label: 'Source Code',
		href: 'https://codeberg.org/ar324/gofe',
	},
	{
		label: (<p className='flex align-c justify-c flex-row lh-1 fs-sm mb-0'>Backed with <i className="j-icon sm mx-0-25r"><span className="text-red-500">{icons.heart}</span></i> by Infinium</p>),
		href: 'https://infinium.earth',
	},
];

const Footer = () => {
	return (
		<div className='footer'>
			<div className="container h-100p">
				<div className="flex align-c justify-c flex-row h-100p">
					{links.map((link, i) => {
						const LinkElem = () => (
							link.to ? (
								<InternalLink key={link.href} href={link.href || ''}>
									<div className='link'>{link.label}</div>
								</InternalLink>
							) : (
								<ExternalLink key={link.href} href={link.href || ''} className='link'>
									{link.label}
								</ExternalLink>
							)
						);

						const isLast = i === links.length - 1;

						return (
							<>
								<LinkElem />
								{!isLast && <p className="mb-0 mx-1r text-dynamic-04">|</p>}
							</>
						)
					})}
				</div>
			</div>
		</div>
	);
}

export default Footer;