import { Button, toast } from '@infinium/hydro';

import ExternalLink from '../../ExternalLink';

import config from '../../../../config.json';
import { icons } from "../../../data/icons";

import type { APIError } from '../../../services/err';


const errorContent = {
	NoResponse: {
		title: 'Something went wrong',
		description: 'We encountered an error fetching your search results. If you keep getting this error, please open an issue.'
	},
	BadResponse: {
		title: 'Server not responding',
		description: 'The search server is not responding. If you continue to have this problem, please open an issue.',
	},
	BadRequest: {
		title: 'Internal request error',
		description: (
			<span>There was an issue making a request to our search server. Please open an issue and include a screenshot of the console. <ExternalLink href="https://en.wikipedia.org/wiki/Web_development_tools#Web_developer_tools_support" className='j-link underline d-inline'>What is the console?</ExternalLink></span>
		),
	},
}

interface Props {
	err: APIError;
}

const SearchError = ({ err }: Props) => {
	const onClick = () => {
		if (window && window.location) {
			window.location.reload();
		} else {
			toast.error('Unable to reload automatically.');
		}
	}

	return (
		<div className='w-100p px-3r py-10r flex-c utility-panel ui-1'>
			<div className="mw-25r flex-c text-c">
				<div className="bg-red-500 radius-90 p-0-5r flex-c d-inline-flex mb-0-75r">
					<i className="j-icon text-white">{icons.x}</i>
				</div>
				<h4 className='mb-0-5r'>{errorContent[err].title}</h4>
				<p>{errorContent[err].description}</p>
				<Button size='md' onClick={onClick} color='red'>Reload</Button>

				{/* Ignoring the `config.repository` type issue, lol */}
				{/* @ts-ignore */}
				<ExternalLink href={`${config.repository}/issues`} className='j-link underline mt-2r'>
					Open an issue
				</ExternalLink>
			</div>
		</div>
	);
};

export default SearchError;