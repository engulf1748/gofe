import InternalLink from './InternalLink';

interface Props {

}

const Logo = ({  }: Props) => {
	return (
		<InternalLink href='/'>
			<a className='logo'>
				<div><p>Gofë</p></div>
			</a>
		</InternalLink>
	);
};


export default Logo;