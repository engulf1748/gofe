import InternalLink from './InternalLink';

interface Props {

}

const Logo = ({  }: Props) => {
	return (
		<InternalLink href='/'>
			<a className='logo'>
				<p>Gofë</p>
			</a>
		</InternalLink>
	);
};


export default Logo;