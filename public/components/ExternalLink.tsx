interface Props {
	href: string;
	className?: string;
	children: React.ReactNode;
}

const ExternalLink = ({ href, className, children, ...props }: Props) => {
	return (
		<a
			href={href}
			rel='nofollow noreferrer noopener'
			target='_blank'
			className={className}
			{...props}
		>
			{children}
		</a>
	);
};


export default ExternalLink;