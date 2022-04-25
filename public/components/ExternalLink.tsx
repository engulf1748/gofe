interface Props extends React.AnchorHTMLAttributes<any> {
	href: string;
	className?: string;
	newTab?: boolean;
	children: React.ReactNode;
}

const ExternalLink = ({
	href,
	className,
	newTab = true,
	children,
	...props
}: Props) => {
	return (
		<a
			href={href}
			rel='nofollow noreferrer noopener'
			target={newTab ? '_blank' : '_self'}
			className={className}
			{...props}
		>
			{children}
		</a>
	);
};


export default ExternalLink;