import ExternalLink from "./ExternalLink";
import InternalLink from "./InternalLink";


interface Link {
	label: string;
	href?: string;
	to?: string;
}

// href is for external links,
// to is for internal links.
const links: Link[] = [
	{
		label: 'Source Code',
		href: 'https://codeberg.org/ar324/gofe',
	}
];

const Footer = () => {
	return (
		<div className='footer'>
			<div className="container h-100p">
				<div className="flex align-c justify-c flex-row h-100p">
					{links.map(link => (
						link.to ? (
							<InternalLink key={link.href} href={link.href || ''}>
								<div className='link'>{link.label}</div>
							</InternalLink>
						) : (
							<ExternalLink key={link.href} href={link.href || ''} className='link'>
								{link.label}
							</ExternalLink>
						)
					))}
				</div>
			</div>
		</div>
	);
}

export default Footer;