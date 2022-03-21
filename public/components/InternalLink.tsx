import Link from "next/link";

interface Props {
	href: string;
	className?: string;
	children: React.ReactNode;
}

const InternalLink = ({ href, className, children, ...props }: Props) => {
	return (
		<Link href={href}>
			{children}
		</Link>
	);
};


export default InternalLink;