import { Button, toast } from '@infinium/hydro';

import { icons } from "../../../data/icons";

const RateLimited = () => {
	const onClick = () => {
		if (window && window.location) {
			window.location.reload();
		} else {
			toast.error('Unable to reload automatically.');
		}
	}

	return (
		<div className='w-100p px-3r py-10r flex-c utility-panel bg search-error-panel'>
			<div className="mw-25r flex-c text-c">
				<div className="bg-red-500 radius-90 p-0-5r flex-c d-inline-flex mb-0-75r">
					<i className="j-icon text-white">{icons.x}</i>
				</div>
				<h4 className='mb-0-5r'>Ain't that a kick in the head</h4>
				<p>Google has blocked our server from its search services. This might be temporary, so please check back later!</p>
				<Button size='md' onClick={onClick} color='red'>Reload</Button>
			</div>
		</div>
	);
};

export default RateLimited;