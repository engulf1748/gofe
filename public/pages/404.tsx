import Image from 'next/image';
import { useRouter } from 'next/router';

import Layout from '../components/layout/Layout';
import PageTitle from '../components/util/PageTitle';


const FourOFour = () => {
	const { push } = useRouter();

	return (
		<div className={'flex-c dark-ui utility-panel'}>
			<PageTitle>Gofë - Page not found</PageTitle>

			<div className="mw-25r flex-c text-c mb-1r">
				<Image
					src='/cat.svg'
					alt='A gray cat sleeping near some vibrant green plants.'
					width={440}
					height={320}
				/>
				<h1 className='fs-4xl fw-600'>404 Page Not Found</h1>
				<p className='opacity-8'>
					The page you requested doesn't exist on our website or has
					been moved. But don't worry, you've got the whole internet
					ahead of you—all it takes is a search.
				</p>
			</div>
			
			<div className="w-100p flex-c mw-25r px-2r">
				<button onClick={() => push('/')} className='button lg'>
					Explore it all
				</button>
			</div>
		</div>
	);
};

FourOFour.layout = Layout;

export default FourOFour;
