import { useQuery } from '../providers/QueryProvider';

import InternalLink from './InternalLink';

interface Props {
	clearQueryOnClick?: boolean;
}

const Logo = ({ clearQueryOnClick }: Props) => {
	const { query, setQuery } = useQuery();

	const onClick = () => {
		if (clearQueryOnClick && query.trim() !== '') {
			setQuery('');
		}
	}

	return (
		<InternalLink href='/'>
			<a className='logo' onClick={onClick}>
				<div><p>Gofë</p></div>
			</a>
		</InternalLink>
	);
};


export default Logo;