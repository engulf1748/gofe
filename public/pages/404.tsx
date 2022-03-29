import { useRouter } from 'next/router';
import { Button } from '@infinium/hydro';

import Layout from '../components/layout/Layout';
import PageTitle from '../components/util/PageTitle';


const FourOFour = () => {
	const { push } = useRouter();

	return (
		<div className={'flex-c dark-ui utility-panel'}>
			<PageTitle>Gofë - Page not found</PageTitle>

			<div className="mw-25r flex-c text-c mb-1r">
				<h1 className='fs-10xl fw-600'>
					<span className='text-primary'>4</span>
					<span>0</span>
					<span className='text-primary'>4</span>
				</h1>
				<p className='opacity-8'>
					The page you requested doesn't exist on our website or has
					been moved. But don't worry, you've got the whole internet
					ahead of you. All it takes is a search.
				</p>
			</div>
			
			<div className="w-100p flex-c mw-25r px-2r">
				<Button onClick={() => push('/')} mods='accent-button'>
					Explore it all
				</Button>
			</div>
		</div>
	);
};

FourOFour.layout = Layout;

export default FourOFour;
